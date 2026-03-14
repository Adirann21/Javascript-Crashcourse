// ───────────────────────────────✦. CARD DESIGN .✦───────────────────────────────
const Card = ({ children }) => {
	return (
		<div className="card bg-base-200 w-120 shadow-lg border border-base-300">
			<div className="card-body">{children}</div>
		</div>
	);
};

export default Card;