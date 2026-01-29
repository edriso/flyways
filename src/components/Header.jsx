import { Link } from '@tanstack/react-router';
import { Logo } from '.';

const Header = () => {
  return (
    <header className='border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40'>
      <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2'>
          <Logo />
          <span className='font-display text-xl font-semibold'>Flyways</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
