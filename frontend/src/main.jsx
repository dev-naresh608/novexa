import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import store from "./app/store.js";
import { setupApiInterceptors } from "./configs/api.js";
import { rotateToken } from "./modules/auth/store/authThunk.js";

setupApiInterceptors(store, rotateToken);

// Auto-recover if dynamic chunks fail to load across redeployments
window.addEventListener("vite:preloadError", (event) => {
  console.warn("Vite chunk failed to load, reloading to fetch latest build...", event);
  const hasReloaded = sessionStorage.getItem("novexa_chunk_reload");
  if (!hasReloaded) {
    sessionStorage.setItem("novexa_chunk_reload", "true");
    window.location.reload();
  }
});

import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
