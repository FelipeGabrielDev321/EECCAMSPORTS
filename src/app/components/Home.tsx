import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Trophy, Calendar, Users, Award, CalendarClock } from "lucide-react";

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-3">
                EECCAM Esportes 2026 Venha fazer parte!
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-yellow-300 mb-6">
                Faça já sua inscrição na EECCAM Esportes!
              </p>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Desperte o atleta que há em você! Inscreva-se para uma das nossas modalidades esportivas.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/inscricao">
                  <Button size="lg" variant="secondary" className="text-lg">
                    Fazer Inscrição
                  </Button>
                </Link>
                <Link to="/modalidades">
                  <Button size="lg" variant="secondary" className="text-lg">
                    Conhecer Modalidades
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/d/1SxVRjRzhxKM0wOFYLnWEfCjuiPx7EQ1L"
                alt="EECCAM"
                className="w-56 h-56 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-slate-950 to-transparent"></div>
      </section>

      {/* Período de Inscrições */}
      <section className="bg-blue-700 text-white py-4 border-b border-blue-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <div className="flex items-center gap-2 font-semibold text-blue-100 text-sm uppercase tracking-wide">
              <CalendarClock className="size-4 text-blue-300" />
              Período de Inscrições
            </div>
            <div className="hidden sm:block w-px h-4 bg-blue-500" />
            <div className="flex items-center gap-2 text-white font-bold">
              <span>01 de Junho de 2026</span>
              <span className="text-blue-300">até</span>
              <span>30 de Junho de 2026</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-blue-500" />
            <Link to="/inscricao">
              <Button size="sm" variant="secondary" className="text-xs font-bold">
                Inscreva-se agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center size-12 bg-blue-100 rounded-full mb-3">
                <Trophy className="size-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold">4</div>
              <div className="text-sm text-muted-foreground">Modalidades</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center size-12 bg-green-100 rounded-full mb-3">
                <Users className="size-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold">200+</div>
              <div className="text-sm text-muted-foreground">Vagas Disponíveis</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center size-12 bg-purple-100 rounded-full mb-3">
                <Calendar className="size-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold">30</div>
              <div className="text-sm text-muted-foreground">Dias para Inscrição</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center size-12 bg-orange-100 rounded-full mb-3">
                <Award className="size-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold">15+</div>
              <div className="text-sm text-muted-foreground">Anos de Tradição</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modalidades Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Modalidades Esportivas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha entre nossas quatro modalidades e desenvolva suas habilidades com os melhores profissionais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: "futsal", name: "Futsal", desc: "Desenvolva técnica, agilidade e trabalho em equipe", src: "https://lh3.googleusercontent.com/d/1XbCvVqZXPE3e8U9pA00EAukdf95Xx8ch" },
              { id: "volei", name: "Vôlei", desc: "Aprimore coordenação, força e estratégia", src: "https://lh3.googleusercontent.com/d/17cfN-bnvcvAQlR-nFMq1Nm_bnwGY999V" },
              { id: "judo", name: "Judô", desc: "Fortaleça corpo, mente e disciplina", src: "https://lh3.googleusercontent.com/d/1TMZb90s1ejm3bUQGP69aonI6GF80vUfx" },
              { id: "capoeira", name: "Capoeira", desc: "Conecte-se com a cultura e movimento", src: "https://lh3.googleusercontent.com/d/1fgWKs-RJythzUPGdf9ZcP7W1EMWqPGzG" },
            ].map(({ id, name, desc, src }) => (
              <Link key={id} to={`/modalidades?tab=${id}`} className="block group">
                <Card className="overflow-hidden group-hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <ImageWithFallback
                      src={src}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>{desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/modalidades">
              <Button size="lg">
                Ver Todas as Modalidades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cronograma do Processo Seletivo</h2>
            <p className="text-lg text-muted-foreground">
              Fique atento aos prazos importantes
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="size-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  Período de Inscrições
                </CardTitle>
                <CardDescription>
                  01/06/2026 a 30/06/2026
                </CardDescription>
              </CardHeader>
              <CardContent>
                Período para realizar sua inscrição online através do nosso site.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="size-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  Testes Práticos
                </CardTitle>
                <CardDescription>
                  05/07/2026 a 10/07/2026
                </CardDescription>
              </CardHeader>
              <CardContent>
                Avaliação técnica e física dos candidatos nas modalidades escolhidas.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="size-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  Divulgação dos Resultados
                </CardTitle>
                <CardDescription>
                  15/07/2026
                </CardDescription>
              </CardHeader>
              <CardContent>
                Publicação da lista de candidatos aprovados no site e mural da escola.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="size-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  Matrícula
                </CardTitle>
                <CardDescription>
                  20/07/2026 a 25/07/2026
                </CardDescription>
              </CardHeader>
              <CardContent>
                Período para efetivação da matrícula dos candidatos aprovados.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl mb-4">Pronto para começar?</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Não perca a oportunidade de fazer parte da EECCAM e desenvolver todo o seu potencial esportivo!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link to="/inscricao">
                <Button size="lg" variant="secondary" className="text-lg">
                  Inscreva-se Agora
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
