import { createBrowserRouter } from 'react-router';

import RootLayout from '../Layouts/RootLayout';
import Home from '../Pages/Home/Home';
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
]);
