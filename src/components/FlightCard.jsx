import { Plane, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const FlightCard = ({ flight, currency = 'USD' }) => {
  const firstSegment = flight.outbound[0];
  const lastSegment = flight.outbound[flight.outbound.length - 1];

  const getStopsLabel = (stops) => {
    if (stops === 0) return 'Nonstop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  // Format price with currency
  const formatPrice = (price, currencyCode) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-card rounded-xl p-5 md:p-6 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Airline Info */}
        <div className="flex items-center gap-3 md:min-w-[140px]">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <Plane className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{flight.airline}</p>
            <p className="text-xs text-muted-foreground">{firstSegment.flightNumber}</p>
          </div>
        </div>

        {/* Flight Times */}
        <div className="flex-1 flex items-center gap-4">
          {/* Departure */}
          <div className="text-center md:text-left">
            <p className="text-xl md:text-2xl font-semibold">{firstSegment.departure.time}</p>
            <p className="text-sm text-muted-foreground">{firstSegment.departure.airport}</p>
          </div>

          {/* Duration & Stops */}
          <div className="flex-1 flex flex-col items-center px-4">
            <p className="text-xs text-muted-foreground mb-1">{flight.totalDuration}</p>
            <div className="w-full flex items-center gap-1">
              <div className="h-px flex-1 bg-border" />
              {flight.stops > 0 && (
                <>
                  {Array.from({ length: flight.stops }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                  ))}
                </>
              )}
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </div>
            <p
              className={cn(
                'text-xs mt-1',
                flight.stops === 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
              )}
            >
              {getStopsLabel(flight.stops)}
            </p>
          </div>

          {/* Arrival */}
          <div className="text-center md:text-right">
            <p className="text-xl md:text-2xl font-semibold">{lastSegment.arrival.time}</p>
            <p className="text-sm text-muted-foreground">{lastSegment.arrival.airport}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between md:justify-end md:min-w-[120px] pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-border md:pl-6">
          <div className="md:text-right">
            <p className="text-2xl font-semibold text-primary">
              {formatPrice(flight.price, currency)}
            </p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
          <button className="md:hidden px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            Select
          </button>
        </div>
      </div>

      {/* Flight Segments for Multi-stop */}
      {flight.stops > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Flight segments</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {flight.outbound.map((segment, index) => (
              <span key={index} className="text-xs bg-accent px-2 py-1 rounded">
                {segment.departure.airport} → {segment.arrival.airport}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightCard;

