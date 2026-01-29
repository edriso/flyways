import Logo from './Logo';

const Loader = ({ message = 'Searching for flights...', subMessage = 'Finding the best deals for you' }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="animate-[pulse_1.5s_ease-in-out_infinite]">
          <Logo 
            containerClassName="size-16" 
            iconClassName="size-10" 
            bgClassName="bg-transparent"
            iconColorClassName="text-primary"
          />
        </div>
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

