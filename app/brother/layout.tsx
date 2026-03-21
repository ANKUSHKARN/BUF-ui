import BrotherNavigation from "@/components/BrotherNavigation";

export default function BrotherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BrotherNavigation />
      <main className="lg:mr-80 min-h-screen transition-all duration-300">
        {children}
      </main>
    </>
  );
}