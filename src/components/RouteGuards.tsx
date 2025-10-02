import React from "react";
import { useAuth } from "@/lib/auth";

/**
 * Shows children only if a user is signed in.
 * If not signed in, redirects to /login.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or a spinner if you prefer
  if (!user) {
    // simple redirect without relying on a router
    window.location.assign("/login");
    return null;
  }
  return <>{children}</>;
}

/**
 * Shows children only if a signed-in user is an admin.
 * If not signed in, redirects to /login.
 * If signed in but not admin, redirects to home.
 */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!user) {
    window.location.assign("/login");
    return null;
  }
  if (!isAdmin) {
    window.location.assign("/");
    return null;
  }
  return <>{children}</>;
}