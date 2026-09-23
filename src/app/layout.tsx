import type { Metadata, Viewport } from "next";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./hooks/useAuth";
import PwaInstallBanner from "./components/pwa/PwaInstallBanner";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Anexa",
  description: "Plataforma educacional para cursos online",
  manifest: "/manifest.json",
  applicationName: "Anexa",
  appleWebApp: {
    capable: true,
    title: "Anexa",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#163E72",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="pt-br" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Anexa" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={2000} />
          {children}
          <PwaInstallBanner />
        </AuthProvider>       
      </body>
    </html>
  );
}
