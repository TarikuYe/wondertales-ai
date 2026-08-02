import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") {
      return { user: null };
    }

    const user = await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        unsubscribe();
        resolve(u);
      });
    });
    if (!user) throw redirect({ to: "/auth" });

    // If accessing a child route, ensure they have selected a profile
    // Except when they are specifically going to select-profile or a parent dashboard
    const isChildRoute = !location.pathname.startsWith('/dashboard') && 
                         !location.pathname.startsWith('/select-profile') &&
                         !location.pathname.startsWith('/children');
                         
    if (isChildRoute) {
      const activeChildId = localStorage.getItem('activeChildId');
      if (!activeChildId) {
        throw redirect({ to: "/select-profile" });
      }
    }

    return { user };
  },
  component: () => <Outlet />,
});