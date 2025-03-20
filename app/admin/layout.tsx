// app/admin/layout.tsx
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/Sidebar";
import Breadcrumb from "@/components/admin/Breadcrumb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Provider from '@/components/SessionProvider';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 严格权限检查
  if (!session?.user?.roles?.includes('ADMIN')) {
    redirect("/auth/login?error=unauthorized");
  }

  return (
    <Provider session={session}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8 ml-64">
            <Breadcrumb />
            {children}
          </main>
        </div>
      </div>
    </Provider>
  );
}