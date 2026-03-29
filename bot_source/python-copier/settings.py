from configparser import ConfigParser
import os
import logging

# Use environment variables set by the API or defaults
API_ID = int(os.getenv('TG_API_ID') or os.getenv('API_ID') or '1')
API_HASH = os.getenv('TG_API_HASH') or os.getenv('API_HASH') or 'default_hash'

# Session string - priority: STRING_SESSION (set by server) > RAILWAY_SESSION_STRING > hardcoded fallback
STRING_SESSION = os.getenv('STRING_SESSION') or os.getenv('RAILWAY_SESSION_STRING') or ''

# Path to config file - can be set by API
CONFIG_PATH = os.getenv('CONFIG_PATH', 'config.ini')

assert API_ID and API_HASH, "API_ID and API_HASH must be set"

configur = ConfigParser()
configur.read(CONFIG_PATH)

forwards = configur.sections()


def get_forward(forward: str) -> tuple:
    try:
        from_chat = configur.get(forward, 'from')
        to_chat = configur.get(forward, 'to')
        offset = configur.getint(forward, 'offset')
        return from_chat, to_chat, offset
    except Exception as err:
        logging.exception(
            'The content of %s does not follow format. See the README.md file for more details. \n\n %s', forward, str(err))
        raise err  # Don't quit, let the calling API handle the error


def update_offset(forward: str, new_offset: str) -> None:
    try:
        configur.set(forward, 'offset', new_offset)
        with open(CONFIG_PATH, 'w') as cfg:
            configur.write(cfg)
    except Exception as err:
        logging.exception(
            'Problem occured while updating offset of %s \n\n %s', forward, str(err))
        raise err  # Don't quit, let the calling API handle the error


def reload_config():
    """Reload the configuration file"""
    global configur, forwards
    configur = ConfigParser()
    configur.read(CONFIG_PATH)
    forwards = configur.sections()


if __name__ == "__main__":
    # testing
    for forward in forwards:
        print(forward, get_forward(forward))