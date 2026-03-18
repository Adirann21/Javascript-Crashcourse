import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import supabase from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";
import { RegisteredEventsContext } from "../context/RegisteredEventsContext";
import Link from "./Link";
	import {
	Settings as SettingsIcon,
	LogOut,
	ChevronLeft,
	ChevronRight,
	Moon,
	Sun,
	LayoutDashboard,
	CalendarDays,
	ClipboardList,
	Camera,
	Trash2,
	Bell,
	Plus,
	Users
} from "lucide-react";

	const Header = () => {
	const session = useContext(SessionContext);
	const { isAdmin, theme, toggleTheme, totalRegistrations, notifications } = useContext(RegisteredEventsContext);
	const navigate = useNavigate();
	const location = useLocation();
	const isSignUp = location.search === "?mode=signup";
	const [bellOpen, setBellOpen] = React.useState(false);
	const bellRef = React.useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (bellRef.current && !bellRef.current.contains(e.target)) {
				setBellOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="navbar bg-base-300 shadow-sm relative z-50">
	<div className="flex max-w-7xl mx-auto w-full">

				<div className="flex-1">
			<a className="btn btn-ghost px-0 hover:bg-transparent navbar-logo" onClick={() => navigate("/") }>
						<div className="flex items-center gap-2.5">

						<div className="flex items-center justify-center shrink-0">
							<svg width="20" height="20" viewBox="0 0 14 14" fill="none">
								<rect x="1" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
								<path d="M4 1v3M10 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
								<path d="M1 7h12" stroke="currentColor" strokeWidth="1.5" />
								<circle cx="4.5" cy="10" r="1" fill="currentColor" />
								<circle cx="7" cy="10" r="1" fill="currentColor" />
								<circle cx="9.5" cy="10" r="1" fill="currentColor" />
							</svg>
						</div>

						<span
							className="text-lg font-black tracking-tight leading-none"
							style={{
								background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent"
							}}
						>
							Event<span className="font-light">Hub</span>
						</span>
						</div>
					</a>
				</div>

				<div className="flex-none flex items-center gap-2">

					{/* ───────────────────────────────✦. SIGNED OUT .✦─────────────────────────────── */}
					{!session && (
						<>
							<Link to="/" linkText="Home" />
							<Link
								to={isSignUp ? "/auth" : "/auth?mode=signup"}
								linkText={isSignUp ? "Sign In" : "Sign Up"}
							/>
						</>
					)}

				{/* ───────────────────────────────✦. LINK BUTTONS .✦─────────────────────────────── */}
				{session && (
					<>
						<button
							className="btn btn-ghost btn-sm"
							onClick={() => navigate("/")}
							title="Home"
						>
							Home
						</button>
						<button
							className="btn btn-ghost btn-sm"
							onClick={() => navigate("/dashboard")}
							title="Dashboard"
						>
							Dashboard
						</button>
					</>
				)}

			{session && !isAdmin && (
				<div className="relative" ref={bellRef}>
					<button
						className="btn btn-ghost btn-sm btn-circle relative"
						onClick={() => setBellOpen(prev => !prev)}
						title="Notifications"
					>
						<Bell size={16} className="text-base-content" />
						{notifications.length > 0 && (
							<span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
						)}
					</button>

					{/* ───────────────────────────────✦. DROPDOWN .✦─────────────────────────────── */}
					{bellOpen && (
						<div className="absolute right-0 mt-2 w-72 card bg-base-200 border border-base-300 shadow-xl z-50">
							<div className="card-body p-3 gap-2">
								<p className="text-xs font-bold text-base-content/50 uppercase tracking-widest px-1">
									New This Week
								</p>
								{notifications.length === 0 ? (
									<p className="text-xs text-base-content/40 text-center py-4">
										No new events this week.
									</p>
								) : (
									notifications.map((n) => (
										<button
											key={n.id}
											className="flex flex-col gap-0.5 text-left px-2 py-2 rounded-lg hover:bg-base-300 transition-colors"
											onClick={() => { navigate("/events"); setBellOpen(false); }}
											>
												<span className="text-sm font-semibold text-base-content">{n.title}</span>
												<span className="text-xs text-base-content/50">
													{new Date(n.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
												</span>
											</button>
									))
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	</div>
</div>
);
};

// ───────────────────────────────✦. BACK BUTTON .✦───────────────────────────────
export const BackButton = ({ to, label = "Back" }) => {
  const navigate = useNavigate();
  return <button
    className="btn btn-ghost btn-sm gap-1 pl-1 w-fit"
    onClick={() => to ? navigate(to) : navigate(-1)}
  >
    <ChevronLeft size={18} /> {label}
  </button>;
};


// ───────────────────────────────✦. FOOTER .✦───────────────────────────────
const Footer = () => (
	<footer
		className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-7">
	</footer>
);

// ───────────────────────────────✦. MAIN .✦───────────────────────────────
const Main = ({ children, className }) => (
	<main className={`flex-1 max-w-7xl mx-auto w-full md:px-2 lg:px-0 pt-5 ${className}`}>
		{children}
	</main>
);

// ───────────────────────────────✦. PAGE WRAPPER .✦───────────────────────────────
const PageWrapper = ({ children, className }) => (
	<div className="flex flex-col min-h-screen">
		<Header />
		<Main className={className}>{children}</Main>
		<Footer />
	</div>
);

// ───────────────────────────────✦. CALENDAR .✦───────────────────────────────
export const Calendar = ({ events = [] }) => {

	// ───────────────────────────────✦. STATES .✦───────────────────────────────
	const today = new Date();
	const [currentDate, setCurrentDate] = React.useState(today);
	const [selectedDate, setSelectedDate] = React.useState(today);

	// ───────────────────────────────✦. DATES .✦───────────────────────────────
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	// ───────────────────────────────✦. MONTH NAVIGATION .✦───────────────────────────────
	const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
	const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

	// ───────────────────────────────✦. DATE CHECK .✦───────────────────────────────
	const isToday = (day) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
	const isSelected = (day) => day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
	const hasEvent = (day) => events.some(event => {
		const d = new Date(event.date + "T00:00:00");
		return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
	});

	// ───────────────────────────────✦. EVENTS ON SELECTED DAY .✦───────────────────────────────
	const selectedEvents = events.filter(event => {
		const d = new Date(event.date + "T00:00:00");
		return d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
	});

	// ───────────────────────────────✦. CALENDAR UI .✦───────────────────────────────
	const days = [];
	for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
	for (let day = 1; day <= daysInMonth; day++) {
		days.push(
			<button key={day} onClick={() => setSelectedDate(new Date(year, month, day))}
				className={`relative text-xs rounded-full w-7 h-7 flex items-center justify-center transition-colors
                    ${isSelected(day) ? "bg-primary text-primary-content font-bold" : ""}
                    ${isToday(day) && !isSelected(day) ? "border border-primary text-primary font-bold" : ""}
                    ${!isSelected(day) && !isToday(day) ? "hover:bg-base-300 text-base-content" : ""}`}>
				{day}
				{hasEvent(day) && !isSelected(day) && (
					<span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
				)}
			</button>
		);
	}

	// ───────────────────────────────✦. CALENDAR PRETTIER UI .✦───────────────────────────────
	return (
		<div className="w-full">
			<div className="flex items-center justify-between mb-2">
				<button className="btn btn-ghost btn-xs" onClick={prevMonth}><ChevronLeft size={14} /></button>
				<span className="text-base-content text-xs font-bold">{monthNames[month]} {year}</span>
				<button className="btn btn-ghost btn-xs" onClick={nextMonth}><ChevronRight size={14} /></button>
			</div>
			<div className="grid grid-cols-7 mb-1">
				{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
					<div key={i} className="text-center text-xs text-base-content/50 font-bold">{d}</div>
				))}
			</div>
			<div className="grid grid-cols-7 gap-y-1">{days}</div>
			<div className="mt-2 text-center text-xs text-base-content/60">{selectedDate.toDateString()}</div>
			<div className="mt-2 border-t border-base-300 pt-2 flex flex-col gap-2">
				{selectedEvents.length === 0 ? (
					<p className="text-xs text-base-content/40 text-center">No events on this day.</p>
				) : (
					selectedEvents.map(event => (
						<div key={event.id} className="text-xs bg-base-300 rounded-lg p-2 flex flex-col gap-0.5">
							<span className="font-bold text-base-content">{event.title}</span>
							<span className="text-base-content/60">{event.location}</span>
							<span className="text-base-content/60">{event.time}</span>
						</div>
					))
				)}
			</div>
		</div>
	);
};

// ───────────────────────────────✦. USER AVATAR .✦───────────────────────────────
export const UserAvatar = ({ avatarUrl, profile, size = "w-20" }) => {
	const initials = profile
		? `${profile.firstname?.[0] ?? ""}${profile.lastname?.[0] ?? ""}`
		: "?";
	return (
		<div className={`avatar ${!avatarUrl ? "placeholder" : ""}`}>
			<div className={`${size} rounded-full border border-base-300 overflow-hidden flex items-center justify-center bg-base-200`}>
				{avatarUrl
					? <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
					: <span className="text-2xl font-bold text-primary">{initials}</span>
				}
			</div>
		</div>
	);
};

// ───────────────────────────────✦. USER SIDEBAR .✦───────────────────────────────
export const UserSidebar = ({ events = [] }) => {
	const session = useContext(SessionContext);
	const { isAdmin, profile, avatarUrl } = useContext(RegisteredEventsContext);
	const navigate = useNavigate();

	const displayName = profile
		? `${profile.firstname} ${profile.lastname}`.trim()
		: session?.user?.user_metadata?.firstname
		? `${session.user.user_metadata.firstname} ${session.user.user_metadata.lastname || ""}`.trim()
		: session?.user?.email?.split("@")[0] || "User";

	const handleSignout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) alert(error);
		else navigate("/");
	};

	return (
		<div className="flex flex-col items-center gap-4 w-56 min-w-56">
			{/* ───────────────────────────────✦. USER PROFILE AND NAVIGATION .✦─────────────────────────────── */}
			<div className="card bg-base-200 border border-base-300 shadow-lg w-full">
				<div className="card-body items-center text-center gap-3">
					<UserAvatar avatarUrl={avatarUrl} profile={profile} size="w-20" />
					<h2 className="text-base-content font-bold text-lg">
						{displayName}
					</h2>
					<div className="divider my-0" />

					{/* ───────────────────────────────✦. ADMIN OR USER .✦─────────────────────────────── */}
					{isAdmin && (
						<>
							<button className="btn btn-ghost w-full justify-start gap-2" onClick={() => navigate("/dashboard")}>
								<LayoutDashboard size={16} /> Dashboard
							</button>
							<button className="btn btn-ghost w-full justify-start gap-2" onClick={() => navigate("/events")}>
								<CalendarDays size={16} /> Events
							</button>
						</>
					)}
					{!isAdmin && (
						<>
							<button className="btn btn-ghost w-full justify-start gap-2" onClick={() => navigate("/dashboard")}>
								<LayoutDashboard size={16} /> Dashboard
							</button>
							<button className="btn btn-ghost w-full justify-start gap-2" onClick={() => navigate("/events")}>
								<CalendarDays size={16} /> Events
							</button>
							<button className="btn btn-ghost w-full justify-start gap-2" onClick={() => navigate("/my-events")}>
								<ClipboardList size={16} /> My Events
							</button>
						</>
					)}

					{/* ───────────────────────────────✦. SETTINGS AND LOGOUT .✦─────────────────────────────── */}
					<button className="btn btn-ghost w-full justify-start gap-2" onClick={() => navigate("/settings")}>
						<SettingsIcon size={16} /> Settings
					</button>
					<button className="btn btn-ghost w-full justify-start gap-2 text-error" onClick={handleSignout}>
						<LogOut size={16} /> Logout
					</button>
				</div>
			</div>

			{/* ───────────────────────────────✦. CALENDAR CARD .✦─────────────────────────────── */}
			<div className="card bg-base-200 border border-base-300 shadow-lg w-full">
				<div className="card-body p-3">
					<Calendar events={events} />
				</div>
			</div>
		</div>
	);
};

// ───────────────────────────────✦. SETTINGS .✦───────────────────────────────
export const Settings = () => {
	const session = useContext(SessionContext);
	const { profile, setAvatarUrl, avatarUrl } = useContext(RegisteredEventsContext);
	const navigate = useNavigate();

	// ───────────────────────────────✦. LOCAL STATE .✦───────────────────────────────
	const [firstname, setFirstname] = React.useState("");
	const [lastname, setLastname] = React.useState("");
	const [newPassword, setNewPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [avatarFile, setAvatarFile] = React.useState(null);
	const [avatarPreview, setAvatarPreview] = React.useState(null);
	const [savingAvatar, setSavingAvatar] = React.useState(false);
	const [removingAvatar, setRemovingAvatar] = React.useState(false);
	const fileInputRef = React.useRef(null);

	// ───────────────────────────────✦. DISPLAY FIRST NAME ON USER PROFILE .✦───────────────────────────────
	useEffect(() => {
		if (profile) {
			setFirstname(profile.firstname);
			setLastname(profile.lastname);
		}
	}, [profile]);

	const handleSaveName = async () => {
		const { error } = await supabase.from("profiles").update({ firstname, lastname }).eq("id", session.user.id);
		if (error) alert(error.message);
		else alert("Name updated!");
	};

	const handleSavePassword = async () => {
		if (newPassword !== confirmPassword) return alert("Passwords do not match!");
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		if (error) alert(error.message);
		else { alert("Password updated!"); setNewPassword(""); setConfirmPassword(""); }
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setAvatarFile(file);
		setAvatarPreview(URL.createObjectURL(file));
	};

	const handleSaveAvatar = async () => {
		if (!avatarFile) return;
		setSavingAvatar(true);
		try {
			const ext = avatarFile.name.split(".").pop();
			const fileName = `avatar_${session.user.id}.${ext}`;
			const { error: uploadError } = await supabase.storage
				.from("profile-images")
				.upload(fileName, avatarFile, { upsert: true });
			if (uploadError) throw uploadError;
			const { data: urlData } = supabase.storage
				.from("profile-images")
				.getPublicUrl(fileName);
			const publicUrl = urlData.publicUrl;
			const { error: dbError } = await supabase
				.from("profiles")
				.update({ avatar_url: publicUrl })
				.eq("id", session.user.id);
			if (dbError) throw dbError;
			setAvatarUrl(publicUrl);
			setAvatarFile(null);
			setAvatarPreview(null);
			alert("Profile picture updated!");
		} catch (err) {
			alert(err.message);
		} finally {
			setSavingAvatar(false);
		}
	};

	const handleRemoveAvatar = async () => {
		if (!avatarUrl) return;
		setRemovingAvatar(true);
		try {
			const { error: dbError } = await supabase
				.from("profiles")
				.update({ avatar_url: null })
				.eq("id", session.user.id);
			if (dbError) throw dbError;

			// ───────────────────────────────✦. GET FILE PATH FROM URL .✦───────────────────────────────
			const bucketName = "profile-images";
			const marker = `/${bucketName}/`;
			const afterBucket = avatarUrl.split(marker)[1];
			// Strip any query params (e.g. cache busters)
			const filePath = afterBucket?.split("?")[0];

			if (filePath) {
				const { error: storageError } = await supabase.storage
					.from(bucketName)
					.remove([filePath]);
				if (storageError) console.warn("Storage delete failed:", storageError.message);
			}

			setAvatarUrl(null);
			setAvatarPreview(null);
			setAvatarFile(null);
			alert("Profile picture removed!");
		} catch (err) {
			alert(err.message);
		} finally {
			setRemovingAvatar(false);
		}
	};

	const displaySrc = avatarPreview || avatarUrl;

	return (
		<PageWrapper>
			<div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto w-full">
				<BackButton to="/dashboard" label="Back to Dashboard" />

				{/* ───────────────────────────────✦. PROFILE PIC .✦─────────────────────────────── */}
				<div className="card bg-base-200 border border-base-300 shadow-lg">
					<div className="card-body gap-4">
						<h2 className="card-title text-base-content">Profile Picture</h2>
						<div className="flex items-center gap-5">
							<div
								className="relative cursor-pointer group shrink-0"
								onClick={() => fileInputRef.current?.click()}
							>
								<div className="w-20 h-20 rounded-full border border-base-300 overflow-hidden flex items-center justify-center bg-base-300">
									{displaySrc
										? <img src={displaySrc} alt="Profile" className="w-full h-full object-cover" />
										: <span className="text-2xl font-bold text-primary">
											{profile?.firstname?.[0]}{profile?.lastname?.[0]}
										</span>
									}
								</div>
								<div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
									<Camera size={18} className="text-white" />
								</div>
							</div>
							<div className="flex flex-col gap-2 flex-1">
								<p className="text-sm text-base-content/60">
									{avatarFile ? `Selected: ${avatarFile.name}` : "Click the avatar or choose a file to upload"}
								</p>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									className="file-input file-input-bordered file-input-sm w-full"
									onChange={handleFileChange}
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								className="btn btn-primary btn-sm"
								onClick={handleSaveAvatar}
								disabled={!avatarFile || savingAvatar}
							>
								{savingAvatar && <span className="loading loading-spinner loading-xs" />}
								Save Picture
							</button>
							{(avatarUrl || avatarPreview) && (
								<button
									className="btn btn-ghost btn-sm text-error gap-2"
									onClick={handleRemoveAvatar}
									disabled={removingAvatar}
								>
									{removingAvatar
										? <span className="loading loading-spinner loading-xs" />
										: <Trash2 size={14} />
									}
									Remove
								</button>
							)}
						</div>
					</div>
				</div>

				{/* ───────────────────────────────✦. CHANGE NAME .✦─────────────────────────────── */}
				<div className="card bg-base-200 border border-base-300 shadow-lg">
					<div className="card-body gap-4">
						<h2 className="card-title text-base-content">Change Name</h2>
						<div className="flex gap-3">
							<div className="flex flex-col gap-1 flex-1">
								<label className="text-base-content/60 text-sm">First Name</label>
								<input type="text" className="input input-bordered input-sm w-full" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
							</div>
							<div className="flex flex-col gap-1 flex-1">
								<label className="text-base-content/60 text-sm">Last Name</label>
								<input type="text" className="input input-bordered input-sm w-full" value={lastname} onChange={(e) => setLastname(e.target.value)} />
							</div>
						</div>
						<button className="btn btn-primary btn-sm w-fit" onClick={handleSaveName}>Save Name</button>
					</div>
				</div>

				{/* ───────────────────────────────✦. CHANGE PASSWORD .✦─────────────────────────────── */}
				<div className="card bg-base-200 border border-base-300 shadow-lg">
					<div className="card-body gap-4">
						<h2 className="card-title text-base-content">Change Password</h2>
						<div className="flex flex-col gap-3">
							<div className="flex flex-col gap-1">
								<label className="text-base-content/60 text-sm">New Password</label>
								<input type="password" className="input input-bordered input-sm w-full" value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-base-content/60 text-sm">Confirm Password</label>
								<input type="password" className="input input-bordered input-sm w-full" value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
							</div>
						</div>
						<button className="btn btn-primary btn-sm w-fit" onClick={handleSavePassword}>Save Password</button>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
};

export default PageWrapper;