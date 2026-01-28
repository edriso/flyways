const Footer = () => {
  return (
    <footer className='border-t border-border/50 bg-card/50 backdrop-blur-sm'>
      <div className='max-w-7xl mx-auto px-4 py-4 text-center text-sm text-muted-foreground'>
        <p>&copy; {new Date().getFullYear()} Flyways. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
