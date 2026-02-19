  import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
  import routes from "./routes/AppRoutes";
  import {   lazy, Suspense, useEffect, useState, type ReactElement } from "react";
  import { ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { AuthProvider } from "./context/AuthContext";
  import { BookingProvider } from "./context/BookingContext";
  import { NotificationProvider } from "./context/NotificationContext";
  const AIAssistant = lazy(() => import("./components/common/AIAssistant/AIAssistant"));
import PageLoader from "./components/common/PageLoader";

  export interface RouteType {
    path: string;
    element: ReactElement;
  }

  type RouteGroup = RouteType[];

  interface AppRoutes {
    public: RouteGroup;
    admin: RouteGroup;
  }

  const typedRoutes = routes as AppRoutes;

  const AppContent = () => {
      const [showAI, setShowAI] = useState(false);
      const location = useLocation();
      const isAdminRoute = location.pathname.startsWith("/admin");
useEffect(() => {
    const timer = setTimeout(() => {
      setShowAI(true);
    }, 4000); // load after 4s

    return () => clearTimeout(timer);
  }, []);
    
    const renderRoutes = (routesArray: RouteType[]) =>
      routesArray.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ));

    return (
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
        {showAI && !isAdminRoute && (
  <Suspense fallback={null}>
    <AIAssistant />
  </Suspense>
)}
        <main>
            <Suspense fallback={<PageLoader />}>
          <Routes>
            {renderRoutes(typedRoutes.public)}
            {renderRoutes(typedRoutes.admin)}
          </Routes>
          </Suspense>
        </main>
      </div>
    );
  };

  function App() {
    return (
      <Router>
        <AuthProvider>
          <BookingProvider>
            <NotificationProvider>
          <AppContent />
          </NotificationProvider>
          </BookingProvider>
        </AuthProvider>
      </Router>
    );
  }

  export default App;
