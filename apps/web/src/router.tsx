import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import { createStart } from "@tanstack/react-start";

const RootRoute = createRootRoute({
  component: () => <div>Root Layout</div>,
});

const IndexRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: () => <div>Home Page</div>,
});

const FeaturesRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/features",
  component: () => <div>Features Page</div>,
});

const PricingRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/pricing",
  component: () => <div>Pricing Page</div>,
});

const FaqRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/faq",
  component: () => <div>FAQ Page</div>,
});

const AboutRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/about",
  component: () => <div>About Page</div>,
});

const LoginRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/login",
  component: () => <div>Login Page</div>,
});

const SignupRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/signup",
  component: () => <div>Signup Page</div>,
});

const ForgotPasswordRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/forgot-password",
  component: () => <div>Forgot Password Page</div>,
});

const PrivacyRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/privacy",
  component: () => <div>Privacy Page</div>,
});

const TermsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/terms",
  component: () => <div>Terms Page</div>,
});

const AppRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/app",
  component: () => <div>Dashboard Page</div>,
});

const AppStudentsRoute = createRoute({
  getParentRoute: () => AppRoute,
  path: "/students",
  component: () => <div>Students Page</div>,
});

const routeTree = RootRoute.addChildren([
  IndexRoute,
  FeaturesRoute,
  PricingRoute,
  FaqRoute,
  AboutRoute,
  LoginRoute,
  SignupRoute,
  ForgotPasswordRoute,
  PrivacyRoute,
  TermsRoute,
  AppRoute.addChildren([AppStudentsRoute]),
]);

const startInstance = createStart(() => {
  return {
    defaultSsr: true,
  };
});

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export {
  RootRoute,
  IndexRoute,
  FeaturesRoute,
  PricingRoute,
  FaqRoute,
  AboutRoute,
  LoginRoute,
  SignupRoute,
  ForgotPasswordRoute,
  PrivacyRoute,
  TermsRoute,
  AppRoute,
  AppStudentsRoute,
  startInstance,
};
