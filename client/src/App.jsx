import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

// Import your pages here
// import Home from "./pages/Home.jsx";
// import Signup from "./pages/Signup.jsx";
// import Login from "./pages/Login.jsx";
// import RootLayout from "./pages/Layout.jsx";

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <div>Root Layout</div>,
			children: [
				{ index: true, element: <div>Home Page</div> },
				// Add more routes here
				// { path: "signup", element: <Signup /> },
				// { path: "login", element: <Login /> },
			],
		},
	]);

	return <RouterProvider router={router} />;
}

export default App;
