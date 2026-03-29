# Telegram Manager — Complete Detailed README

> This document is so complete that a developer reading only this file can rebuild the exact same application from scratch.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Folder & File Structure](#3-folder--file-structure)
4. [Database Schema](#4-database-schema)
5. [Authentication System](#5-authentication-system)
6. [All Screens & UI Views](#6-all-screens--ui-views)
7. [All Buttons & Their Actions](#7-all-buttons--their-actions)
8. [Backend API Endpoints](#8-backend-api-endpoints)
9. [Python Bot Source Files](#9-python-bot-source-files)
10. [Environment Variables & Secrets](#10-environment-variables--secrets)
11. [Build & Run Instructions](#11-build--run-instructions)
12. [Deployment (Railway)](#12-deployment-railway)
13. [Key Libraries & Versions](#13-key-libraries--versions)

---

## 1. Project Overview

**Telegram Manager** is a full-stack web application that acts as a powerful Telegram user-account control panel. It lets a user:

- Log in via Telegram (using API credentials or a session string)
- Browse all Telegram chats (channels, groups, private)
- Search messages by text, message ID, date, or similarity
- Download media files (videos, audio, documents, images)
- Forward/copy messages between chats using either a Python script (Telethon) or a JavaScript script (GramJS)
- Run "Live Cloning" — real-time automatic message forwarding from one chat to another
- Manage GitHub repositories (upload files, manage branches, webhooks, collaborators)
- Store text notes (Text Memo)
- View a real-time console log panel
- Convert PDF/images via an embedded tool
- Run a "Python Script Mode" wizard for advanced chat operations

The UI is a dark-themed, single-page React app with a left sidebar and a floating window system allowing any panel to be popped out into a draggable overlay.

---

## 2. Technology Stack

### Frontend
| Item | Value |
|------|-------|
| Framework | React 18 with TypeScript |
| Build Tool | Vite 5 |
| UI Library | Shadcn/UI (built on Radix UI primitives) |
| Styling | Tailwind CSS 3 |
| State Management | TanStack Query (React Query) v5 |
| Routing | Wouter |
| Icons | Lucide React |
| Local Storage | IndexedDB (via custom `storage.ts` lib) |
| WebSocket | Native `ws` for console logs |
| PDF Handling | PDF.js (`public/pdf.worker.js`) |

### Backend
| Item | Value |
|------|-------|
| Server | Express.js (TypeScript) |
| Database | PostgreSQL via Neon serverless + Drizzle ORM |
| Session | express-session + memorystore |
| Telegram (Node) | `telegram` npm package (GramJS), `@mtproto/core` |
| File Handling | multer, archiver, adm-zip, unzipper, extract-zip |
| YouTube | ytdl-core |
| HTTP | axios, node-fetch |
| Child Processes | Node `child_process.spawn` for Python scripts |
| WebSocket | `ws` library |

### Python Bots
| Item | Value |
|------|-------|
| Language | Python 3.11 |
| Telegram Library | Telethon ≥ 1.41.0 |
| Crypto | tgcrypto, cryptg |
| Config | configparser, python-dotenv |
| Image | Pillow ≥ 8.0.0 |

---

## 3. Folder & File Structure

```
/ (project root)
├── client/                          # React frontend
│   ├── index.html                   # Entry HTML (Vite template)
│   └── src/
│       ├── App.tsx                  # Root component + router (4 routes)
│       ├── main.tsx                 # ReactDOM.createRoot entry
│       ├── index.css                # Global styles + Tailwind
│       ├── components/
│       │   ├── auth-modal.tsx       # Login dialog (3 auth methods)
│       │   ├── chat-selection.tsx   # Chat list + selection screen
│       │   ├── Console.tsx          # Real-time console log panel
│       │   ├── dashboard.tsx        # Overview dashboard
│       │   ├── date-range.tsx       # Date-range message filter
│       │   ├── FloatingWindow.tsx   # Draggable floating panel wrapper
│       │   ├── git-control.tsx      # Advanced GitHub management (1970 lines)
│       │   ├── github-sync.tsx      # Simple GitHub file upload (1655 lines)
│       │   ├── github-sync-v2.tsx   # Updated version of GitHub sync
│       │   ├── js-copier.tsx        # JS/GramJS message copier (1429 lines)
│       │   ├── live-cloning.tsx     # Real-time message cloner (2081 lines)
│       │   ├── message-search.tsx   # Message search (text/ID/date/similarity)
│       │   ├── PdfImg.tsx           # PDF/Image conversion tool
│       │   ├── python-copier.tsx    # Python/Telethon message copier (1456 lines)
│       │   ├── python-script-main.tsx # Python Script Mode wizard (821 lines)
│       │   ├── settings.tsx         # App settings panel
│       │   ├── sidebar.tsx          # Left navigation sidebar
│       │   └── ui/                  # ~30 Shadcn/Radix UI components
│       ├── contexts/
│       │   └── ui-layout-context.tsx # Layout theme context
│       ├── hooks/
│       │   └── use-toast.ts         # Toast notification hook
│       ├── lib/
│       │   ├── downloads.ts         # Download manager (File System Access API)
│       │   ├── queryClient.ts       # TanStack Query client config
│       │   ├── similarity.ts        # Similarity matching algorithm
│       │   ├── storage.ts           # IndexedDB wrapper
│       │   ├── telegram.ts          # Telegram client wrapper (GramJS)
│       │   └── telegram-entity-formatter.ts # Entity ID formatting utils
│       └── pages/
│           ├── home.tsx             # Main home page (renders sidebar + views)
│           ├── DownloadsPage.tsx    # Downloads page (route /downloads)
│           ├── TextMemoPage.tsx     # Text memo page (route /text-memo)
│           └── not-found.tsx        # 404 page
│
├── server/                          # Express backend
│   ├── index.ts                     # Server entry, Express setup, WebSocket
│   ├── routes.ts                    # All API routes (~5471 lines)
│   ├── routes.ts.backup             # Backup of routes
│   ├── storage.ts                   # Database storage interface
│   ├── db.ts                        # Drizzle + Neon DB connection
│   ├── auto-setup.ts                # Auto-setup on startup
│   ├── github-features.ts           # GitHub API helper functions
│   ├── telegram-client-factory.ts   # Creates Telegram GramJS clients
│   ├── DatabaseLiveCloningStorage.ts # Live cloning DB storage
│   ├── vite.ts                      # Vite dev middleware setup
│   ├── telegram-bot/
│   │   ├── BotManager.ts            # Bot lifecycle manager
│   │   ├── DatabaseStorage.ts       # DB-backed storage for bot
│   │   ├── DownloadManager.ts       # File download manager
│   │   ├── FileExtractor.ts         # Zip/tar extractor
│   │   ├── LanguageTemplates.ts     # Bot response templates
│   │   ├── logger.ts                # Winston-style logger
│   │   ├── MTProtoClient.ts         # Low-level MTProto client
│   │   ├── SimpleTelegramBot.ts     # Simple bot implementation
│   │   ├── TelegramBot.ts           # Full bot implementation
│   │   └── YouTubeDownloader.ts     # YouTube download handler
│   └── utils/
│       ├── github-uploader.ts       # GitHub file upload utility
│       └── replit-fetcher.ts        # Replit project file fetcher
│
├── shared/
│   ├── schema.ts                    # Drizzle ORM schema + Zod types
│   ├── config-reader.ts             # Config file reader (TypeScript)
│   └── config-reader.py             # Config file reader (Python)
│
├── bot_source/                      # Python bot source code
│   ├── README.md                    # Bot source readme
│   ├── requirements.txt             # Root Python deps
│   ├── live-cloning/                # Live cloning Python bot
│   │   ├── main.py                  # Entry point
│   │   ├── live_cloner.py           # Core cloning logic
│   │   ├── Login.py                 # Telethon login
│   │   ├── Types.py                 # Custom types
│   │   ├── config.json              # Bot configuration (has hardcoded IDs)
│   │   ├── enhanced_logger.py       # Logger
│   │   ├── auto_start_validator.py  # Auto-start validator
│   │   ├── help.txt                 # Help text
│   │   ├── message_mappings.json    # Message ID mappings
│   │   ├── status.json              # Running status
│   │   ├── live_cloner.session      # Telethon session file
│   │   ├── temp_session.session     # Temp session
│   │   ├── requirements.txt         # Python deps
│   │   └── plugins/
│   │       ├── utils.py             # Config manager
│   │       └── jsons/               # JSON config files
│   │           ├── config.json      # Config
│   │           ├── entities.json    # Entity links
│   │           ├── filters.json     # Word filters
│   │           └── messages.json    # Message mappings
│   └── python-copier/               # Python copier bot
│       ├── forwarder.py             # Core forwarding logic
│       ├── settings.py              # Settings with hardcoded session string
│       ├── config.ini               # Forwarding pair config
│       ├── check_accessible_chats.py # Chat access checker
│       └── requirements.txt         # Python deps
│
├── public/                          # Static files served by Express
│   ├── pdf.worker.js                # PDF.js worker
│   └── FinalCropper/               # Embedded image cropper tool
│
├── tmp/config/                      # Runtime config files
│   ├── copier_config.ini            # Python copier config (runtime)
│   ├── js_copier_config.ini         # JS copier config (runtime)
│   └── live_cloning_config.json     # Live cloning config (runtime)
│
├── package.json                     # Node dependencies + scripts
├── requirements.txt                 # Root Python dependencies
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── drizzle.config.ts                # Drizzle ORM configuration
├── railway.toml                     # Railway deployment config
├── pyproject.toml                   # Python project config
├── .replit                          # Replit configuration
├── replit.md                        # Project notes for Replit Agent
├── standalone.html                  # Standalone HTML version
├── session-upload-helper.sh         # Shell helper for session upload
├── replace.sh                       # Shell script for file replacement
├── bottorrent.session               # Torrent bot session file
└── test_bot.session                 # Test session file
```

---

## 4. Database Schema

All tables are PostgreSQL, managed via Drizzle ORM. Defined in `shared/schema.ts`.

### `downloads`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | Auto-increment |
| userId | varchar | Who downloaded |
| messageId | integer | Telegram message ID |
| originalFilename | varchar | Original file name |
| filePath | varchar | Local path |
| url | text | Source URL |
| fileType | varchar | Type of file |
| fileSize | integer | Size in bytes |
| status | varchar | pending/downloading/completed/failed |
| progress | integer | 0-100 |
| error | text | Error message if failed |
| downloadDate | timestamp | When started |
| updateDate | timestamp | Last updated |

### `pendingMessages`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| userId | varchar | |
| messageId | integer | |
| messageType | varchar | download/command/youtube |
| content | text | |
| metadata | jsonb | Extra data |
| createdAt | timestamp | |

### `botSessions`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| botId | varchar UNIQUE | Bot identifier |
| sessionString | text | Telegram session string |
| config | jsonb | Bot configuration |
| status | varchar | active/inactive/error |
| lastError | text | |
| createdAt | timestamp | |
| updatedAt | timestamp | |

### `githubSettings`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| userId | varchar UNIQUE | |
| personalAccessToken | text | GitHub PAT |
| isDefault | boolean | |
| updatedAt | timestamp | |

### `gitTokenConfigs`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| label | varchar(100) | Human label for the token |
| tokenHash | text | Hashed PAT |
| scopes | text[] | GitHub scopes |
| createdAt | timestamp | |
| lastUsed | timestamp | |

### `gitRepositories`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| owner | varchar(100) | GitHub username |
| name | varchar(100) | Repo name |
| fullName | varchar(200) | owner/name |
| private | boolean | |
| description | text | |
| defaultBranch | varchar | |
| homepage | text | |
| topics | text[] | |
| cachedAt | timestamp | |

### `textMemos`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| title | varchar(200) | Memo title |
| description | text | |
| hint | text | Helper text |
| content | text | Main content |
| createdAt | timestamp | |

### `liveCloningInstances`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| instanceId | varchar UNIQUE | Unique instance ID |
| sessionString | text | Telegram session |
| config | jsonb | Full config |
| status | varchar | active/inactive/error |
| botEnabled | boolean | Enable/disable bot |
| filterWords | boolean | Word filter on/off |
| addSignature | boolean | Append signature |
| signature | text | Signature text |
| lastError | text | |
| processedMessages | integer | Count |
| createdAt | timestamp | |
| updatedAt | timestamp | |

### `entityLinks`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| instanceId | varchar | Links to liveCloningInstances |
| fromEntity | text | Source chat ID/username |
| toEntity | text | Target chat ID/username |
| isActive | boolean | |
| createdAt | timestamp | |

### `wordFilters`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| instanceId | varchar | |
| fromWord | text | Word to replace |
| toWord | text | Replacement |
| isActive | boolean | |
| createdAt | timestamp | |

### `liveCloningMessages`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| instanceId | varchar | |
| baseEntity | text | Source chat |
| baseMessageId | integer | Source message ID |
| targetEntity | text | Target chat |
| targetMessageId | integer | Cloned message ID |
| createdAt | timestamp | |

### `consoleLogs`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| level | varchar | DEBUG/INFO/WARN/ERROR |
| message | text | Log text |
| source | varchar | application/bot/system |
| metadata | jsonb | Extra context |
| timestamp | timestamp | |

### `logCollections`
| Column | Type | Description |
|--------|------|-------------|
| id | serial PK | |
| name | varchar(255) | Collection label |
| totalEntries | integer | Count |
| savedAt | varchar(50) | ISO timestamp string |
| logsData | text | JSON-serialized logs |
| createdAt | timestamp | |

---

## 5. Authentication System

The app uses **Telegram's own authentication** — it connects directly as a Telegram user account, not as a bot.

### Three Login Methods (in `auth-modal.tsx`)

#### Method 1: Use Default Session
- Loads a hardcoded or env-var session string directly
- No OTP needed
- Calls `telegramManager.loadSession(sessionData)` immediately
- Session string source: `VITE_DEFAULT_SESSION_STRING` env var OR hardcoded string

#### Method 2: Enter Custom Session String
- User pastes a Telethon/GramJS session string into a text field
- Session saved to `localStorage` under key `custom_sessions` (array)
- Session history is password-protected; password is `Sh@090609` (hardcoded, overridable via `VITE_SESSION_HISTORY_PASSWORD`)

#### Method 3: Full Authentication
- Step 1 → Enter API ID and API Hash
- Step 2 → Enter phone number (with country code)
- Step 3 → Enter OTP code received via Telegram
- Step 4 (optional) → Enter 2FA password if enabled
- Uses window custom events: `telegram:code-required`, `telegram:code-response`, `telegram:password-required`, `telegram:password-response`

### Session Storage
- Session saved to **IndexedDB** via `storage.saveSession()`
- Also sets `localStorage.setItem('telegram_session', 'active')` flag
- On app reload, session is auto-restored from IndexedDB

### Telegram API Credentials Used for Login (all hardcoded or via env):
- API ID: `28403662` → env: `VITE_TELEGRAM_API_ID`
- API Hash: `079509d4ac7f209a1a58facd00d6ff5a` → env: `VITE_TELEGRAM_API_HASH`
- Phone: `+917352013479` → env: `VITE_TELEGRAM_PHONE`

---

## 6. All Screens & UI Views

The app has a single main layout: **Left Sidebar (272px wide) + Right Content Area**.

### Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Main view — sidebar + content panels |
| `/downloads` | `DownloadsPage` | Standalone downloads page |
| `/git-control` | `GitControl` | Standalone git control page |
| `/text-memo` | `TextMemoPage` | Standalone text memo page |
| `*` | `NotFound` | 404 page |

### Sidebar Navigation Items (in order)
| ID | Label | Icon |
|----|-------|------|
| `python-script` | 🐍 Python Script Mode | Code2 |
| `python-copier` | 🐍 Python Copier | Forward |
| `js-copier` | ⚡ JS Copier | Forward |
| `live-cloning` | ⚡ Live Cloning | Zap |
| `dashboard` | Dashboard | LayoutDashboard |
| `chats` | Chat Selection | MessageSquare |
| `messages` | Message Search | Search |
| `date-range` | Date Range | CalendarRange |
| `similarity` | Similarity Search | GitCompare |
| `downloads` | Download | Download |
| `file-manager` | 📁 File Manager | Files |
| `github-sync` | 🐙 GitHub Sync | Github |
| `git-control` | ⚡ Git Control | Github |
| `text-memo` | 📝 Text Memo | FileText |
| `settings` | Settings | Settings |

Each sidebar item has a "floating window" button (Monitor icon) to pop the view into a draggable overlay.

---

### Screen 1: 🐍 Python Script Mode (`python-script-main.tsx`)

**Purpose**: Wizard-style interface to run pre-built operations on a selected Telegram chat.

**3-step flow**:
1. **Select Chat** — Search bar to filter chats; click to select
2. **Choose Mode** — Pick one of 6 operation modes:
   - 📅 Get message info by date range
   - 📈 Get total number of messages
   - 🧠 Get message ID from approximate message (85% similarity)
   - 🔢 Get message text and date from Message ID
   - 📆 Get ALL messages on a specific date
   - 🎥 Download videos from last 50 messages
3. **Execute** — Fills in parameters (dates, IDs, search text) and runs the operation

**Key UI elements**:
- Chat search input field
- 6 mode cards (click to select)
- Date inputs, message ID input, search query input
- Download Range input (for video downloads)
- Progress bar during execution
- Results display area
- "Select Download Folder" button (uses File System Access API)
- "Change Folder" / "Select Folder" button

---

### Screen 2: 🐍 Python Copier (`python-copier.tsx`)

**Purpose**: Forward/copy messages from one Telegram chat to another using a Python (Telethon) script running as a child process on the server.

**Sections**:
1. **Status Bar** — Shows running/stopped status, current pair, messages processed, user info
2. **Session String** — Text input pre-filled with default session string
3. **Login Test Button** — Tests if session is valid, shows user name/ID
4. **Forward Pairs List** — Table of configured forwarding pairs with Edit/Remove/Start buttons
5. **Add New Forward Pair** — Form with: Pair Name, From Chat (dropdown), To Chat (dropdown), From Offset (number), To Offset (number)
6. **Config Editor** — Shows/edits the raw `config.ini` text
7. **Logs Panel** — Shows last log and copier logs (toggle)

**Control Buttons**:
- **Start** (green Play icon) — Starts the Python copier
- **Stop** (red Square icon) — Stops the Python copier
- **Pause** — Pauses forwarding
- **Resume** — Resumes from saved offset
- **Get Offset** (single click) — Shows last saved offset
- **Update Offset** (double click) — Updates the offset in config
- **Save Config** — Saves the generated config.ini
- **Edit Config** — Opens raw config editor
- **Clear Logs** — Clears all log entries

**Config format generated** (`config.ini`):
```ini
[pair_name]
from = @username_or_chat_id
to = @username_or_chat_id
offset = 0
```

---

### Screen 3: ⚡ JS Copier (`js-copier.tsx`)

**Purpose**: Same as Python Copier but runs using Node.js/GramJS (JavaScript) instead of Python. Identical UI to Python Copier.

**Differences from Python Copier**:
- Uses API endpoints `/api/js-copier/*` instead of `/api/python-copier/*`
- Uses GramJS (npm `telegram` package) instead of Telethon
- Config comment says "JavaScript/GramJS"
- Chat ID formatting uses `formatChatIdForGramJS` instead of `formatChatIdForTelethon`

**All buttons are identical to Python Copier.**

---

### Screen 4: ⚡ Live Cloning (`live-cloning.tsx`)

**Purpose**: Real-time message cloning — monitors source chats and instantly forwards new messages to target chats. Runs as a persistent background process.

**Sections**:

#### Status Card
- Running indicator (green/red)
- Instance ID, processed messages count, session validity badge
- Current user info (name, username, ID)
- Start / Stop buttons

#### Bot Settings Card
- **Bot Enabled** toggle (Switch)
- **Filter Words** toggle (Switch)
- **Add Signature** toggle (Switch)
- **Signature text** input (only visible when Add Signature is on)
- **Save Settings** button

#### Entity Links (Forwarding Routes)
- Table showing all source→target pairs
- Each row has: from entity, to entity, active status, Edit button, Delete button
- **Add Entity Link** form:
  - Toggle between "Select from chat list" and "Manual input"
  - Dropdown selectors for From Chat and To Chat
  - OR manual text inputs for From Entity and To Entity
  - **Add Link** button

#### Word Filters
- Table showing all word replacement rules (fromWord → toWord)
- Each row has Edit and Delete buttons
- **Add Word Filter** form:
  - From Word input
  - To Word input
  - **Add Filter** button

#### Advanced Monitoring Panel (toggleable)
- Messages Per Minute, Success Rate, Error Count, Uptime
- Message type breakdown (text, photo, video, audio, document, sticker, voice)
- Statistics: Total Processed, Filtered, Forwarded, Media, Text, Errors
- Active Users list with last seen time and message count
- Recent Activity feed

#### Advanced Bot Settings (expandable section)
- Skip Duplicates (switch)
- Preserve Formatting (switch)
- Forward Media (switch)
- Forward Stickers (switch)
- Forward Voice (switch)
- Max Message Length (input, default 4096)
- Delay Between Messages (slider, default 1 second)
- Retry Failed Messages (switch)
- Log Level (Select: INFO/DEBUG/WARN/ERROR)
- Alert Threshold input

#### Logs Panel (toggleable)
- **Show Logs** button
- **Clear Logs** button
- Auto-scroll toggle
- Message type filter dropdown
- User filter input
- Scrollable log output

---

### Screen 5: Dashboard (`dashboard.tsx`)

**Purpose**: Overview page with statistics and recent activity.

**4 stat cards**:
1. Total Chats (count from IndexedDB)
2. Downloaded Videos (count of completed downloads)
3. Storage Used (sum of completed download sizes)
4. Last Sync (current timestamp when rendered)

**2 content cards**:
- **Recent Downloads** — last 5 downloads with filename, size, status icon; "View All" button → navigates to downloads view
- **Active Chats** — first 5 chats with avatar, name, type badge, member count; "View All" button → navigates to chats view; click any chat → navigates to messages view

**Download Progress section** (only visible when downloads are active):
- Each active download shows filename, file size, percent, speed, and a progress bar

---

### Screen 6: Chat Selection (`chat-selection.tsx`)

**Purpose**: Browse and select Telegram chats.

**Features**:
- Search bar to filter chats by title or username
- Chat type filter (All / Channels / Groups / Private)
- Refresh button — fetches fresh chats from Telegram
- Sorted/filtered chat list, each item shows:
  - Avatar with initials
  - Chat title
  - Chat type badge
  - Member count or "Private chat"
  - Username (if available)
- Click any chat → saves selection for use in other panels

---

### Screen 7: Message Search (`message-search.tsx`)

**Purpose**: Search messages within a selected Telegram chat.

**3 Search Modes** (tabs):
1. **Text Search** — keyword search with optional similarity threshold slider (0–100%)
2. **ID Search** — look up a specific message by its numeric ID
3. **Date Search** — pick a date to see all messages from that day

**Controls**:
- Chat selector dropdown
- Search query input
- "Search in whole message" checkbox
- Similarity threshold slider (default 70%)
- Date pickers for date range
- **Execute Search** button
- Results list — each message shows: date, sender name, text preview, media type badge
- Copy and external link buttons per message

---

### Screen 8: Date Range (`date-range.tsx`)

**Purpose**: Filter and browse messages between two dates.

**Controls**:
- Chat selector
- Start date picker
- End date picker
- **Fetch Messages** button
- Sortable results with text, sender, date, media info

---

### Screen 9: Similarity Search

**Purpose**: Uses the `SimilarityMatcher` class (in `client/src/lib/similarity.ts`) to find messages similar to a given query string.

- Threshold slider
- Query input
- Chat selector
- Results ranked by similarity score

---

### Screen 10: Download (`downloads` view)

**Purpose**: Download media from Telegram messages and track download status.

**Features**:
- Select chat → select messages with media
- Download button per media item
- Active downloads list with progress bars
- Completed downloads list
- Download queue status
- "Select Download Folder" → uses File System Access API to pick local folder

---

### Screen 11: 📁 File Manager (`file-manager` view)

**Purpose**: Browse and manage downloaded files on the server.

**API**: Calls `GET /api/downloads` to list all files in `./downloads/` directory.

**Features**:
- File list showing: name, type, size, download date
- Delete button per file
- Play/view button for media files (served via `/api/downloads/file/:folder/:filename`)
- Organized by subfolders: completed, youtube/videos, youtube/audio, documents, images, videos, audio, archives

---

### Screen 12: 🐙 GitHub Sync (`github-sync.tsx`)

**Purpose**: Upload/sync files to a GitHub repository.

**Sections**:
1. **Authentication** — Enter GitHub Personal Access Token (PAT)
2. **Repository Selection** — List user's repos, click to select
3. **File Upload**:
   - Drag & drop or file picker
   - Supports individual files or entire folders (with `webkitdirectory`)
   - Max single file: 500MB; Max total: 5GB
   - Chunks large files for memory safety
4. **Sync Progress** — progress bar, files processed/total, current file name, errors list
5. **Cancel** button during sync

**Tabs**:
- Upload Files
- Manage Repository
- Terminal (shell commands)
- Replit Sync (sync from Replit project)

---

### Screen 13: ⚡ Git Control (`git-control.tsx`)

**Purpose**: Full GitHub repository management panel (1970 lines).

**Tabs**:
1. **Repositories** — Browse repos, create, delete, archive, view details
2. **Branches** — List branches, create, delete, set default, protect
3. **Collaborators** — Add/remove collaborators with permissions (pull/push/admin/etc.)
4. **Webhooks** — Add/remove webhooks, configure events
5. **Pull Requests** — List, create, merge PRs
6. **Commits** — View commit history
7. **Settings** — Update repo description, homepage, topics, visibility, features

**Key buttons**: Refresh, Create New, Delete, Archive, Add Collaborator, Add Webhook, Merge PR, etc.

---

### Screen 14: 📝 Text Memo (`text-memo` view / TextMemoPage)

**Purpose**: Simple note-taking system backed by the PostgreSQL database.

**Features**:
- List of all memos with title, description, hint, creation date
- **New Memo** button → opens form with Title, Description, Hint, Content fields
- **Edit** button per memo
- **Delete** button per memo (with confirmation)
- Memos persist in the `text_memos` PostgreSQL table

**API calls**: `GET/POST/PUT/DELETE /api/text-memos`

---

### Screen 15: Settings (`settings.tsx`)

**Purpose**: App preferences and account information.

**Sections**:
1. **Account Information** (left column):
   - Name, Phone Number, User ID, API ID, API Hash — each with Copy button
   - Session String — shows first 50 chars + "Copy Full Session" button
   - Bot Tokens section — shows active bot configs
   - **Refresh Session** button — reloads chats from Telegram

2. **Download Settings** (left column):
   - Download Quality select (Auto/High/Medium/Low)
   - Max Concurrent Downloads slider (1–10, default 3)
   - Auto-retry failed downloads (switch)
   - Delete failed downloads (switch)
   - Show download notifications (switch)

3. **Storage Information** (right column):
   - Total Downloads count
   - Total size of downloads
   - Browser storage quota and usage (from `navigator.storage.estimate()`)
   - **Clear Downloads** button
   - **Clear All Data** button (clears IndexedDB + localStorage + disconnects Telegram)

4. **UI Layout Themes** (right column):
   - 6 layout options:
     - Current Design
     - Compact Pro
     - Modern Glass
     - Classic Box
     - Ultra Minimal
     - Gaming RGB
   - Each is clickable; stores in localStorage + updates UILayoutContext

---

### Floating Console Window (`Console.tsx`)

**Purpose**: Real-time log viewer connected via WebSocket.

**Features**:
- Connects to `ws://<host>/ws/console`
- Log levels: DEBUG, INFO, WARN, ERROR (color coded)
- Filter by level
- Clear logs
- Save log collection (calls `POST /api/console-logs/save-collection`)
- Load saved collections
- Pagination (limit/offset)
- Auto-scroll toggle

**Opened by**: Sidebar footer "Console" button.

---

### Floating PdfImg Window (`PdfImg.tsx`)

**Purpose**: Convert between PDF and images.

**Opened by**: Sidebar footer "PdfImg" button.

---

## 7. All Buttons & Their Actions

### Sidebar Footer Buttons
| Button | Data-testid | Action |
|--------|-------------|--------|
| Select Folder / Change Folder | `button-select-folder` | Opens browser File System Access API folder picker |
| Default | `button-default-download` | Sets `downloadManager.setUseDefaultDownload(true)` |
| Console | `button-open-console` | Opens floating Console window |
| PdfImg | `button-open-pdfimg` | Opens floating PdfImg window |
| Logout | `button-logout` | Calls `onLogout` → clears session, returns to login |
| Monitor icon (per nav item) | `floating-{id}` | Opens that view in a floating draggable window |

### Auth Modal Buttons
| Button | Data-testid | Action |
|--------|-------------|--------|
| Use Default Session | `button-default-session` | Calls `handleUseDefaultSession()` |
| Enter Session String | `button-custom-session` | Switches step to `custom-session` |
| Full Authentication | `button-full-auth` | Switches step to `credentials` |
| Back | `button-back-to-options` | Returns to login-options step |
| Login (custom session) | `button-login-custom-session` | Calls `handleUseCustomSession()` |
| History icon | `button-session-history` | Password prompt → shows stored sessions |
| Continue (credentials) | `button-credentials-submit` | Validates API ID/Hash, moves to phone step |
| Back (from credentials) | `button-back-to-options-from-credentials` | Back to options |
| Continue (phone) | calls `handlePhoneSubmit()` | Sends phone to Telegram, waits for code |
| Back (from phone) | `button-back-to-credentials` | Back to credentials |
| Continue (code) | dispatches `telegram:code-response` event | Submits OTP |
| Continue (password) | dispatches `telegram:password-response` event | Submits 2FA password |

### Settings Buttons
| Button | Data-testid | Action |
|--------|-------------|--------|
| Copy Name | `button-copy-name` | Copies full name to clipboard |
| Copy Phone | `button-copy-phone` | Copies phone number to clipboard |
| Copy User ID | `button-copy-user-id` | Copies user ID to clipboard |
| Copy API ID | `button-copy-api-id` | Copies API ID to clipboard |
| Copy API Hash | `button-copy-api-hash` | Copies API hash to clipboard |
| Copy Full Session | `button-copy-session` | Copies full session string to clipboard |
| Refresh Session | `button-refresh-session` | Reloads chats from Telegram |
| Clear Downloads | — | Calls `storage.deleteDownload()` for all |
| Clear All Data | — | Clears all IndexedDB + localStorage |

### Python Copier / JS Copier Buttons (identical set for both)
| Button | Action |
|--------|--------|
| Start | `POST /api/python-copier/start` (or js-copier) |
| Stop | `POST /api/python-copier/stop` |
| Pause | `POST /api/python-copier/pause` |
| Resume | `POST /api/python-copier/resume` |
| Test Session | `POST /api/python-copier/test-session` |
| Add Pair | Adds pair to local state array |
| Remove Pair | Removes from local state array |
| Edit Pair | Opens inline edit form |
| Save Edited Pair | Updates pair + calls `POST /api/python-copier/config` |
| Start Individual Pair | `POST /api/python-copier/start` with single pair |
| Save Config | `POST /api/python-copier/config` |
| Edit Config | Opens raw config textarea |
| Save Custom Config | `POST /api/python-copier/config/custom` |
| Get Offset (single click) | `GET /api/python-copier/last-offset` |
| Update Offset (double click) | `GET` then `POST /api/python-copier/update-offset` |
| Clear Logs | `POST /api/python-copier/clear-logs` |
| Show Last Log | `GET /api/python-copier/last-log` |

### Live Cloning Buttons
| Button | Action |
|--------|--------|
| Start Live Cloning | `POST /api/live-cloning/start` |
| Stop Live Cloning | `POST /api/live-cloning/stop` |
| Save Settings | `PUT /api/live-cloning/settings` |
| Add Entity Link | `POST /api/live-cloning/entity-links` |
| Edit Entity Link | `PUT /api/live-cloning/entity-links/:id` |
| Delete Entity Link | `DELETE /api/live-cloning/entity-links/:id` |
| Add Word Filter | `POST /api/live-cloning/word-filters` |
| Edit Word Filter | `PUT /api/live-cloning/word-filters/:id` |
| Delete Word Filter | `DELETE /api/live-cloning/word-filters/:id` |
| Clear Logs | `POST /api/live-cloning/clear-logs` |
| Toggle Advanced Monitoring | Local state toggle |
| Toggle Performance Stats | Local state toggle |
| Toggle Active Users | Local state toggle |
| Toggle Recent Activity | Local state toggle |

---

## 8. Backend API Endpoints

All routes prefixed with `/api` unless otherwise noted. Defined in `server/routes.ts`.

### Text Memos
| Method | Path | Action |
|--------|------|--------|
| GET | `/api/text-memos` | Get all memos |
| GET | `/api/text-memos/:id` | Get single memo |
| POST | `/api/text-memos` | Create memo |
| PUT | `/api/text-memos/:id` | Update memo |
| DELETE | `/api/text-memos/:id` | Delete memo |

### Console Logs
| Method | Path | Action |
|--------|------|--------|
| GET | `/api/console-logs` | Get logs (with `?limit=&offset=&level=`) |
| DELETE | `/api/console-logs/old` | Clear logs older than `?days=7` |
| POST | `/api/console-logs/save-collection` | Save log collection |
| GET | `/api/console-logs/collections` | List saved collections |
| GET | `/api/console-logs/collections/:id` | Load a collection |
| DELETE | `/api/console-logs/collections/:id` | Delete a collection |

### Downloads (File Manager)
| Method | Path | Action |
|--------|------|--------|
| GET | `/api/downloads` | List all downloaded files |
| GET | `/api/downloads/file/:folder/:filename` | Stream/serve a file |
| DELETE | `/api/downloads/file/:folder/:filename` | Delete a file |
| GET | `/archive/:filename` | Download a project zip archive |

### Python Copier
| Method | Path | Action |
|--------|------|--------|
| POST | `/api/python-copier/start` | Start the Python copier |
| POST | `/api/python-copier/stop` | Stop the Python copier |
| POST | `/api/python-copier/pause` | Pause the copier |
| POST | `/api/python-copier/resume` | Resume the copier |
| GET | `/api/python-copier/status` | Get current status |
| GET | `/api/python-copier/logs` | Get log lines |
| POST | `/api/python-copier/clear-logs` | Clear logs |
| GET | `/api/python-copier/config` | Get current config + pairs |
| POST | `/api/python-copier/config` | Save config |
| POST | `/api/python-copier/config/custom` | Save raw custom config |
| POST | `/api/python-copier/test-session` | Validate session string |
| GET | `/api/python-copier/last-offset` | Get last saved offset |
| POST | `/api/python-copier/update-offset` | Update a pair's offset |
| GET | `/api/python-copier/last-log` | Get last forwarding log entry |

### JS Copier (identical structure)
| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/js-copier/start` | Uses GramJS internally |
| POST | `/api/js-copier/stop` | |
| POST | `/api/js-copier/pause` | |
| POST | `/api/js-copier/resume` | |
| GET | `/api/js-copier/status` | |
| GET | `/api/js-copier/logs` | |
| POST | `/api/js-copier/clear-logs` | |
| GET | `/api/js-copier/config` | |
| POST | `/api/js-copier/config` | |
| POST | `/api/js-copier/config/custom` | |
| POST | `/api/js-copier/test-session` | |
| GET | `/api/js-copier/last-offset` | |
| POST | `/api/js-copier/update-offset` | |
| GET | `/api/js-copier/last-log` | |

### Live Cloning
| Method | Path | Action |
|--------|------|--------|
| POST | `/api/live-cloning/start` | Start live cloning |
| POST | `/api/live-cloning/stop` | Stop live cloning |
| GET | `/api/live-cloning/status` | Get running status |
| GET | `/api/live-cloning/logs` | Get log lines |
| POST | `/api/live-cloning/clear-logs` | Clear logs |
| GET | `/api/live-cloning/settings` | Get settings |
| PUT | `/api/live-cloning/settings` | Update settings |
| POST | `/api/live-cloning/entity-links` | Add entity link |
| GET | `/api/live-cloning/entity-links/:instanceId` | Get links for instance |
| PUT | `/api/live-cloning/entity-links/:id` | Update a link |
| DELETE | `/api/live-cloning/entity-links/:id` | Delete a link |
| POST | `/api/live-cloning/word-filters` | Add word filter |
| GET | `/api/live-cloning/word-filters/:instanceId` | Get filters |
| PUT | `/api/live-cloning/word-filters/:id` | Update filter |
| DELETE | `/api/live-cloning/word-filters/:id` | Delete filter |

### Telegram (MTProto/GramJS) — Bot Management
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/bot/status` | Main bot status |
| GET | `/api/python-bot/status` | Python bot status |
| GET | `/api/node-bot/status` | Node bot status |

### GitHub Sync
| Method | Path | Action |
|--------|------|--------|
| POST | `/api/github/connect` | Connect with PAT |
| GET | `/api/github/user` | Get GitHub user info |
| GET | `/api/github/repos` | List repositories |
| POST | `/api/github/sync` | Upload files to repo |
| GET/POST/DELETE | `/api/github/repos/:owner/:repo/*` | Repo management |

### Git Control (Advanced)
| Method | Path | Notes |
|--------|------|-------|
| GET/POST/DELETE | `/api/git-control/tokens` | Manage PATs |
| GET | `/api/git-control/repos` | List repos |
| GET/POST/DELETE | `/api/git-control/repos/:owner/:repo/branches` | Branch management |
| GET/POST/DELETE | `/api/git-control/repos/:owner/:repo/collaborators` | Collaborators |
| GET/POST/DELETE | `/api/git-control/repos/:owner/:repo/webhooks` | Webhooks |
| GET | `/api/git-control/repos/:owner/:repo/pulls` | Pull requests |
| GET | `/api/git-control/repos/:owner/:repo/commits` | Commits |
| PATCH | `/api/git-control/repos/:owner/:repo/settings` | Repo settings |

### Static File Serving (non-API)
| Path | Description |
|------|-------------|
| `/FinalCropper/build/*` | FinalCropper app static files |
| `/FinalCropper/public/molview/*` | MolView chemistry tool |
| `/FinalCropper/public/molview/php/download_db.php` | Download molview DB |
| `/FinalCropper/public/molview/php/upload_db.php` | Upload molview DB |
| `/FinalCropper/public/molview/php/upload.php` | Upload structure files |
| `/FinalCropper/public/molview/php/download.php` | Download structures as zip |
| `/FinalCropper/public/molview/php/cod.php` | Proxy to crystallography.net |
| `/FinalCropper/public/molview/php/cif.php` | Proxy CIF file fetch |
| `/public/*` | General public static files |
| `/ws/console` | WebSocket endpoint for console logs |

---

## 9. Python Bot Source Files

### Live Cloning Bot (`bot_source/live-cloning/`)

**Entry Point**: `main.py`

**Core File**: `live_cloner.py` — Contains the TelegramClient setup, message handler, and cloning logic

**Authentication**: `Login.py` reads `api_id` and `api_hash` from `config.json` via `plugins/utils.py Config` class

**Config file** (`config.json`):
```json
{
  "api_id": 28403662,
  "api_hash": "079509d4ac7f209a1a58facd00d6ff5a",
  "bot_enabled": true,
  "sudo": [],
  "filter_words": true,
  "add_signature": false,
  "signature": "",
  "entities": [[4949360302, 2186541033]],
  "filters": []
}
```
- `entities`: Array of `[source_chat_id, destination_chat_id]` pairs
- `filters`: Array of `[from_word, to_word]` word replacement rules

**Session File**: `live_cloner.session` (Telethon SQLite session)

**Plugin Config Files** (`plugins/jsons/`):
- `config.json` — Same as root config.json
- `entities.json` — Entity link pairs
- `filters.json` — Word filter pairs
- `messages.json` — Tracks cloned message ID mappings

**Python Dependencies**:
```
telethon>=1.41.0
tgcrypto
requests
python-dotenv
pillow>=8.0.0
cryptg
```

---

### Python Copier Bot (`bot_source/python-copier/`)

**Entry Point**: `forwarder.py`

**Settings File**: `settings.py`:
- Reads `TG_API_ID` / `API_ID` env vars → defaults to `1`
- Reads `TG_API_HASH` / `API_HASH` env vars → defaults to `'default_hash'`
- Reads `RAILWAY_SESSION_STRING` env var → defaults to hardcoded session string (see Section 10)
- Reads `CONFIG_PATH` env var → defaults to `config.ini`

**Config file** (`config.ini`):
```ini
[pair_name]
from = source_chat
to = destination_chat
offset = 0
```

---

## 10. Environment Variables & Secrets

### Frontend (Vite, prefix `VITE_`)
| Variable | Default Value (Hardcoded Fallback) | File |
|----------|-----------------------------------|------|
| `VITE_TELEGRAM_API_ID` | `28403662` | `auth-modal.tsx` |
| `VITE_TELEGRAM_API_HASH` | `079509d4ac7f209a1a58facd00d6ff5a` | `auth-modal.tsx` |
| `VITE_TELEGRAM_PHONE` | `+917352013479` | `auth-modal.tsx` |
| `VITE_DEFAULT_SESSION_STRING` | `1BQAWZmxvcmEud...` (long string, see auth-modal.tsx line 142) | `auth-modal.tsx` |
| `VITE_DEFAULT_SESSION_STRING` | Also used in `python-copier.tsx` and `js-copier.tsx` line 54 with a different hardcoded default | `python-copier.tsx`, `js-copier.tsx` |
| `VITE_SESSION_HISTORY_PASSWORD` | `Sh@090609` | `auth-modal.tsx` |

### Backend (Node.js process.env)
| Variable | Default Value | File |
|----------|---------------|------|
| `SESSION_SECRET` | Random string: `'telegram-manager-github-sync-' + Math.random()` | `server/index.ts` |
| `PORT` | `5000` | `server/index.ts` |
| `NODE_ENV` | `development` | `server/index.ts` |
| `DATABASE_URL` | Required — Neon PostgreSQL URL | `server/db.ts` |
| `REPL_ID` | Set by Replit | `server/index.ts` |
| `REPLIT_DEV_DOMAIN` | Set by Replit | `server/index.ts` |
| `RAILWAY_ENVIRONMENT` | Set by Railway | `server/index.ts` |
| `RAILWAY_PROJECT_ID` | Set by Railway | `server/index.ts` |
| `GITHUB_CLIENT_ID` | Optional — GitHub OAuth | `server/routes.ts` |
| `GITHUB_CLIENT_SECRET` | Optional — GitHub OAuth | `server/routes.ts` |

### Python Environment Variables
| Variable | Default Value | File |
|----------|---------------|------|
| `TG_API_ID` or `API_ID` | `1` | `bot_source/python-copier/settings.py` |
| `TG_API_HASH` or `API_HASH` | `'default_hash'` | `bot_source/python-copier/settings.py` |
| `RAILWAY_SESSION_STRING` | Hardcoded session string | `bot_source/python-copier/settings.py` |
| `CONFIG_PATH` | `config.ini` | `bot_source/python-copier/settings.py` |

---

## 11. Build & Run Instructions

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL database (Neon serverless recommended)

### Setup Steps

**1. Clone the repo**
```bash
git clone <repo-url>
cd telegram-manager
```

**2. Install Node dependencies**
```bash
npm install
```

**3. Install Python dependencies**
```bash
pip install -r requirements.txt
```

**4. Set up environment variables**

Create a `.env` file or set these in your environment:
```env
DATABASE_URL=postgresql://user:pass@host/dbname
SESSION_SECRET=your-random-secret-here
VITE_TELEGRAM_API_ID=your_api_id
VITE_TELEGRAM_API_HASH=your_api_hash
VITE_TELEGRAM_PHONE=+your_phone_number
VITE_DEFAULT_SESSION_STRING=your_session_string
VITE_SESSION_HISTORY_PASSWORD=your_password
PORT=5000
NODE_ENV=development
```

**5. Push database schema**
```bash
npm run db:push
```

**6. Run in development**
```bash
npm run dev
```
This starts both the Vite dev server (hot reload) and the Express server on port 5000.

**7. Build for production**
```bash
npm run build
npm start
```

---

## 12. Deployment (Railway)

The project includes `railway.toml` for Railway deployment.

**Key Railway settings**:
- Start command: `npm start`
- Build command: `npm run build`
- Set all required environment variables in Railway dashboard
- `DATABASE_URL` must point to a PostgreSQL instance
- `RAILWAY_SESSION_STRING` used by Python copier instead of hardcoded default

**Railway-specific detection** in `server/index.ts`:
```typescript
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID;
```

---

## 13. Key Libraries & Versions

### Production Dependencies (Node)
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `express` | ^4.21.2 | Web server |
| `telegram` | ^2.26.22 | GramJS — Telegram client (JavaScript) |
| `@mtproto/core` | ^6.3.0 | Low-level MTProto |
| `drizzle-orm` | ^0.39.1 | ORM |
| `@neondatabase/serverless` | ^0.10.4 | Neon PostgreSQL driver |
| `@tanstack/react-query` | ^5.60.5 | Server state management |
| `wouter` | ^3.3.5 | Client routing |
| `tailwindcss` | ^3.4.17 | CSS utility framework |
| `lucide-react` | ^0.453.0 | Icons |
| `ws` | ^8.18.0 | WebSocket server |
| `express-session` | ^1.18.2 | Session middleware |
| `multer` | ^2.0.2 | File upload |
| `archiver` | ^7.0.1 | Zip creation |
| `ytdl-core` | ^4.11.5 | YouTube download |
| `axios` | ^1.11.0 | HTTP client |
| `zod` | ^3.24.2 | Schema validation |
| `framer-motion` | ^11.13.1 | Animations |
| `date-fns` | ^3.6.0 | Date utilities |
| `recharts` | ^2.15.2 | Charts |

### Python
| Package | Version | Purpose |
|---------|---------|---------|
| `telethon` | ≥1.41.0 | Telegram client |
| `tgcrypto` | latest | Fast Telegram crypto |
| `cryptg` | latest | Alternative crypto |
| `pillow` | ≥8.0.0 | Image processing |
| `python-dotenv` | latest | Env file loading |
| `requests` | latest | HTTP requests |
| `configparser` | standard lib | INI config parsing |

---

*End of FULL_PROJECT_README.md*
