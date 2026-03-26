import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AboutUs } from "./pages/AboutUs";
import { Blog } from "./pages/Blog";
import { Certificate } from "./pages/Certificate";
import { Checkout } from "./pages/Checkout";
import { CodeOfConduct } from "./pages/CodeOfConduct";
import { ContactUs } from "./pages/ContactUs";
import { CorporateTraining } from "./pages/CorporateTraining";
import { CourseDetail } from "./pages/CourseDetail";
import { CourseLearn } from "./pages/CourseLearn";
import { Courses } from "./pages/Courses";
import { Dashboard } from "./pages/Dashboard";
import { Disclaimer } from "./pages/Disclaimer";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Payment } from "./pages/Payment";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { RefundPolicy } from "./pages/RefundPolicy";
import { Register } from "./pages/Register";
import { SelectCourse } from "./pages/SelectCourse";
import { SelfAssessment } from "./pages/SelfAssessment";
import { TermsOfUse } from "./pages/TermsOfUse";
import { UserProfile } from "./pages/UserProfile";
import { AdminAssessmentQuestions } from "./pages/admin/AdminAssessmentQuestions";
import { AdminCertificates } from "./pages/admin/AdminCertificates";
import { AdminCourses } from "./pages/admin/AdminCourses";
import { AdminCoursesContent } from "./pages/admin/AdminCoursesContent";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminHomepage } from "./pages/admin/AdminHomepage";
import { AdminLeaders } from "./pages/admin/AdminLeaders";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminSchedule } from "./pages/admin/AdminSchedule";
import { AdminTrainingContent } from "./pages/admin/AdminTrainingContent";
import { AdminUsers } from "./pages/admin/AdminUsers";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          classNames: {
            toast:
              "bg-card border border-border/60 text-foreground font-sans text-sm",
            error: "border-destructive/40 text-destructive",
            success: "border-accent/40",
          },
        }}
      />
    </QueryClientProvider>
  ),
});

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
  path: "/course/$id",
  component: CourseDetail,
});

const courseLearnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learn/$level",
  component: CourseLearn,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: Checkout,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment",
  component: Payment,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: UserProfile,
});

const certificateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/certificate/$id",
  component: Certificate,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutUs,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsOfUse,
});

const refundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/refund-policy",
  component: RefundPolicy,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPolicy,
});

const disclaimerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/disclaimer",
  component: Disclaimer,
});

const codeOfConductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/code-of-conduct",
  component: CodeOfConduct,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: Blog,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactUs,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const selfAssessmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/self-assessment",
  component: SelfAssessment,
});

const selectCourseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/select-course",
  component: SelectCourse,
});

const corporateTrainingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/corporate-training",
  component: CorporateTraining,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLogin,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboard,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/users",
  component: AdminUsers,
});

const adminCoursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/courses",
  component: AdminCourses,
});

const adminCoursesContentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/courses-content",
  component: AdminCoursesContent,
});

const adminScheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/schedule",
  component: AdminSchedule,
});

const adminHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/homepage",
  component: AdminHomepage,
});

const adminTrainingContentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/training-content",
  component: AdminTrainingContent,
});

const adminCertificatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/certificates",
  component: AdminCertificates,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPassword,
});

const adminAssessmentQuestionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/assessment-questions",
  component: AdminAssessmentQuestions,
});

const adminLeadersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/leaders",
  component: AdminLeaders,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  coursesRoute,
  courseDetailRoute,
  courseLearnRoute,
  dashboardRoute,
  checkoutRoute,
  paymentRoute,
  profileRoute,
  certificateRoute,
  aboutRoute,
  termsRoute,
  refundRoute,
  privacyRoute,
  disclaimerRoute,
  codeOfConductRoute,
  blogRoute,
  contactRoute,
  registerRoute,
  loginRoute,
  corporateTrainingRoute,
  selfAssessmentRoute,
  selectCourseRoute,
  adminIndexRoute,
  adminLoginRoute,
  adminDashboardRoute,
  adminUsersRoute,
  adminCoursesRoute,
  adminCoursesContentRoute,
  adminScheduleRoute,
  adminHomepageRoute,
  adminTrainingContentRoute,
  adminCertificatesRoute,
  forgotPasswordRoute,
  adminAssessmentQuestionsRoute,
  adminLeadersRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
