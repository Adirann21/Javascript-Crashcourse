import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Main from "../components/Main";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";

const Register = () => {
    return (
        <PageWrapper>
            <Header />
            <Main><Card></Card></Main>
            <Footer />
        </PageWrapper>
    );
};

export default Register;