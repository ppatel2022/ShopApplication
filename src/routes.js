import React from 'react';
import { asyncComponent } from '@jaredpalmer/after';

export default [
  {
    path: '/',
    exact: true,
    component: asyncComponent({
      loader: () => import('./Home'),
      Placeholder: () => <div>...LOADING...</div>,
    })
  },
  {
        path: '/item/:item_id(\\d+)',
        exact: true,
        component: asyncComponent({
          loader: () => import('./Item'),
          Placeholder: () => <div>...LOADING...</div>,
        }),
    },
    {
      path: '/notFound',
      exact: true,
      component: asyncComponent({
        loader: () => import('./NotFound'),
        Placeholder: () => <div>...LOADING...</div>,
      }),
  }
];
