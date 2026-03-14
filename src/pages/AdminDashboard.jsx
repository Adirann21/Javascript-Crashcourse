import { useContext, useEffect, useState, useMemo } from "react";
import PageWrapper, { UserSidebar, BackButton } from "../components/PageWrapper";
import { RegisteredEventsContext } from "../context/RegisteredEventsContext";
// ───────────────────────────────✦. CUSTOM ICONS .✦───────────────────────────────
import {
    Calendar,
    Users,
    Eye,
    EyeOff,
    TrendingUp,
    ImagePlus,
    MoveRight
} from "lucide-react";
import supabase from "../utils/supabase";

const AdminDashboard = () => {
    const { events } = useContext(RegisteredEventsContext);
    const [registrationCounts, setRegistrationCounts] = useState({});
    const [totalRegistrations, setTotalRegistrations] = useState(0);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: regData } = await supabase.from("registrations").select("event_id");
            if (regData) {
                const counts = {};
                regData.forEach(({ event_id }) => { counts[event_id] = (counts[event_id] || 0) + 1; });
                setRegistrationCounts(counts);
                setTotalRegistrations(regData.length);
            }
            const { data: recent } = await supabase
                .from("registrations")
                .select("event_id, created_at, user_id, profiles(firstname, lastname), events(title)")
                .order("created_at", { ascending: false })
                .limit(100);
            if (recent) setRecentActivity(recent);
            setLoading(false);
        };
        fetchData();
    }, []);

    const published = events.filter((e) => e.published).length;
    const drafts = events.filter((e) => !e.published).length;
    const topEvent = useMemo(() => {
        if (!events.length) return null;
        return [...events].sort((a, b) => (registrationCounts[b.id] || 0) - (registrationCounts[a.id] || 0))[0];
    }, [events, registrationCounts]);

    const fmtDate = (d) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
    };
    const timeAgo = (iso) => {
        const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <PageWrapper>
            <div className="flex gap-6 p-4">
                <UserSidebar events={events} />
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
                    <BackButton to="/events" label="Back to Events" />
                    <div>
                        <h1 className="text-2xl font-bold text-base-content tracking-tight">Dashboard</h1>
                        <p className="text-base-content/50 text-sm mt-0.5">Overview of all events and registrations</p>
                    </div>

                    {/* ───────────────────────────────✦. STAT CARDS .✦─────────────────────────────── */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "Total Events", value: events.length, icon: <Calendar size={18} />, color: "text-primary" },
                            { label: "Published", value: published, icon: <Eye size={18} />, color: "text-success" },
                            { label: "Drafts", value: drafts, icon: <EyeOff size={18} />, color: "text-base-content/40" },
                            { label: "Total Registrations", value: totalRegistrations, icon: <Users size={18} />, color: "text-secondary" },
                        ].map((s) => (
                            <div key={s.label} className="card bg-base-200 border border-base-300 shadow-sm">
                                <div className="card-body py-4 px-5 gap-1">
                                    <span className={s.color}>{s.icon}</span>
                                    <p className="text-3xl font-bold text-base-content mt-1">{s.value}</p>
                                    <p className="text-xs text-base-content/50 font-medium">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ───────────────────────────────✦. MOST POPULAR AND REGISTRATION LOG .✦─────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* ───────────────────────────────✦. MOST POPULAR .✦─────────────────────────────── */}
                        <div className="flex flex-col gap-3">
                            <p className="text-xs text-base-content/40 uppercase tracking-widest font-semibold">Most Popular</p>
                            {topEvent ? (
                                <div className="card bg-base-200 border border-base-300 shadow-sm overflow-hidden">
                                    {topEvent.image_url && (
                                        <figure className="h-32 overflow-hidden">
                                            <img src={topEvent.image_url} alt={topEvent.title} className="w-full h-full object-cover" />
                                        </figure>
                                    )}
                                    <div className="card-body p-4 gap-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h2 className="font-bold text-base-content text-sm">{topEvent.title}</h2>
                                            <span className={`badge badge-sm ${topEvent.published ? "badge-success" : "badge-ghost"}`}>
                                                {topEvent.published ? "Live" : "Draft"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-base-content/50">{fmtDate(topEvent.date)} · {topEvent.location}</p>
                                        <div className="flex items-center gap-1.5 mt-2 text-primary">
                                            <Users size={13} />
                                            <span className="text-sm font-bold">{registrationCounts[topEvent.id] || 0}</span>
                                            <span className="text-xs text-base-content/40">registrations</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="card bg-base-200 border border-base-300 border-dashed shadow-sm">
                                    <div className="card-body items-center py-8 text-center">
                                        <TrendingUp size={28} className="text-base-content/15" />
                                        <p className="text-xs text-base-content/40">No events yet</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ───────────────────────────────✦. REGISTRATION LOG .✦─────────────────────────────── */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-base-content/40 uppercase tracking-widest font-semibold">Registration Log</p>
                                {recentActivity.length > 0 && (
                                    <span className="badge badge-sm badge-ghost">{recentActivity.length} total</span>
                                )}
                            </div>
                            <div className="card bg-base-200 border border-base-300 shadow-sm">
                                <div className="card-body p-4 gap-0 max-h-96 overflow-y-auto">
                                    {loading ? (
                                        <div className="flex justify-center py-8">
                                            <span className="loading loading-spinner loading-sm text-base-content/30" />
                                        </div>
                                    ) : recentActivity.length === 0 ? (
                                        <div className="flex flex-col items-center py-8 gap-2">
                                            <Users size={28} className="text-base-content/15" />
                                            <p className="text-xs text-base-content/40">No registrations yet</p>
                                        </div>
                                    ) : (
                                        recentActivity.map((r, i) => (
                                            <div key={i} className={`flex items-center gap-3 py-3 ${i < recentActivity.length - 1 ? "border-b border-base-300" : ""}`}>
                                                {/* ───────────────────────────────✦. AVATAR .✦─────────────────────────────── */}
                                                <div className="avatar placeholder shrink-0">
                                                    <div className="bg-primary/15 text-primary rounded-full w-8">
                                                        <span className="text-xs font-bold">
                                                            {r.profiles?.firstname?.[0] ?? "?"}{r.profiles?.lastname?.[0] ?? ""}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* ───────────────────────────────✦. LOG TEXT .✦─────────────────────────────── */}
                                                <div className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-sm font-semibold text-base-content">
                                                        {r.profiles?.firstname ?? "Unknown"} {r.profiles?.lastname ?? ""}
                                                    </span>
                                                    <MoveRight size={12} className="text-primary shrink-0" />
                                                    <span className="text-sm text-base-content/60 truncate">
                                                        {r.events?.title ?? "Unknown event"}
                                                    </span>
                                                </div>

                                                {/* ───────────────────────────────✦. TIME .✦─────────────────────────────── */}
                                                <span className="text-xs text-base-content/30 shrink-0">{timeAgo(r.created_at)}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ───────────────────────────────✦. REGISTRATION BREAKDOWN .✦─────────────────────────────── */}
                    <div>
                        <p className="text-xs text-base-content/40 uppercase tracking-widest font-semibold mb-3">Registration Breakdown</p>
                        <div className="card bg-base-200 border border-base-300 shadow-sm">
                            <div className="card-body p-4 gap-3">
                                {events.length === 0 ? (
                                    <p className="text-xs text-base-content/40 text-center py-4">No events to show</p>
                                ) : (
                                    [...events]
                                        .sort((a, b) => (registrationCounts[b.id] || 0) - (registrationCounts[a.id] || 0))
                                        .map((event) => {
                                            const count = registrationCounts[event.id] || 0;
                                            const max = Math.max(...events.map((e) => registrationCounts[e.id] || 0), 1);
                                            const pct = Math.round((count / max) * 100);
                                            return (
                                                <div key={event.id} className="flex items-center gap-3">
                                                    <div className="w-5 h-5 rounded overflow-hidden shrink-0 bg-base-300 flex items-center justify-center">
                                                        {event.image_url
                                                            ? <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                                                            : <ImagePlus size={10} className="text-base-content/20" />
                                                        }
                                                    </div>
                                                    <p className="text-xs text-base-content font-medium truncate w-40 shrink-0">{event.title}</p>
                                                    <div className="flex-1 bg-base-300 rounded-full h-2 overflow-hidden">
                                                        <div className="h-2 rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-xs text-base-content/50 w-6 text-right shrink-0">{count}</span>
                                                    <span className={`badge badge-xs shrink-0 ${event.published ? "badge-success" : "badge-ghost"}`}>
                                                        {event.published ? "Live" : "Draft"}
                                                    </span>
                                                </div>
                                            );
                                        })
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};

export default AdminDashboard;