import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ProfileSetup } from "./components/ProfileSetup";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useCallerUserProfile, useIsAdmin } from "./hooks/useQueries";
import { Checkout } from "./pages/Checkout";
import { CourseDetail } from "./pages/CourseDetail";
import { Courses } from "./pages/Courses";
import { Dashboard } from "./pages/Dashboard";
import { Landing } from "./pages/Landing";
import { AdminPortal } from "./pages/admin/AdminPortal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

// Root layout component
function RootLayout() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: loadingProfile } = useCallerUserProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (identity && !loadingProfile && profile !== undefined) {
      if (profile === null || !profile.name) {
        setShowProfileSetup(true);
      }
    }
  }, [identity, profile, loadingProfile]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <ProfileSetup
        open={showProfileSetup}
        onComplete={() => setShowProfileSetup(false)}
      />
    </div>
  );
}

// Auth guard for dashboard
function DashboardPage() {
  const { identity } = useInternetIdentity();
  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }
  return <Dashboard />;
}

// Admin guard
function AdminPage() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  if (isLoading) return null;
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        <p>Access denied. Admin privileges required.</p>
      </div>
    );
  }
  return <AdminPortal />;
}

// Router
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const coursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/courses",
  component: Courses,
});

const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/courses/$id",
  component: CourseDetail,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: Checkout,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  coursesRoute,
  courseDetailRoute,
  dashboardRoute,
  checkoutRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="bottom-right" />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}

export default App;
