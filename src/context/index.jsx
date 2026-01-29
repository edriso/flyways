import { useState } from "react";
import { AppContext } from "./AppContext";

export const AppProvider = ({ children }) => {
    const [flightFrom, setFlightFrom] = useState('');
    const [flightTo, setFlightTo] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    
  return <AppContext.Provider value={{
    flightFrom,
    setFlightFrom,
    flightTo,
    setFlightTo,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    passengers,
    setPassengers,
  }}>{children}</AppContext.Provider>;
};

