import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/integrations/firebase/client";

export type AppRole = "parent" | "teacher" | "admin";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Map user to session to keep the hook return signature compatible
  return { session: user, user, loading };
}

export function useRoles(user: User | null) {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    
    const rolesQuery = query(collection(db, "user_roles"), where("user_id", "==", user.uid));
    
    getDocs(rolesQuery)
      .then((querySnapshot) => {
        if (!active) return;
        const fetchedRoles: AppRole[] = [];
        querySnapshot.forEach((doc) => {
          fetchedRoles.push(doc.data().role as AppRole);
        });
        setRoles(fetchedRoles.length > 0 ? fetchedRoles : ["parent"]);
        setLoading(false);
      })
      .catch((error) => {
        if (!active) return;
        // Gracefully fallback to parent role if Firestore rules deny client query
        setRoles(["parent"]);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  return { roles, loading, hasRole: (role: AppRole) => roles.includes(role) };
}