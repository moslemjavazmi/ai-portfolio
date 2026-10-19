import { AuthGuard } from "@/components/auth/AuthGuard";
import { Navbar } from "@/components/ui/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}