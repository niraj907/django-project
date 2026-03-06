import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "sonner";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    {/* Replace with your actual Google Client ID */}
    <GoogleOAuthProvider clientId="1051458506382-96oro7ppprp41veqdk23350lq58qk3am.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </QueryClientProvider>,
)