import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AuthPage from "./components/AuthPage.jsx";
import PBN_Dashboard from "./components/PBN_Dashboard.jsx";
import ResetPassword from "./components/Rest_Password.jsx";
import {store , persistor} from "./redux/store.js";
import { Provider } from "react-redux";
import UserCampaigns from "./components/UserCampaigns.jsx";
import UpdateCampaign from "./components/UpdateCampaign.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { PersistGate } from "redux-persist/lib/integration/react.js";
import AllSentCampaigns from "./components/AllSentCampaigns.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/rest-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PBN_Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/create-campaigns"
        element={
          <ProtectedRoute>
            <UserCampaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/update-campaign/:campaignId"
        element={
          <ProtectedRoute>
            <UpdateCampaign />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/sent-campaigns" element={<AllSentCampaigns />} />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
