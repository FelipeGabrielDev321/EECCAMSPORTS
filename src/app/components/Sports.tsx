import { useState } from "react";
import { useSearchParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Clock, Users, MapPin, X, ZoomIn } from "lucide-react";

const sportsData = [
  {
    id: "futsal",
    name: "Futsal",
    image: "https://lh3.googleusercontent.com/d/1ELICV1fzB_vQNKVyhh39qE1giS3PEZc6",
    description: "O futsal é uma modalidade esportiva que desenvolve habilidades técnicas, táticas e físicas através do trabalho em equipe.",
    benefits: ["Desenvolvimento de coordenação motora", "Trabalho em equipe e comunicação", "Condicionamento físico", "Agilidade e reflexos rápidos"],
    schedule: "Terças e Quintas, 14h às 16h",
    instructor: "Prof. Julio Cesar",
    instructorPhoto: "https://lh3.googleusercontent.com/d/1M9bE20LqPiUPg_0zvEWtqn2HVa_AyicJ",
    vacancies: 60,
    location: "Quadra Poliesportiva Principal",
    requirements: ["Idade: 10 a 17 anos", "Atestado médico", "Autorização dos responsáveis"],
  },
  {
    id: "volei",
    name: "Vôlei",
    image: "https://lh3.googleusercontent.com/d/17cfN-bnvcvAQlR-nFMq1Nm_bnwGY999V",
    description: "O vôlei promove o desenvolvimento físico completo, trabalhando força, coordenação e estratégia em um ambiente de equipe.",
    benefits: ["Fortalecimento muscular", "Melhora da coordenação olho-mão", "Desenvolvimento de estratégia", "Trabalho em equipe"],
    schedule: "Segundas e Quartas, 15h às 17h",
    instructor: "Prof. Marcos Medeiros",
    instructorPhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRllLNv1isL5agyzh1DeypaL7ims6sURG7bM1pkobLU27ha205y63HNVwAS&s=10",
    vacancies: 50,
    location: "Quadra de Vôlei",
    requirements: ["Idade: 11 a 18 anos", "Atestado médico", "Autorização dos responsáveis"],
    subModalities: [
      {
        id: "quadra",
        name: "Vôlei de Quadra",
        image: "https://lh3.googleusercontent.com/d/1wkXeCwU2N1INr1DfiWdakMwZ4UI39ps1",
        description: "Modalidade tradicional jogada em quadra coberta com seis jogadores por equipe, focando em precisão, força e trabalho coletivo.",
        benefits: ["Fortalecimento muscular completo", "Coordenação e reflexos", "Trabalho em equipe intenso", "Fundamentos técnicos avançados"],
        schedule: "Segundas e Quartas, 15h às 17h",
        vacancies: 30,
        location: "Quadra Poliesportiva Coberta",
        requirements: ["Idade: 11 a 18 anos", "Atestado médico", "Tênis de vôlei ou esportivo", "Autorização dos responsáveis"],
      },
      {
        id: "areia",
        name: "Vôlei de Areia",
        description: "Versão ao ar livre com duplas ou trios, exigindo maior resistência física e adaptação ao terreno irregular da areia.",
        benefits: ["Maior gasto calórico", "Equilíbrio e propriocepção", "Resistência física", "Jogo estratégico em duplas"],
        schedule: "Terças e Quintas, 14h às 16h",
        vacancies: 20,
        location: "Quadra de Areia (Área Externa)",
        requirements: ["Idade: 11 a 18 anos", "Atestado médico", "Protetor solar recomendado", "Autorização dos responsáveis"],
      },
    ],
  },
  {
    id: "judo",
    name: "Judô",
    image: "https://lh3.googleusercontent.com/d/1TMZb90s1ejm3bUQGP69aonI6GF80vUfx",
    description: "Arte marcial japonesa que desenvolve o corpo e a mente através da disciplina, respeito e técnicas de combate.",
    benefits: ["Disciplina e autocontrole", "Força e flexibilidade", "Confiança e autoestima", "Respeito e valores morais"],
    schedule: "Terças e Quintas, 16h às 18h",
    instructor: "Sensei Suedson",
    instructorPhoto: "https://lh3.googleusercontent.com/d/12kSrqzU1U2n47Dyo4u0WZNL3TQaH-6O3",
    vacancies: 40,
    location: "Dojô (Sala de Artes Marciais)",
    requirements: ["Idade: 8 a 16 anos", "Atestado médico", "Kimono apropriado (pode ser adquirido na escola)", "Autorização dos responsáveis"],
  },
  {
    id: "capoeira",
    name: "Capoeira",
    image: "https://lh3.googleusercontent.com/d/1fgWKs-RJythzUPGdf9ZcP7W1EMWqPGzG",
    description: "Expressão cultural brasileira que une luta, dança, música e acrobacia, desenvolvendo corpo e mente de forma integral.",
    benefits: ["Flexibilidade e equilíbrio", "Consciência corporal", "Conexão com cultura brasileira", "Musicalidade e ritmo"],
    schedule: "Segundas e Quartas, 14h às 16h",
    instructor: "Mestre Alex Besouro",
    instructorPhoto: "",
    vacancies: 50,
    location: "Sala de Ginástica",
    requirements: ["Idade: 9 a 17 anos", "Atestado médico", "Roupas confortáveis para prática", "Autorização dos responsáveis"],
  },
];

