import React from "react";
import { Header, Footer } from ".";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ModalProvider } from "./ui/modal";

function Layout() {

  return (
    <ModalProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
        <ToastContainer
          position="top-right"
          autoClose={500}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

    </ModalProvider>
  );
}

export default Layout;
