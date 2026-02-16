import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { getRouter } from "./router";

hydrateRoot(
  document,
  <StrictMode>
    <RouterProvider router={getRouter()} />
  </StrictMode>,
);
