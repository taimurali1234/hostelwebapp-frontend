import Home from "../Pages/users/Home";
import Dashboard from "../Pages/admin/Dashboard";
import Rooms from "../Pages/admin/Rooms";
import RoomPricing from "../Pages/admin/RoomPricing";
import Bookings from "../Pages/admin/Bookings";
import Reviews from "../Pages/admin/Reviews";
import Users from "../Pages/admin/Users";
import Notifications from "../Pages/admin/Notifications";
import Payments from "../Pages/admin/Payments";
import Analytics from "../Pages/admin/Analytics";

import Login from "../Pages/users/Login";
import Signup from "../Pages/users/Signup";
import ResetPassword from "../components/auth/ResetPassword";

import ProtectedRoute from "./ProtectedRoutes";
import PublicRoute from "./PublicRoutes";
import UserRooms from "../Pages/users/UserRooms";
import About from "@/Pages/users/About";
import Contact from "@/Pages/users/Contact";
import Policy from "@/Pages/users/Policy";
import Terms from "@/Pages/users/Terms";
import SingleRoom from "@/Pages/users/SingleRoom";
import BookingPage from "@/Pages/users/BookingPage";

const routes = {
  public: [
     {
    path: "/",
    element: (
      <PublicRoute>
        <Home />
      </PublicRoute>
    ),
  },
   {
    path: "/rooms",
    element: (
      <PublicRoute>
        <UserRooms />
      </PublicRoute>
    ),
  },
   {
    path: "/about",
    element: (
      <PublicRoute>
        <About />
      </PublicRoute>
    ),
  },
   {
    path: "/contact",
    element: (
      <PublicRoute>
        <Contact />
      </PublicRoute>
    ),
  },
   {
    path: "/privacy",
    element: (
      <PublicRoute>
        <Policy />
      </PublicRoute>
    ),
  },
   {
    path: "/terms",
    element: (
      <PublicRoute>
        <Terms />
      </PublicRoute>
    ),
  },
  {
  path: "/rooms/:id",
  element: (
    <PublicRoute>
      <SingleRoom />
    </PublicRoute>
  ),
},
 {
  path: "/bookings",
  element: (
    <PublicRoute>
      <BookingPage />
    </PublicRoute>
  ),
},
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
  ],

  admin: [
    {
      path: "/admin/dashboard",
      element: (
        <ProtectedRoute
          element={Dashboard}
          allowedRoles={["ADMIN", "COORDINATOR"]}
        />
      ),
    },
    {
      path: "/admin/rooms",
      element: (
        <ProtectedRoute
          element={Rooms}
          allowedRoles={["ADMIN", "COORDINATOR"]}
        />
      ),
    },
    {
      path: "/admin/room-pricing",
      element: (
        <ProtectedRoute
          element={RoomPricing}
          allowedRoles={["ADMIN", "COORDINATOR"]}
        />
      ),
    },
    {
      path: "/admin/bookings",
      element: (
        <ProtectedRoute
          element={Bookings}
          allowedRoles={["ADMIN", "COORDINATOR"]}
        />
      ),
    },
    {
      path: "/admin/reviews",
      element: (
        <ProtectedRoute
          element={Reviews}
          allowedRoles={["ADMIN", "COORDINATOR"]}
        />
      ),
    },
    {
      path: "/admin/users",
      element: (
        <ProtectedRoute
          element={Users}
          allowedRoles={["ADMIN"]}
        />
      ),
    },
    {
      path: "/admin/notifications",
      element: (
        <ProtectedRoute
          element={Notifications}
          allowedRoles={["ADMIN", "COORDINATOR"]}
        />
      ),
    },
    {
      path: "/admin/payments",
      element: (
        <ProtectedRoute
          element={Payments}
          allowedRoles={["ADMIN"]}
        />
      ),
    },
    {
      path: "/admin/analytics",
      element: (
        <ProtectedRoute
          element={Analytics}
          allowedRoles={["ADMIN"]}
        />
      ),
    },
  ],
};

export default routes;
