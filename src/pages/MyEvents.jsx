import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import PageWrapper, { UserSidebar, BackButton } from "../components/PageWrapper";
import { RegisteredEventsContext } from "../context/RegisteredEventsContext";
	import {

    QrCode,
    Ticket,
    Calendar,
    MapPin,
    Clock,
    ImagePlus,
    X
} from "lucide-react";
import QRCode from "qrcode";
import supabase from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";

const MyEvents = () => {
    const { registered, toggleRegister, events } = useContext(RegisteredEventsContext);
    const session = useContext(SessionContext);
    const navigate = useNavigate();
    const myEvents = events.filter((e) => registered[e.id]);
    const [qrModal, setQrModal] = useState(false);
    const [qrImage, setQrImage] = useState(null);
    const [qrEvent, setQrEvent] = useState(null);
    const [loadingQr, setLoadingQr] = useState(false);

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

    const handleViewTicket = async (event) => {
        setLoadingQr(true);
        setQrEvent(event);
        setQrModal(true);
        try {
            
            const { data, error } = await supabase
                .from("registrations")
                .select("id")
                .eq("user_id", session.user.id)
                .eq("event_id", event.id)
                .single();
            if (error) throw error;

           
            const payload = JSON.stringify({
                registrationId: data.id,
                userId: session.user.id,
                eventId: event.id,
            });

            const url = await QRCode.toDataURL(payload, {
                width: 280,
                margin: 2,
                color: { dark: "#000000", light: "#ffffff" },
            });
            setQrImage(url);
        } catch (err) {
            alert(err.message);
            setQrModal(false);
        } finally {
            setLoadingQr(false);
        }
    };

    return (
        <PageWrapper>
            <div className="flex gap-6 p-4">
                <UserSidebar events={events} />
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
                    <BackButton to="/dashboard" label="Back to Dashboard" />

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-base-content tracking-tight">My Events</h1>
                            <p className="text-base-content/50 text-sm mt-0.5">
                                {myEvents.length === 0
                                    ? "You haven't registered for any events yet."
                                    : `You're registered for ${myEvents.length} event${myEvents.length !== 1 ? "s" : ""}.`}
                            </p>
                        </div>
                        <button className="btn btn-outline btn-sm gap-2" onClick={() => navigate("/events")}>
                            <Calendar size={14} /> Browse Events
                        </button>
                    </div>

                    {myEvents.length === 0 && (
                        <div className="card bg-base-200 border border-base-300 shadow-sm">
                            <div className="card-body items-center text-center py-20 gap-3">
                                <Ticket size={44} className="text-base-content/15" />
                                <p className="text-base-content/40 text-sm max-w-xs">
                                    No upcoming events. Head to the Events page to find something to join!
                                </p>
                                <button className="btn btn-primary btn-sm mt-2" onClick={() => navigate("/events")}>
                                    Explore Events
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-5">
                        {myEvents.map((event) => (
                            <div key={event.id} className="card bg-base-200 border border-base-300 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="sm:w-52 h-44 sm:h-auto shrink-0 bg-base-300 flex items-center justify-center overflow-hidden">
                                        {event.image_url
                                            ? <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                            : <ImagePlus size={28} className="text-base-content/20" />
                                        }
                                    </div>
                                    <div className="card-body p-5 flex flex-col justify-between">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h2 className="font-bold text-base-content text-lg leading-tight">{event.title}</h2>
                                                <span className="badge badge-success badge-sm shrink-0 mt-1">Registered</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-base-content/50">
                                                <span className="flex items-center gap-1.5"><MapPin size={12} /> {event.location || "—"}</span>
                                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {fmtDate(event.date)}</span>
                                                <span className="flex items-center gap-1.5"><Clock size={12} /> {fmtTime(event.time)}</span>
                                            </div>
                                            {event.details && <p className="text-sm text-base-content/60 line-clamp-2">{event.details}</p>}
                                        </div>
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-base-300">
                                            <button
                                                className="btn btn-sm btn-primary gap-2 flex-1 sm:flex-none"
                                                onClick={() => handleViewTicket(event)}
                                            >
                                                <QrCode size={14} /> View Ticket
                                            </button>
                                            <button className="btn btn-sm btn-ghost text-error gap-2 ml-auto" onClick={() => toggleRegister(event.id)}>
                                                <Ticket size={14} /> Unregister
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

     
            {qrModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-sm flex flex-col items-center gap-4">
                        <div className="flex items-center justify-between w-full">
                            <h3 className="font-bold text-base-content text-lg">Your Ticket</h3>
                            <button className="btn btn-ghost btn-sm btn-square" onClick={() => { setQrModal(false); setQrImage(null); }}>
                                <X size={16} />
                            </button>
                        </div>

                
                        <div className="w-full bg-base-300 rounded-xl p-4 flex flex-col gap-1 text-center">
                            <p className="font-bold text-base-content">{qrEvent?.title}</p>
                            <p className="text-xs text-base-content/50 flex items-center justify-center gap-1">
                                <MapPin size={11} /> {qrEvent?.location}
                            </p>
                            <p className="text-xs text-base-content/50 flex items-center justify-center gap-1">
                                <Calendar size={11} /> {fmtDate(qrEvent?.date)} · {fmtTime(qrEvent?.time)}
                            </p>
                        </div>

    
                        <div className="bg-white p-4 rounded-xl shadow-inner">
                            {loadingQr ? (
                                <div className="w-70 h-70 flex items-center justify-center">
                                    <span className="loading loading-spinner loading-md text-base-content/30" />
                                </div>
                            ) : qrImage ? (
                                <img src={qrImage} alt="QR Ticket" className="w-70 h-70" />
                            ) : null}
                        </div>

                        <p className="text-xs text-base-content/40 text-center">
                            Show this QR code to the admin at the event entrance.
                        </p>

                        <button className="btn btn-ghost btn-sm w-full" onClick={() => { setQrModal(false); setQrImage(null); }}>
                            Close
                        </button>
                    </div>
                    <div className="modal-backdrop" onClick={() => { setQrModal(false); setQrImage(null); }} />
                </div>
            )}

        </PageWrapper>
    );
};

export default MyEvents;