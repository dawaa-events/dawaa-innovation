import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DashboardLayout from "./components/DashboardLayout";
import BookingsPage from "./pages/BookingsPage";
import DashboardPageNew from "./pages/DashboardPageNew";
import CustomerPortalPage from "./pages/CustomerPortalPage";
import GuestsPage from "./pages/GuestsPage";
import SendInvitationsPage from "./pages/SendInvitationsPage";
import SendPage from "./pages/SendPage";
import GuestsListPage from "./pages/GuestsListPage";
import SettingsPage from "./pages/SettingsPage";
import QRCardsPage from "./pages/QRCardsPage";
import ReportsPage from "./pages/ReportsPage";
import MessagesPage from "./pages/MessagesPage";
import PrivacyPage from "./pages/PrivacyPage";
import LandingPageAnimated from "./pages/LandingPageAnimated";
import LandingPageHTML from "./pages/LandingPageHTML";
import { useAuth } from "./_core/hooks/useAuth";

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path={"/" } component={LandingPageHTML} />
        <Route path={"/home"} component={LandingPageHTML} />
        <Route path={"/privacy"}>{() => <PrivacyPage />}</Route>
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path={"/privacy"}>{() => <PrivacyPage />}</Route>
      <Route>
        {() => (
    <DashboardLayout>
      <Switch>
        <Route path={"/bookings"}>
          {() => <BookingsPage />}
        </Route>
        <Route path={"/bookings/:bookingId/guests"}>
          {({ bookingId }) => <GuestsPage bookingId={bookingId} />}
        </Route>
        <Route path={"/bookings/:bookingId/send"}>
          {({ bookingId }) => <SendInvitationsPage bookingId={bookingId} />}
        </Route>
        <Route path={"/send"}>{() => <SendPage />}</Route>
        <Route path={"/guests"}>{() => <GuestsListPage />}</Route>
        <Route path={"/settings"}>{() => <SettingsPage />}</Route>
        <Route path={"/qr-cards"}>{() => <QRCardsPage />}</Route>
        <Route path={"/reports"}>{() => <ReportsPage />}</Route>
        <Route path={"/messages"}>{() => <MessagesPage />}</Route>
        <Route path={"/portal"}>{() => <CustomerPortalPage />}</Route>
        <Route path={"/"}>{() => <DashboardPageNew />}</Route>
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div dir="rtl" className="min-h-screen bg-background text-foreground">
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
