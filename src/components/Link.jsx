import { NavLink } from "react-router";

const Link = ({ to, linkText, variant = "nav", onClick }) => {

	if (variant === "button") {

		return (
			<button className="text-primary font-bold link-hover" onClick={onClick}>
				{linkText}
			</button>
		);
	}

	// ───────────────────────────────✦. NAVLINK .✦───────────────────────────────
	return (
		<NavLink
			className={({ isActive }) =>
				isActive ?
					"text-primary mr-4 font-bold link"
					:
					"text-base-content/60 mr-4 link-hover"
			}
			to={to}
		>
			{linkText}
		</NavLink>
	);
};

export default Link;