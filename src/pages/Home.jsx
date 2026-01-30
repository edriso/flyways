import { Hero, SearchForm, FlightResults } from '../components';
import { useSearchFlights } from '../hooks/useFlights';
import { useAppContext } from '../hooks/useAppContext';

const Home = () => {
  const { hasSearched } = useAppContext();
  const { flights, isLoading, isFetching, isError, error } = useSearchFlights();

  return (
    <>
      <Hero />
      <div className="px-4 -mt-8 relative z-10">
        <SearchForm isSearching={isLoading || isFetching} />
      </div>

      {/* Show results only after user has searched */}
      {hasSearched && (
        <div>
          <FlightResults
            flights={flights}
            isLoading={isLoading || isFetching}
            isError={isError}
            error={error}
          />
        </div>
      )}
    </>
  );
};

export default Home;
