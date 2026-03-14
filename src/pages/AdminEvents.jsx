import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PageWrapper, { BackButton } from "../components/PageWrapper";
import { SessionContext } from "../context/SessionContext";
import { RegisteredEventsContext } from "../context/RegisteredEventsContext";
import supabase from "../utils/supabase";
// ───────────────────────────────✦. CUSTOM ICONS .✦───────────────────────────────
import {
    Pencil,
    Trash2,
    Plus,
    Eye,
    EyeOff,
    ImagePlus,
    X,
    Calendar,
    MapPin,
    Clock,
    Users,
    ScanLine,
    CheckCircle,
    XCircle
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

const AdminEvents = () => {
    const session = useContext(SessionContext);
    const { isAdmin, fetchEvents: refreshPublicEvents, fetchTotalRegistrations } = useContext(RegisteredEventsContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [deletingEvent, setDeletingEvent] = useState(null);
    const [showUsers, setShowUsers] = useState(false);
    const [usersEvent, setUsersEvent] = useState(null);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [form, setForm] = useState({
        title: "", details: "", location: "", date: "", time: "", published: false,
    });
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef();

    // ───────────────────────────────✦. SCANNER STATES .✦───────────────────────────────
    const [showScanner, setShowScanner] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanStatus, setScanStatus] = useState(null); // ───✦."success" | "error".✦───
    const [scanMessage, setScanMessage] = useState("");
    const [marking, setMarking] = useState(false);
    const scannerRef = useRef(null);
    const html5QrRef = useRef(null);

    useEffect(() => {
        if (session === null) return;
        if (!isAdmin) navigate("/dashboard");
    }, [session, isAdmin]);

    const fetchEvents = async () => {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("date", { ascending: true });
        if (!error) setEvents(data);
    };

    useEffect(() => { fetchEvents(); }, []);

    // ───────────────────────────────✦. Auto-open create modal if ?create=true .✦───────────────────────────────
    useEffect(() => {
        if (searchParams.get("create") === "true") {
            handleCreate();
            setSearchParams({});
        }
    }, [searchParams]);

    // ───────────────────────────────✦. START SCANNER .✦───────────────────────────────
    const startScanner = async () => {
        setShowScanner(true);
        setScanResult(null);
        setScanStatus(null);
        setScanMessage("");
        setTimeout(async () => {
            try {
                html5QrRef.current = new Html5Qrcode("qr-reader");
                await html5QrRef.current.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    async (decodedText) => {
                        await html5QrRef.current.stop();
                        await handleScanResult(decodedText);
                    },
                    () => { }
                );
            } catch (err) {
                setScanStatus("error");
                setScanMessage("Could not access camera. Please allow camera permissions.");
            }
        }, 300);
    };

    // ───────────────────────────────✦. STOP SCANNER .✦───────────────────────────────
    const stopScanner = async () => {
        try {
            if (html5QrRef.current) {
                await html5QrRef.current.stop();
                html5QrRef.current = null;
            }
        } catch (_) { }
        setShowScanner(false);
        setScanResult(null);
        setScanStatus(null);
        setScanMessage("");
    };

    // ───────────────────────────────✦. SCANNED QR .✦───────────────────────────────
    const handleScanResult = async (text) => {
        try {
            const payload = JSON.parse(text);
            const { registrationId, userId, eventId } = payload;
            if (!registrationId || !userId || !eventId) throw new Error("Invalid QR code.");

            // ───────────────────────────────✦. GET REGISTRATION, USER AND EVENT INFO .✦───────────────────────────────
            const { data, error } = await supabase
                .from("registrations")
                .select("id, attended, profiles(firstname, lastname), events(title, date, location)")
                .eq("id", registrationId)
                .single();

            if (error || !data) throw new Error("Registration not found.");

            setScanResult(data);
            setScanStatus("success");
            setScanMessage(data.attended ? "Already attended!" : "Valid ticket!");
        } catch (err) {
            setScanStatus("error");
            setScanMessage(err.message || "Invalid QR code.");
            setScanResult(null);
        }
    };

    // ───────────────────────────────✦. MARK AS ATTENDED .✦───────────────────────────────
    const handleMarkAttended = async () => {
        if (!scanResult) return;
        setMarking(true);
        try {
            const { error } = await supabase
                .from("registrations")
                .update({ attended: true })
                .eq("id", scanResult.id);
            if (error) throw error;
            setScanResult(prev => ({ ...prev, attended: true }));
            setScanMessage("Marked as attended! ✅");
        } catch (err) {
            alert(err.message);
        } finally {
            setMarking(false);
        }
    };

    const handleCreate = () => {
        setEditingEvent(null);
        setForm({ title: "", details: "", location: "", date: "", time: "", published: false });
        setImageFile(null);
        setImagePreview(null);
        setShowModal(true);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setForm({
            title: event.title,
            details: event.details || "",
            location: event.location,
            date: event.date,
            time: event.time,
            published: event.published,
        });
        setImageFile(null);
        setImagePreview(event.image_url || null);
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImage = async (file) => {
        const ext = file.name.split(".").pop();
        const fileName = `event_${Date.now()}.${ext}`;
        const { error } = await supabase.storage
            .from("event-images")
            .upload(fileName, file, { upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from("event-images").getPublicUrl(fileName);
        return data.publicUrl;
    };

    const handleSave = async () => {
        if (!form.title.trim()) return alert("Please enter a title.");
        if (!form.location.trim()) return alert("Please enter a location.");
        if (!form.date) return alert("Please select a date.");
        if (!form.time) return alert("Please select a time.");
        const eventDate = new Date(`${form.date}T${form.time}`);
        if (eventDate < new Date()) return alert("Event date and time cannot be in the past.");
        setSaving(true);
        try {
            let image_url = editingEvent?.image_url || null;
            if (imageFile) image_url = await uploadImage(imageFile);
            const payload = { ...form, image_url };
            if (editingEvent) {
                const { error } = await supabase.from("events").update(payload).eq("id", editingEvent.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("events").insert(payload);
                if (error) throw error;
            }
            setShowModal(false);
            fetchEvents();
            refreshPublicEvents();
            fetchTotalRegistrations();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleTogglePublish = async (event) => {
        const { error } = await supabase.from("events").update({ published: !event.published }).eq("id", event.id);
        if (error) return alert(error.message);
        fetchEvents();
        refreshPublicEvents();
    };

    const handleDelete = async () => {
        const { error } = await supabase.from("events").delete().eq("id", deletingEvent.id);
        if (error) return alert(error.message);
        setShowDelete(false);
        fetchEvents();
        refreshPublicEvents();
        fetchTotalRegistrations();
    };

    const handleViewUsers = async (event) => {
        setUsersEvent(event);
        setShowUsers(true);
        const { data, error } = await supabase
            .from("registrations")
            .select("user_id, attended, profiles(firstname, lastname, email)")
            .eq("event_id", event.id);
        if (!error) setRegisteredUsers(data);
    };

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
            <div className="p-6 flex flex-col gap-6 max-w-4xl mx-auto">
                <BackButton to="/dashboard" label="Back to Dashboard" />

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-base-content tracking-tight">Events</h1>
                        <p className="text-base-content/50 text-sm mt-0.5">Manage, publish, and organize all events</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-outline btn-sm gap-2" onClick={startScanner}>
                            <ScanLine size={15} /> Scan Ticket
                        </button>
                        <button className="btn btn-primary gap-2" onClick={handleCreate}>
                            <Plus size={16} /> New Event
                        </button>
                    </div>
                </div>

                {/* ───────────────────────────────✦. STATS STRIP .✦─────────────────────────────── */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Total Events", value: events.length },
                        { label: "Published", value: events.filter((e) => e.published).length },
                        { label: "Drafts", value: events.filter((e) => !e.published).length },
                    ].map((s) => (
                        <div key={s.label} className="card bg-base-200 border border-base-300 shadow-sm">
                            <div className="card-body py-4 px-5">
                                <p className="text-base-content/50 text-xs uppercase tracking-widest">{s.label}</p>
                                <p className="text-3xl font-bold text-base-content">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ───────────────────────────────✦. EVENT LIST .✦─────────────────────────────── */}
                {events.length === 0 ? (
                    <div className="card bg-base-200 border border-base-300 shadow-sm">
                        <div className="card-body items-center text-center py-16">
                            <Calendar size={40} className="text-base-content/20 mb-2" />
                            <p className="text-base-content/50">No events yet. Create your first one!</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {events.map((event) => (
                            <div key={event.id} className="card bg-base-200 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                                <div className="card-body p-4 flex flex-row gap-4 items-start">
                                    <div
                                        className="w-24 h-20 rounded-lg overflow-hidden bg-base-300 shrink-0 flex items-center justify-center cursor-pointer"
                                        onClick={() => handleEdit(event)}
                                    >
                                        {event.image_url
                                            ? <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                            : <ImagePlus size={22} className="text-base-content/20" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="font-semibold text-base-content text-base truncate">{event.title}</h2>
                                            <span className={`badge badge-sm ${event.published ? "badge-success" : "badge-ghost"}`}>
                                                {event.published ? "Published" : "Draft"}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-base-content/50">
                                            <span className="flex items-center gap-1"><MapPin size={11} /> {event.location || "—"}</span>
                                            <span className="flex items-center gap-1"><Calendar size={11} /> {fmtDate(event.date)}</span>
                                            <span className="flex items-center gap-1"><Clock size={11} /> {fmtTime(event.time)}</span>
                                        </div>
                                        {event.details && (
                                            <p className="text-xs text-base-content/40 mt-1 line-clamp-2">{event.details}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button className="btn btn-sm btn-ghost" onClick={() => handleViewUsers(event)}>
                                            <Users size={14} />
                                        </button>
                                        <button className="btn btn-sm btn-ghost" onClick={() => handleTogglePublish(event)}>
                                            {event.published ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                        <button className="btn btn-sm btn-ghost" onClick={() => handleEdit(event)}>
                                            <Pencil size={14} />
                                        </button>
                                        <button className="btn btn-sm btn-ghost text-error" onClick={() => { setDeletingEvent(event); setShowDelete(true); }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ───────────────────────────────✦. QR SCANNER MODAL .✦─────────────────────────────── */}
            {showScanner && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base-content">Scan Ticket</h3>
                            <button className="btn btn-ghost btn-sm btn-square" onClick={stopScanner}>
                                <X size={16} />
                            </button>
                        </div>

                        {/* ───────────────────────────────✦. CAMERA VIEW, HIDDEN ONCE SCANNED .✦─────────────────────────────── */}
                        {!scanResult && !scanStatus?.includes("error") && (
                            <div id="qr-reader" ref={scannerRef} className="w-full rounded-xl overflow-hidden" />
                        )}

                        {/* ───────────────────────────────✦. ERROR .✦─────────────────────────────── */}
                        {scanStatus === "error" && (
                            <div className="flex flex-col items-center gap-3 py-4">
                                <XCircle size={48} className="text-error" />
                                <p className="text-sm font-semibold text-base-content">{scanMessage}</p>
                                <button className="btn btn-outline btn-sm" onClick={() => {
                                    setScanStatus(null);
                                    setScanMessage("");
                                    setScanResult(null);
                                    startScanner();
                                }}>
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* ───────────────────────────────✦. SUCCESS .✦─────────────────────────────── */}
                        {scanStatus === "success" && scanResult && (
                            <div className="flex flex-col gap-4">
                                <div className={`flex items-center gap-2 p-3 rounded-xl ${scanResult.attended ? "bg-warning/20" : "bg-success/20"}`}>
                                    <CheckCircle size={20} className={scanResult.attended ? "text-warning" : "text-success"} />
                                    <p className={`text-sm font-bold ${scanResult.attended ? "text-warning" : "text-success"}`}>
                                        {scanMessage}
                                    </p>
                                </div>

                                {/* ───────────────────────────────✦. USER INFO .✦─────────────────────────────── */}
                                <div className="bg-base-200 rounded-xl p-4 flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-primary/20 text-primary rounded-full w-10">
                                                <span className="text-sm font-bold">
                                                    {scanResult.profiles?.firstname?.[0]}{scanResult.profiles?.lastname?.[0]}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-base-content">
                                                {scanResult.profiles?.firstname} {scanResult.profiles?.lastname}
                                            </p>
                                            <p className="text-xs text-base-content/50">Registered attendee</p>
                                        </div>
                                    </div>
                                    <div className="divider my-0" />
                                    <p className="text-sm font-semibold text-base-content">{scanResult.events?.title}</p>
                                    <p className="text-xs text-base-content/50 flex items-center gap-1">
                                        <MapPin size={11} /> {scanResult.events?.location}
                                    </p>
                                    <p className="text-xs text-base-content/50 flex items-center gap-1">
                                        <Calendar size={11} /> {fmtDate(scanResult.events?.date)}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className={`badge badge-sm ${scanResult.attended ? "badge-warning" : "badge-success"}`}>
                                            {scanResult.attended ? "Already Attended" : "Not Yet Attended"}
                                        </span>
                                    </div>
                                </div>

                                {/*───────────────────────────────✦. ACTIONS .✦─────────────────────────────── */}
                                <div className="flex gap-2">
                                    {!scanResult.attended && (
                                        <button
                                            className="btn btn-success btn-sm flex-1"
                                            onClick={handleMarkAttended}
                                            disabled={marking}
                                        >
                                            {marking && <span className="loading loading-spinner loading-xs" />}
                                            ✅ Mark as Attended
                                        </button>
                                    )}
                                    <button className="btn btn-ghost btn-sm flex-1" onClick={() => {
                                        setScanResult(null);
                                        setScanStatus(null);
                                        setScanMessage("");
                                        startScanner();
                                    }}>
                                        Scan Another
                                    </button>
                                </div>
                            </div>
                        )}

                        <button className="btn btn-ghost btn-sm" onClick={stopScanner}>Close</button>
                    </div>
                    <div className="modal-backdrop" onClick={stopScanner} />
                </div>
            )}

            {/* ───────────────────────────────✦. CREATE OR EDIT MODAL .✦─────────────────────────────── */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-lg flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-base-content">
                                {editingEvent ? "Edit Event" : "New Event"}
                            </h3>
                            <button className="btn btn-ghost btn-sm btn-square" onClick={() => setShowModal(false)}>
                                <X size={16} />
                            </button>
                        </div>
                        <div
                            className="relative w-full h-40 rounded-xl overflow-hidden bg-base-200 border-2 border-dashed border-base-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs font-semibold">Change Image</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-base-content/30">
                                    <ImagePlus size={28} />
                                    <span className="text-xs">Click to upload event image</span>
                                </div>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-base-content/60 font-medium">Title *</label>
                                <input type="text" className="input input-bordered input-sm w-full" placeholder="Event name"
                                    value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-base-content/60 font-medium">Details</label>
                                <textarea className="textarea textarea-bordered textarea-sm w-full resize-none" rows={3}
                                    placeholder="Event description (optional)"
                                    value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-base-content/60 font-medium">Location *</label>
                                <input type="text" className="input input-bordered input-sm w-full" placeholder="Venue or address"
                                    value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-xs text-base-content/60 font-medium">Date *</label>
                                    <input type="date" className="input input-bordered input-sm w-full"
                                        min={new Date().toISOString().split("T")[0]}
                                        value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-xs text-base-content/60 font-medium">Time *</label>
                                    <input type="time" className="input input-bordered input-sm w-full"
                                        value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div>
                                    <p className="text-sm text-base-content font-medium">Publish immediately</p>
                                    <p className="text-xs text-base-content/50">Users will see this event right away</p>
                                </div>
                                <input type="checkbox" className="toggle toggle-primary toggle-sm"
                                    checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                            </div>
                        </div>
                        <div className="modal-action mt-0 pt-2 border-t border-base-300">
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                                {saving && <span className="loading loading-spinner loading-xs" />}
                                {editingEvent ? "Save Changes" : "Create Event"}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowModal(false)} />
                </div>
            )}

            {/* ───────────────────────────────✦. DELETE MODAL .✦─────────────────────────────── */}
            {showDelete && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-sm flex flex-col gap-3">
                        <h3 className="font-bold text-base-content">Delete Event?</h3>
                        <p className="text-sm text-base-content/60">
                            <span className="font-semibold text-base-content">{deletingEvent?.title}</span> will be permanently deleted. This cannot be undone.
                        </p>
                        <div className="modal-action mt-0">
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowDelete(false)}>Cancel</button>
                            <button className="btn btn-error btn-sm" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowDelete(false)} />
                </div>
            )}

            {/* ───────────────────────────────✦. REGISTRANTS MODAL .✦─────────────────────────────── */}
            {showUsers && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-base-content">Registrants</h3>
                                <p className="text-xs text-base-content/50">{usersEvent?.title}</p>
                            </div>
                            <button className="btn btn-ghost btn-sm btn-square" onClick={() => setShowUsers(false)}>
                                <X size={16} />
                            </button>
                        </div>
                        {registeredUsers.length === 0 ? (
                            <div className="flex flex-col items-center py-8 gap-2">
                                <Users size={32} className="text-base-content/20" />
                                <p className="text-sm text-base-content/40">No registrants yet</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                                {registeredUsers.map((r, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-base-200 rounded-lg p-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-primary/20 text-primary rounded-full w-8">
                                                <span className="text-xs font-bold">
                                                    {r.profiles?.firstname?.[0]}{r.profiles?.lastname?.[0]}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-base-content">
                                                {r.profiles?.firstname} {r.profiles?.lastname}
                                            </p>
                                            <p className="text-xs text-base-content/50">{r.profiles?.email}</p>
                                        </div>
                                        <span className={`badge badge-xs ${r.attended ? "badge-success" : "badge-ghost"}`}>
                                            {r.attended ? "Attended" : "Registered"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-base-content/40 text-right">{registeredUsers.length} registered</p>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowUsers(false)} />
                </div>
            )}
        </PageWrapper>
    );
};

export default AdminEvents;