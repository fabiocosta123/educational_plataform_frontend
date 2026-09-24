import PresidentPhoto from "../../components/home/PresidentPhoto";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#163E72] sm:text-4xl">Quem Somos</h1>
          <p className="mt-2 text-gray-600">Instituto Teológico Anexa</p>
        </header>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <PresidentPhoto />

          <div className="flex-1 space-y-5 text-justify text-gray-700 leading-relaxed">
            <p>
              O Instituto Teológico Anexa procura proporcionar aos seus alunos os
              critérios e os princípios que auxiliem no uso correto dos meios
              científicos e técnicos desenvolvidos pela inteligência humana. Desta
              forma, Deus é visto como o autor por trás da técnica, sendo o inventor
              daquele que a cria e, portanto, regulador e mestre daqueles que a
              utilizam. Nesse sentido, o Instituto Anexa oferece este curso como um
              elemento de uma nova ordenação antropológica da ciência e do
              progresso, formando homens cheios de consideração pelo Criador e por
              suas criaturas, que consolidem uma sociedade verdadeiramente humana e,
              assim, verdadeiramente cristã, capaz de interferir e contribuir para a
              melhoria da sociedade em que está inserida.
            </p>
            <p>
              Temos trabalhado no fortalecimento e na ampliação de nossa atuação
              teológica, lançando bases firmes para avançarmos em várias áreas
              educacionais, sempre com uma cosmovisão cristã, ortodoxa e
              confessional. Sinto-me privilegiado por Deus por ter a oportunidade de
              contribuir de alguma forma com essa história, auxiliando nossos
              líderes, membros e pastores, e, assim, trabalhando ao lado de pessoas
              comprometidas com o Reino e com a Igreja de Deus.
            </p>
            <p>
              Em toda a Bíblia somos informados sobre a importância e a
              indispensabilidade do ensino das verdades eternas de Deus. Inclusive,
              é por meio do ensino que cumprimos a ordem do Senhor Jesus à Igreja de
              “fazer discípulos de todas as nações” (Mt 28.19-20).
            </p>
            <p>
              Desejo a todos os nossos alunos um bom estudo e um crescimento
              espiritual nessa jornada em busca do conhecimento de Deus e de sua
              vontade.
            </p>

            <footer className="border-t border-gray-200 pt-6 text-left not-italic">
              <p className="text-gray-700">O pastor presidente do campo</p>
              <p className="mt-2 text-lg font-semibold text-[#163E72]">
                Pr. Reuel Padilha
              </p>
              <p className="mt-1 text-sm uppercase tracking-wide text-[#255690]">
                Presidente da Assembleia de Deus Ministério do Belém
                <br />
                Campo de Registro/SP
              </p>
            </footer>
          </div>
        </div>
      </article>
    </main>
  );
}
