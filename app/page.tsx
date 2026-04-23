import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import PageLoader from "./components/PageLoader";
import StarField from "./components/StarField";

export default function Home() {
  return (
    <>
      <PageLoader />
      <CustomCursor />
      <StarField />
      <Header />

      <main className="relative z-10">
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Contact />
      </main>

      <Footer />
    </>
  );
}


