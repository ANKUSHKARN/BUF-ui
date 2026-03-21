import AdminNavigation from "@/components/AdminNavigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavigation />
      <main className="lg:mr-80 min-h-screen transition-all duration-300">
        {children}
      </main>
    </>
  );
}