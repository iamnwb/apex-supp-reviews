import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const { logout } = useAdmin();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      window.location.assign("/login");
    }
  }

  return (
    <Button
      variant="outline"
      className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
      onClick={handleLogout}
    >
      Log out
    </Button>
  );
}
