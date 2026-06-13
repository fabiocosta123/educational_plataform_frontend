import type { Metadata } from "next";
import { Toaster } from "sonner";
import Header from "./home/header";
import Footer from "./home/footer";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "Anexa",
  description: "Plataforma educacional para cursos online",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <Header />
        <Toaster richColors position="top-right" />
       <div className="flex-1"> {children}</div>

       <Footer />
      </body>
    </html>
  );
}
