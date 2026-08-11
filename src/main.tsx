import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {GameProvider} from './context/GameContext';
import App from './App';
import {initializeAuthSession} from './lib/stores/auth-store';
import './index.css';

// App-start auth: establishes a session via real Telegram initData
// (validated by the Supabase Edge Function) when inside the Telegram
// client, and falls back to the dev/test user only in non-production
// builds. See initializeAuthSession() for details.
initializeAuthSession();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);
