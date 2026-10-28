import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "./App.css";

const Home = lazy(() => import("./Pages/Home.jsx"));
const About = lazy(() => import("./Pages/About.jsx"));
const Doctors = lazy(() => import("./Pages/Doctors.jsx"));
const Appointments = lazy(() => import("./Pages/Appointments.jsx"));
const Dashboard = lazy(() => import("./Dashboard.jsx"));
const Auth = lazy(() => import("./Pages/Auth"));

function RouteLoading() {
  return (
    <main className="route-loading" role="status" aria-live="polite">
      <p>MediBook იტვირთება...</p>
    </main>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/MediBook">
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
