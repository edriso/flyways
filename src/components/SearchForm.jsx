import { useState, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, Users, ArrowRightLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useAppContext } from '@/hooks/useAppContext';
import { airports } from '@/utils/airports';
import { currencies } from '@/utils/currencies';

const SearchForm = ({ onSearch, isSearching = false }) => {
  // Get state from context
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    passengers,
    setPassengers,
    tripType,
    setTripType,
    currency,
    setCurrency,
    swapLocations,
    isSearchValid,
    setHasSearched,
  } = useAppContext();

  // Check if origin and destination are the same
  const isSameLocation = origin && destination && origin === destination;

  // Check if departure date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPastDepartureDate = departureDate && departureDate < today;

  // Check if return date is before departure date
  const isInvalidReturnDate = tripType === 'roundtrip' && returnDate && departureDate && returnDate < departureDate;

  // Popover open states (local UI state)
  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);

  // Handle search
  const handleSearch = () => {
    if (!isSearchValid) return;
    
    // If round trip but no return date, switch to one way
    if (tripType === 'roundtrip' && !returnDate) {
      setTripType('oneway');
    }
    
    setHasSearched(true);
    onSearch?.();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border/50">
        {/* Trip Type Toggle & Passengers */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setTripType('roundtrip')}
              className={cn(
                'text-sm font-medium transition-colors',
                tripType === 'roundtrip'
                  ? 'text-foreground border-b-2 border-primary pb-1'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Round trip
            </button>
            <button
              onClick={() => setTripType('oneway')}
              className={cn(
                'text-sm font-medium transition-colors',
                tripType === 'oneway'
                  ? 'text-foreground border-b-2 border-primary pb-1'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              One way
            </button>
          </div>
          <PassengerSelect passengers={passengers} onChange={setPassengers} />
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 md:gap-4">
          {/* Origin Airport */}
          <div className={cn(tripType === 'roundtrip' ? 'md:col-span-3' : 'md:col-span-4')}>
            <AirportSelect
              label="From"
              placeholder="Select origin"
              value={origin}
              onChange={setOrigin}
              open={originOpen}
              onOpenChange={setOriginOpen}
              airports={airports}
            />
          </div>

          {/* Swap Button */}
          <div className="hidden md:flex items-center justify-center">
            <button
              onClick={swapLocations}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Swap locations"
            >
              <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Destination Airport */}
          <div className={cn(tripType === 'roundtrip' ? 'md:col-span-3' : 'md:col-span-4')}>
            <AirportSelect
              label="To"
              placeholder="Select destination"
              value={destination}
              onChange={setDestination}
              open={destinationOpen}
              onOpenChange={setDestinationOpen}
              airports={airports}
              hasError={isSameLocation}
            />
          </div>

          {/* Departure Date */}
          <div className="md:col-span-2">
            <DatePicker
              label="Depart"
              date={departureDate}
              onSelect={setDepartureDate}
              disabledBefore={new Date()}
              hasError={isPastDepartureDate}
              errorMessage="Select a future date"
            />
          </div>

          {/* Return Date (only for round trip) */}
          {tripType === 'roundtrip' && (
            <div className="md:col-span-2">
              <DatePicker
                label="Return"
                date={returnDate}
                onSelect={setReturnDate}
                disabledBefore={departureDate || new Date()}
                hasError={isInvalidReturnDate}
                errorMessage="Must be after departure"
              />
            </div>
          )}
        </div>

        {/* Currency & Search Button */}
        <div className="mt-6 flex justify-between items-center">
          <CurrencySelect currency={currency} onChange={setCurrency} />
          <Button
            onClick={handleSearch}
            size="lg"
            className="px-8"
            disabled={!isSearchValid || isSearching}
          >
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? 'Searching...' : 'Search flights'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Sub-components for better organization
// ============================================

// Airport Selection Component
function AirportSelect({ label, placeholder, value, onChange, open, onOpenChange, airports, hasError }) {
  const selectedAirport = airports.find((a) => a.code === value);
  const listRef = useRef(null);

  // Scroll to top when search input changes
  const handleSearchChange = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'w-full flex items-center gap-3 p-4 rounded-xl bg-background border transition-colors text-left',
              hasError
                ? 'border-destructive hover:border-destructive'
                : 'border-border hover:border-primary/50'
            )}
          >
            <MapPin className={cn('w-5 h-5 shrink-0', hasError ? 'text-destructive' : 'text-muted-foreground')} />
            <div className="min-w-0">
              <p className={cn('text-xs', hasError ? 'text-destructive' : 'text-muted-foreground')}>{label}</p>
              <p className={cn('font-medium truncate', !value && 'text-muted-foreground')}>
                {selectedAirport ? `${selectedAirport.city} (${selectedAirport.code})` : placeholder}
              </p>
            </div>
          </button>
        </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search city or airport..." onValueChange={handleSearchChange} />
          <CommandList ref={listRef} className="max-h-[300px]">
            <CommandEmpty>No airport found.</CommandEmpty>
            <CommandGroup>
              {airports.map((airport) => (
                <CommandItem
                  key={airport.code}
                  value={`${airport.city} ${airport.code} ${airport.name} ${airport.country}`}
                  onSelect={() => {
                    onChange(airport.code);
                    onOpenChange(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {airport.city} ({airport.code})
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {airport.name}, {airport.country}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    {hasError && (
      <p className="absolute -bottom-5 left-0 text-xs text-destructive">
        Must be different from origin
      </p>
    )}
  </div>
  );
}

// Date Picker Component
function DatePicker({ label, date, onSelect, disabledBefore, hasError, errorMessage }) {
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'w-full flex items-center gap-3 p-4 rounded-xl bg-background border transition-colors text-left',
              hasError
                ? 'border-destructive hover:border-destructive'
                : 'border-border hover:border-primary/50'
            )}
          >
            <CalendarIcon className={cn('w-5 h-5 shrink-0', hasError ? 'text-destructive' : 'text-muted-foreground')} />
            <div className="min-w-0">
              <p className={cn('text-xs', hasError ? 'text-destructive' : 'text-muted-foreground')}>{label}</p>
              <p className={cn('font-medium truncate', !date && 'text-muted-foreground')}>
                {date ? format(date, 'MMM d') : 'Add date'}
              </p>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            disabled={(d) => d < disabledBefore}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {hasError && errorMessage && (
        <p className="absolute -bottom-5 left-0 text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// Passenger Selection Component
function PassengerSelect({ passengers, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-muted-foreground" />
      <span className="hidden md:inline text-sm text-muted-foreground">Travelers</span>
      <div className="flex items-center gap-1 ml-1">
        <button
          onClick={() => onChange(Math.max(1, passengers - 1))}
          className="w-7 h-7 rounded-md border border-border hover:bg-accent flex items-center justify-center text-sm transition-colors cursor-pointer"
          aria-label="Decrease passengers"
        >
          −
        </button>
        <span className="w-6 text-center font-medium text-sm">{passengers}</span>
        <button
          onClick={() => onChange(Math.min(9, passengers + 1))}
          className="w-7 h-7 rounded-md border border-border hover:bg-accent flex items-center justify-center text-sm transition-colors cursor-pointer"
          aria-label="Increase passengers"
        >
          +
        </button>
      </div>
    </div>
  );
}

// Currency Selection Component
function CurrencySelect({ currency, onChange }) {
  const selectedCurrency = currencies.find((c) => c.code === currency);

  return (
    <Select value={currency} onValueChange={onChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          {selectedCurrency && (
            <span className="flex items-center gap-2">
              <span className="text-muted-foreground">{selectedCurrency.symbol}</span>
              <span>{selectedCurrency.code}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((curr) => (
          <SelectItem key={curr.code} value={curr.code}>
            <span className="flex items-center gap-2">
              <span className="text-muted-foreground w-6">{curr.symbol}</span>
              <span>{curr.code}</span>
              <span className="text-muted-foreground text-xs ml-1">{curr.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SearchForm;
