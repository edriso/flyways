import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axios';
import { useAppContext } from './useAppContext';
import { parseDuration, formatTime } from '../utils/helpers';

/**
 * Transform Amadeus API response to a cleaner format for our UI
 */
const transformFlightData = (data, dictionaries) => {
  if (!data || !Array.isArray(data)) return [];

  return data.map((offer) => {
    const firstItinerary = offer.itineraries[0];
    const segments = firstItinerary.segments;
    const firstSegment = segments[0];

    // Get carrier name from dictionaries
    const carrierCode = firstSegment.carrierCode;
    const airlineName = dictionaries?.carriers?.[carrierCode] || carrierCode;

    return {
      id: offer.id,
      price: parseFloat(offer.price.total),
      currency: offer.price.currency,
      airline: airlineName,
      carrierCode,
      stops: segments.length - 1,
      totalDuration: parseDuration(firstItinerary.duration),
      outbound: segments.map((seg) => ({
        flightNumber: `${seg.carrierCode}${seg.number}`,
        departure: {
          airport: seg.departure.iataCode,
          time: formatTime(seg.departure.at),
          date: seg.departure.at?.split('T')[0],
        },
        arrival: {
          airport: seg.arrival.iataCode,
          time: formatTime(seg.arrival.at),
          date: seg.arrival.at?.split('T')[0],
        },
        duration: parseDuration(seg.duration),
        aircraft: dictionaries?.aircraft?.[seg.aircraft?.code] || seg.aircraft?.code,
      })),
      // Return itinerary if round trip
      inbound: offer.itineraries[1]
        ? offer.itineraries[1].segments.map((seg) => ({
            flightNumber: `${seg.carrierCode}${seg.number}`,
            departure: {
              airport: seg.departure.iataCode,
              time: formatTime(seg.departure.at),
              date: seg.departure.at?.split('T')[0],
            },
            arrival: {
              airport: seg.arrival.iataCode,
              time: formatTime(seg.arrival.at),
              date: seg.arrival.at?.split('T')[0],
            },
            duration: parseDuration(seg.duration),
          }))
        : null,
      // Raw data for debugging
      _raw: offer,
    };
  });
};

/**
 * Hook to search for flights using Amadeus API
 */
export const useSearchFlights = () => {
  const { getSearchParams, isSearchValid, hasSearched } = useAppContext();

  const searchParams = getSearchParams();

  const {
    data,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['flights', searchParams],
    queryFn: async () => {
      // Clean up params - remove undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(([, v]) => v !== undefined)
      );

      const response = await axiosInstance.get('/v2/shopping/flight-offers', {
        params: cleanParams,
      });

      return {
        flights: transformFlightData(response.data.data, response.data.dictionaries),
        dictionaries: response.data.dictionaries,
        meta: response.data.meta,
      };
    },
    enabled: Boolean(isSearchValid && hasSearched), // Only run when search is valid and user has searched
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Only retry once on failure
  });

  return {
    flights: data?.flights || [],
    dictionaries: data?.dictionaries || {},
    isLoading: isLoading && hasSearched,
    isFetching,
    error,
    isError,
    refetch,
  };
};

/**
 * Hook to get airport suggestions (for autocomplete)
 * Uses Amadeus Airport & City Search API
 */
export const useAirportSearch = (keyword) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['airports', keyword],
    queryFn: async () => {
      if (!keyword || keyword.length < 2) return [];

      const response = await axiosInstance.get('/v1/reference-data/locations', {
        params: {
          keyword,
          subType: 'AIRPORT,CITY',
          'page[limit]': 10,
        },
      });

      return response.data.data.map((location) => ({
        code: location.iataCode,
        name: location.name,
        city: location.address?.cityName || location.name,
        country: location.address?.countryName,
        type: location.subType,
      }));
    },
    enabled: Boolean(keyword && keyword.length >= 2),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  return {
    airports: data || [],
    isLoading,
    error,
  };
};

