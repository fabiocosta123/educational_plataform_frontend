import HeroSection from "../components/home/Hero-Section";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#163E72] via-[#255690] to-[#66BCA1] flex flex-col items-center justify-center p-8 text-center">
      <HeroSection />

      {/* Botões de ação */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button className="px-6 py-3 bg-[#338B97] text-white rounded-lg shadow-md hover:bg-[#255690] transition">
          Inscreva-se Agora
        </Button>
        <Button
          variant="ghost"
          className="border border-[#163E72] text-[#163E72] hover:bg-gray-100"
        >
          Saiba Mais
        </Button>

      </div>

      {/* Destaques */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#163E72]">Estudo Bíblico</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Aprofunde-se na interpretação das Escrituras com base sólida e acadêmica.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#163E72]">História da Igreja</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Conheça os principais eventos e personagens que moldaram a fé cristã.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#163E72]">Teologia Sistemática</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Construa uma visão organizada e coerente da fé cristã.</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
