import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Award, Target, Heart, Users } from "lucide-react";

export function About() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre o Processo Seletivo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça mais sobre a EECCAM e nosso processo de seleção esportiva
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-12 rounded-lg overflow-hidden max-w-4xl mx-auto">
          <ImageWithFallback
            src="https://lh3.googleusercontent.com/d/1TXtmWMFALWYDsXrA64D0Nqjjf_2mHuLQ"
            alt="Estudantes praticando esportes"
            className="w-full aspect-[16/9] object-cover"
          />
        </div>

        {/* About EECCAM */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-6">Sobre a EECCAM</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-4">
              A <strong>Escola Estadual Professora Calpurnia Caldas de Amorim (EECCAM)</strong> 
            </p>
            <p className="text-muted-foreground mb-4">Foi fundada em 1979 sendo integrante do projeto PREMEN — Programa de Extensão e Melhoramento do Ensino, criado pelo Decreto Federal Nº 70.067 de 26 de janeiro de 1972, sendo, portanto, um Programa Nacional com o objetivo de aperfeiçoar o ensino de 2º grau por meio de um acordo celebrado entre o Ministério da Educação e o Banco Internacional de Reconstrução e Desenvolvimento em parceria com a Secretaria de Educação do Governo do Rio Grande do Norte. Com ele, a tentativa de trazer para o Brasil o modelo de Escola Americana.</p>
            <p className="text-muted-foreground mb-4">As finalidades desse programa eram, entre tantas outras, atender às necessidades de ampliação da oferta de matrícula na área do ensino médio, visto que o país necessitava de mão-de-obra para atender às indústrias e propor alternativas de reformulação da estrutura da escola média por meio da implantação de um modelo novo de escola de 1º ciclo. Esse modelo de escola foi implantado em vários estados brasileiros.</p>
            <p className="text-muted-foreground mb-4">Em 1980 a escola recebeu o nome de Escola Estadual Professora Calpúrnia Caldas de Amorim (EECCAM), em homenagem à referida professora pelos serviços prestados à educação seridoense.</p>


          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Target className="size-6 text-blue-600" />
              </div>
              <CardTitle>Excelência</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprometimento com a qualidade no ensino e no desenvolvimento de cada atleta.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Heart className="size-6 text-green-600" />
              </div>
              <CardTitle>Respeito</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Valorização das diferenças e promoção de um ambiente inclusivo e acolhedor.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="size-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="size-6 text-purple-600" />
              </div>
              <CardTitle>Comunidade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fortalecimento dos laços comunitários através do esporte e da cooperação.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="size-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <Award className="size-6 text-orange-600" />
              </div>
              <CardTitle>Disciplina</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Desenvolvimento de autodisciplina e comprometimento com objetivos pessoais.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Perguntas Frequentes</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Como funciona o processo seletivo?</AccordionTrigger>
              <AccordionContent>
                O processo seletivo consiste em quatro etapas principais: inscrição online, testes práticos de habilidade na modalidade escolhida, divulgação dos resultados e matrícula dos aprovados. Durante os testes, avaliamos aspectos técnicos, físicos e comportamentais dos candidatos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Preciso ter experiência prévia na modalidade?</AccordionTrigger>
              <AccordionContent>
                Não! Aceitamos candidatos de todos os níveis, desde iniciantes até aqueles com experiência avançada. O processo seletivo avalia não apenas habilidades técnicas, mas também potencial de desenvolvimento, dedicação e atitude.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Quais documentos são necessários?</AccordionTrigger>
              <AccordionContent>
                Você precisará apresentar: documento de identidade (RG) ou certidão de nascimento, CPF, comprovante de residência, atestado médico atualizado (emitido há no máximo 30 dias), autorização dos responsáveis (para menores de 18 anos) e uma foto 3x4 recente.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Há algum custo para participar?</AccordionTrigger>
              <AccordionContent>
                A inscrição no processo seletivo é totalmente gratuita.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Posso me inscrever em mais de uma modalidade?</AccordionTrigger>
              <AccordionContent>
                Inicialmente, você deve escolher apenas uma modalidade para o processo seletivo. Após o início das aulas, dependendo da disponibilidade de horários e do desempenho do aluno, pode ser possível participar de uma segunda modalidade. Consulte a coordenação para mais informações.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>O que acontece se eu for aprovado mas não puder comparecer?</AccordionTrigger>
              <AccordionContent>
                Se você for aprovado mas não puder comparecer para efetuar a matrícula no período estabelecido, sua vaga será disponibilizada para o próximo candidato da lista de espera. Por isso, é importante manter seus dados de contato atualizados e acompanhar todas as comunicações que enviaremos por e-mail.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>A escola fornece os equipamentos necessários?</AccordionTrigger>
              <AccordionContent>
                Para as aulas regulares, fornecemos os equipamentos básicos necessários para a prática. No caso do judô, o kimono deve ser adquirido pelo aluno, mas oferecemos condições especiais de compra através de parceria com fornecedores. Para futsal e vôlei, o aluno deve ter tênis adequado para esportes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>Como posso me preparar para o teste prático?</AccordionTrigger>
              <AccordionContent>
                Recomendamos que você chegue descansado, hidratado e com roupas confortáveis adequadas para atividade física. Se possível, pratique a modalidade escolhida antes do teste. Lembre-se: avaliamos não apenas habilidade, mas também comprometimento, respeito e capacidade de trabalhar em equipe. Seja você mesmo e demonstre seu interesse genuíno pela modalidade.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact CTA */}
        <Card className="mt-12 max-w-3xl mx-auto bg-slate-50 dark:bg-slate-800">
          <CardHeader className="text-center">
            <CardTitle>Ainda tem dúvidas?</CardTitle>
            <CardDescription>
              Entre em contato com nossa equipe
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p>
              <strong>E-mail:</strong> eeccam.edu.br
            </p>
            <p>
              <strong>Telefone:</strong> (84) 1234-5678
            </p>
            <p>
              <strong>WhatsApp:</strong> (84) 98765-4321
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Horário de atendimento: Segunda a Sexta, das 8h às 18h
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
