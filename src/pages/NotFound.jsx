import { Link } from '@tanstack/react-router';

const NotFound = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 min-h-[60vh]'>
      <h1 className='text-4xl md:text-5xl font-bold'>404</h1>
      <p className='text-lg text-muted-foreground text-center'>
        The page you are looking for does not exist.
      </p>
      <Link
        to='/'
        className='bg-primary px-6 py-2 hover:opacity-90 transition-opacity'
      >
        Go back to the home page
      </Link>
    </section>
  );
};

export default NotFound;
