import { Link } from '@tanstack/react-router';
import { Logo } from '.';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { nextTheme, currentTheme } = useTheme();

  return (
    <header className='border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40'>
      <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2'>
          <Logo />
          <span className='font-display text-xl font-semibold'>Flyways</span>
        </Link>

        <Button
          variant='ghost'
          size='sm'
          onClick={nextTheme}
          className='text-lg'
          title={`Theme: ${currentTheme.name}`}
        >
          {currentTheme.icon}
        </Button>
      </div>
    </header>
  );
};

export default Header;
