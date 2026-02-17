import { lazy } from "react";
const Home = lazy(() => import("../Pages/users/Home"));
const Dashboard =  lazy(() => import("../Pages/admin/Dashboard"));
const Rooms = lazy(() => import("../Pages/admin/Rooms"));
const RoomPricing = lazy(() => import("../Pages/admin/RoomPricing"));
const Bookings = lazy(() => import("../Pages/admin/Bookings"));
const Orders = lazy(() => import("../Pages/admin/Orders"));
const Reviews = lazy(() => import("../Pages/admin/Reviews"));
const Users = lazy(() => import("../Pages/admin/Users"));
const Notifications = lazy(() => import("../Pages/admin/Notifications"));

const Payments = lazy(() => import("../Pages/admin/Payments"));
const Analytics = lazy(() => import("../Pages/admin/Analytics"));

import Login from "../Pages/users/Login";
import Signup from "../Pages/users/Signup";
import ResetPassword from "../components/auth/ResetPassword";
const OrderDetailsPage = lazy(() => import("../Pages/users/OrderDetails"));
const OrderHistoryPage = lazy(() => import("../Pages/users/OrderHistory"));

import ProtectedRoute from "./ProtectedRoutes";
import PublicRoute from "./PublicRoutes";
const UserRooms = lazy(() => import("../Pages/users/UserRooms"));
const About = lazy(() => import("../Pages/users/About"));
const Contact = lazy(() => import("../Pages/users/Contact"));
const Policy = lazy(() => import("../Pages/users/Policy"));
const Terms = lazy(() => import("../Pages/users/Terms"));
const SingleRoom = lazy(() => import("../Pages/users/SingleRoom"));
const BookingPage = lazy(() => import("../Pages/users/BookingPage"));
const BookingDetails = lazy(() => import("../Pages/users/BookingDetails"));
const BookingConfirmation = lazy(() => import("../Pages/users/BookingConfirmation"));

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
  path: "/booking-details",
  element: (
    <ProtectedRoute
      element={BookingDetails}
      allowedRoles={["USER", "ADMIN", "COORDINATOR"]}
    />
  ),
},
{
  path: "/booking-confirmation",
  element: (
    <ProtectedRoute
      element={BookingConfirmation}
      allowedRoles={["USER", "ADMIN", "COORDINATOR"]}
    />
  ),
},
{
  path: "/orders/:orderId",
  element: (
    <ProtectedRoute
      element={OrderDetailsPage}
      allowedRoles={["USER", "ADMIN", "COORDINATOR"]}
    />
  ),
},
{
  path: "/my-orders",
  element: (
    <ProtectedRoute
      element={OrderHistoryPage}
      allowedRoles={["USER", "ADMIN", "COORDINATOR"]}
    />
  ),
},
// {
//   path: "/orders",
//   element: (
//     <ProtectedRoute
//       element={OrdersPage}
//       allowedRoles={["USER", "ADMIN", "COORDINATOR"]}
//     />
//   ),
// },
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
      path: "/admin/orders",
      element: (
        <ProtectedRoute
          element={Orders}
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
