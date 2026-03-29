# Hardcoded Values Report — Telegram Manager

> This file lists every hardcoded credential, secret, string, session, ID, password, and config value found in the codebase — along with the exact file, line, and how it is used.

---

## Summary Table

| # | What | Hardcoded Value (truncated) | File | Line(s) | Can be Overridden By |
|---|------|-----------------------------|------|---------|----------------------|
| 1 | Telegram API ID | `28403662` | `client/src/components/auth-modal.tsx` | 30, 146, 193, 321 | `VITE_TELEGRAM_API_ID` env var |
| 2 | Telegram API Hash | `079509d4ac7f209a1a58facd00d6ff5a` | `client/src/components/auth-modal.tsx` | 31, 147, 194, 322 | `VITE_TELEGRAM_API_HASH` env var |
| 3 | Telegram Phone Number | `+917352013479` | `client/src/components/auth-modal.tsx` | 32, 148, 323 | `VITE_TELEGRAM_PHONE` env var |
| 4 | Default Session String (auth-modal) | `1BQAWZmxvcmEud...` | `client/src/components/auth-modal.tsx` | 142 | `VITE_DEFAULT_SESSION_STRING` env var |
| 5 | Session History Password | `Sh@090609` | `client/src/components/auth-modal.tsx` | 167 | `VITE_SESSION_HISTORY_PASSWORD` env var |
| 6 | Default Session String (Live Cloning) | `1BVtsOKsBu7_...` | `client/src/components/live-cloning.tsx` | 300 | None — hardcoded only |
| 7 | Default Session String (Python Copier) | `1BVtsOKsBu7_...` | `client/src/components/python-copier.tsx` | 54 | `VITE_DEFAULT_SESSION_STRING` env var |
| 8 | Default Session String (JS Copier) | `1BVtsOKsBu7_...` | `client/src/components/js-copier.tsx` | 54 | `VITE_DEFAULT_SESSION_STRING` env var |
| 9 | Default Session String (Python settings) | `1BVtsOKsBu7_...` | `bot_source/python-copier/settings.py` | 10 | `RAILWAY_SESSION_STRING` env var |
| 10 | Telegram API ID (Python config.json) | `28403662` | `bot_source/live-cloning/config.json` | 2 | Edit file or pass env |
| 11 | Telegram API Hash (Python config.json) | `079509d4ac7f209a1a58facd00d6ff5a` | `bot_source/live-cloning/config.json` | 3 | Edit file or pass env |
| 12 | Hardcoded Chat IDs (entity pair) | `[4949360302, 2186541033]` | `bot_source/live-cloning/config.json` | 10–13 | Edit the file |
| 13 | Python API ID default | `1` | `bot_source/python-copier/settings.py` | 6 | `TG_API_ID` or `API_ID` env var |
| 14 | Python API Hash default | `'default_hash'` | `bot_source/python-copier/settings.py` | 7 | `TG_API_HASH` or `API_HASH` env var |
| 15 | Express session secret fallback | `'telegram-manager-github-sync-' + Math.random()` | `server/index.ts` | 22 | `SESSION_SECRET` env var |
| 16 | Server Port default | `5000` | `server/index.ts` | 361 | `PORT` env var |
| 17 | MTProto session storage path | `'./downloads/session.json'` | `server/telegram-bot/MTProtoClient.ts` | 26, 57, 71 | None — hardcoded path |
| 18 | MolView database path | `'public/FinalCropper/public/molview/php/data/molview_library.db'` | `server/index.ts` | 233, 243 | None — hardcoded |
| 19 | Config file path | `'config/bot-config.json'` | `shared/config-reader.ts` | 74 | Pass path to constructor |
| 20 | Live cloning persistent settings path | `'config/live_cloning_persistent_settings.json'` | `server/routes.ts` | 65 | None — hardcoded |
| 21 | localStorage key for session flag | `'telegram_session'` | `client/src/components/auth-modal.tsx` | 115 | None — hardcoded key |
| 22 | localStorage key for custom sessions | `'custom_sessions'` | `client/src/components/auth-modal.tsx` | 204, 207, 487 | None — hardcoded key |
| 23 | localStorage key for app settings | `'telegram-manager-settings'` | `client/src/components/settings.tsx` | 102, 116 | None — hardcoded key |
| 24 | Session check max attempts | `50` (= 25 seconds) | `client/src/components/auth-modal.tsx` | 83 | None — hardcoded |
| 25 | Session check interval | `500ms` | `client/src/components/auth-modal.tsx` | 84 | None — hardcoded |
| 26 | Downloads folder list | `['completed', 'youtube/videos', ...]` | `server/routes.ts` | 509 | None — hardcoded |
| 27 | Max concurrent downloads default | `3` | `client/src/components/settings.tsx` | 81 | Saved to localStorage |
| 28 | Similarity threshold default | `70%` | `client/src/components/message-search.tsx` | 32 | User-adjustable slider |
| 29 | Max message length default | `4096` | `client/src/components/live-cloning.tsx` | 124 | User-adjustable input |
| 30 | Delay between messages default | `1` second | `client/src/components/live-cloning.tsx` | 125 | User-adjustable slider |
| 31 | Performance threshold default | `90%` | `client/src/components/live-cloning.tsx` | 116 | User-adjustable input |
| 32 | Live cloning status poll interval | `2000ms` | `client/src/components/live-cloning.tsx` | 148 | None — hardcoded |
| 33 | Live cloning logs poll interval | `3000ms` | `client/src/components/live-cloning.tsx` | 158 | None — hardcoded |
| 34 | Python Copier status poll interval | `2000ms` | `client/src/components/python-copier.tsx` | 82 | None — hardcoded |
| 35 | JS Copier status poll interval | `2000ms` | `client/src/components/js-copier.tsx` | 82 | None — hardcoded |
| 36 | Dashboard download refresh interval | `1000ms` | `client/src/components/dashboard.tsx` | 55 | None — hardcoded |
| 37 | Settings bot status refresh interval | `5000ms` | `client/src/components/settings.tsx` | 145, 159, 173 | None — hardcoded |
| 38 | Express JSON body limit | `'500mb'` | `server/index.ts` | 32, 33 | None — hardcoded |
| 39 | Session cookie maxAge | `24 * 60 * 60 * 1000` (24 hours) | `server/index.ts` | 27 | None — hardcoded |
| 40 | GitHub file size limits | `500MB` per file, `5GB` total | `client/src/components/github-sync.tsx` | 63–65 | None — hardcoded |
| 41 | Approx message similarity threshold | `85%` | `client/src/components/python-script-main.tsx` | 69 | None — hardcoded in label |
| 42 | Double-click window for offset update | `300ms` | `client/src/components/python-copier.tsx` | 617 | None — hardcoded |
| 43 | Double-click window (JS copier) | `300ms` | `client/src/components/js-copier.tsx` | 617 | None — hardcoded |
| 44 | Console log default limit | `100` | `server/routes.ts` | 226 | `?limit=` query param |
| 45 | Console log clear days default | `7` | `server/routes.ts` | 247 | `?days=` query param |
| 46 | WebSocket path | `'/ws/console'` | `server/index.ts` | 130 | None — hardcoded |
| 47 | MolView PHP uploads path | `'public/FinalCropper/public/molview/php/uploads/structures/'` | `server/index.ts` | 252–254 | None — hardcoded |
| 48 | Archive file naming convention | Must start with `'project-archive-'` | `server/routes.ts` | 456 | None — hardcoded security check |
| 49 | Python copier config path (runtime) | `'tmp/config/copier_config.ini'` | Generated at runtime | — | None |
| 50 | JS copier config path (runtime) | `'tmp/config/js_copier_config.ini'` | Generated at runtime | — | None |

