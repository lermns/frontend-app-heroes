import { createHashRouter, Navigate } from "react-router";

import HomePage from "@/heroes/pages/home/HomePage";
import { HeroPage } from "@/heroes/pages/heroes/HeroPage";
import { AdminPages } from "@/admin/pages/AdminPages";
import { HeroesLayout } from "@/heroes/layouts/HeroesLayout";
import { AdminLayout } from "@/admin/layouts/AdminLayout";
import { lazy } from "react";
//import { SearchPage } from "@/heroes/pages/search/SearchPage";

// para importarlo de manera directa definimos el export default en el SearchPage.tsx
const SearchPage = lazy(() => import("@/heroes/pages/search/SearchPage"));

export const appRouter = createHashRouter([
  {
    path: "/",
    element: <HeroesLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/heroes/:idSlug",
        element: <HeroPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPages />,
      },
    ],
  },
]);
