import HomePage from "@pages/home/home.tsx";
import "./styles/global.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PacksPage from "./pages/packs/packs";
import Layout from "./pages/layout/layout";
import { useState } from "react";
import { UserContext, UserSetterContext } from "./contexts/user";
import PackPage from "./pages/pack/pack";
import ErrorPage from "./pages/error/error";
import { db } from "./db/db";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "packs",
        element: <PacksPage />,
      },
      {
        path: "/packs/create",
        element: <PackPage />,
      },
      {
        path: "/packs/:packId",
        element: <PackPage />,
        loader: async ({ params }) => {
          return await db.packs.get(params);
        },
      },
    ],
  },
]);

function App() {
  const userName = localStorage.getItem("userName");
  const avatarID = localStorage.getItem("avatarID");
  const [user, setUser] = useState({
    name: userName ? userName : "",
    avatarID: avatarID ? avatarID : "",
  });

  const setUserName = (name: string) => {
    setUser((user) => ({ ...user, name }));
    localStorage.setItem("userName", name);
  };

  const setUserAvatar = (avatarID: string) => {
    setUser((user) => ({ ...user, avatarID }));
  };

  return (
    <div className="container">
      <UserContext.Provider value={user}>
        <UserSetterContext.Provider value={{ setUserName, setUserAvatar }}>
          <RouterProvider router={router} />
        </UserSetterContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
