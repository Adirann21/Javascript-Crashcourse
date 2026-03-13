import { useEffect } from "react";
import React, { use } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Main from "../components/Main";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Input from "../components/Input";
import { Form } from "react-router";
import { useState } from "react";
import supabase from "../utils/supabase";

const Register = () => {

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    console.log(inputName, inputValue);

    setFormData({...formData, [inputName]: inputValue });
  };

const handleSubmit = async (event) => { event.preventDefault();
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (signupError) alert(signupError);
  console.log(signupData);

  if (signupData) {
    
    const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: signupData.user.id,
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
    })
    .select();
    
   if (profileError) alert(profileError);

   if (profileData) {
    console.log("profile data", profileData);
   }
  }
   
};

const[session, setSession] = useState(null);
useEffect(() => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    setSession(session);
  });

return () => data.subscription.unsubscribe();

}, []);

  return (
    <PageWrapper>
      <Header />
      <Main className="flex justify-center">
        <div className="flex items-center">
          {!session ? (
              <Card>
            <h1 className="text-xl font-bold">Signup</h1>
            <form>
            <Input
              label="Firstname"
              name="firstname"
              type="text"
              placeholder="Enter your Firstname"
              onChange={handleInputChange}
            />

            <Input
              label="Lastname"
              name="lastname"
              type="text"
              placeholder="Enter your Lastname"
              onChange={handleInputChange}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your Email"
              onChange={handleInputChange}
            />
    
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your Password"
              onChange={handleInputChange}
            />
            <button 
            className="btn btn-primary w-full mt-4"
              onClick={handleSubmit}
            >
                Submit
              </button>
            </form>

          </Card>
          ) : (
            <Card> You are already logged in. </Card>
          )}
        </div>
      </Main>
      <Footer />
    </PageWrapper>
  );
};

export default Register;