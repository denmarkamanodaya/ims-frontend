import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import "./index.css";

import "bootstrap/dist/css/bootstrap.min.css";
import Subscriber from "./components/Subscriber.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/info",
    element: <Subscriber />,
  },
  {
    path: "/add",
    element: <Subscriber />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
