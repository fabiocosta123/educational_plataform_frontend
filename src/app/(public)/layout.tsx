import Header from "../../app/components/home/Header";
import Footer from "../../app/components/home/Footer";
import { Toaster } from "@/components/ui/toast";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Toaster />
      <Footer />
    </>
  );
}
