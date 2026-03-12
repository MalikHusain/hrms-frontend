import { useState } from "react";

// ─── Sample Data ──────────────────────────────────────────────────────────────
const today = new Date();
const fmt = (d) => d.toISOString().split("T")[0];

const EMPLOYEES = [
  { id: 1, name: "Kartik Iyer",    role: "Engineer",       avatar: "AK", dept: "Engineering" },
  { id: 2, name: "Rachit Verma",   role: "HR Executive",   avatar: "BA", dept: "HR" },
  { id: 3, name: "Sara Malik",     role: "Designer",       avatar: "SM", dept: "Design" },
  { id: 4, name: "Jatin Thakre",   role: "Sales Manager",  avatar: "UF", dept: "Sales" },
  { id: 5, name: "Harshit Mishra",  role: "Finance Analyst",avatar: "HB", dept: "Finance" },
  { id: 6, name: "Siddhant Dubey",   role: "DevOps Eng.",    avatar: "ZR", dept: "Engineering" },
  { id: 7, name: "Chiranjiv Kuhikar",role: "Recruiter",      avatar: "FN", dept: "HR" },
  { id: 8, name: "Hassan Ali",     role: "Backend Dev",    avatar: "HA", dept: "Engineering" },
];

const STATUS_CONFIG = {
  present:  { label: "Present",   color: "bg-emerald-500/15 text-emerald-600 border-emerald-200",  dot: "bg-emerald-500",  bar: "bg-emerald-500" },
  absent:   { label: "Absent",    color: "bg-red-500/10 text-red-600 border-red-200",              dot: "bg-red-500",      bar: "bg-red-500" },
  late:     { label: "Late",      color: "bg-amber-500/10 text-amber-600 border-amber-200",        dot: "bg-amber-400",    bar: "bg-amber-400" },
  leave:    { label: "On Leave",  color: "bg-blue-500/10 text-blue-600 border-blue-200",           dot: "bg-blue-400",     bar: "bg-blue-400" },
  wfh:      { label: "WFH",       color: "bg-purple-500/10 text-purple-600 border-purple-200",     dot: "bg-purple-400",   bar: "bg-purple-400" },
};

// Generate mock attendance for last 7 days
const STATUSES = ["present","present","present","late","absent","wfh","leave"];
const generateRecords = () => {
  const records = {};
  EMPLOYEES.forEach(emp => {
    records[emp.id] = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = fmt(d);
      records[emp.id][key] = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    }
    // Today's status fixed
    records[emp.id][fmt(today)] = ["present","present","present","late","wfh"][emp.id % 5];
  });
  return records;
};

const INITIAL_RECORDS = generateRecords();

