import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PrivateRoute from "./component/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { Provider } from "react-redux";

import { store } from "./redux/store";
import Profile from "./component/dashboard/Profile";
import CreateNote from "./component/Note/CreateNote";
import { SocketProvider } from "./context/SocketContext";
import EditNote from "./component/Note/EditNote";
// import "react-toastify/dist/ReactToastify.css";
// import App from "./App.css"

const App = () => {
  return (
    <div className="flex flex-col min-w-full min-h-screen">
      <BrowserRouter>
        {/* <ScrollToTop /> */}
        <Provider store={store}>
          <SocketProvider>
            <div className="flex-grow bg-gray-50 max-w-full pb-5">
              <Routes>
                <Route path="/user/signup" element={<Signup />} />
                <Route path="/user/login" element={<Login />} />
                <Route path="/" element={<Home />} />

                <Route element={<PrivateRoute />}>
                  <Route path="/user/dashboard" element={<Dashboard />} />
                  <Route path="/user/dashboard/profile" element={<Profile />} />
                  <Route
                    path="/user/dashboard/create-note"
                    element={<CreateNote />}
                  />
                  <Route
                    path="/user/dashboard/edit-note/:noteId"
                    element={<EditNote />}
                  />
                </Route>
              </Routes>
              {/* <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          /> */}
            </div>
          </SocketProvider>
        </Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
