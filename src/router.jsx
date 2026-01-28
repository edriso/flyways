import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const rootRoute = createRootRoute({
  notFoundComponent: NotFound,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});
