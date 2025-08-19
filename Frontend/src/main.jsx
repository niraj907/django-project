import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "sonner";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
       <ReactQueryDevtools initialIsOpen={false} />
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  </QueryClientProvider>,
)