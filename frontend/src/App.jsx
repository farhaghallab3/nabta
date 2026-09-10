import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Spinner } from "./components/Spinner";

const Landing = lazy(() => import("./pages/Landing"));
const ForFarmers = lazy(() => import("./pages/ForFarmers"));
const Batches = lazy(() => import("./pages/Batches"));
const BatchDetail = lazy(() => import("./pages/BatchDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const MyAdoptions = lazy(() => import("./pages/consumer/MyAdoptions"));
const FarmerDashboard = lazy(() => import("./pages/farmer/FarmerDashboard"));
const RegisterBatch = lazy(() => import("./pages/farmer/RegisterBatch"));
const LogEvent = lazy(() => import("./pages/farmer/LogEvent"));
const Analytics = lazy(() => import("./pages/farmer/Analytics"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Spinner full />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/for-farmers" element={<ForFarmers />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/batches/:id" element={<BatchDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/my-adoptions"
              element={
                <ProtectedRoute role="consumer">
                  <MyAdoptions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/farmer"
              element={
                <ProtectedRoute role="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/batches/new"
              element={
                <ProtectedRoute role="farmer">
                  <RegisterBatch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/batches/:id/log"
              element={
                <ProtectedRoute role="farmer">
                  <LogEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/analytics"
              element={
                <ProtectedRoute role="farmer">
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
