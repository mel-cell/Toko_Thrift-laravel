import React from "react";
import UserHeader from "../../../components/header/userheader";
import Footer from "../../../components/footer/footer";

export default function DashboardLayout({ children }) {
  return (
    <>
      <UserHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}