---

## Detailed Breakdown

---

### 1–5: `client/src/components/auth-modal.tsx`

**What it does**: Powers the login dialog. All credential values are loaded from Vite env vars with inline hardcoded fallbacks.

```typescript
// Line 29-35 — default credentials state
const [credentials, setCredentials] = useState({
  apiId: import.meta.env.VITE_TELEGRAM_API_ID || '28403662',
  apiHash: import.meta.env.VITE_TELEGRAM_API_HASH || '079509d4ac7f209a1a58facd00d6ff5a',
  phoneNumber: import.meta.env.VITE_TELEGRAM_PHONE || '+917352013479',
  code: '',
  password: '',
});
```

```typescript
// Line 142 — The default session string used by "Use Default Session" button
const predefinedSessionString = import.meta.env.VITE_DEFAULT_SESSION_STRING || 
  "1BQAWZmxvcmEud2ViLnRlbGVncmFtLm9yZwG7IS3tNY2BsIDLeDQnewXF0dZ7iEc231dYk/8TDX83hkgf7EwJ8Hvds
   qxWr/Dyb8oeEIe6+H9MAgI4yPaGs0IgIsdLQozbCnlNF7NDC+q5iC+JlpLbAF2PIiZ3nHvetmRyadZpTsVSLFgSG1Bdv
   VUx2J65VHdkbJTk9V0hj2Wq3ucMrBNGJB6oCSrnSqWCD5mmtxKdFDV6p+6Fj1d0gbnmBOkhV0Ud+V6NRHDup/j6rREt/
   lJTO8gXowmd2dLt1piiQrmD3fU+zKEFf4Mv0GllJYYKY9aVxQjjhowXM8GdKnX0DLxOFVcqSk7sOkCn14ocdtYK4ffhRg
   Jdgu241XriLA==";
```

