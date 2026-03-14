import { useNavigate } from "react-router";
import PageWrapper from "../components/PageWrapper";
// ───────────────────────────────✦. CUSTOM ICONS .✦───────────────────────────────
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

	// ───────────────────────────────✦. AESTHETIC STUFF .✦───────────────────────────────
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

				{/* ───────────────────────────────✦. HERO .✦─────────────────────────────── */}
				<section className="w-full flex flex-col items-center text-center px-6 pt-16 pb-20 gap-6 relative overflow-hidden">

					{/* ───────────────────────────────✦. MOVING BLOBS .✦─────────────────────────────── */}
					<div className="anim-fade-in absolute inset-0 pointer-events-none">
						<div className="blob-1 absolute top-16 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
						<div className="blob-2 absolute bottom-10 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
						<div className="blob-3 absolute top-1/2 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
					</div>

					{/* ───────────────────────────────✦. BADGE .✦─────────────────────────────── */}
					<div className="anim-fade-up relative z-10">
						<span className="badge badge-primary badge-outline px-4 py-3 text-xs font-semibold tracking-widest uppercase gap-1">
							<Sparkles size={11} /> Lorem ipsum
						</span>
					</div>

					{/* ───────────────────────────────✦. HEADLINE .✦─────────────────────────────── */}
					<h1 className="anim-fade-up-2 relative z-10 text-5xl sm:text-6xl font-black text-base-content leading-tight max-w-2xl">
						Lorem ipsum dolor sit amet,
						<span className="text-primary"> consectetur </span>
						adipiscing elit.
					</h1>

					{/* ───────────────────────────────✦. SUBHEADING .✦─────────────────────────────── */}
					<p className="anim-fade-up-3 relative z-10 text-base-content/60 text-lg max-w-md leading-relaxed">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
					</p>

					{/* ───────────────────────────────✦. CTA BUTTONS .✦─────────────────────────────── */}
					<div className="anim-fade-up-4 relative z-10 flex flex-wrap gap-3 justify-center">
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

				</section>

				{/* ───────────────────────────────✦. FEATURES .✦─────────────────────────────── */}
				<section className="w-full max-w-4xl px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
					{[
						{
							icon: <Calendar size={28} className="text-primary" />,
							title: "Browse Events",
							desc: "Find upcoming events and see all the details in one clean view.",
							delay: "anim-slide-left"
						},
						{
							icon: <Users size={28} className="text-primary" />,
							title: "Easy Register",
							desc: "One click to register. Track everything from your personal dashboard.",
							delay: "anim-fade-up-3"
						},
						{
							icon: <Ticket size={28} className="text-primary" />,
							title: "Your Tickets",
							desc: "All your registered events in one place, ready when you need them.",
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

				{/* ───────────────────────────────✦. CTA BANNER .✦─────────────────────────────── */}
				<section className="anim-fade-up-4 w-full max-w-4xl px-6 pb-20">
					<div className="card bg-primary text-primary-content shadow-xl overflow-hidden">
						<div className="card-body items-center text-center gap-4 py-12 relative">
							<div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
							<div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
							<LayoutDashboard size={36} className="opacity-80 relative z-10" />
							<h2 className="text-3xl font-black relative z-10">Ready to join?</h2>
							<p className="opacity-80 text-sm max-w-xs relative z-10">
								Create your account and start discovering events happening near you.
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