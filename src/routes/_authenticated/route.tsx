import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const user = await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        unsubscribe();
        resolve(u);
      });
    });
    if (!user) throw redirect({ to: "/auth" });
    return { user };
  },
  component: () => <Outlet />,
});