```typescript
// Line 167 — Password to view saved session history
if (password === (import.meta.env.VITE_SESSION_HISTORY_PASSWORD || 'Sh@090609')) {
```

```typescript
// Lines 193–194 and 321–322 — Same API ID/Hash repeated in handleUseCustomSession and handleClose reset
apiId: parseInt(import.meta.env.VITE_TELEGRAM_API_ID || '28403662'),
apiHash: import.meta.env.VITE_TELEGRAM_API_HASH || '079509d4ac7f209a1a58facd00d6ff5a',
```

---

### 6: `client/src/components/live-cloning.tsx` — Line 300

**What it does**: Pre-fills the session string field in the Live Cloning screen on component mount.

```typescript
// This runs on mount if sessionString is empty
const defaultSession = '1BVtsOKsBu7_Sm6oqn7q_JG49VDr6uuMQDasC2-xXy1nYvv-stWa14npRKMV4rTQU2Q7Cg
L5VtnJodONQmvfAzo5Oj07EImJtk3pVlVa7fP8D-IKJQ4pK3_MzlhX6PHYtYWA_GFjLwbxVI6pwb9XHJEtswyfKP0Lq
QrbhvkZ7YNCpoGIE9-9Sg1l0F2jTnkjTc3II0puNnLtrmyvHuOR8SlqqhCzzaX9OOBxLq2TZh46rL9WGaN2ieZy_M2k0r
-7Ax1ryuax4j93mKt8ulGG6tRinvzog08cABAIJawjVDmh-Rv-sxFqgmjJ2RvqfffKidfmLu8932t0vtvJgTYW21CxfLjB3
ny0=';
setSessionString(defaultSession);
```

**⚠️ No env var override.** This is completely hardcoded with no fallback to env variable.

---

### 7: `client/src/components/python-copier.tsx` — Line 54

**What it does**: Pre-fills the session string in the Python Copier screen.

```typescript
const [sessionString, setSessionString] = useState(
  import.meta.env.VITE_DEFAULT_SESSION_STRING || 
  '1BVtsOKsBu7_Sm6oqn7q_JG49VDr6uuMQDasC2-xXy1nYvv-stWa14npRKMV4rTQU2Q7CgL5VtnJodONQmvfAzo5Oj
   07EImJtk3pVlVa7fP8D-IKJQ4pK3_MzlhX6PHYtYWA_GFjLwbxVI6pwb9XHJEtswyfKP0LqQrbhvkZ7YNCpoGIE9-9S
   g1l0F2jTnkjTc3II0puNnLtrmyvHuOR8SlqqhCzzaX9OOBxLq2TZh46rL9WGaN2ieZy_M2k0r-7Ax1ryuax4j93mKt8u
   lGG6tRinvzog08cABAIJawjVDmh-Rv-sxFqgmjJ2RvqfffKidfmLu8932t0vtvJgTYW21CxfLjB3ny0='
);
```

Can be overridden by `VITE_DEFAULT_SESSION_STRING`.

---

### 8: `client/src/components/js-copier.tsx` — Line 54

**What it does**: Same as #7 but for the JS Copier screen. Exact same session string.

```typescript
const [sessionString, setSessionString] = useState(
  import.meta.env.VITE_DEFAULT_SESSION_STRING || 
  '1BVtsOKsBu7_Sm6oqn7q_JG49VDr6uuMQDasC2-xXy1nYvv-stWa14...'
);
```

Can be overridden by `VITE_DEFAULT_SESSION_STRING`.

---