export function Sports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "futsal";
  const [voleiSub, setVoleiSub] = useState<"quadra" | "areia">("quadra");
  const [lightboxPhoto, setLightboxPhoto] = useState<{ src: string; name: string } | null>(null);

  return (
    <>
    {/* Lightbox */}
    {lightboxPhoto && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={() => setLightboxPhoto(null)}
      >
        <div
          className="relative max-w-sm w-full flex flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute -top-3 -right-3 size-8 rounded-full bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors z-10"
          >
            <X className="size-4" />
          </button>
          <div className="size-64 rounded-full overflow-hidden border-4 border-white shadow-2xl">
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-white font-semibold text-lg text-center drop-shadow">{lightboxPhoto.name}</p>
        </div>
      </div>
    )}
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Modalidades Esportivas</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça em detalhes cada uma das modalidades oferecidas pela EECCAM
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => setSearchParams({ tab: val })} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="futsal">Futsal</TabsTrigger>
            <TabsTrigger value="volei">Vôlei</TabsTrigger>
            <TabsTrigger value="judo">Judô</TabsTrigger>
            <TabsTrigger value="capoeira">Capoeira</TabsTrigger>
          </TabsList>

          {sportsData.map((sport) => (
            <TabsContent key={sport.id} value={sport.id}>
              {/* Vôlei: sub-modality selector */}
              {sport.subModalities && (
                <div className="flex gap-2 mb-6">
                  {sport.subModalities.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setVoleiSub(sub.id as "quadra" | "areia")}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        voleiSub === sub.id
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-blue-300"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={
                      sport.subModalities
                        ? (sport.subModalities.find((s) => s.id === voleiSub) as any)?.image ?? sport.image
                        : sport.image
                    }
                    alt={sport.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div>
                  <h2 className="text-3xl font-bold mb-1">
                    {sport.subModalities
                      ? sport.subModalities.find((s) => s.id === voleiSub)?.name ?? sport.name
                      : sport.name}
                  </h2>
                  {sport.subModalities && (
                    <p className="text-xs text-blue-600 font-medium mb-3">Sub-modalidade de Vôlei</p>
                  )}
                  <p className="text-muted-foreground mb-6">
                    {sport.subModalities
                      ? sport.subModalities.find((s) => s.id === voleiSub)?.description
                      : sport.description}
                  </p>

                  {/* Info Cards */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Clock className="size-4" />
                          Horário
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          {sport.subModalities
                            ? sport.subModalities.find((s) => s.id === voleiSub)?.schedule
                            : sport.schedule}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Users className="size-4" />
                          Vagas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          {sport.subModalities
                            ? `${sport.subModalities.find((s) => s.id === voleiSub)?.vacancies} vagas`
                            : `${sport.vacancies} vagas`}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <MapPin className="size-4" />
                          Local
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          {sport.subModalities
                            ? sport.subModalities.find((s) => s.id === voleiSub)?.location
                            : sport.location}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="col-span-2">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`size-16 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border-2 border-slate-200 flex items-center justify-center relative group ${sport.instructorPhoto ? "cursor-pointer" : ""}`}
                            onClick={() => sport.instructorPhoto && setLightboxPhoto({ src: sport.instructorPhoto, name: sport.instructor })}
                          >
                            {sport.instructorPhoto ? (
                              <>
                                <img
                                  src={sport.instructorPhoto}
                                  alt={sport.instructor}
                                  className="w-full h-full object-cover transition-opacity group-hover:opacity-75"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ZoomIn className="size-5 text-white drop-shadow" />
                                </div>
                              </>
                            ) : (
                              <span className="text-2xl font-bold text-slate-400">
                                {sport.instructor.charAt(sport.instructor.lastIndexOf(" ") + 1)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Instrutor(a)</p>
                            <p className="font-semibold text-base">{sport.instructor}</p>
                            {sport.instructorPhoto && (
                              <p className="text-xs text-blue-500 mt-0.5">Clique na foto para ampliar</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Benefits and Requirements */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Benefícios</CardTitle>
                    <CardDescription>O que você vai desenvolver nesta modalidade</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(sport.subModalities
                        ? sport.subModalities.find((s) => s.id === voleiSub)?.benefits
                        : sport.benefits
                      )?.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Badge variant="secondary" className="mt-0.5">✓</Badge>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requisitos</CardTitle>
                    <CardDescription>O que você precisa para se inscrever</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(sport.subModalities
                        ? sport.subModalities.find((s) => s.id === voleiSub)?.requirements
                        : sport.requirements
                      )?.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Badge className="mt-0.5">•</Badge>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
    </>
  );
}
