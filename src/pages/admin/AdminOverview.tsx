import { useEffect, useState } from "react";
import { turso } from "@/lib/db";
import { CalendarDays, DollarSign, Users, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface KPI {
  todayAppointments: number;
  weekRevenue: number;
  newClients: number;
  pendingConfirmations: number;
}

interface TodayAppointment {
  id: string;
  start_time: string;
  client_name: string;
  service_name: string;
  status: string;
}

const CHART_COLORS = ["hsl(140, 25%, 45%)", "hsl(140, 30%, 35%)", "hsl(140, 20%, 60%)", "hsl(120, 10%, 30%)"];

const AdminOverview = () => {
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<TodayAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const [aptsToday, aptsWeek, pending, todayApts] = await Promise.all([
      turso.execute("SELECT COUNT(*) as count FROM appointments WHERE appointment_date = ?", [today]),
      turso.execute("SELECT total_price FROM appointments WHERE appointment_date >= ? AND status IN ('confirmed', 'completed')", [weekAgo]),
      turso.execute("SELECT COUNT(*) as count FROM appointments WHERE status = ?", ["pending"]),
      turso.execute(
        `SELECT a.id, a.start_time, a.client_name, a.status,
                COALESCE(s.name, '') as service_name
         FROM appointments a
         LEFT JOIN services s ON a.service_id = s.id
         WHERE a.appointment_date = ?
         ORDER BY a.start_time`,
        [today]
      ),
    ]);

    const weekRevenue = (aptsWeek.rows as any[]).reduce((sum: number, a: any) => sum + (a.total_price || 0), 0);

    setKpis({
      todayAppointments: (aptsToday.rows[0] as any)?.count ?? 0,
      weekRevenue,
      newClients: 0,
      pendingConfirmations: (pending.rows[0] as any)?.count ?? 0,
    });

    setTodaySchedule(
      (todayApts.rows as any[]).map((a: any) => ({
        id: a.id,
        start_time: a.start_time,
        client_name: a.client_name,
        service_name: a.service_name || "Unknown",
        status: a.status,
      }))
    );

    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await turso.execute("UPDATE appointments SET status = ? WHERE id = ?", [status, id]);
    fetchData();
  };

  // Placeholder chart data
  const revenueData = Array.from({ length: 7 }, (_, i) => ({
    day: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString("en", { weekday: "short" }),
    revenue: Math.floor(Math.random() * 800 + 200),
  }));

  const serviceData = [
    { name: "Massages", value: 42 },
    { name: "Hammams", value: 25 },
    { name: "Packs", value: 20 },
  ];

  const kpiCards = kpis
    ? [
        { label: "Rendez-vous Aujourd'hui", value: kpis.todayAppointments, icon: CalendarDays },
        { label: "Revenus (Semaine)", value: `${kpis.weekRevenue.toFixed(0)} DH`, icon: DollarSign },
        { label: "Nouveaux Clients", value: kpis.newClients, icon: Users },
        { label: "En Attente", value: kpis.pendingConfirmations, icon: Clock },
      ]
    : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">Vue d'Ensemble du <span className="italic">Tableau de Bord</span></h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="border border-border rounded-sm p-5 bg-background">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">{kpi.label}</span>
              <kpi.icon size={18} className="text-primary" />
            </div>
            <p className="font-display text-3xl">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border rounded-sm p-5">
          <h3 className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">Revenus (7 Derniers Jours)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(45, 15%, 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="hsl(140, 25%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-border rounded-sm p-5">
          <h3 className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">Services les Plus Populaires</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={serviceData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {serviceData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="border border-border rounded-sm p-5">
        <h3 className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">Planning d'Aujourd'hui</h3>
        {todaySchedule.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground italic">Aucun rendez-vous prévu pour aujourd'hui.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-body text-xs uppercase tracking-[0.1em] text-muted-foreground py-3 px-2">Heure</th>
                  <th className="text-left font-body text-xs uppercase tracking-[0.1em] text-muted-foreground py-3 px-2">Client</th>
                  <th className="text-left font-body text-xs uppercase tracking-[0.1em] text-muted-foreground py-3 px-2">Service</th>
                  <th className="text-left font-body text-xs uppercase tracking-[0.1em] text-muted-foreground py-3 px-2">Statut</th>
                  <th className="text-left font-body text-xs uppercase tracking-[0.1em] text-muted-foreground py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todaySchedule.map((apt) => (
                  <tr key={apt.id} className="border-b border-border/50">
                    <td className="py-3 px-2 font-body text-sm">{apt.start_time.slice(0, 5)}</td>
                    <td className="py-3 px-2 font-body text-sm">{apt.client_name}</td>
                    <td className="py-3 px-2 font-body text-sm">{apt.service_name}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-body capitalize ${
                        apt.status === "completed" ? "bg-primary/15 text-primary" :
                        apt.status === "pending" ? "bg-accent/20 text-accent-foreground" :
                        apt.status === "no-show" ? "bg-destructive/15 text-destructive" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        {apt.status === "pending" && (
                          <button onClick={() => updateStatus(apt.id, "confirmed")} className="text-xs font-body text-primary hover:underline">Confirmer</button>
                        )}
                        {(apt.status === "pending" || apt.status === "confirmed") && (
                          <>
                            <button onClick={() => updateStatus(apt.id, "completed")} className="text-xs font-body text-green-600 hover:underline ml-2">Terminer</button>
                            <button onClick={() => updateStatus(apt.id, "no-show")} className="text-xs font-body text-destructive hover:underline ml-2">Absent</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