### 9: `bot_source/python-copier/settings.py` — Line 10

**What it does**: The Python copier script uses this as the Telegram session string when `RAILWAY_SESSION_STRING` env var is not set.

```python
STRING_SESSION = os.getenv('RAILWAY_SESSION_STRING') or \
  '1BVtsOKsBu7_Sm6oqn7q_JG49VDr6uuMQDasC2-xXy1nYvv-stWa14npRKMV4rTQU2Q7CgL5VtnJodONQmvfAzo5Oj
   07EImJtk3pVlVa7fP8D-IKJQ4pK3_MzlhX6PHYtYWA_GFjLwbxVI6pwb9XHJEtswyfKP0LqQrbhvkZ7YNCpoGIE9-9S
   g1l0F2jTnkjTc3II0puNnLtrmyvHuOR8SlqqhCzzaX9OOBxLq2TZh46rL9WGaN2ieZy_M2k0r-7Ax1ryuax4j93mKt8u
   lGG6tRinvzog08cABAIJawjVDmh-Rv-sxFqgmjJ2RvqfffKidfmLu8932t0vtvJgTYW21CxfLjB3ny0='
```

**Note**: This is a Telethon session string. This is also lines 6-7:
```python
API_ID = int(os.getenv('TG_API_ID') or os.getenv('API_ID') or '1')
API_HASH = os.getenv('TG_API_HASH') or os.getenv('API_HASH') or 'default_hash'
```

---

### 10–12: `bot_source/live-cloning/config.json`

**What it does**: Configuration file for the Python live cloning bot. Read by `Login.py` and `live_cloner.py`.

```json
{
  "api_id": 28403662,
  "api_hash": "079509d4ac7f209a1a58facd00d6ff5a",
  "bot_enabled": true,
  "sudo": [],
  "filter_words": true,
  "add_signature": false,
  "signature": "",
  "entities": [
    [4949360302, 2186541033]
  ],
  "filters": []
}
```

| Field | Type | Value | Description |
|-------|------|-------|-------------|
| `api_id` | integer | `28403662` | Telegram API App ID |
| `api_hash` | string | `079509d4ac7f209a1a58facd00d6ff5a` | Telegram API App Hash |
| `entities` | array | `[[4949360302, 2186541033]]` | Hardcoded source→target chat ID pair |

**`4949360302`** = Source Telegram chat ID (channel or group)
**`2186541033`** = Target Telegram chat ID

To change: Edit the JSON file. These are NOT read from env vars.

---

### 15: `server/index.ts` — Line 22

**What it does**: The express-session secret used to sign session cookies. If `SESSION_SECRET` env var is not set, it generates a new random one each server restart (which invalidates all existing sessions on restart).

```typescript
app.use(session({
  secret: process.env.SESSION_SECRET || 'telegram-manager-github-sync-' + Math.random().toString(36),
  ...
}));
```

**⚠️ This means if you don't set `SESSION_SECRET`, every server restart logs out all users.**

---

### 16: `server/index.ts` — Line 361

**What it does**: Default port the server listens on.

```typescript
const port = parseInt(process.env.PORT || '5000', 10);
```

---

### 17: `server/telegram-bot/MTProtoClient.ts` — Lines 26, 57, 71

**What it does**: MTProto client saves its session to a hardcoded local path.

```typescript
// Line 26 — Session storage path in constructor
storageOptions: {
  path: path.resolve('./downloads/session.json'),
},

// Line 57 — Load session
const sessionPath = path.resolve('./downloads/session.json');

// Line 71 — Save session  
const sessionPath = path.resolve('./downloads/session.json');
```

**The `./downloads/` directory is also where all downloaded files go.** This is hardcoded throughout `server/routes.ts`.

---

### 19: `shared/config-reader.ts` — Line 74

**What it does**: The main config file reader looks for a config at a hardcoded relative path.

```typescript
this.configPath = path.join(projectRoot, 'config', 'bot-config.json');
```

If no `config/bot-config.json` exists, this throws on startup. The `auto-setup.ts` creates this file.

---

### 20: `server/routes.ts` — Line 65

**What it does**: Path where live cloning settings are persisted across restarts.

```typescript
const persistentSettingsPath = path.join(
  process.cwd(), 
  'config', 
  'live_cloning_persistent_settings.json'
);
```

---

### Full Session Strings (Complete Values)

