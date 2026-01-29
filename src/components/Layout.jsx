import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-y-10 md:gap-y-14'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
