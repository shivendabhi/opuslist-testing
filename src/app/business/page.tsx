import { Header } from "@/b2bSections/Header";
import Hero from "@/b2bSections/Hero";
import { LogoTicker } from "@/b2bSections/LogoTicker";
import { ProductShowcase } from "@/b2bSections/ProductShowcase";
import Pricing from "@/b2bSections/Pricing";
import { CallToAction } from "@/b2bSections/CallToAction";
import { Footer } from "@/b2bSections/Footer";
import FeatureShowcase from "@/b2bSections/featureShowcase";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <LogoTicker />
      <FeatureShowcase />
      <Pricing />
      <CallToAction />
      <Footer />
    </>
  );
}
