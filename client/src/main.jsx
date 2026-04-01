import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BroweserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import { store } from './app/store';

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BroweserRouter>
      <App />
    </BroweserRouter>
  </Provider>,
);
