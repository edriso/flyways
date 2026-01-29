# Flyways - Flight Search Engine

A modern flight search application built with React and the Amadeus API.

## Features

- **Flight Search**: Search for flights by origin, destination, and dates
- **Round Trip / One Way**: Support for both trip types
- **Multi-passenger**: Select number of passengers
- **Currency Selection**: View prices in different currencies
- **Advanced Filtering**: Filter by stops, price range, and airlines
- **Sorting**: Sort results by price, duration, or departure time
- **Price Graph**: Visual price distribution chart
- **Responsive Design**: Mobile-friendly interface with slide-out filters

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TanStack Query** - Data fetching and caching
- **TanStack Router** - Client-side routing
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components (Radix UI primitives)
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **date-fns** - Date utilities

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Amadeus API credentials ([Get them here](https://developers.amadeus.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd flyways
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
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
├── context/            # React Context providers
│   └── index.jsx       # App-wide state management
├── hooks/              # Custom React hooks
│   ├── useAppContext.js # Context consumer hook
│   └── useFlights.js   # Flight data fetching hooks
├── pages/              # Page components
│   └── Home.jsx        # Main search page
├── utils/              # Utility functions
│   ├── airports.js     # Airport data
│   ├── axios.js        # Axios instance with auth
│   ├── currencies.js   # Currency data
│   └── helpers.js      # Common helper functions
└── main.jsx            # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

This app uses the [Amadeus Flight Offers Search API](https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search) to fetch real flight data. The API uses OAuth2 authentication, which is handled automatically by the axios interceptors.

### Rate Limits

The Amadeus test environment has rate limits. If you encounter 429 errors, wait a moment before retrying.

## License

MIT