// Last 7 days array
const LAST7 = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (6 - i));
  return { date: fmt(d), label: d.toLocaleDateString("en-US", { weekday: "short" }), day: d.getDate() };
});

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS = {
  clock:    "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 5v5l3 3",
  users:    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8 0a3 3 0 11-6 0 3 3 0 016 0M23 21v-2a4 4 0 00-3-3.87",
  check:    "M20 6L9 17l-5-5",
  x:        "M18 6L6 18M6 6l12 12",
  calendar: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  filter:   "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  trend:    "M23 6l-9.5 9.5-5-5L1 18",
  badge:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`rounded-2xl border p-5 flex items-start gap-4 bg-white shadow-sm hover:shadow-md transition-shadow`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon d={icon} size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none mb-1">{value}</p>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700","bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700","bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700","bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700","bg-orange-100 text-orange-700",
];
function Avatar({ initials, index, size = "w-9 h-9" }) {
  return (
    <div className={`${size} rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
      {initials}
    </div>
  );
}

// ─── Mini Calendar Dots ───────────────────────────────────────────────────────
function WeekDots({ empId, records }) {
  return (
    <div className="flex gap-1">
      {LAST7.map(({ date, label }) => {
        const s = records[empId]?.[date] || "absent";
        const cfg = STATUS_CONFIG[s];
        return (
          <div key={date} className="flex flex-col items-center gap-1" title={`${label}: ${cfg.label}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.bar}`} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Donut Chart (SVG) ────────────────────────────────────────────────────────
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 40, cx = 50, cy = 50, stroke = 12;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={100} height={100} viewBox="0 0 100 100">
        {data.map((seg, i) => {
          const pct = seg.value / total;
          const dash = pct * circumference;
          const gap  = circumference - dash;
          const rotate = offset * 360 - 90;
          offset += pct;
          return (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeLinecap="round"
              style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "50% 50%", transition: "all 0.5s ease" }}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
      </svg>
      <div className="absolute text-center">
        <p className="text-lg font-bold text-slate-800">{total}</p>
        <p className="text-[9px] text-slate-400 font-medium">Total</p>
      </div>
    </div>
  );
}

// ─── Main Attendance Section ──────────────────────────────────────────────────
export default function AttendanceSection() {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [activeDay, setActiveDay] = useState(fmt(today));

  // Compute today's stats
  const todayStats = EMPLOYEES.reduce((acc, emp) => {
    const s = records[emp.id]?.[fmt(today)] || "absent";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const present = todayStats.present || 0;
  const absent  = todayStats.absent  || 0;
  const late    = todayStats.late    || 0;
  const leave   = todayStats.leave   || 0;
  const wfh     = todayStats.wfh     || 0;

  const donutData = [
    { label: "Present", value: present, color: "#10b981" },
    { label: "WFH",     value: wfh,     color: "#a855f7" },
    { label: "Late",    value: late,    color: "#f59e0b" },
    { label: "Leave",   value: leave,   color: "#3b82f6" },
    { label: "Absent",  value: absent,  color: "#ef4444" },
  ].filter(d => d.value > 0);

  // Filter employees
  const filtered = EMPLOYEES.filter(emp => {
    const s = records[emp.id]?.[activeDay] || "absent";
    const matchFilter = filter === "all" || s === filter;
    const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
                        emp.dept.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Mark attendance
  const markStatus = (empId, status) => {
    setRecords(prev => ({
      ...prev,
      [empId]: { ...prev[empId], [activeDay]: status },
    }));
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Attendance</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm">
          <Icon d={ICONS.download} size={14} />
          Export Report
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={ICONS.check}  label="Present"  value={present} sub={`${Math.round(present/EMPLOYEES.length*100)}% attendance`} color="bg-emerald-100 text-emerald-600" />
        <StatCard icon={ICONS.clock}  label="Late"     value={late}    sub="Clocked in late"   color="bg-amber-100 text-amber-600" />
        <StatCard icon={ICONS.x}      label="Absent"   value={absent}  sub="Not checked in"   color="bg-red-100 text-red-500" />
        <StatCard icon={ICONS.badge}  label="On Leave" value={leave + wfh} sub={`${leave} leave · ${wfh} WFH`} color="bg-blue-100 text-blue-600" />
      </div>

      {/* ── Week Bar + Donut ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Week selector */}
        <div className="md:col-span-2 bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Select Day</p>
          <div className="grid grid-cols-7 gap-2">
            {LAST7.map(({ date, label, day }) => {
              const isActive = date === activeDay;
              const isToday  = date === fmt(today);
              // Count present for that day
              const cnt = EMPLOYEES.filter(e => records[e.id]?.[date] === "present").length;
              return (
                <button key={date} onClick={() => setActiveDay(date)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all text-center
                    ${isActive
                      ? "bg-slate-800 border-slate-800 text-white shadow-md"
                      : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</span>
                  <span className={`text-base font-bold ${isToday && !isActive ? "text-emerald-600" : ""}`}>{day}</span>
                  <span className={`text-[9px] font-medium ${isActive ? "text-emerald-300" : "text-emerald-600"}`}>{cnt}P</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Donut */}
        <div className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col items-center justify-center gap-4">
          <p className="text-sm font-semibold text-slate-700 self-start">Today's Overview</p>
          <DonutChart data={donutData} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full">
            {donutData.map(d => (
              <div key={d.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-slate-500">{d.label}</span>
                <span className="text-xs font-bold text-slate-700 ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter + Search ── */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search employee or department…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 bg-white" />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", ...Object.keys(STATUS_CONFIG)].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all capitalize
                ${filter === f
                  ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}>
              {f === "all" ? "All" : STATUS_CONFIG[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Attendance Table ── */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Employee</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Department</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">7-Day</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Check In</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400 text-sm">No employees found</td></tr>
              ) : filtered.map((emp, i) => {
                const status = records[emp.id]?.[activeDay] || "absent";
                const checkInTimes = { present: "09:02 AM", late: "10:15 AM", wfh: "09:30 AM", absent: "—", leave: "—" };
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={emp.avatar} index={i} />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-600">{emp.dept}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <WeekDots empId={emp.id} records={records} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-500 font-mono">{checkInTimes[status]}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                          <button key={key} onClick={() => markStatus(emp.id, key)}
                            title={cfg.label}
                            className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center
                              ${status === key ? `${cfg.dot} border-transparent` : "bg-white border-slate-200 hover:border-slate-400"}`}>
                            {status === key && <span className="w-2 h-2 rounded-full bg-white/80" />}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of {EMPLOYEES.length} employees
          </p>
          <div className="flex gap-3">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <span key={key} className="flex items-center gap-1 text-xs text-slate-500">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />{cfg.label}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
