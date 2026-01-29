import { useState, useMemo, useCallback } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2, AlertCircle, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import FlightCard from './FlightCard';
import { useAppContext } from '@/hooks/useAppContext';

const FlightResults = ({ flights, isLoading, isError, error }) => {
  const { origin, destination, currency } = useAppContext();
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [filters, setFilters] = useState({
    stops: [], // [0, 1, 2] for nonstop, 1 stop, 2+ stops
    priceRange: [0, 10000],
    airlines: [],
  });

  // Get unique airlines from flights
  const availableAirlines = useMemo(
    () => [...new Set(flights.map((f) => f.airline))].sort(),
    [flights]
  );

  // Get max price for slider
  const maxPrice = useMemo(
    () => (flights.length > 0 ? Math.max(...flights.map((f) => f.price)) + 50 : 1000),
    [flights]
  );

  // Filter flights
  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      // Filter by stops
      if (filters.stops.length > 0) {
        const stopCategory = flight.stops >= 2 ? 2 : flight.stops;
        if (!filters.stops.includes(stopCategory)) return false;
      }

      // Filter by price
      if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) {
        return false;
      }

      // Filter by airlines
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
        return false;
      }

      return true;
    });
  }, [flights, filters]);

  // Helper to parse duration string to minutes
  const getDurationMinutes = useCallback((d) => {
    const match = d?.match(/(\d+)h\s*(\d+)?m?/);
    if (!match) return 0;
    return parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
  }, []);

  // Sort flights
  const sortedFlights = useMemo(() => {
    const sorted = [...filteredFlights].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'duration':
          comparison = getDurationMinutes(a.totalDuration) - getDurationMinutes(b.totalDuration);
          break;
        case 'departure':
          comparison = a.outbound[0].departure.time.localeCompare(b.outbound[0].departure.time);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [filteredFlights, sortBy, sortOrder, getDurationMinutes]);

  // Handle sort button click - toggle order if same field, otherwise set new field with asc
  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy]);

  // Toggle stop filter
  const toggleStopFilter = (stop) => {
    setFilters((prev) => ({
      ...prev,
      stops: prev.stops.includes(stop)
        ? prev.stops.filter((s) => s !== stop)
        : [...prev.stops, stop],
    }));
  };

  // Toggle airline filter
  const toggleAirlineFilter = (airline) => {
    setFilters((prev) => ({
      ...prev,
      airlines: prev.airlines.includes(airline)
        ? prev.airlines.filter((a) => a !== airline)
        : [...prev.airlines, airline],
    }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Searching for the best flights...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    // Parse API error for user-friendly message
    const getErrorMessage = () => {
      const apiError = error?.response?.data?.errors?.[0];
      const errorDetail = apiError?.detail || '';
      
      // Map common API errors to user-friendly messages
      if (errorDetail.includes('O/D overlap') || errorDetail.includes('same city')) {
        return 'Origin and destination cannot be the same. Please select different airports.';
      }
      if (errorDetail.includes('past date') || errorDetail.includes('date')) {
        return 'Please select a valid future date for your trip.';
      }
      if (apiError?.code === 477 || errorDetail.includes('location')) {
        return 'Invalid airport code. Please select valid airports from the list.';
      }
      if (error?.response?.status === 429) {
        return 'Too many requests. Please wait a moment and try again.';
      }
      if (error?.response?.status === 500) {
        return 'The flight search service is temporarily unavailable. Please try again later.';
      }
      
      return errorDetail || error?.message || 'Something went wrong. Please try again.';
    };

    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div className="max-w-md">
            <h3 className="font-semibold text-lg">Unable to search flights</h3>
            <p className="text-muted-foreground mt-2">
              {getErrorMessage()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No flights found
  if (flights.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Plane className="w-12 h-12 text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-lg">No flights found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search criteria or dates
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          {origin} → {destination}
        </h2>
        <p className="text-muted-foreground">
          {sortedFlights.length} flight{sortedFlights.length !== 1 ? 's' : ''} found
          {filteredFlights.length !== flights.length && ` (${flights.length} total)`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-card rounded-xl p-5 border border-border/50 sticky top-4">
            <h3 className="font-semibold mb-4">Filters</h3>

            {/* Stops Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Stops</h4>
              <div className="space-y-2">
                {[
                  { value: 0, label: 'Nonstop' },
                  { value: 1, label: '1 stop' },
                  { value: 2, label: '2+ stops' },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.stops.includes(value)}
                      onChange={() => toggleStopFilter(value)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Airlines Filter */}
            {availableAirlines.length > 1 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Airlines</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableAirlines.map((airline) => (
                    <label key={airline} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.airlines.includes(airline)}
                        onChange={() => toggleAirlineFilter(airline)}
                        className="rounded border-border"
                      />
                      <span className="text-sm truncate">{airline}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {(filters.stops.length > 0 || filters.airlines.length > 0) && (
              <button
                onClick={() => setFilters({ stops: [], priceRange: [0, maxPrice], airlines: [] })}
                className="text-sm text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Sort Controls */}
          <div className="flex items-center justify-between bg-card rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort by</span>
            </div>
            <div className="flex gap-2">
              {[
                { value: 'price', label: 'Price' },
                { value: 'duration', label: 'Duration' },
                { value: 'departure', label: 'Departure' },
              ].map(({ value, label }) => {
                const isActive = sortBy === value;
                // Up arrow = ascending (low to high), Down arrow = descending (high to low)
                const SortIcon = isActive ? (sortOrder === 'asc' ? ArrowDown : ArrowUp) : null;
                
                return (
                  <button
                    key={value}
                    onClick={() => handleSort(value)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent hover:bg-accent/80'
                    )}
                  >
                    {label}
                    {isActive && SortIcon && (
                      <SortIcon className="w-3 h-3" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flight Cards */}
          <div className="space-y-4">
            {sortedFlights.length > 0 ? (
              sortedFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} currency={currency} />
              ))
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground">
                  No flights match your filters. Try adjusting your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;