#### Session String A (Used in auth-modal.tsx as "Default Session"):
```
1BQAWZmxvcmEud2ViLnRlbGVncmFtLm9yZwG7IS3tNY2BsIDLeDQnewXF0dZ7iEc231dYk/8TDX83hkgf7EwJ8HvdsqxWr/Dyb8oeEIe6+H9MAgI4yPaGs0IgIsdLQozbCnlNF7NDC+q5iC+JlpLbAF2PIiZ3nHvetmRyadZpTsVSLFgSG1BdvVUx2J65VHdkbJTk9V0hj2Wq3ucMrBNGJB6oCSrnSqWCD5mmtxKdFDV6p+6Fj1d0gbnmBOkhV0Ud+V6NRHDup/j6rREt/lJTO8gXowmd2dLt1piiQrmD3fU+zKEFf4Mv0GllJYYKY9aVxQjjhowXM8GdKnX0DLxOFVcqSk7sOkCn14ocdtYK4ffhRgJdgu241XriLA==
```
- **Type**: Telethon / GramJS session string (starts with `1BQA`)
- **Used in**: `auth-modal.tsx` line 142, as the "Use Default Session" button's session

#### Session String B (Used in Live Cloning, Python Copier, JS Copier, settings.py):
```
1BVtsOKsBu7_Sm6oqn7q_JG49VDr6uuMQDasC2-xXy1nYvv-stWa14npRKMV4rTQU2Q7CgL5VtnJodONQmvfAzo5Oj07EImJtk3pVlVa7fP8D-IKJQ4pK3_MzlhX6PHYtYWA_GFjLwbxVI6pwb9XHJEtswyfKP0LqQrbhvkZ7YNCpoGIE9-9Sg1l0F2jTnkjTc3II0puNnLtrmyvHuOR8SlqqhCzzaX9OOBxLq2TZh46rL9WGaN2ieZy_M2k0r-7Ax1ryuax4j93mKt8ulGG6tRinvzog08cABAIJawjVDmh-Rv-sxFqgmjJ2RvqfffKidfmLu8932t0vtvJgTYW21CxfLjB3ny0=
```
- **Type**: Telethon / GramJS session string (starts with `1BVt`)
- **Used in**:
  - `client/src/components/live-cloning.tsx` line 300 (hardcoded, no env override)
  - `client/src/components/python-copier.tsx` line 54 (fallback, env: `VITE_DEFAULT_SESSION_STRING`)
  - `client/src/components/js-copier.tsx` line 54 (fallback, env: `VITE_DEFAULT_SESSION_STRING`)
  - `bot_source/python-copier/settings.py` line 10 (fallback, env: `RAILWAY_SESSION_STRING`)

---

## How Session Strings Work

These are Telethon/GramJS session strings. They encode:
- The Telegram DC (data center) number and address
- The user's auth key
- The user's account ID

**A session string is equivalent to a logged-in account.** Anyone with this string can access the Telegram account without OTP.

**Which npm library uses it?** The `telegram` npm package (GramJS v2.26.22) uses it via:
```typescript
import { StringSession } from 'telegram/sessions';
const session = new StringSession(sessionString);
```

**Which Python library uses it?** Telethon uses it via:
```python
from telethon.sessions import StringSession
client = TelegramClient(StringSession(STRING_SESSION), API_ID, API_HASH)
```

---

## Security Risk Summary

| Risk Level | Item | Recommendation |
|------------|------|----------------|
| 🔴 CRITICAL | Two full Telegram session strings hardcoded in frontend JS (Session A & B) | Move to env vars or server-side only |
| 🔴 CRITICAL | Session strings in Python `settings.py` source file | Use env vars only |
| 🔴 CRITICAL | API ID + API Hash hardcoded in frontend | Move to env vars (`VITE_TELEGRAM_API_ID`, `VITE_TELEGRAM_API_HASH`) |
| 🔴 CRITICAL | Phone number hardcoded in frontend | Move to env var |
| 🟠 HIGH | Session history password hardcoded as `Sh@090609` | Move to env var |
| 🟠 HIGH | Hardcoded channel IDs in `config.json` | Make configurable |
| 🟡 MEDIUM | Session secret generates random value if not set (breaks sessions on restart) | Always set `SESSION_SECRET` env var |
| 🟡 MEDIUM | `localStorage` stores session strings (browser-accessible) | Consider server-side session management |

---

*End of HARDCODED_VALUES_REPORT.md*
