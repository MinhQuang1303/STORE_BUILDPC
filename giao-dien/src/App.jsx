import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { CartProvider } from "./context/CartContext";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <CartProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </CartProvider>
  );
}

export default App;
