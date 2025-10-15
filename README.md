# Trello MERN Stack (Frontend)

A Trello-like board UI built with React + Vite. It supports authentication, real-time board invitations, drag-and-drop columns/cards, markdown card descriptions, and light/dark/system themes.

## Tech stack

- React + Vite
- Redux Toolkit + redux-persist
- React Router
- Material UI (MUI)
- dnd-kit (drag and drop)
- Socket.IO Client
- react-hook-form
- react-toastify
- moment
- uiw/react-md-editor
- ESLint

## Features

- Authentication (login, register, email verification)
- Boards list with pagination and board creation modal
- Drag and drop columns/cards with placeholder handling
- Real-time notifications for board invitations (Socket.IO)
- Card modal with members, markdown description, comments, and cover upload
- Account and security settings (profile, avatar, change password)
- Light/Dark/System theme toggle
- API request interceptor with UI “loading lock” for buttons

## Monorepo layout (frontend)

```
.
├─ public/
├─ src/
│  ├─ apis/
│  ├─ components/
│  ├─ customHooks/
│  ├─ customLibs/
│  ├─ pages/
│  ├─ redux/
│  ├─ utils/
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ theme.js
├─ package.json
├─ vite.config.js
└─ README.md
```

Key files:
- App shell and routing: [src/main.jsx](src/main.jsx), [src/App.jsx](src/App.jsx)
- API host config: [src/utils/constants.js](src/utils/constants.js)
- Axios instance with token refresh: [src/utils/authorizeAxios.js](src/utils/authorizeAxios.js)
- Socket.IO client: [src/socketClient.js](src/socketClient.js)
- Boards pages:
  - Boards list: [src/pages/Boards/index.jsx](src/pages/Boards/index.jsx)
  - Board detail: [src/pages/Boards/_id.jsx](src/pages/Boards/_id.jsx)
  - DnD columns/cards: [src/pages/Boards/BoardContent/ListColumns/ListColumns.jsx](src/pages/Boards/BoardContent/ListColumns/ListColumns.jsx)
- Notifications (real-time invitations): [src/components/AppBar/Notifications/Notifications.jsx](src/components/AppBar/Notifications/Notifications.jsx)
- Card modal (description, comments, members): [src/components/Modal/ActiveCard/ActiveCard.jsx](src/components/Modal/ActiveCard/ActiveCard.jsx)
- Theme: [src/theme.js](src/theme.js)

## Environment

API base URL is derived from BUILD_MODE in [src/utils/constants.js](src/utils/constants.js):
- BUILD_MODE=dev → http://localhost:8017
- BUILD_MODE=production → https://trelloapi-512x.onrender.com

Create a .env file at the project root:
```bash
BUILD_MODE=dev
```

Ensure the backend API is running and reachable at the configured URL.

## Getting started

- Install dependencies:
```bash
npm install
```

- Start the dev server:
```bash
npm run dev
```

- Build for production:
```bash
npm run build
```

- Preview production build:
```bash
npm run preview
```

- Lint (if available) or run ESLint directly:
```bash
npm run lint
# or
npx eslint .
```

Open http://localhost:5173 (default Vite port).

## Notes

- Interceptor-based “anti-spam click” UI is enabled for elements with class interceptor-loading (see [src/utils/formatters.js](src/utils/formatters.js)).
- Drag & drop sensors respect data-no-dnd to block DnD on interactive elements (see [src/customLibs/DndKitSensors.js](src/customLibs/DndKitSensors.js)).

## License

MIT (or update accordingly)
