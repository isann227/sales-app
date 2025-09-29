import Navigation from "../Components/Navigation";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
} 