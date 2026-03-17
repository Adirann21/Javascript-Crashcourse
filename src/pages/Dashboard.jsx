import { useContext, useMemo } from "react";
import { useNavigate } from "react-router";
import PageWrapper, { UserSidebar, BackButton } from "../components/PageWrapper";
import { SessionContext } from "../context/SessionContext";
import { RegisteredEventsContext } from "../context/RegisteredEventsContext";
// ───────────────────────────────✦. CUSTOM ICONS .✦───────────────────────────────
import {
    Calendar,
    Ticket,
    Clock,
    MapPin,
    ChevronRight,
    Smile
} from "lucide-react";

const Dashboard = () => {
    const session = useContext(SessionContext);
    const { registered, events } = useContext(RegisteredEventsContext);
    const navigate = useNavigate();

    const firstName = session?.user?.user_metadata?.firstname
        || session?.user?.email?.split("@")[0]
        || "there";

    const myEvents = useMemo(() => events.filter((e) => registered[e.id]), [events, registered]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = useMemo(() =>
        myEvents
            .filter((e) => e.date && new Date(e.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3),
        [myEvents]
    );

    const nextEvent = upcomingEvents[0] || null;
    const daysUntil = nextEvent
        ? Math.max(0, Math.ceil((new Date(nextEvent.date) - today) / (1000 * 60 * 60 * 24)))
        : null;

    const fmtDate = (d) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
    };
    const fmtTime = (t) => {
        if (!t) return "—";
        const [h, m] = t.split(":");
        const hr = parseInt(h, 10);
        return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
    };

    return (
        <PageWrapper>
            <div className="flex gap-6 p-4">
                <UserSidebar events={events} />
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
                    <BackButton to="/events" label="Back to Events" />

                    {/* ───────────────────────────────✦. WELCOME .✦─────────────────────────────── */}
                    <div>
                        <h1 className="text-2xl font-bold text-base-content tracking-tight">
                            Hey, {firstName}! 👋
                        </h1>
                        <p className="text-base-content/50 text-sm mt-0.5">
                            {myEvents.length === 0
                                ? "You haven't joined any events yet."
                                : `You're registered for ${myEvents.length} event${myEvents.length !== 1 ? "s" : ""}.`}
                        </p>
                    </div>

                    {/* ───────────────────────────────✦. STAT CARDS (STACKED) .✦─────────────────────────────── */}
                    <div className="flex flex-col gap-4">
                        <div className="card bg-primary text-primary-content shadow-sm">
                            <div className="card-body py-5 px-5">
                                <Ticket size={20} className="opacity-70" />
                                <p className="text-3xl font-bold mt-1">{myEvents.length}</p>
                                <p className="text-xs opacity-70 font-medium">Registered Events</p>
                            </div>
                        </div>
                        <div className="card bg-base-200 border border-base-300 shadow-sm">
                            <div className="card-body py-5 px-5">
                                <Calendar size={20} className="text-base-content/40" />
                                <p className="text-3xl font-bold mt-1 text-base-content">{upcomingEvents.length}</p>
                                <p className="text-xs text-base-content/50 font-medium">Upcoming</p>
                            </div>
                        </div>
                        <div className="card bg-base-200 border border-base-300 shadow-sm">
                            <div className="card-body py-5 px-5">
                                <Clock size={20} className="text-base-content/40" />
                                <p className="text-3xl font-bold mt-1 text-base-content">
                                    {daysUntil !== null ? daysUntil : "—"}
                                </p>
                                <p className="text-xs text-base-content/50 font-medium">Days Until Next Event</p>
                            </div>
                        </div>
                    </div>

                    {/* ───────────────────────────────✦. NEXT EVENT .✦─────────────────────────────── */}
                    {nextEvent ? (
                        <div>
                            <p className="text-xs text-base-content/40 uppercase tracking-widest font-semibold mb-3">Next Up</p>
                            <div
                                className="card bg-base-200 border border-base-300 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                                onClick={() => navigate("/my-events")}
                            >
                                <div className="flex flex-col sm:flex-row">
                                    {nextEvent.image_url && (
                                        <div className="sm:w-44 h-36 sm:h-auto shrink-0 overflow-hidden">
                                            <img src={nextEvent.image_url} alt={nextEvent.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="card-body p-5 flex flex-col justify-between">
                                        <div>
                                            <h2 className="font-bold text-base-content text-lg">{nextEvent.title}</h2>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-base-content/50 mt-1">
                                                <span className="flex items-center gap-1"><MapPin size={11} /> {nextEvent.location}</span>
                                                <span className="flex items-center gap-1"><Calendar size={11} /> {fmtDate(nextEvent.date)}</span>
                                                <span className="flex items-center gap-1"><Clock size={11} /> {fmtTime(nextEvent.time)}</span>
                                            </div>
                                            {nextEvent.details && (
                                                <p className="text-sm text-base-content/50 mt-2 line-clamp-2">{nextEvent.details}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-primary text-xs font-semibold mt-3">
                                            View ticket <ChevronRight size={13} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card bg-base-200 border border-base-300 border-dashed shadow-sm">
                            <div className="card-body items-center text-center py-10 gap-2">
                                <Smile size={36} className="text-base-content/15" />
                                <p className="text-sm text-base-content/40">No upcoming events. Go join one!</p>
                                <button className="btn btn-primary btn-sm mt-1" onClick={() => navigate("/events")}>
                                    Browse Events
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ───────────────────────────────✦. UPCOMING LIST .✦─────────────────────────────── */}
                    {upcomingEvents.length > 1 && (
                        <div>
                            <p className="text-xs text-base-content/40 uppercase tracking-widest font-semibold mb-3">Your Schedule</p>
                            <div className="flex flex-col gap-2">
                                {upcomingEvents.slice(1).map((event) => (
                                    <div
                                        key={event.id}
                                        className="card bg-base-200 border border-base-300 shadow-sm cursor-pointer hover:border-primary/40 transition-colors"
                                        onClick={() => navigate("/my-events")}
                                    >
                                        <div className="card-body p-4 flex flex-row items-center gap-4">
                                            <div className="shrink-0 w-10 text-center">
                                                <p className="text-lg font-bold text-primary leading-none">
                                                    {new Date(event.date).getDate()}
                                                </p>
                                                <p className="text-xs text-base-content/40 uppercase">
                                                    {new Date(event.date).toLocaleDateString("en-PH", { month: "short" })}
                                                </p>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-base-content text-sm truncate">{event.title}</p>
                                                <p className="text-xs text-base-content/50 truncate">{event.location} · {fmtTime(event.time)}</p>
                                            </div>
                                            <ChevronRight size={16} className="text-base-content/30 shrink-0" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </PageWrapper>
    );
};

export default Dashboard;