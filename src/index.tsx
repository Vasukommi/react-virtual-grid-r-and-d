import React from 'react';
import { PrimeReactProvider } from "primereact/api";
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from 'react-query'

import App from './App';
import PrimeTable from './components/prime-react/PrimeTable';
import KATable from './components/ka-table/KATable';
import TanstackTable from './components/tanstack-table/TanstackTable';
import AGGrid from './components/ag-grid/AGGrid';
import './index.css';

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<App />} />
      <Route path='prime-table' element={<PrimeTable />} />
      <Route path='ka-table' element={<KATable />} />
      <Route path='tanstack-table' element={<TanstackTable />} />
      <Route path='ag-table' element={<AGGrid />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <RouterProvider router={router} ></RouterProvider>
      </PrimeReactProvider>
    </QueryClientProvider>
  </React.StrictMode>
);