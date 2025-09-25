import React from "react";
import UserHeader from "../../../components/header/userheader";
import Footer from "../../../components/footer/footer";

export default function ShopLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
