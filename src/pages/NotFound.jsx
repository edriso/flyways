import { Link } from '@tanstack/react-router';

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 h-screen'>
      <h1 className='text-4xl font-bold'>404</h1>
      <p className='text-lg'>The page you are looking for does not exist.</p>
      <Link to='/' className='bg-primary text-white px-4 py-2'>
        Go back to the home page
      </Link>
    </div>
  );
};

export default NotFound;
