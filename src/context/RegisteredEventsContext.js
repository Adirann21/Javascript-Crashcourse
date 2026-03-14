import { createContext } from "react";
export const RegisteredEventsContext = createContext({
    registered: {},
    toggleRegister: () => { },
    events: [],
    isAdmin: false,
    profile: null,
    avatarUrl: null,
    setAvatarUrl: () => { },
    theme: "coffee",
    toggleTheme: () => { },
    totalRegistrations: 0,
    fetchTotalRegistrations: () => { },
    notifications: [],
});