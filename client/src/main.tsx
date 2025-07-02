import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Handle unhandled promise rejections to prevent DOMException errors
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  // Prevent the default browser behavior of logging to console
  event.preventDefault();
});

// Handle general errors
window.addEventListener('error', (event) => {
  console.warn('JavaScript error:', event.error);
});

createRoot(document.getElementById("root")!).render(<App />);
