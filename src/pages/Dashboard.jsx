import { Users, UserCheck, Clock, UserX, TrendingUp, FileText, CalendarCheck, CalendarX, Timer, Home } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { CandidateTable } from "@/components/CandidateTable";
import { candidates } from "@/data/mockData";
import { motion } from "framer-motion";
import { useState } from "react";

// ─── Attendance Mock Data ─────────────────────────────────────────────────────
const today = new Date();
const fmt = (d) => d.toISOString().split("T")[0];

const ATTENDANCE_EMPLOYEES = [
  { id: 1, name: "Kartik Iyer",   role: "Engineer",        avatar: "AK", dept: "Engineering" },
  { id: 2, name: "Rachit Verma",   role: "HR Executive",    avatar: "BA", dept: "HR" },
  { id: 3, name: "Sara Malik",    role: "Designer",        avatar: "SM", dept: "Design" },
  { id: 4, name: "Jatin Thakre", role: "Sales Manager",   avatar: "UF", dept: "Sales" },
  { id: 5, name: "Harshit Mishra",    role: "Finance Analyst", avatar: "HB", dept: "Finance" },
  { id: 6, name: "Siddhant Dubey",    role: "DevOps Eng.",     avatar: "ZR", dept: "Engineering" },
  { id: 7, name: "Chiranjiv Kuhikar",  role: "Recruiter",       avatar: "FN", dept: "HR" },
  { id: 8, name: "Hassan Ali",   role: "Backend Dev",     avatar: "HA", dept: "Engineering" },
];

const STATUS_CFG = {
  present: { label: "Present",  dot: "bg-success",     badge: "bg-success/10 text-success border-success/20" },
  absent:  { label: "Absent",   dot: "bg-destructive", badge: "bg-destructive/10 text-destructive border-destructive/20" },
  late:    { label: "Late",     dot: "bg-warning",     badge: "bg-warning/10 text-warning border-warning/20" },
  leave:   { label: "On Leave", dot: "bg-info",        badge: "bg-info/10 text-info border-info/20" },
  wfh:     { label: "WFH",      dot: "bg-primary",     badge: "bg-primary/10 text-primary border-primary/20" },
};

const LAST7 = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (6 - i));
  return { date: fmt(d), label: d.toLocaleDateString("en-US", { weekday: "short" }), day: d.getDate() };
});

const ALL_STATUSES = ["present","present","present","late","absent","wfh","leave"];
const generateRecords = () => {
  const r = {};
  ATTENDANCE_EMPLOYEES.forEach((emp) => {
    r[emp.id] = {};
    LAST7.forEach(({ date }) => {
      r[emp.id][date] = ALL_STATUSES[Math.floor(Math.random() * ALL_STATUSES.length)];
    });
    r[emp.id][fmt(today)] = ["present","present","present","late","wfh"][emp.id % 5];
  });
  return r;
};

const AVATAR_COLORS = [
  "bg-primary/10 text-primary", "bg-success/10 text-success",
  "bg-warning/10 text-warning", "bg-destructive/10 text-destructive",
  "bg-info/10 text-info",        "bg-purple-500/10 text-purple-600",
  "bg-teal-500/10 text-teal-600","bg-orange-500/10 text-orange-600",
];

