import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import RecentActivity from "./components/dashboard/RecentActivity";
import StatsCard from "./components/dashboard/StatsCard";
import UpcomingPosts from "./components/dashboard/UpcomingPosts";

// Import your pages here
// import Home from "./pages/Home.jsx";
// import Signup from "./pages/Signup.jsx";
// import Login from "./pages/Login.jsx";
// import RootLayout from "./pages/Layout.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar></Navbar>
          <div className="p-6 space-y-6">
            <StatsCard />
            <RecentActivity />
            <UpcomingPosts />
          </div>
        </>
      ),
      children: [
        { index: true, element: <div></div> },
        // Add more routes here
        // { path: "signup", element: <Signup /> },
        // { path: "login", element: <Login /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
