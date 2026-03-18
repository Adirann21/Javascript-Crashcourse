const Input = ({ label, name, type, className, placeholder, onChange, required }) => {

	return (
		<fieldset className="fieldset">
			<legend className="fieldset-legend">{label}</legend>
			<input
				name={name}
				type={type}
				className={`input ${className}`}
				placeholder={placeholder}
				onChange={onChange}
				required={required}
			/>
		</fieldset>
	);
};

export default Input;