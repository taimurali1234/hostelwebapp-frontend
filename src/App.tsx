import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./routes/AppRoutes";
import {  type ComponentType } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface RouteType {
  path: string;
  element: ComponentType;
}

type RouteGroup = RouteType[];

interface AppRoutes {
  public: RouteGroup;
  dashboard: RouteGroup;
  admin: RouteGroup;
}

const typedRoutes = routes as AppRoutes;

const AppContent = () => {
  
  const renderRoutes = (routesArray: RouteType[]) =>
    routesArray.map(({ path, element: Element }) => (
      <Route key={path} path={path} element={<Element />} />
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
      <main>
        <Routes>
          {renderRoutes(typedRoutes.public)}
          {renderRoutes(typedRoutes.dashboard)}
          {renderRoutes(typedRoutes.admin)}
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
