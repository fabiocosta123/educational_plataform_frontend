import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Educational Plataform",
  description: "Plataforma educacional para cursos online",
  manifest: "/manifest.json",
  themeColor: "#2563eb"
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
      <body>{children}</body>
    </html>
  );
}