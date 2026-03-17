import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Input from "../components/Input";
import Link from "../components/Link";
import supabase from "../utils/supabase";

// ───────────────────────────────✦. AUTH .✦───────────────────────────────
const Auth = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const isSignIn = searchParams.get("mode") !== "signup";
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });
    const [session, setSession] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });
        return () => data.subscription.unsubscribe();
    }, []);

    const handleInputChange = (event) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setFormData({ ...formData, [inputName]: inputValue });
    };

    const toggleMode = () => {
        setSearchParams({ mode: isSignIn ? "signup" : "signin" });
    };

    const handleSubmit = async () => {
        try {
            if (isSignIn) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
                navigate("/dashboard");
            } else {
                const { data: signupData, error: signupError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            firstname: formData.firstname,
                            lastname: formData.lastname,
                        }
                    }
                });
                if (signupError) throw signupError;

                const userId = signupData?.user?.id;
                if (!userId) throw new Error("No user ID returned from signup.");

                // ───────────────────────────────✦. INSERT PROFILE .✦───────────────────────────────
                const { error: profileError } = await supabase
                    .from("profiles")
                    .insert({
                        id: userId,
                        firstname: formData.firstname,
                        lastname: formData.lastname,
                        email: formData.email,
                        role: "user",
                    });

                if (profileError) throw profileError;
                navigate("/dashboard");
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <PageWrapper className="flex justify-center">
            <div className="flex items-center">
                {!session ? (
                    <Card>
                        <h1 className="text-xl font-bold text-base-content text-center w-full">
                            {isSignIn ? "Sign In" : "Sign Up"}
                        </h1>

                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-2 w-full">

                            {!isSignIn && (
                                <>
                                    <Input
                                        label="Firstname"
                                        name="firstname"
                                        type="text"
                                        placeholder="Enter your first name"
                                        className="w-full"
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Input
                                        label="Lastname"
                                        name="lastname"
                                        type="text"
                                        placeholder="Enter your last name"
                                        className="w-full"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </>
                            )}

                            <Input
                                label="Email"
                                name="email"
                                type="text"
                                placeholder="@example.com"
                                className="w-full"
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className="w-full mb-5"
                                onChange={handleInputChange}
                                required
                            />

                            <div className="flex justify-center w-full">
                                <button type="submit" className="btn btn-primary rounded-full">
                                    {isSignIn ? "Sign In" : "Sign Up"}
                                </button>
                            </div>

                        </form>

                        <p className="text-base-content text-sm text-center mt-3">
                            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
                            <Link
                                variant="button"
                                linkText={isSignIn ? "Sign Up" : "Sign In"}
                                onClick={toggleMode}
                            />
                        </p>
                    </Card>
                ) : (

                    <Card>
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-base-content">You are already signed in.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate("/dashboard")}
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </Card>
                )}
            </div>
        </PageWrapper>
    );
};

export default Auth;