import UserHeader from "../../../components/header/userheader";
import Footer from "../../../components/footer/footer";

export default function PaymentMethodsLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
