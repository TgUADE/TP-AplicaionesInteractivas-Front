import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children, showFooter = true }) => {
  return (
    <div className="w-full m-0 p-0 min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;