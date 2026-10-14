import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import {
  CheckCircle2, XCircle, Clock, LogOut, Users, Search, Filter, Eye, ShieldCheck,
  AlertTriangle, Loader2, RefreshCw, Archive, Ban, Sun, Moon,
} from "lucide-react";
import { AdminUser } from "./adminData";
import { supabase, InscricaoRow } from "../../../lib/supabase";
import { projectId } from "../../../../utils/supabase/info";

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ec12f2c5`;

async function sendStatusEmail(params: {
  to: string;
  studentName: string;
  sport: string;
  status: "aprovado" | "negado";
  reason?: string;
  deniedByName?: string;
  deniedByRole?: string;
  deniedBySport?: string;
}) {
  try {
    await fetch(`${SERVER_URL}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch (e) {
    console.error("Email send failed:", e);
  }
}

const SPORT_COLORS: Record<string, string> = {
  Futsal: "bg-orange-100 text-orange-700 border-orange-200",
  "Vôlei": "bg-blue-100 text-blue-700 border-blue-200",
  "Vôlei de Quadra": "bg-blue-100 text-blue-700 border-blue-200",
  "Vôlei de Areia": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Judô": "bg-purple-100 text-purple-700 border-purple-200",
  Capoeira: "bg-green-100 text-green-700 border-green-200",
};

const ROLE_LABEL: Record<string, string> = {
  secretario: "Secretaria",
  professor: "Professor(a)",
};

