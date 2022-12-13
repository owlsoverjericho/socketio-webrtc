import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./Components/Main";
import Room from "./Components/Room";
import NotFound404 from "./Components/NotFound404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <NotFound404 />,
  },
  {
    path: "/room/:roomID",
    element: <Room />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
