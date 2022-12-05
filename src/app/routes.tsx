import {
  Navigate,
  type Route,
} from '@tanstack/react-location';

import { Board } from '@/pages/Board/Board';
import { Boards } from '@/pages/Boards/Boards';
import { Home } from '@/pages/Home/Home';
import { NonExistedPage } from '@/pages/NonExistedPage/NonExistedPage';
import { Profile } from '@/pages/Profile/Profile';
import { SignIn } from '@/pages/SignIn/SignIn';
import { SignUp } from '@/pages/SignUp/SignUp';

export const routes: (isUserlogged: boolean) => Route[] = isUserlogged =>[
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/boards',
    children: [
      {
        path: '/',
        element: isUserlogged ? <Boards /> : <Navigate to="/" />,
      },
      {
        path: ':boardId',
        element: isUserlogged ? <Board /> : <Navigate to="/" />,
        loader: ({ params }) => ({
          boardId: params.boardId,
        }),
      },
    ],

  },
  {
    path: '/profile',
    element: isUserlogged ? <Profile /> : <Navigate to="/" />,
  },
  {
    path: '/404',
    element: <NonExistedPage />,
  },
  {
    path: '*',
    element: <Navigate to="/404" />,
  },

];
