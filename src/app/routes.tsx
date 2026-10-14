import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Sports } from "./components/Sports";
import { Registration } from "./components/Registration";
import { About } from "./components/About";
import { NotFound } from "./components/NotFound";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "modalidades", Component: Sports },
      { path: "inscricao", Component: Registration },
      { path: "sobre", Component: About },
      { path: "*", Component: NotFound },
    ],
  },
  { path: "/admin", Component: AdminLogin },
  { path: "/admin/dashboard", Component: AdminDashboard },
]);
