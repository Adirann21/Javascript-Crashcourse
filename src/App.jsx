import "./App.css";
import { Routes, Route } from "react-router";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";
import { SessionContext } from "./context/SessionContext";
import { RegisteredEventsContext } from "./context/RegisteredEventsContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Events from "./pages/Events";
import MyEvents from "./pages/MyEvents";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";

function App() {
	const [session, setSession] = useState(null);
	const [registered, setRegistered] = useState({});
	const [events, setEvents] = useState([]);
	const [isAdmin, setIsAdmin] = useState(false);
	const [profile, setProfile] = useState(null);
	const [avatarUrl, setAvatarUrl] = useState(null);
	const [theme, setTheme] = useState("blackred");
	const [totalRegistrations, setTotalRegistrations] = useState(0);
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", "blackred");
	}, []);

	const toggleTheme = () => {
		// Keep the app on the black/red theme.
		setTheme("blackred");
		document.documentElement.setAttribute("data-theme", "blackred");
	};

	const fetchEvents = async () => {
		const { data, error } = await supabase
			.from("events")
			.select("*")
			.eq("published", true)
			.order("date", { ascending: true });
		if (!error) setEvents(data);
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	const fetchRegistrations = async (userId) => {
		const { data, error } = await supabase
			.from("registrations")
			.select("event_id")
			.eq("user_id", userId);
		if (!error) {
			const map = {};
			data.forEach((r) => { map[r.event_id] = true; });
			setRegistered(map);
		}
	};

	const fetchTotalRegistrations = async () => {
		const { count, error } = await supabase
			.from("registrations")
			.select("*", { count: "exact", head: true });
		if (!error) setTotalRegistrations(count || 0);
	};

	// ───────────────────────────────✦. SHOW FUTURE EVENTS 1 WEEK FROM NOW .✦───────────────────────────────
	const fetchNotifications = async (userId) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const sevenDaysFromNow = new Date();
		sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
		sevenDaysFromNow.setHours(23, 59, 59, 999);
		const { data, error } = await supabase
			.from("events")
			.select("id, title, date, created_at")
			.eq("published", true)
			.gte("date", today.toISOString().split("T")[0])
			.lte("date", sevenDaysFromNow.toISOString().split("T")[0])
			.order("date", { ascending: true });
		if (!error) setNotifications(data || []);
	};

	// ───────────────────────────────✦. FETCH PROFILE + CHECK ADMIN .✦───────────────────────────────
	useEffect(() => {
		const fetchProfile = async () => {
			if (!session) {
				setIsAdmin(false);
				setProfile(null);
				setAvatarUrl(null);
				setNotifications([]);
				return;
			}
			const { data, error } = await supabase
				.from("profiles")
				.select("role, firstname, lastname, avatar_url")
				.eq("id", session.user.id)
				.single();
			if (!error) {
				setIsAdmin(data.role === "admin");
				setProfile(data);
				setAvatarUrl(data.avatar_url || null);
				if (data.role === "admin") {
					fetchTotalRegistrations();
				} else {
					fetchNotifications(session.user.id);
				}
			}
		};
		fetchProfile();
		if (session) fetchRegistrations(session.user.id);
		else setRegistered({});
	}, [session]);

	const toggleRegister = async (eventId) => {
		if (!session) return;
		const userId = session.user.id;
		const isRegistered = registered[eventId];
		if (isRegistered) {
			const { error } = await supabase
				.from("registrations")
				.delete()
				.eq("user_id", userId)
				.eq("event_id", eventId);
			if (error) return alert(error.message);
		} else {
			const { error } = await supabase
				.from("registrations")
				.insert({ user_id: userId, event_id: eventId });
			if (error) return alert(error.message);
		}
		fetchRegistrations(userId);
	};

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
		});
		return () => data.subscription.unsubscribe();
	}, []);

	return (
		<RegisteredEventsContext.Provider value={{
			registered, toggleRegister, events, isAdmin, fetchEvents,
			profile, avatarUrl, setAvatarUrl,
			theme, toggleTheme,
			totalRegistrations, fetchTotalRegistrations,
			notifications,
		}}>
			<SessionContext.Provider value={session}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/auth" element={<Auth />} />
					<Route path="/settings" element={<Settings />} />

					<Route path="/events" element={isAdmin ? <AdminEvents /> : <Events />} />
					<Route path="/dashboard" element={isAdmin ? <AdminDashboard /> : <Dashboard />} />
					<Route path="/my-events" element={<MyEvents />} />

					<Route path="/admin" element={<AdminEvents />} />
					<Route path="/user-events" element={<MyEvents />} />
				</Routes>
			</SessionContext.Provider>
		</RegisteredEventsContext.Provider>
	);
}

export default App;