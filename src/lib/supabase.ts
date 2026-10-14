import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export type InscricaoRow = {
  id: string;
  full_name: string;
  matricula: string;
  email: string;
  sport: string;
  experience: string;
  status: "pendente" | "aprovado" | "negado";
  denied_by_name: string | null;
  denied_by_role: string | null;
  denied_by_sport: string | null;
  denied_reason: string | null;
  created_at: string;
};
