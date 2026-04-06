import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./style.scss"
import { Auth0Provider } from '@auth0/auth0-react';
import { router } from './app.routes.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      useRefreshTokens={true}
      onRedirectCallback={(appState) => {
        router.navigate(appState?.returnTo || '/dashboard');
      }}
      cacheLocation="localstorage"
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
      }}
    >
      <App />
    </Auth0Provider>

  </StrictMode>,
)
