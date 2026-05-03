import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0B0F] flex flex-col pt-24 items-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#DC2626]/[0.03] blur-[150px] rounded-[100%] pointer-events-none animate-breathing" />

      {/* Subtle dot grid texture for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Main Navbar */}
      <Navbar />

      <div className="flex flex-1 w-full max-w-[1400px] px-4 sm:px-8 relative z-10">
        {/* Sidebar container */}
        <aside className="sticky top-24 h-[calc(100vh-6rem)] hidden md:block z-40">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-h-screen pl-4 md:pl-8 pb-10">
          {children}
        </main>
      </div>

      {/* Footer */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        <Footer />
      </div>
    </div>
  );
}
