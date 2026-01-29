import { useState } from 'react';
import { AppContext } from './AppContext';

export const AppProvider = ({ children }) => {
  // Search form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState('roundtrip'); // 'roundtrip' | 'oneway'
  const [currency, setCurrency] = useState('USD');

  // Search results state
  const [hasSearched, setHasSearched] = useState(false);

  // Swap origin and destination
  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // Reset search form
  const resetSearch = () => {
    setOrigin('');
    setDestination('');
    setDepartureDate(null);
    setReturnDate(null);
    setPassengers(1);
    setTripType('roundtrip');
    setCurrency('USD');
    setHasSearched(false);
  };

  // Date validation helpers
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPastDepartureDate = departureDate && departureDate < today;
  const isInvalidReturnDate = tripType === 'roundtrip' && returnDate && departureDate && returnDate < departureDate;

  // Check if search is valid (ensure boolean)
  const isSearchValid = Boolean(
    origin && 
    destination && 
    departureDate && 
    origin !== destination &&
    !isPastDepartureDate &&
    !isInvalidReturnDate
  );

  // Get validation error message (if any)
  const getValidationError = () => {
    if (!origin) return 'Please select an origin airport';
    if (!destination) return 'Please select a destination airport';
    if (origin === destination) return 'Origin and destination cannot be the same';
    if (!departureDate) return 'Please select a departure date';
    if (isPastDepartureDate) return 'Please select a valid future date for your trip';
    if (isInvalidReturnDate) return 'Return date must be after departure date';
    return null;
  };

  // Get search params for API call
  const getSearchParams = () => ({
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate: departureDate?.toISOString().split('T')[0],
    returnDate: tripType === 'roundtrip' && returnDate 
      ? returnDate.toISOString().split('T')[0] 
      : undefined,
    adults: passengers,
    currencyCode: currency,
    max: 50, // Get more results for filtering
  });

  return (
    <AppContext.Provider
      value={{
        // Search form state
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
        // Helpers
        swapLocations,
        resetSearch,
        isSearchValid,
        getValidationError,
        getSearchParams,
        // Search state
        hasSearched,
        setHasSearched,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
