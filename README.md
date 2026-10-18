# EventHub - Event Management System

A React single-page app for exploring events, registering for them, and managing your registrations. Event data comes from the [Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/).

Built for Web Programming, Assignment 2.

## Features

- **Authentication (frontend simulation):** register, login and logout. Users are stored in the browser's Local Storage and the session survives a page refresh. Forms have validation.
- **Event exploration:** search by keyword, filter by category, city and date range, an Upcoming (next 30 days) tab, and pagination.
- **Event details:** name, date and time, venue, location, category and genre, image, price range, status, info notes, seat map and a link to buy tickets.
- **Event registration:** logged-in users can register, duplicate registration is blocked, a toast confirms every action, and registrations can be cancelled. Each registration belongs to the user who made it.
- **My Events:** your registrations split into Upcoming and Completed. Cancelling is only offered for upcoming events. A snapshot of each event is saved, so completed events still display after they leave the API.
- **Protected routes:** `/my-events` requires login. Login and Register redirect logged-in users away. After logging in you return to the page you originally wanted.
- **Loading, error and empty states** on every page that calls the API, with a retry button.
- **Responsive design** for phone, tablet and desktop.

## Tech stack

- React 19 and Vite
- Redux Toolkit (`configureStore`, `createSlice`, `createAsyncThunk`) with `react-redux`
- React Router
- Ticketmaster Discovery API

## Getting started

### Prerequisites

- Node.js 18 or newer
- A free Ticketmaster API key. Register at https://developer.ticketmaster.com/ and copy the **Consumer Key** from your app.

### Setup

```bash
git clone https://github.com/Wania-Ahsan65/event-management-system.git
cd event-management-system
npm install
```

Create a `.env` file in the project root (copy `.env.example`):

```
VITE_TM_API_KEY=your_consumer_key_here
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal (usually http://localhost:5173). If you change `.env`, restart the server.

### Other scripts

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── app/            store.js - Redux store and localStorage persistence
├── components/     Reusable UI: Navbar, EventCard, SearchBar, CategoryBar,
│                   Pagination, Loader, ErrorMessage, Toast,
│                   ProtectedRoute, GuestRoute, RegisteredEventCard
├── features/
│   ├── auth/           authSlice - users, session, register/login thunks
│   ├── events/         eventsSlice - event list, categories, single event
│   ├── registrations/  registrationsSlice - register and cancel
│   └── ui/             uiSlice - toast notifications
├── hooks/          useDebounce
├── pages/          Events, EventDetails, MyEvents, Login, Register, NotFound
├── services/       ticketmaster.js - all API calls
└── utils/          date and time helpers
```

## Redux state

| Slice | Holds | Persisted in Local Storage |
|---|---|---|
| `auth` | current user, status, error | yes (`em_session`; registered users in `em_users`) |
| `events` | event list, pagination, categories, selected event, status and errors | no |
| `registrations` | registrations keyed by `userId`, each with an event snapshot | yes (`em_registrations`) |
| `ui` | current toast message | no |

## Routes

| Path | Page | Access |
|---|---|---|
| `/` | Events | public |
| `/events/:id` | Event details | public (registering requires login) |
| `/my-events` | My Events | logged-in users only |
| `/login`, `/register` | Auth forms | guests only |
| `*` | Not found | public |

## Notes and limitations

- **Authentication is a simulation.** There is no backend, so accounts and passwords live in the browser's Local Storage in plain text. Do not use a real password.
- Ticketmaster allows about 2 requests per second and 5,000 per day. Search is debounced and the app shows a clear message if the limit is hit.
- The API returns at most about 1,000 results per search, so pagination stops there.
- The API key is read from an environment variable and is never committed. `.env` is listed in `.gitignore`. Note that any key used by a frontend-only app is visible in the browser's network requests.
