import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Main from "../components/Main";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Input from "../components/Input";
import { Form } from "react-router";

const Register = () => {

  const handleInputChange = (event) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    console.log(inputName, inputValue);
  };

  return (
    <PageWrapper>
      <Header />
      <Main className="flex justify-center">
        <div className="flex items-center">
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
            <button type="submit" className="btn btn-primary w-full mt-4">
                Submit
              </button>
            </form>

          </Card>
        </div>
      </Main>
      <Footer />
    </PageWrapper>
  );
};

export default Register;