// ─── Small helpers ─────────────────────────────────────────────────────────────
function Avatar({ initials, index }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${c.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function WeekDots({ empId, records }) {
  return (
    <div className="flex gap-1 items-center">
      {LAST7.map(({ date, label }) => {
        const s = records[empId]?.[date] || "absent";
        return (
          <div key={date} title={`${label}: ${STATUS_CFG[s].label}`}
            className={`w-2 h-2 rounded-full ${STATUS_CFG[s].dot} opacity-80`} />
        );
      })}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const [attendanceRecords, setAttendanceRecords] = useState(() => generateRecords());
  const [attFilter, setAttFilter] = useState("all");
  const [attSearch, setAttSearch] = useState("");
  const [activeDay, setActiveDay] = useState(fmt(today));

  // Pipeline stats
  const stats = [
    {
      title: "Total Candidates",
      value: candidates.length,
      change: "+12% from last month",
      changeType: "positive",
      icon: Users,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      title: "Onboarded",
      value: candidates.filter((c) => c.status === "onboarded").length,
      change: "+3 this month",
      changeType: "positive",
      icon: UserCheck,
      iconBg: "bg-success/10 text-success",
    },
    {
      title: "In Progress",
      value: candidates.filter((c) => ["applied", "interviewed", "offered"].includes(c.status)).length,
      change: "5 pending review",
      changeType: "neutral",
      icon: Clock,
      iconBg: "bg-warning/10 text-warning",
    },
    {
      title: "Rejected",
      value: candidates.filter((c) => c.status === "rejected").length,
      icon: UserX,
      iconBg: "bg-destructive/10 text-destructive",
    },
  ];

  const recentCandidates = [...candidates]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  // Attendance stats for selected day
  const dayStats = ATTENDANCE_EMPLOYEES.reduce((acc, emp) => {
    const s = attendanceRecords[emp.id]?.[activeDay] || "absent";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const attStats = [
    { label: "Present", value: dayStats.present || 0, icon: CalendarCheck, iconBg: "bg-success/10 text-success" },
    { label: "Late",    value: dayStats.late    || 0, icon: Timer,         iconBg: "bg-warning/10 text-warning" },
    { label: "Absent",  value: dayStats.absent  || 0, icon: CalendarX,    iconBg: "bg-destructive/10 text-destructive" },
    { label: "WFH / Leave", value: (dayStats.wfh || 0) + (dayStats.leave || 0), icon: Home, iconBg: "bg-primary/10 text-primary" },
  ];

  // Filtered employee list
  const filteredEmps = ATTENDANCE_EMPLOYEES.filter((emp) => {
    const s = attendanceRecords[emp.id]?.[activeDay] || "absent";
    return (
      (attFilter === "all" || s === attFilter) &&
      (emp.name.toLowerCase().includes(attSearch.toLowerCase()) ||
       emp.dept.toLowerCase().includes(attSearch.toLowerCase()))
    );
  });

  const markStatus = (empId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [empId]: { ...prev[empId], [activeDay]: status },
    }));
  };

  return (
    <div className="page-container">

      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Welcome back! Here's an overview of your HR pipeline.</p>
      </motion.div>

      {/* ── Pipeline Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Recent Candidates ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Candidates</h2>
          <a href="/candidates" className="text-sm text-primary font-medium hover:underline">View all →</a>
        </div>
        <CandidateTable candidates={recentCandidates} />
      </motion.div>

      {/* ── Pipeline + Quick Actions ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass-card rounded-xl p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Pipeline by Status
          </h3>
          <div className="space-y-3">
            {[
              { label: "Applied",     count: candidates.filter(c => c.status === "applied").length,     color: "bg-info" },
              { label: "Interviewed", count: candidates.filter(c => c.status === "interviewed").length, color: "bg-warning" },
              { label: "Offered",     count: candidates.filter(c => c.status === "offered").length,     color: "bg-primary" },
              { label: "Onboarded",   count: candidates.filter(c => c.status === "onboarded").length,   color: "bg-success" },
              { label: "Rejected",    count: candidates.filter(c => c.status === "rejected").length,    color: "bg-destructive" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-24">{item.label}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${(item.count / candidates.length) * 100}%` }} />
                </div>
                <span className="text-xs font-medium w-6 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="glass-card rounded-xl p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Candidate", href: "/candidates" },
              { label: "Generate Offer", href: "/offer-letters" },
              { label: "Export CSV", href: "#" },
              { label: "View Reports", href: "#" },
            ].map((action) => (
              <a key={action.label} href={action.href}
                className="flex items-center justify-center rounded-lg border border-border bg-card p-3 text-sm font-medium transition-colors hover:bg-muted hover:border-primary/20">
                {action.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          ATTENDANCE SECTION
      ════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
        className="space-y-4"
      >
        {/* Attendance Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Attendance
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button className="text-sm text-primary font-medium hover:underline">
            Export Report →
          </button>
        </div>

        {/* Attendance Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {attStats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.07 }}
              className="glass-card rounded-xl p-4 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Day Selector */}
        <div className="glass-card rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Day</p>
          <div className="grid grid-cols-7 gap-2">
            {LAST7.map(({ date, label, day }) => {
              const isActive = date === activeDay;
              const isToday  = date === fmt(today);
              const presentCount = ATTENDANCE_EMPLOYEES.filter(
                (e) => attendanceRecords[e.id]?.[date] === "present"
              ).length;
              return (
                <button key={date} onClick={() => setActiveDay(date)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-center transition-all
                    ${isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card border-border hover:border-primary/30 hover:bg-muted"
                    }`}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</span>
                  <span className={`text-sm font-bold ${isToday && !isActive ? "text-primary" : ""}`}>{day}</span>
                  <span className={`text-[9px] font-medium ${isActive ? "text-primary-foreground/70" : "text-success"}`}>
                    {presentCount}P
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={attSearch} onChange={(e) => setAttSearch(e.target.value)}
              placeholder="Search employee or department…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 bg-card transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", ...Object.keys(STATUS_CFG)].map((f) => (
              <button key={f} onClick={() => setAttFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize
                  ${attFilter === f
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:bg-muted"
                  }`}>
                {f === "all" ? "All" : STATUS_CFG[f].label}
              </button>
            ))}
          </div>
        </div>

        {/* Attendance Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Employee", "Department", "Status", "7-Day", "Check In", "Mark"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                      No employees match your filter
                    </td>
                  </tr>
                ) : filteredEmps.map((emp, i) => {
                  const status = attendanceRecords[emp.id]?.[activeDay] || "absent";
                  const checkIn = { present: "09:02 AM", late: "10:18 AM", wfh: "09:30 AM", absent: "—", leave: "—" }[status];
                  return (
                    <motion.tr key={emp.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Employee */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar initials={emp.avatar} index={i} />
                          <div>
                            <p className="text-sm font-semibold">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{emp.role}</p>
                          </div>
                        </div>
                      </td>
                      {/* Dept */}
                      <td className="px-4 py-3 text-sm text-muted-foreground">{emp.dept}</td>
                      {/* Status */}
                      <td className="px-4 py-3"><StatusBadge status={status} /></td>
                      {/* 7-day dots */}
                      <td className="px-4 py-3"><WeekDots empId={emp.id} records={attendanceRecords} /></td>
                      {/* Check in */}
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{checkIn}</td>
                      {/* Mark buttons */}
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                            <button key={key} onClick={() => markStatus(emp.id, key)} title={cfg.label}
                              className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-110
                                ${status === key ? `${cfg.dot} border-transparent` : "bg-card border-border hover:border-primary/40"}`}>
                              {status === key && <span className="block w-1.5 h-1.5 rounded-full bg-white/80 mx-auto" />}
                            </button>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredEmps.length}</span> of {ATTENDANCE_EMPLOYEES.length} employees
            </p>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                <span key={key} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />{cfg.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      {/* ── End Attendance ── */}

    </div>
  );
};

export default Dashboard;
