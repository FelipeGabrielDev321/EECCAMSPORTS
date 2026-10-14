import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function Registration() {
  const [formData, setFormData] = useState({
    fullName: "",
    matricula: "",
    email: "",
    sport: "",
    voleiSub: "",
    experience: "",
    termsAccepted: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matriculaError, setMatriculaError] = useState("");
  const [emailError, setEmailError] = useState("");

  const FAKE_DOMAINS = [
    "mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email",
    "sharklasers.com", "guerrillamailblock.com", "grr.la", "spam4.me",
    "yopmail.com", "dispostable.com", "fakeinbox.com", "trashmail.com",
    "maildrop.cc", "10minutemail.com", "temp-mail.org", "discard.email",
    "spamgourmet.com", "mytemp.email", "getnada.com", "mohmal.com",
    "aaaa.com", "asdf.com", "test.com", "example.com", "teste.com",
  ];

  const DOMAIN_TYPOS: Record<string, string> = {
    "gmail.co": "gmail.com", "gmail.cm": "gmail.com", "gmail.con": "gmail.com",
    "gmail.cpm": "gmail.com", "gmail.ocm": "gmail.com", "gmail.om": "gmail.com",
    "gmai.com": "gmail.com", "gmial.com": "gmail.com", "gamail.com": "gmail.com",
    "gmaill.com": "gmail.com", "gmaill.com.br": "gmail.com",
    "hotmial.com": "hotmail.com", "hotmail.co": "hotmail.com", "hotmal.com": "hotmail.com",
    "hotmai.com": "hotmail.com", "htomail.com": "hotmail.com", "hotmaill.com": "hotmail.com",
    "outlok.com": "outlook.com", "outook.com": "outlook.com", "outlook.co": "outlook.com",
    "outlookk.com": "outlook.com", "outllook.com": "outlook.com",
    "yahooo.com": "yahoo.com", "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com",
    "iclould.com": "icloud.com", "iclod.com": "icloud.com", "icloud.co": "icloud.com",
  };

  // Regras reais de cada provedor na criação da conta
  const PROVIDER_RULES: Record<string, {
    minLen: number; maxLen: number;
    allowedChars: RegExp;
    noConsecutiveDots?: boolean;
    noLeadingTrailingDots?: boolean;
    mustStartWithLetter?: boolean;
    label: string;
  }> = {
    "gmail.com": {
      minLen: 6, maxLen: 30,
      allowedChars: /^[a-zA-Z0-9.]+$/,
      noConsecutiveDots: true,
      noLeadingTrailingDots: true,
      label: "Gmail",
    },
    "hotmail.com": {
      minLen: 1, maxLen: 64,
      allowedChars: /^[a-zA-Z0-9._\-]+$/,
      noConsecutiveDots: true,
      noLeadingTrailingDots: true,
      label: "Hotmail",
    },
    "outlook.com": {
      minLen: 1, maxLen: 64,
      allowedChars: /^[a-zA-Z0-9._\-]+$/,
      noConsecutiveDots: true,
      noLeadingTrailingDots: true,
      label: "Outlook",
    },
    "yahoo.com": {
      minLen: 4, maxLen: 32,
      allowedChars: /^[a-zA-Z0-9._]+$/,
      noLeadingTrailingDots: true,
      mustStartWithLetter: true,
      label: "Yahoo",
    },
    "icloud.com": {
      minLen: 3, maxLen: 20,
      allowedChars: /^[a-zA-Z0-9._\-]+$/,
      noLeadingTrailingDots: true,
      mustStartWithLetter: true,
      label: "iCloud",
    },
    "live.com": {
      minLen: 1, maxLen: 64,
      allowedChars: /^[a-zA-Z0-9._\-]+$/,
      noConsecutiveDots: true,
      noLeadingTrailingDots: true,
      label: "Live",
    },
  };

  const validateEmail = (value: string) => {
    if (!value) { setEmailError(""); return; }

    if (!value.includes("@")) {
      setEmailError("E-mail incompleto. É necessário incluir o '@' (ex: nome@gmail.com).");
      return;
    }

    const atIndex = value.lastIndexOf("@");
    const localPart = value.slice(0, atIndex);
    const domain = value.slice(atIndex + 1).toLowerCase();

    if (!localPart || localPart.length < 2) {
      setEmailError("E-mail inválido. O nome antes do '@' deve ter pelo menos 2 caracteres.");
      return;
    }

    if (!domain || !domain.includes(".")) {
      setEmailError("E-mail incompleto. O domínio está faltando (ex: @gmail.com).");
      return;
    }

    const tld = domain.split(".").slice(-1)[0];
    if (!tld || tld.length < 2) {
      setEmailError("E-mail inválido. A extensão do domínio está incompleta (ex: .com, .br).");
      return;
    }

    // Typo detection
    if (DOMAIN_TYPOS[domain]) {
      setEmailError(`Domínio inválido. Você quis dizer @${DOMAIN_TYPOS[domain]}?`);
      return;
    }

    // Descartáveis
    if (FAKE_DOMAINS.includes(domain)) {
      setEmailError("E-mail inválido. Não são aceitos e-mails temporários ou descartáveis.");
      return;
    }

    // Regras específicas do provedor
    const rules = PROVIDER_RULES[domain];
    if (rules) {
      if (localPart.length < rules.minLen) {
        setEmailError(`E-mail inválido. O nome de usuário ${rules.label} deve ter no mínimo ${rules.minLen} caracteres.`);
        return;
      }
      if (localPart.length > rules.maxLen) {
        setEmailError(`E-mail inválido. O nome de usuário ${rules.label} pode ter no máximo ${rules.maxLen} caracteres.`);
        return;
      }
      if (!rules.allowedChars.test(localPart)) {
        const providerCharMsg: Record<string, string> = {
          "gmail.com": "Gmail só aceita letras, números e pontos (sem underline, hífen ou símbolos).",
          "yahoo.com": "Yahoo só aceita letras, números, pontos e underline.",
          "icloud.com": "iCloud só aceita letras, números, pontos e hífen.",
        };
        setEmailError(`E-mail inválido. ${providerCharMsg[domain] ?? `${rules.label} não aceita os caracteres usados.`}`);
        return;
      }
      if (rules.noLeadingTrailingDots && (localPart.startsWith(".") || localPart.endsWith("."))) {
        setEmailError(`E-mail inválido. O endereço ${rules.label} não pode começar nem terminar com ponto.`);
        return;
      }
      if (rules.noConsecutiveDots && localPart.includes("..")) {
        setEmailError(`E-mail inválido. O endereço ${rules.label} não pode ter dois pontos seguidos (..)`);
        return;
      }
      if (rules.mustStartWithLetter && !/^[a-zA-Z]/.test(localPart)) {
        setEmailError(`E-mail inválido. O endereço ${rules.label} deve começar com uma letra.`);
        return;
      }
    }

    // Padrões obviamente falsos
    if (/^(.)\1{4,}$/.test(localPart) || /^(abc|aaa|bbb|ccc|xxx|123|test|fake|lixo|aaaa|qwer|asdf)/i.test(localPart)) {
      setEmailError("E-mail inválido. Por favor, use um e-mail real.");
      return;
    }

    // Formato geral
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      setEmailError("E-mail inválido. Verifique o formato (ex: nome@gmail.com).");
      return;
    }

    setEmailError("");
  };

  const handleEmailChange = (value: string) => {
    handleChange("email", value);
    validateEmail(value);
  };

  const handleMatriculaChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    handleChange("matricula", digits);
    if (digits.length > 0 && digits.length < 12) {
      setMatriculaError("A matrícula deve ter exatamente 12 dígitos.");
    } else {
      setMatriculaError("");
    }
  };

  const finalSport = formData.sport === "Vôlei"
    ? (formData.voleiSub || "Vôlei")
    : formData.sport;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.matricula.length !== 12) {
      setMatriculaError("A matrícula deve ter exatamente 12 dígitos.");
      return;
    }
    if (formData.sport === "Vôlei" && !formData.voleiSub) {
      setError("Selecione a sub-modalidade de Vôlei (Quadra ou Areia).");
      return;
    }
    if (emailError) {
      setError("Corrija o e-mail antes de enviar.");
      return;
    }
    setLoading(true);
    setError("");

    const { data: existing } = await supabase
      .from("inscricoes")
      .select("id")
      .eq("email", formData.email)
      .eq("sport", finalSport)
      .maybeSingle();

    if (existing) {
      setError(`Este e-mail já possui uma inscrição para ${finalSport}. Cada e-mail só pode ser usado uma vez por modalidade.`);
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase.from("inscricoes").insert({
      full_name: formData.fullName,
      matricula: formData.matricula,
      email: formData.email,
      sport: finalSport,
      experience: formData.experience,
      status: "pendente",
    });

    setLoading(false);

    if (dbError) {
      if (dbError.code === "23505") {
        setError(`Este e-mail já possui uma inscrição para ${finalSport}. Cada e-mail só pode ser usado uma vez por modalidade.`);
      } else {
        setError("Erro ao enviar inscrição. Tente novamente em alguns instantes.");
        console.error(dbError);
      }
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ fullName: "", matricula: "", email: "", sport: "", voleiSub: "", experience: "", termsAccepted: false });
  };

  if (submitted) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
            <AlertDescription className="ml-2">
              <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">Inscrição Realizada com Sucesso!</h3>
              <p className="text-green-800 dark:text-green-200">
                Sua inscrição para <strong>{finalSport}</strong> foi registrada com a
                matrícula <strong>{formData.matricula}</strong>. Você receberá um retorno
                pelo e-mail <strong>{formData.email}</strong> com as próximas etapas.
              </p>
              <div className="mt-4">
                <Button onClick={handleReset}>Fazer Nova Inscrição</Button>
              </div>
            </AlertDescription>
          </Alert>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { step: "1", title: "Aguardar Análise", desc: "Sua inscrição será avaliada pela secretaria e pelo professor responsável" },
                { step: "2", title: "Confirmação por E-mail", desc: "Você será notificado sobre aprovação ou reprovação pelo e-mail informado" },
                { step: "3", title: "Comparecer ao Teste Prático", desc: "Se aprovado, a data será informada por e-mail" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3">
                  <div className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm flex-shrink-0">{step}</div>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ficha de Inscrição</h1>
          <p className="text-lg text-muted-foreground">
            Preencha os dados abaixo para se inscrever no processo seletivo
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="size-4" />
          <AlertDescription>
            Apenas dados escolares são necessários. Nenhuma informação pessoal sensível é coletada.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Dados do Aluno</CardTitle>
              <CardDescription>Informações de identificação escolar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <Label htmlFor="matricula">Matrícula * <span className="text-muted-foreground font-normal text-xs">(12 dígitos)</span></Label>
                <Input
                  id="matricula"
                  required
                  inputMode="numeric"
                  maxLength={12}
                  value={formData.matricula}
                  onChange={(e) => handleMatriculaChange(e.target.value)}
                  placeholder="Ex: 202600100001"
                  className={matriculaError ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {matriculaError && (
                  <p className="text-xs text-red-600 mt-1">{matriculaError}</p>
                )}
                {!matriculaError && formData.matricula.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">{formData.matricula.length}/12 dígitos</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">E-mail Escolar *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="seu@escola.edu.br"
                  className={emailError ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {emailError && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3 flex-shrink-0" />
                    {emailError}
                  </p>
                )}
                {!emailError && formData.email.length > 0 && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> E-mail válido
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Modalidade</CardTitle>
              <CardDescription>Escolha a modalidade e informe sua experiência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sport">Modalidade Escolhida *</Label>
                <Select required value={formData.sport} onValueChange={(value) => handleChange("sport", value)}>
                  <SelectTrigger id="sport">
                    <SelectValue placeholder="Selecione uma modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Futsal">Futsal</SelectItem>
                    <SelectItem value="Vôlei">Vôlei</SelectItem>
                    <SelectItem value="Judô">Judô</SelectItem>
                    <SelectItem value="Capoeira">Capoeira</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.sport === "Vôlei" && (
                <div>
                  <Label htmlFor="voleiSub">Sub-modalidade de Vôlei *</Label>
                  <Select required value={formData.voleiSub} onValueChange={(value) => handleChange("voleiSub", value)}>
                    <SelectTrigger id="voleiSub">
                      <SelectValue placeholder="Selecione a sub-modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vôlei de Quadra">Vôlei de Quadra</SelectItem>
                      <SelectItem value="Vôlei de Areia">Vôlei de Areia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="experience">Experiência Anterior</Label>
                <Select value={formData.experience} onValueChange={(value) => handleChange("experience", value)}>
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nenhuma">Nenhuma experiência</SelectItem>
                    <SelectItem value="Iniciante">Iniciante (menos de 1 ano)</SelectItem>
                    <SelectItem value="Intermediário">Intermediário (1-3 anos)</SelectItem>
                    <SelectItem value="Avançado">Avançado (mais de 3 anos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  required
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleChange("termsAccepted", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  Declaro que as informações fornecidas são verdadeiras e estou ciente das regras
                  do processo seletivo da EECCAM. Autorizo o uso de imagem durante as atividades
                  esportivas para fins institucionais. *
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" size="lg" className="w-full md:w-auto min-w-64" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : "Enviar Inscrição"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
