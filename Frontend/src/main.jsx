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
import store from './redux/store.js'
import { Provider } from 'react-redux'
import UserCampaigns from "./components/UserCampaigns.jsx";
import UpdateCampaign from "./components/UpdateCampaign.jsx";




const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path='/auth/rest-password' element={<ResetPassword />}/>
      <Route path="/dashboard" element={<PBN_Dashboard />} />
      <Route path="/dashboard/create-campaigns" element={<UserCampaigns />} />
      <Route path="/dashboard/update-campaign/:campaignId" element={<UpdateCampaign />} />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
