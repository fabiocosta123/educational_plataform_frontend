import ProfilePhotoSlot from "../../components/home/ProfilePhotoSlot";

const WHATSAPP = "5513997875194";
const PHONE_LABEL = "(13) 99787-5194";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#163E72] sm:text-4xl">Fale Conosco</h1>
          <p className="mt-2 text-gray-600">Coordenação do Instituto Teológico Anexa</p>
        </header>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <ProfilePhotoSlot
            src="/img/abraao_ramalho.png"
            name="Pr. Abraão Ramalho Novaes"
            alt="Pr. Abraão Ramalho Novaes, coordenador do Instituto Teológico Anexa"
          />

          <div className="flex-1 space-y-5 text-gray-700 leading-relaxed">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#338B97]">
              Coordenador do curso
            </p>
            <h2 className="text-2xl font-bold text-[#163E72]">
              Abraão Ramalho Novaes
            </h2>
            <p>
              Coordenador, professor e pastor da Igreja Assembleia de Deus
              Ministério do Belém — Campo de Registro/SP.
            </p>
            <p className="text-lg text-[#163E72]">
              Ajudo líderes cristãos a liderar com base bíblica.
            </p>
            <p>📘 Pastor e teólogo | 20+ anos formando líderes</p>

            <div className="rounded-xl bg-white p-5 shadow-md">
              <p className="text-sm font-semibold text-[#163E72]">Contato</p>
              <p className="mt-1 text-gray-600">Pr. Abraão Ramalho</p>
              <a
                href={`tel:+${WHATSAPP}`}
                className="mt-2 inline-block text-xl font-semibold text-[#163E72] hover:text-[#338B97]"
              >
                {PHONE_LABEL}
              </a>
              <div className="mt-4">
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-[#25D366] px-4 py-2 font-semibold text-white hover:bg-[#1EBE5D]"
                >
                  Conversar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
