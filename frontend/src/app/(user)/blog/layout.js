import UserHeader from "../../../components/header/userheader";
import Footer from "../../../components/footer/footer";

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
