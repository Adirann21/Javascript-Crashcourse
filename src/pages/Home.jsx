import { useNavigate } from "react-router";
import PageWrapper from "../components/PageWrapper";
	import {

	Calendar,
	Ticket,
	LayoutDashboard,
	Sparkles,
	Users,
	ArrowRight
} from "lucide-react";

const Home = () => {
	const navigate = useNavigate();

	return (

		<PageWrapper>
			<style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-10px); }
                }
                @keyframes pulse-ring {
                    0%   { transform: scale(0.8); opacity: 0.6; }
                    100% { transform: scale(1.4); opacity: 0; }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-40px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                /* ── Blob drift animations ── */
                @keyframes drift1 {
                    0%   { transform: translate(0px, 0px) scale(1); }
                    25%  { transform: translate(40px, -30px) scale(1.05); }
                    50%  { transform: translate(20px, 40px) scale(0.97); }
                    75%  { transform: translate(-30px, 20px) scale(1.03); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes drift2 {
                    0%   { transform: translate(0px, 0px) scale(1); }
                    25%  { transform: translate(-50px, 30px) scale(1.04); }
                    50%  { transform: translate(-20px, -40px) scale(0.96); }
                    75%  { transform: translate(40px, -20px) scale(1.06); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes drift3 {
                    0%   { transform: translate(0px, 0px) scale(1); }
                    33%  { transform: translate(30px, 50px) scale(1.07); }
                    66%  { transform: translate(-40px, 20px) scale(0.95); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }

                .blob-1 { animation: drift1 12s ease-in-out infinite; }
                .blob-2 { animation: drift2 16s ease-in-out infinite; }
                .blob-3 { animation: drift3 20s ease-in-out infinite; }

                .anim-fade-up   { animation: fadeUp 0.7s ease forwards; }
                .anim-fade-up-2 { animation: fadeUp 0.7s ease 0.15s forwards; opacity: 0; }
                .anim-fade-up-3 { animation: fadeUp 0.7s ease 0.3s  forwards; opacity: 0; }
                .anim-fade-up-4 { animation: fadeUp 0.7s ease 0.45s forwards; opacity: 0; }
                .anim-fade-up-5 { animation: fadeUp 0.7s ease 0.6s  forwards; opacity: 0; }
                .anim-fade-in   { animation: fadeIn 1s ease 0.2s forwards; opacity: 0; }
                .anim-float     { animation: float 3s ease-in-out infinite; }
                .anim-slide-left  { animation: slideInLeft  0.7s ease 0.3s forwards; opacity: 0; }
                .anim-slide-right { animation: slideInRight 0.7s ease 0.5s forwards; opacity: 0; }
                .feature-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
            `}</style>

			<div className="flex flex-col items-center gap-0">

				{}
			<section className="w-full flex items-center justify-between px-8 pt-16 pb-20 gap-16 relative overflow-hidden max-w-7xl mx-auto">

			
				<div className="anim-fade-in absolute inset-0 pointer-events-none">
					<div className="blob-1 absolute top-16 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: "rgba(6, 78, 59, 0.1)" }} />
					<div className="blob-2 absolute bottom-10 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: "rgba(15, 118, 110, 0.1)" }} />
					<div className="blob-3 absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: "rgba(6, 78, 59, 0.05)" }} />
				</div>

				
				<div className="flex flex-col gap-6 relative z-10 flex-1 max-w-lg">
				
					<div className="anim-fade-up">
						<span className="badge badge-primary badge-outline px-4 py-3 text-xs font-semibold tracking-widest uppercase gap-1">
							<Sparkles size={11} /> Event Hub
						</span>
					</div>

				
					<h1 className="anim-fade-up-2 text-5xl sm:text-6xl font-black text-base-content leading-tight">
						Manage Events with
						<span className="text-primary"> Event Hub </span>
						— Your Complete Solution
					</h1>

					
					<p className="anim-fade-up-3 text-base-content/60 text-lg leading-relaxed">
						Event Hub is a powerful dashboard designed for admins and employees to create, manage, and organize events effortlessly. Track registrations, engage participants, and streamline your event planning workflow in one centralized platform.
					</p>

			
					<div className="anim-fade-up-4 flex flex-wrap gap-3">
						<button
							className="btn btn-primary btn-lg rounded-full px-8 shadow-lg hover:scale-105 transition-transform gap-2"
							onClick={() => navigate("/auth?mode=signup")}
						>
							Get Started <ArrowRight size={18} />
						</button>
						<button
							className="btn btn-ghost btn-lg rounded-full px-8 border border-base-content/20 hover:scale-105 transition-transform"
							onClick={() => navigate("/auth")}
						>
							Sign In
						</button>
					</div>
				</div>

			
				<div className="anim-fade-in relative z-10 hidden lg:flex items-center justify-center flex-1">
					<div className="w-full max-w-xl h-96 bg-base-200/30 border-2 border-dashed border-base-content/20 rounded-2xl flex items-center justify-center">
					<img src="https://www.firmofthefuture.com/oidam/intuit/sbseg/en_us/Blog/Photography/Stock/hosting-business-event-us-en.png" alt="Hero" className="w-full h-full object-cover rounded-2xl" />
				</div>

			</div>

		</section>

		<section className="w-full max-w-4xl px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
					{[
						{
							icon: <Calendar size={28} className="text-primary" />,
							title: "Create & Manage Events",
							desc: "Set up new events with all details, customization options, and scheduling tools in minutes.",
							delay: "anim-slide-left"
						},
						{
							icon: <Users size={28} className="text-primary" />,
							title: "Track Registrations",
							desc: "Monitor attendee signups, manage participant lists, and send updates in real-time.",
							delay: "anim-fade-up-3"
						},
						{
							icon: <Ticket size={28} className="text-primary" />,
							title: "Manage Tickets",
							desc: "Generate, distribute, and validate tickets. Keep attendee information organized and secure.",
							delay: "anim-slide-right"
						},
					].map((f) => (
						<div key={f.title} className={`feature-card ${f.delay} card bg-base-200 border border-base-300 shadow-sm`}>
							<div className="card-body gap-3 items-start">
								{f.icon}
								<h3 className="font-bold text-base-content">{f.title}</h3>
								<p className="text-sm text-base-content/50 leading-relaxed">{f.desc}</p>
							</div>
						</div>
					))}
				</section>

			
				<section className="anim-fade-up-4 w-full max-w-4xl px-6 pb-20">
					<div className="card bg-primary text-primary-content shadow-xl overflow-hidden">
						<div className="card-body items-center text-center gap-4 py-12 relative">
							<div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
							<div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
							<LayoutDashboard size={36} className="opacity-80 relative z-10" />
						<h2 className="text-3xl font-black relative z-10">Start Managing Events Today</h2>
						<p className="opacity-80 text-sm max-w-xs relative z-10">
							Join Event Hub and get full control over your event management, from creation to attendee engagement.
							</p>
							<button
								className="btn bg-white text-primary hover:bg-white/90 rounded-full px-8 relative z-10 hover:scale-105 transition-transform gap-2"
								onClick={() => navigate("/auth?mode=signup")}
							>
								Create Free Account <ArrowRight size={16} />
							</button>
						</div>
					</div>
				</section>

			</div>
		</PageWrapper>
	);
};

export default Home;