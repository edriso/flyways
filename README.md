# Flyways - Flight Search Engine

A modern flight search app built with React and the Amadeus API.

## Live Demo

🔗 [View Live Demo](https://flyways-spotter.netlify.app)

## Features

- **Flight Search** - Search flights by origin, destination, and dates
- **Round Trip / One Way** - Support for both trip types
- **Multi-passenger** - Select number of passengers
- **Currency Selection** - View prices in different currencies
- **Advanced Filtering** - Filter by stops, price range, and airlines
- **Sorting** - Sort results by price, duration, or departure time
- **Live Price Graph** - Visual price distribution that updates with filters
- **Responsive Design** - Works great on mobile and desktop
- **Theme Switcher** - 6 color themes (Light, Dark, Ocean, Rose, Lavender, Mint)

## Tech Stack

| Technology | What it does |
|------------|--------------|
| **React 19** | UI framework - latest version with improved performance |
| **Vite** | Build tool - super fast dev server and builds |
| **TanStack Query** | Data fetching - handles caching, loading states, and refetching |
| **TanStack Router** | Routing - type-safe client-side navigation |
| **Tailwind CSS 4** | Styling - utility-first CSS framework |
| **shadcn/ui** | UI components - accessible components built on Radix UI |
| **Recharts** | Charts - for the price distribution graph |
| **Axios** | HTTP client - API requests with interceptors for auth |
| **date-fns** | Date utilities - formatting and manipulation |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Amadeus API credentials ([Get them here](https://developers.amadeus.com/))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/edriso/flyways.git
cd flyways
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Then open `.env` and add your Amadeus API credentials:

```env
VITE_AMADEUS_CLIENT_ID=your_api_key_here
VITE_AMADEUS_CLIENT_SECRET=your_api_secret_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── SearchForm.jsx  # Flight search form
│   ├── FlightCard.jsx  # Individual flight display
│   └── FlightResults.jsx # Results list with filters
├── context/            # React Context for app state
├── hooks/              # Custom React hooks
│   ├── useAppContext.js # Context consumer hook
│   └── useFlights.js   # Flight data fetching
├── pages/              # Page components
├── utils/              # Utility functions
│   ├── axios.js        # Axios instance with OAuth
│   └── helpers.js      # Common helper functions
└── main.jsx            # App entry point
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## API Integration

Uses the [Amadeus Flight Offers Search API](https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search) for real flight data. OAuth2 authentication is handled automatically by axios interceptors.

**Note**: The test environment has rate limits. If you see 429 errors, wait a moment before retrying.

---

## Design Decisions

### Why These Tools?

**TanStack Query** - Handles caching, loading states, and retries out of the box. Same search won't hit the API twice.

**Context API** - Simple and lightweight for this app size. No need for Redux complexity here.

**Tailwind + shadcn/ui** - Fast to build, accessible components, no CSS headaches.

### Performance

- **useMemo** for price graph and filter options - only recalculates when data actually changes
- **useCallback** for filter handlers - stable references prevent unnecessary re-renders
- **Smart token handling** - concurrent API calls share one token request instead of firing multiple

---

## License

MIT
