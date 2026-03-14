import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import PageWrapper, { UserSidebar, BackButton } from "../components/PageWrapper";
import { SessionContext } from "../context/SessionContext";
import { RegisteredEventsContext } from "../context/RegisteredEventsContext";
// ───────────────────────────────✦. CUSTOM ICONS .✦───────────────────────────────
import {
    QrCode,
    Ticket,
    Calendar,
    MapPin,
    Clock,
    X,
    ImagePlus,
    Search
} from "lucide-react";

const Events = () => {
    const session = useContext(SessionContext);
    const { registered, toggleRegister, events } = useContext(RegisteredEventsContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [detailsEvent, setDetailsEvent] = useState(null);

    const publishedEvents = events.filter((e) => e.published);
    const filtered = publishedEvents.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.location || "").toLowerCase().includes(search.toLowerCase())
    );

    const fmtDate = (d) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
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
                    <BackButton to="/dashboard" label="Back to Dashboard" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-base-content tracking-tight">Events</h1>
                            <p className="text-base-content/50 text-sm mt-0.5">
                                {publishedEvents.length} event{publishedEvents.length !== 1 ? "s" : ""} available
                            </p>
                        </div>
                        <label className="input input-bordered input-sm flex items-center gap-2 w-full sm:w-64">
                            <Search size={14} className="text-base-content/40" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="grow bg-transparent outline-none text-sm"
                            />
                        </label>
                    </div>

                    {filtered.length === 0 && (
                        <div className="card bg-base-200 border border-base-300 shadow-sm">
                            <div className="card-body items-center text-center py-16 gap-2">
                                <Calendar size={36} className="text-base-content/15" />
                                <p className="text-base-content/40 text-sm">
                                    {search ? "No events match your search." : "No events available right now."}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filtered.map((event) => (
                            <div key={event.id} className="card bg-base-200 border border-base-300 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="h-40 bg-base-300 flex items-center justify-center overflow-hidden">
                                    {event.image_url
                                        ? <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                        : <ImagePlus size={28} className="text-base-content/20" />
                                    }
                                </div>
                                <div className="card-body p-4 gap-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="font-bold text-base-content leading-tight">{event.title}</h2>
                                        {registered[event.id] && <span className="badge badge-success badge-sm shrink-0">Joined</span>}
                                    </div>
                                    <div className="flex flex-col gap-1 text-xs text-base-content/50">
                                        <span className="flex items-center gap-1.5"><MapPin size={11} /> {event.location || "—"}</span>
                                        <span className="flex items-center gap-1.5"><Calendar size={11} /> {fmtDate(event.date)}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={11} /> {fmtTime(event.time)}</span>
                                    </div>
                                    {event.details && <p className="text-xs text-base-content/50 line-clamp-2">{event.details}</p>}
                                    <div className="card-actions justify-between items-center mt-1 pt-3 border-t border-base-300">
                                        <button className="btn btn-xs btn-ghost text-base-content/50 gap-1"
                                            onClick={() => { setDetailsEvent(event); setShowDetails(true); }}>
                                            Details
                                        </button>
                                        <div className="flex gap-2">
                                            {registered[event.id] && (
                                                <button className="btn btn-xs btn-outline gap-1" onClick={() => navigate("/my-events")}>
                                                    <QrCode size={12} /> Ticket
                                                </button>
                                            )}
                                            <button
                                                className={`btn btn-xs gap-1 ${registered[event.id] ? "btn-ghost text-error" : "btn-primary"}`}
                                                onClick={() => toggleRegister(event.id)}
                                            >
                                                <Ticket size={12} />
                                                {registered[event.id] ? "Unregister" : "Register"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* ───────────────────────────────✦. DETAILS MODAL .✦─────────────────────────────── */}
            {showDetails && detailsEvent && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-md flex flex-col gap-0 p-0 overflow-hidden">
                        {detailsEvent.image_url && (
                            <div className="h-48 overflow-hidden shrink-0">
                                <img src={detailsEvent.image_url} alt={detailsEvent.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-6 flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-lg text-base-content">{detailsEvent.title}</h3>
                                <button className="btn btn-ghost btn-sm btn-square shrink-0" onClick={() => setShowDetails(false)}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="flex flex-col gap-2 text-sm text-base-content/60">
                                <span className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {detailsEvent.location}</span>
                                <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {fmtDate(detailsEvent.date)}</span>
                                <span className="flex items-center gap-2"><Clock size={14} className="text-primary" /> {fmtTime(detailsEvent.time)}</span>
                            </div>
                            {detailsEvent.details && <p className="text-sm text-base-content/70 leading-relaxed">{detailsEvent.details}</p>}
                            <div className="modal-action mt-0 pt-3 border-t border-base-300">
                                <button className="btn btn-ghost btn-sm" onClick={() => setShowDetails(false)}>Close</button>
                                <button
                                    className={`btn btn-sm ${registered[detailsEvent.id] ? "btn-error btn-outline" : "btn-primary"}`}
                                    onClick={() => { toggleRegister(detailsEvent.id); setShowDetails(false); }}
                                >
                                    <Ticket size={14} />
                                    {registered[detailsEvent.id] ? "Unregister" : "Register Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowDetails(false)} />
                </div>
            )}
        </PageWrapper>
    );
};

export default Events;