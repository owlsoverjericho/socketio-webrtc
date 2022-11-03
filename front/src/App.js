import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./Components/Main";
import Room from "./Components/Room";
import NotFound404 from "./Components/NotFound404";
import { ChakraProvider } from "@chakra-ui/react";

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

const App = () => {
  return (
    <>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </>
  );
};

export default App;
