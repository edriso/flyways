import { Plane } from 'lucide-react';

const Loader = ({ message = 'Searching for flights...', subMessage = 'Finding the best deals for you' }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center gap-4">
        <Plane 
          className="w-16 h-16 text-primary animate-[pulse_1.5s_ease-in-out_infinite]" 
          style={{ animationTimingFunction: 'ease-in-out' }}
        />
        <div className="text-center">
          <p className="font-medium">{message}</p>
          {subMessage && (
            <p className="text-sm text-muted-foreground mt-1">{subMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loader;

