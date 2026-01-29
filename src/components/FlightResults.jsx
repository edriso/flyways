import { useState, useMemo, useCallback } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  Plane,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import FlightCard from './FlightCard';
import { useAppContext } from '@/hooks/useAppContext';
import { getCurrencyByCode } from '@/utils/currencies';

// Filter Panel Component (extracted outside to prevent re-creation)
const FilterPanel = ({
  filters,
  minPrice,
  maxPrice,
  currencySymbol,
  stopsOptions,
  airlineOptions,
  hasActiveFilters,
  onPriceRangeChange,
  onToggleStop,
  onToggleAirline,
  onClearAll,
  className,
}) => (
  <div className={cn('space-y-6', className)}>
    {/* Price Range Filter */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">Price Range</h4>
        <span className="text-xs text-muted-foreground">
          {currencySymbol}{filters.priceRange[0]} - {currencySymbol}{filters.priceRange[1]}
        </span>
      </div>
      <Slider
        value={filters.priceRange}
        onValueChange={onPriceRangeChange}
        min={minPrice}
        max={maxPrice}
        step={10}
        className="mt-2"
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">{currencySymbol}{minPrice}</span>
        <span className="text-xs text-muted-foreground">{currencySymbol}{maxPrice}</span>
      </div>
    </div>

    {/* Stops Filter */}
    {stopsOptions.length > 0 && (
      <div>
        <h4 className="text-sm font-medium mb-3">Stops</h4>
        <div className="space-y-3">
          {stopsOptions.map(({ value, label, count }) => (
            <label
              key={value}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={filters.stops.includes(value)}
                  onCheckedChange={() => onToggleStop(value)}
                />
                <span className="text-sm group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </div>
              <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                {count}
              </span>
            </label>
          ))}
        </div>
      </div>
    )}

    {/* Airlines Filter */}
    {airlineOptions.length > 1 && (
      <div>
        <h4 className="text-sm font-medium mb-3">Airlines</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
          {airlineOptions.map(({ name, count }) => (
            <label
              key={name}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Checkbox
                  checked={filters.airlines.includes(name)}
                  onCheckedChange={() => onToggleAirline(name)}
                />
                <span className="text-sm truncate group-hover:text-foreground transition-colors">
                  {name}
                </span>
              </div>
              <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full shrink-0 ml-2">
                {count}
              </span>
            </label>
          ))}
        </div>
      </div>
    )}

    {/* Clear Filters */}
    {hasActiveFilters && (
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="w-full text-primary hover:text-primary"
      >
        Clear all filters
      </Button>
    )}
  </div>
);

const FlightResults = ({ flights, isLoading, isError, error }) => {
  const { origin, destination, currency } = useAppContext();
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get price bounds from flights
  const { minPrice, maxPrice } = useMemo(() => {
    if (flights.length === 0) return { minPrice: 0, maxPrice: 1000 };
    const prices = flights.map((f) => f.price);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [flights]);

  // Initialize filters
  const [filters, setFilters] = useState({
    stops: [],
    priceRange: [0, 10000],
    airlines: [],
  });

  // Compute effective price range (use flight bounds if filter is at defaults)
  const effectivePriceRange = useMemo(() => {
    const isDefault = filters.priceRange[0] === 0 && filters.priceRange[1] === 10000;
    return isDefault ? [minPrice, maxPrice] : filters.priceRange;
  }, [filters.priceRange, minPrice, maxPrice]);

  // Get unique airlines from flights with count
  const airlineOptions = useMemo(() => {
    const airlineCounts = flights.reduce((acc, f) => {
      acc[f.airline] = (acc[f.airline] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(airlineCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [flights]);

  // Get stops options with count
  const stopsOptions = useMemo(() => {
    const stopsCounts = flights.reduce((acc, f) => {
      const category = f.stops >= 2 ? 2 : f.stops;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    return [
      { value: 0, label: 'Nonstop', count: stopsCounts[0] || 0 },
      { value: 1, label: '1 stop', count: stopsCounts[1] || 0 },
      { value: 2, label: '2+ stops', count: stopsCounts[2] || 0 },
    ].filter((opt) => opt.count > 0);
  }, [flights]);

  // Filter flights
  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      if (filters.stops.length > 0) {
        const stopCategory = flight.stops >= 2 ? 2 : flight.stops;
        if (!filters.stops.includes(stopCategory)) return false;
      }
      if (flight.price < effectivePriceRange[0] || flight.price > effectivePriceRange[1]) {
        return false;
      }
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
        return false;
      }
      return true;
    });
  }, [flights, filters.stops, filters.airlines, effectivePriceRange]);

  // Generate price distribution data for the graph
  const priceGraphData = useMemo(() => {
    if (filteredFlights.length === 0) return [];

    const bucketCount = 20;
    const range = maxPrice - minPrice || 1;
    const bucketSize = range / bucketCount;

    const buckets = Array.from({ length: bucketCount }, (_, i) => ({
      price: Math.round(minPrice + (i + 0.5) * bucketSize),
      count: 0,
      label: `$${Math.round(minPrice + i * bucketSize)}`,
    }));

    filteredFlights.forEach((flight) => {
      const bucketIndex = Math.min(
        Math.floor((flight.price - minPrice) / bucketSize),
        bucketCount - 1
      );
      if (bucketIndex >= 0) {
        buckets[bucketIndex].count++;
      }
    });

    return buckets;
  }, [filteredFlights, minPrice, maxPrice]);

  // Helper to parse duration string to minutes
  const getDurationMinutes = (d) => {
    const match = d?.match(/(\d+)h\s*(\d+)?m?/);
    if (!match) return 0;
    return parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
  };

  // Sort flights
  const sortedFlights = useMemo(() => {
    const flightsToSort = [...filteredFlights];
    
    flightsToSort.sort((a, b) => {
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
    
    return flightsToSort;
  }, [filteredFlights, sortBy, sortOrder]);

  // Handle sort
  const handleSort = useCallback(
    (field) => {
      if (sortBy === field) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
    },
    [sortBy]
  );

  // Toggle filters
  const toggleStopFilter = useCallback((stop) => {
    setFilters((prev) => ({
      ...prev,
      stops: prev.stops.includes(stop)
        ? prev.stops.filter((s) => s !== stop)
        : [...prev.stops, stop],
    }));
  }, []);

  const toggleAirlineFilter = useCallback((airline) => {
    setFilters((prev) => ({
      ...prev,
      airlines: prev.airlines.includes(airline)
        ? prev.airlines.filter((a) => a !== airline)
        : [...prev.airlines, airline],
    }));
  }, []);

  const handlePriceRangeChange = useCallback((value) => {
    setFilters((prev) => ({ ...prev, priceRange: value }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({ stops: [], priceRange: [minPrice, maxPrice], airlines: [] });
  }, [minPrice, maxPrice]);

  const hasActiveFilters =
    filters.stops.length > 0 ||
    filters.airlines.length > 0 ||
    (filters.priceRange[0] !== 0 && filters.priceRange[0] !== minPrice) ||
    (filters.priceRange[1] !== 10000 && filters.priceRange[1] !== maxPrice);

  const currencySymbol = getCurrencyByCode(currency)?.symbol || '$';

  // Filter panel props
  const filterPanelProps = {
    filters: { ...filters, priceRange: effectivePriceRange },
    minPrice,
    maxPrice,
    currencySymbol,
    stopsOptions,
    airlineOptions,
    hasActiveFilters,
    onPriceRangeChange: handlePriceRangeChange,
    onToggleStop: toggleStopFilter,
    onToggleAirline: toggleAirlineFilter,
    onClearAll: clearAllFilters,
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <Plane className="w-12 h-12 text-primary animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-medium">Searching for flights...</p>
            <p className="text-sm text-muted-foreground mt-1">Finding the best deals for you</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    const getErrorMessage = () => {
      const apiError = error?.response?.data?.errors?.[0];
      const errorDetail = apiError?.detail || '';

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
            <p className="text-muted-foreground mt-2">{getErrorMessage()}</p>
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
          {filteredFlights.length !== flights.length && (
            <span className="text-primary"> (filtered from {flights.length})</span>
          )}
        </p>
      </div>

      {/* Price Graph */}
      {priceGraphData.length > 0 && (
        <div className="bg-card rounded-xl p-4 md:p-6 border border-border/50 mb-6">
          <h3 className="text-sm font-medium mb-4">Price Distribution</h3>
          <div className="h-32 md:h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceGraphData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="price"
                  tickFormatter={(v) => `${currencySymbol}${v}`}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
                          <p className="text-sm font-medium">
                            {currencySymbol}{payload[0].payload.price}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payload[0].payload.count} flight
                            {payload[0].payload.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <Button variant="outline" onClick={() => setShowMobileFilters(true)} className="w-full">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-card border-l border-border p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <FilterPanel {...filterPanelProps} />
            </div>
          </div>
        )}

        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block lg:w-72 shrink-0">
          <div className="bg-card rounded-xl p-5 border border-border/50 sticky top-4">
            <h3 className="font-semibold mb-4">Filters</h3>
            <FilterPanel {...filterPanelProps} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Sort Controls */}
          <div className="flex items-center justify-between bg-card rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowUpDown className="w-4 h-4" />
              <span className="hidden sm:inline">Sort by</span>
            </div>
            <div className="flex gap-2">
              {[
                { value: 'price', label: 'Price' },
                { value: 'duration', label: 'Duration' },
                { value: 'departure', label: 'Departure' },
              ].map(({ value, label }) => {
                const isActive = sortBy === value;
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
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.charAt(0)}</span>
                    {isActive && SortIcon && <SortIcon className="w-3 h-3" />}
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
                <Plane className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">No flights match your filters</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your criteria</p>
                <Button variant="link" onClick={clearAllFilters} className="mt-2">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
