import { NavLink } from "react-router";

const HeaderNavLink = ({ to, linkText }) => {
    return (
        <NavLink
            className={({ isActive }) =>
                isActive
                    ? "text-darkblue-300 mr-4 font-bold link"
                    : "text-gray-500 mr-4 font-bold link"
            }
            to={to}
        >
            {linkText}
        </NavLink>
    );
};

export default HeaderNavLink;