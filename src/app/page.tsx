import Header from "@/b2cSections/Header";
import Hero from "@/b2cSections/Hero";
import { LogoTicker } from "@/b2bSections/LogoTicker";
import ProductShowcase from "@/b2cSections/ProductShowcase";
import Pricing from "@/b2cSections/Pricing";
import CallToAction from "@/b2cSections/CallToAction";
import Footer from "@/b2cSections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <Pricing />
      <CallToAction />
      <Footer />
    </>
  );
}
