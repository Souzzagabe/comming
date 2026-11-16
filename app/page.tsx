import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import Experience from "./components/Experience";

export default function Home() {
  return (
    <>
      <PageLoader />
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <Header />

      <main id="conteudo" className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Services />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
