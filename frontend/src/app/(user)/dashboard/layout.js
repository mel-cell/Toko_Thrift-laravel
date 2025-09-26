import React from "react";
import UserHeader from "../../../components/header/userheader";
import Footer from "../../../components/footer/footer";
import DashboardPage from "./page";

export default function DashboardLayout({ children }) {
  return (
    <>
    <UserHeader />
      <main className=" min-h-screen">
        <DashboardPage />
      </main>
     <Footer /> 
    </>
  );
}
