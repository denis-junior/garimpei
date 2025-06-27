import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserSheet from "@/components/UserSheet";

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <UserSheet />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