const STATUS_CONFIG = {
  pendente: { label: "Pendente", icon: Clock, class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  aprovado: { label: "Aprovado", icon: CheckCircle2, class: "bg-green-100 text-green-700 border-green-200" },
  negado: { label: "Negado", icon: XCircle, class: "bg-red-100 text-red-700 border-red-200" },
};

function InscricaoTable({
  rows, emptyMsg, onView, onApprove, onDeny, compact = false,
}: {
  rows: InscricaoRow[];
  emptyMsg: string;
  onView: (i: InscricaoRow) => void;
  onApprove?: (i: InscricaoRow) => void;
  onDeny?: (i: InscricaoRow) => void;
  compact?: boolean;
}) {
  if (rows.length === 0) return emptyMsg ? <div className="py-16 text-center text-muted-foreground">{emptyMsg}</div> : null;
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50/50 dark:bg-slate-800/50 text-muted-foreground text-xs uppercase tracking-wide">
                <th className="text-left py-3 px-4">Aluno</th>
                {!compact && <th className="text-left py-3 px-4 hidden md:table-cell">Matrícula</th>}
                {!compact && <th className="text-left py-3 px-4">Modalidade</th>}
                <th className="text-left py-3 px-4 hidden lg:table-cell">Data</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((insc) => {
                const statusCfg = STATUS_CONFIG[insc.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pendente;
                const StatusIcon = statusCfg.icon;
                return (
                  <tr key={insc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium">{insc.full_name}</p>
                      <p className="text-xs text-muted-foreground">{insc.email}</p>
                    </td>
                    {!compact && <td className="py-3 px-4 hidden md:table-cell text-muted-foreground font-mono text-xs">{insc.matricula}</td>}
                    {!compact && (
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${SPORT_COLORS[insc.sport] ?? ""}`}>{insc.sport}</span>
                      </td>
                    )}
                    <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">{new Date(insc.created_at).toLocaleDateString("pt-BR")}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusCfg.class}`}>
                        <StatusIcon className="size-3" />{statusCfg.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => onView(insc)}><Eye className="size-4" /></Button>
                        {onApprove && insc.status !== "aprovado" && (
                          <Button variant="ghost" size="icon" className="size-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => onApprove(insc)}><CheckCircle2 className="size-4" /></Button>
                        )}
                        {onDeny && insc.status !== "negado" && (
                          <Button variant="ghost" size="icon" className="size-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onDeny(insc)}><XCircle className="size-4" /></Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) { root.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else { root.classList.remove("dark"); localStorage.setItem("theme", "light"); }
  }, [darkMode]);
  const [inscriptions, setInscriptions] = useState<InscricaoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<InscricaoRow | null>(null);
  const [dashboardTab, setDashboardTab] = useState<"pendentes" | "aprovadas" | "negadas" | "arquivo">("pendentes");
  const [filterSport, setFilterSport] = useState("todos");
  const [search, setSearch] = useState("");

  const [denyTarget, setDenyTarget] = useState<InscricaoRow | null>(null);
  const [denyReason, setDenyReason] = useState("");
  const [denyError, setDenyError] = useState("");
  const [denyLoading, setDenyLoading] = useState(false);

  const [approveTarget, setApproveTarget] = useState<InscricaoRow | null>(null);
  const [approveLoading, setApproveLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("adminUser");
    if (!stored) { navigate("/admin"); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const fetchInscriptions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inscricoes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setInscriptions(data as InscricaoRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchInscriptions(); }, [fetchInscriptions]);

  useEffect(() => {
    const channel = supabase
      .channel("inscricoes-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "inscricoes" },
        (payload) => {
          setInscriptions((prev) => [payload.new as InscricaoRow, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "inscricoes" },
        (payload) => {
          setInscriptions((prev) =>
            prev.map((i) => i.id === (payload.new as InscricaoRow).id ? payload.new as InscricaoRow : i)
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminUser");
    navigate("/admin");
  };

  const handleApprove = async (insc: InscricaoRow) => {
    setApproveLoading(true);
    const { error } = await supabase
      .from("inscricoes")
      .update({ status: "aprovado", denied_by_name: null, denied_by_role: null, denied_by_sport: null, denied_reason: null })
      .eq("id", insc.id);
    if (!error) {
      setInscriptions((prev) => prev.map((i) => i.id === insc.id ? { ...i, status: "aprovado", denied_by_name: null, denied_by_role: null, denied_by_sport: null, denied_reason: null } : i));
      setSelected((prev) => prev?.id === insc.id ? { ...prev, status: "aprovado", denied_by_name: null, denied_by_role: null, denied_by_sport: null, denied_reason: null } : prev);
      sendStatusEmail({ to: insc.email, studentName: insc.full_name, sport: insc.sport, status: "aprovado" });
    }
    setApproveLoading(false);
    setApproveTarget(null);
  };

  const handleDenyConfirm = async () => {
    if (!denyReason.trim()) { setDenyError("Informe o motivo da negação."); return; }
    if (!user || !denyTarget) return;
    setDenyLoading(true);
    const updates = {
      status: "negado",
      denied_by_name: user.name,
      denied_by_role: user.role,
      denied_by_sport: user.sport ?? null,
      denied_reason: denyReason.trim(),
    };
    const { error } = await supabase.from("inscricoes").update(updates).eq("id", denyTarget.id);
    if (!error) {
      const updated = { ...denyTarget, ...updates } as InscricaoRow;
      setInscriptions((prev) => prev.map((i) => i.id === denyTarget.id ? updated : i));
      setSelected((prev) => prev?.id === denyTarget.id ? updated : prev);
      sendStatusEmail({
        to: denyTarget.email,
        studentName: denyTarget.full_name,
        sport: denyTarget.sport,
        status: "negado",
        reason: denyReason.trim(),
        deniedByName: user.name,
        deniedByRole: user.role,
        deniedBySport: user.sport,
      });
    }
    setDenyLoading(false);
    setDenyTarget(null);
    setDenyReason("");
    setDenyError("");
  };

  const openDeny = (insc: InscricaoRow) => {
    setDenyTarget(insc);
    setDenyReason("");
    setDenyError("");
  };

  if (!user) return null;

  const ONE_MONTH_AGO = new Date();
  ONE_MONTH_AGO.setMonth(ONE_MONTH_AGO.getMonth() - 1);

  const baseFilter = (i: InscricaoRow) => {
    if (user.role === "professor" && !i.sport.startsWith(user.sport ?? "")) return false;
    if (filterSport !== "todos" && i.sport !== filterSport) return false;
    if (search && !i.full_name.toLowerCase().includes(search.toLowerCase()) && !i.email.toLowerCase().includes(search.toLowerCase()) && !i.matricula.includes(search)) return false;
    return true;
  };

  const isOld = (i: InscricaoRow) => new Date(i.created_at) < ONE_MONTH_AGO;

  const pendentes = inscriptions.filter((i) => i.status === "pendente" && !isOld(i) && baseFilter(i));
  const aprovadas = inscriptions.filter((i) => i.status === "aprovado" && baseFilter(i));
  const negadas = inscriptions.filter((i) => i.status === "negado" && baseFilter(i));
  const arquivadas = inscriptions.filter((i) => i.status === "pendente" && isOld(i) && baseFilter(i));

  const sports = ["Futsal", "Vôlei de Quadra", "Vôlei de Areia", "Judô", "Capoeira"];

  const groupBySport = (list: InscricaoRow[]) => {
    return sports.reduce<Record<string, InscricaoRow[]>>((acc, sport) => {
      const items = list.filter((i) => i.sport === sport);
      if (items.length > 0) acc[sport] = items;
      return acc;
    }, {});
  };

  const syncedSelected = selected ? inscriptions.find((i) => i.id === selected.id) ?? null : null;

  const TAB_CONFIG = [
    { id: "pendentes" as const, label: "Pendentes", icon: Clock, count: pendentes.length, activeBg: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    { id: "aprovadas" as const, label: "Aprovadas", icon: CheckCircle2, count: aprovadas.length, activeBg: "bg-green-50 border-green-200 text-green-700" },
    { id: "negadas" as const, label: "Negadas", icon: Ban, count: negadas.length, activeBg: "bg-red-50 border-red-200 text-red-700" },
    { id: "arquivo" as const, label: "Arquivo (+1 mês)", icon: Archive, count: arquivadas.length, activeBg: "bg-slate-100 border-slate-300 text-slate-700" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Topbar */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <ShieldCheck className="size-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">EECCAM — Admin</p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">
                {user.role === "secretario" ? "Gestão" : `Professor — ${user.sport}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-green-500"></span>
              </span>
              <span className="hidden sm:inline">Tempo real</span>
            </div>
            <Button variant="ghost" size="icon" className="size-8" title="Atualizar" onClick={fetchInscriptions}>
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="size-8" title={darkMode ? "Modo claro" : "Modo escuro"} onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5 capitalize">{user.role}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="size-4" />
              <span className="hidden md:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Inscrições</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user.role === "secretario"
              ? "Visualize e gerencie todas as inscrições do processo seletivo"
              : `Inscrições da modalidade ${user.sport}`}
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TAB_CONFIG.map(({ id, label, icon: Icon, count, activeBg }) => (
            <button
              key={id}
              onClick={() => setDashboardTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                dashboardTab === id ? activeBg : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <Icon className="size-4" />
              {label}
              <span className={`inline-flex items-center justify-center size-5 rounded-full text-xs font-bold ${
                dashboardTab === id ? "bg-white/60" : "bg-slate-100 dark:bg-slate-600"
              }`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Search + Sport filter */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome, matrícula ou e-mail..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              {user.role === "secretario" && (
                <Select value={filterSport} onValueChange={setFilterSport}>
                  <SelectTrigger className="w-44">
                    <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas modalidades</SelectItem>
                    {sports.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" /> Carregando inscrições...
          </div>
        ) : (
          <>
            {/* ── PENDENTES ── */}
            {dashboardTab === "pendentes" && (
              <InscricaoTable
                rows={pendentes}
                emptyMsg="Nenhuma inscrição pendente."
                onView={setSelected}
                onApprove={setApproveTarget}
                onDeny={openDeny}
              />
            )}

            {/* ── APROVADAS ── */}
            {dashboardTab === "aprovadas" && (
              <InscricaoTable
                rows={aprovadas}
                emptyMsg="Nenhuma inscrição aprovada ainda."
                onView={setSelected}
                onDeny={openDeny}
              />
            )}

            {/* ── NEGADAS ── */}
            {dashboardTab === "negadas" && (
              negadas.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">Nenhuma inscrição negada recentemente.</div>
              ) : (
                <div className="space-y-3">
                  {negadas.map((insc) => (
                    <Card key={insc.id} className="border-red-100 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-semibold">{insc.full_name}</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${SPORT_COLORS[insc.sport] ?? ""}`}>{insc.sport}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{insc.email} · Matrícula: {insc.matricula}</p>
                            <p className="text-xs text-muted-foreground">Inscrito em: {new Date(insc.created_at).toLocaleDateString("pt-BR")}</p>
                            {insc.denied_by_name && (
                              <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded border border-red-200 dark:border-red-800 text-xs">
                                <p className="font-semibold text-red-800 dark:text-red-300 mb-0.5">
                                  Negado por: {insc.denied_by_name} ({ROLE_LABEL[insc.denied_by_role ?? ""] ?? insc.denied_by_role}{insc.denied_by_sport ? ` — ${insc.denied_by_sport}` : ""})
                                </p>
                                <p className="text-red-700 dark:text-red-400">{insc.denied_reason}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="size-8" onClick={() => setSelected(insc)}><Eye className="size-4" /></Button>
                            <Button variant="ghost" size="icon" className="size-8 text-green-600 hover:bg-green-50" onClick={() => setApproveTarget(insc)}><CheckCircle2 className="size-4" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            )}

            {/* ── ARQUIVO (pendentes > 1 mês sem resposta) ── */}
            {dashboardTab === "arquivo" && (
              arquivadas.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">
                  <Archive className="size-10 mx-auto mb-3 text-slate-300" />
                  <p>Nenhuma inscrição sem resposta há mais de 1 mês.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium">
                    <Archive className="size-4" />
                    Inscrições pendentes sem resposta há mais de 1 mês — {arquivadas.length} no total
                  </div>
                  {Object.entries(groupBySport(arquivadas)).map(([sport, items]) => (
                    <div key={sport}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${SPORT_COLORS[sport] ?? ""}`}>{sport}</span>
                        <span className="text-xs text-muted-foreground">{items.length} aluno(s) sem resposta</span>
                      </div>
                      <InscricaoTable
                        rows={items}
                        emptyMsg=""
                        onView={setSelected}
                        onApprove={setApproveTarget}
                        onDeny={openDeny}
                        compact
                      />
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {syncedSelected && (
        <Dialog open={!!syncedSelected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{syncedSelected.full_name}</DialogTitle>
              <DialogDescription>Detalhes da inscrição</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="flex gap-2 flex-wrap">
                {(() => { const cfg = STATUS_CONFIG[syncedSelected.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pendente; const Icon = cfg.icon; return (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.class}`}>
                    <Icon className="size-3" />{cfg.label}
                  </span>
                ); })()}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${SPORT_COLORS[syncedSelected.sport] ?? ""}`}>{syncedSelected.sport}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Matrícula", value: syncedSelected.matricula },
                  { label: "E-mail", value: syncedSelected.email },
                  { label: "Experiência", value: syncedSelected.experience ?? "—" },
                  { label: "Inscrição em", value: new Date(syncedSelected.created_at).toLocaleDateString("pt-BR") },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
              {syncedSelected.status === "negado" && syncedSelected.denied_by_name && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900 space-y-2">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold text-xs uppercase tracking-wide">
                    <AlertTriangle className="size-3.5" /> Inscrição Negada
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Negado por</p>
                      <p className="font-semibold text-red-900 dark:text-red-200">{syncedSelected.denied_by_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Perfil</p>
                      <p className="font-semibold text-red-900 dark:text-red-200">
                        {ROLE_LABEL[syncedSelected.denied_by_role ?? ""] ?? syncedSelected.denied_by_role}
                        {syncedSelected.denied_by_sport ? ` — ${syncedSelected.denied_by_sport}` : ""}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Motivo</p>
                    <p className="text-sm text-red-900 dark:text-red-200 leading-relaxed">{syncedSelected.denied_reason}</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="gap-2 mt-2">
              {syncedSelected.status !== "aprovado" && (
                <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={() => { setApproveTarget(syncedSelected); setSelected(null); }}>
                  <CheckCircle2 className="size-4" /> Aprovar
                </Button>
              )}
              {syncedSelected.status !== "negado" && (
                <Button variant="destructive" className="gap-2" onClick={() => { openDeny(syncedSelected); setSelected(null); }}>
                  <XCircle className="size-4" /> Negar
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelected(null)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Approve Confirm Modal */}
      {approveTarget && (
        <Dialog open={!!approveTarget} onOpenChange={() => setApproveTarget(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Aprovar inscrição?</DialogTitle>
              <DialogDescription>
                Você está prestes a <strong>aprovar</strong> a inscrição de{" "}
                <strong>{approveTarget.full_name}</strong> para <strong>{approveTarget.sport}</strong>.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button className="bg-green-600 hover:bg-green-700 gap-2" disabled={approveLoading} onClick={() => handleApprove(approveTarget)}>
                {approveLoading ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                Confirmar Aprovação
              </Button>
              <Button variant="outline" onClick={() => setApproveTarget(null)}>Cancelar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Deny Modal */}
      {denyTarget && (
        <Dialog open={!!denyTarget} onOpenChange={() => { setDenyTarget(null); setDenyReason(""); setDenyError(""); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Negar inscrição</DialogTitle>
              <DialogDescription>
                Informe o motivo da negação de <strong>{denyTarget.full_name}</strong> para{" "}
                <strong>{denyTarget.sport}</strong>. O feedback ficará registrado.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label htmlFor="denyReason">Motivo *</Label>
                <textarea
                  id="denyReason"
                  rows={4}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="Ex: Candidato não atende os requisitos mínimos para a modalidade..."
                  value={denyReason}
                  onChange={(e) => { setDenyReason(e.target.value); if (denyError) setDenyError(""); }}
                />
                {denyError && <p className="text-xs text-red-600 mt-1">{denyError}</p>}
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-600 text-xs text-muted-foreground">
                <p className="font-medium text-slate-600 mb-1">Registrado como:</p>
                <p><span className="font-semibold">{user?.name}</span> — {user ? ROLE_LABEL[user.role] : ""}{user?.sport ? ` / ${user.sport}` : ""}</p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="destructive" className="gap-2" disabled={denyLoading} onClick={handleDenyConfirm}>
                {denyLoading ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
                Confirmar Negação
              </Button>
              <Button variant="outline" onClick={() => { setDenyTarget(null); setDenyReason(""); setDenyError(""); }}>Cancelar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
