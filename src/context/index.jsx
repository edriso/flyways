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

  // Check if search is valid (ensure boolean)
  const isSearchValid = Boolean(origin && destination && departureDate);

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
