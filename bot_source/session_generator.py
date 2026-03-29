#!/usr/bin/env python3
"""
Telethon Session Generator
Handles interactive Telegram authentication and exports a Telethon StringSession.
Communicates with the Node.js backend via JSON files in a temp directory.
"""
import asyncio
import json
import os
import sys
import time
from pathlib import Path

try:
    from telethon import TelegramClient
    from telethon.sessions import StringSession
    from telethon.errors import (
        SessionPasswordNeededError,
        PhoneCodeInvalidError,
        PasswordHashInvalidError,
        FloodWaitError,
        PhoneNumberInvalidError,
    )
except ImportError:
    print(json.dumps({"status": "error", "error": "Telethon not installed. Run: pip install telethon"}))
    sys.exit(1)

SESSION_DIR = os.environ.get("SESSION_DIR", "/tmp/session_gen")
API_ID = int(os.environ.get("TG_API_ID", "0"))
API_HASH = os.environ.get("TG_API_HASH", "")
PHONE = os.environ.get("TG_PHONE", "")

status_path = Path(SESSION_DIR) / "status.json"
input_path = Path(SESSION_DIR) / "input.json"


def write_status(status: str, **kwargs):
    data = {"status": status, "timestamp": time.time(), **kwargs}
    status_path.write_text(json.dumps(data))
    print(json.dumps(data), flush=True)


def wait_for_input(timeout: int = 300) -> dict:
    """Wait for the backend to write an input file."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        if input_path.exists():
            try:
                data = json.loads(input_path.read_text())
                input_path.unlink()
                return data
            except Exception:
                pass
        time.sleep(0.3)
    raise TimeoutError("Input timeout waiting for user response")


async def main():
    if not API_ID or not API_HASH or not PHONE:
        write_status("error", error="Missing API_ID, API_HASH or PHONE environment variables")
        sys.exit(1)

    Path(SESSION_DIR).mkdir(parents=True, exist_ok=True)

    # Clean up any stale input file
    if input_path.exists():
        input_path.unlink()

    write_status("starting")

    client = TelegramClient(StringSession(), API_ID, API_HASH)
    await client.connect()

    write_status("sending_code")

    try:
        sent = await client.send_code_request(PHONE)
        phone_code_hash = sent.phone_code_hash
    except FloodWaitError as e:
        write_status("error", error=f"Flood wait: please wait {e.seconds} seconds before retrying")
        sys.exit(1)
    except PhoneNumberInvalidError:
        write_status("error", error="Invalid phone number. Include country code (e.g. +91...)")
        sys.exit(1)

    write_status("waiting_code")

    try:
        inp = wait_for_input(timeout=300)
        code = inp.get("code", "").strip()
    except TimeoutError:
        write_status("error", error="Timed out waiting for OTP code")
        sys.exit(1)

    try:
        await client.sign_in(PHONE, code, phone_code_hash=phone_code_hash)
    except SessionPasswordNeededError:
        write_status("waiting_password")
        try:
            inp = wait_for_input(timeout=300)
            password = inp.get("password", "").strip()
        except TimeoutError:
            write_status("error", error="Timed out waiting for 2FA password")
            sys.exit(1)
        try:
            await client.sign_in(password=password)
        except PasswordHashInvalidError:
            write_status("error", error="Incorrect 2FA password")
            sys.exit(1)
    except PhoneCodeInvalidError:
        write_status("error", error="Invalid OTP code. Please try again.")
        sys.exit(1)

    me = await client.get_me()
    session_string = client.session.save()

    await client.disconnect()

    user_info = {
        "name": f"{me.first_name or ''} {me.last_name or ''}".strip(),
        "phone": me.phone or PHONE,
        "userId": str(me.id),
        "username": me.username or "",
    }

    write_status(
        "done",
        sessionString=session_string,
        userInfo=user_info,
    )


if __name__ == "__main__":
    asyncio.run(main())
