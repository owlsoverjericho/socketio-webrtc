import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Main from "./Components/Main"
import Room from "./Components/Room"
import NotFound404 from "./Components/NotFound404"
import Navbar from "./Components/Navbar"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <NotFound404 />
  },
  {
    path: "/room/:roomID",
    element: <Room />
  }
]);

const App = () => {
  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
