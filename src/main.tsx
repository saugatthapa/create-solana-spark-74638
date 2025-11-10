import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Validate required environment variables
const requiredEnvVars = {
  VITE_PLATFORM_WALLET_ADDRESS_MAINNET: import.meta.env.VITE_PLATFORM_WALLET_ADDRESS_MAINNET,
  VITE_PLATFORM_WALLET_ADDRESS_DEVNET: import.meta.env.VITE_PLATFORM_WALLET_ADDRESS_DEVNET,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  document.getElementById("root")!.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui; padding: 20px;">
      <div style="max-width: 600px; text-align: center;">
        <h1 style="color: #ef4444; margin-bottom: 16px;">Configuration Error</h1>
        <p style="margin-bottom: 16px;">Missing required environment variables:</p>
        <code style="background: #1f2937; color: #f3f4f6; padding: 12px; border-radius: 8px; display: block; margin-bottom: 16px;">
          ${missingVars.join('<br>')}
        </code>
        <p style="color: #6b7280;">Please configure these variables in your deployment settings.</p>
      </div>
    </div>
  `;
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
