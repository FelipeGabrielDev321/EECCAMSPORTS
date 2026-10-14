export type Role = "secretario" | "professor";

export interface AdminUser {
  id: string;
  name: string;
  role: Role;
  sport?: string;
  username: string;
  password: string;
}

export interface Inscription {
  id: string;
  fullName: string;
  matricula: string;
  email: string;
  sport: string;
  experience: string;
  status: "pendente" | "aprovado" | "negado";
  createdAt: string;
  deniedBy?: {
    name: string;
    role: Role;
    sport?: string;
    reason: string;
  };
}

export const ADMIN_USERS: AdminUser[] = [
  {
    id: "1",
    name: "Gestão EECCAM",
    role: "Gestão escolar",
    username: "Gestão",
    password: "eeccam2026",
  },
  {
    id: "2",
    name: "Prof.Julio Cesar",
    role: "professor",
    sport: "Futsal",
    username: "prof.futsal",
    password: "futsal2026",
  },
  {
    id: "3",
    name: "Prof. Marcos",
    role: "professor",
    sport: "Vôlei",
    username: "prof.volei",
    password: "volei2026",
  },
  {
    id: "4",
    name: "Prof. Suedson",
    role: "professor",
    sport: "Judô",
    username: "prof.judo",
    password: "judo2026",
  },
  {
    id: "5",
    name: "Mestre besouro",
    role: "professor",
    sport: "Capoeira",
    username: "prof.capoeira",
    password: "capoeira2026",
  },
];

export const MOCK_INSCRIPTIONS: Inscription[] = [
  {
    id: "1",
    fullName: "Lucas Ferreira Santos",
    matricula: "2026001",
    email: "lucas@escola.edu.br",
    sport: "Futsal",
    experience: "Iniciante",
    status: "pendente",
    createdAt: "2026-07-10",
  },
  {
    id: "2",
    fullName: "Beatriz Oliveira Costa",
    matricula: "2026002",
    email: "beatriz@escola.edu.br",
    sport: "Vôlei",
    experience: "Nenhuma",
    status: "pendente",
    createdAt: "2026-07-11",
  },
  {
    id: "3",
    fullName: "Pedro Henrique Alves",
    matricula: "2026003",
    email: "pedro@escola.edu.br",
    sport: "Judô",
    experience: "Intermediário",
    status: "aprovado",
    createdAt: "2026-07-08",
  },
  {
    id: "4",
    fullName: "Juliana Rocha Mendes",
    matricula: "2026004",
    email: "juliana@escola.edu.br",
    sport: "Capoeira",
    experience: "Nenhuma",
    status: "pendente",
    createdAt: "2026-07-12",
  },
  {
    id: "5",
    fullName: "Gabriel Martins Torres",
    matricula: "2026005",
    email: "gabriel@escola.edu.br",
    sport: "Futsal",
    experience: "Avançado",
    status: "negado",
    createdAt: "2026-07-09",
    deniedBy: {
      name: "Prof. Carlos Silva",
      role: "professor",
      sport: "Futsal",
      reason: "Candidato já está inscrito em outra modalidade e não cumpre o requisito de exclusividade.",
    },
  },
  {
    id: "6",
    fullName: "Isabella Lima Cardoso",
    matricula: "2026006",
    email: "isabella@escola.edu.br",
    sport: "Vôlei",
    experience: "Iniciante",
    status: "aprovado",
    createdAt: "2026-07-07",
  },
  {
    id: "7",
    fullName: "Rafael Souza Barbosa",
    matricula: "2026007",
    email: "rafael@escola.edu.br",
    sport: "Judô",
    experience: "Avançado",
    status: "pendente",
    createdAt: "2026-07-13",
  },
  {
    id: "8",
    fullName: "Sofia Pereira Nunes",
    matricula: "2026008",
    email: "sofia@escola.edu.br",
    sport: "Capoeira",
    experience: "Iniciante",
    status: "pendente",
    createdAt: "2026-07-14",
  },
];
