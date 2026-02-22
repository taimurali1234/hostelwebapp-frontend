import { lazy, Suspense, useEffect, useState, type ReactElement } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "./components/common/PageLoader";
import GlobalErrorFallback from "./components/common/GlobalErrorFallback";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { NotificationProvider } from "./context/NotificationContext";
import routes from "./routes/AppRoutes";

const AIAssistant = lazy(() => import("./components/common/AIAssistant/AIAssistant"));

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

const GlobalRouteErrorBoundary = ({ children }: { children: ReactElement }) => {
  const location = useLocation();

  return (
    <ErrorBoundary key={location.pathname} FallbackComponent={GlobalErrorFallback}>
      {children}
    </ErrorBoundary>
  );
};

const AppContent = () => {
  const [showAI, setShowAI] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";
  const shouldTestBoundary =
    import.meta.env.DEV &&
    new URLSearchParams(location.search).get("testErrorBoundary") === "1";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAI(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (shouldTestBoundary) {
    throw new Error("Intentional test error: global error boundary is active.");
  }

  const renderRoutes = (routesArray: RouteType[]) =>
    routesArray.map(({ path, element }) => <Route key={path} path={path} element={element} />);

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
      {showAI && !isAdminRoute && !isAuthRoute && (
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
      <GlobalRouteErrorBoundary>
        <AuthProvider>
          <BookingProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </BookingProvider>
        </AuthProvider>
      </GlobalRouteErrorBoundary>
    </Router>
  );
}

export default App;
