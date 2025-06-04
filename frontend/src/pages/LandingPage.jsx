import NavBar from "@/components/NavBar";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import ContentSection from "@/components/ContentSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Gallery from "@/components/Gallery";
import VisitUs from "@/components/VisitUs";
import BrandSection from "@/components/BrandSection";
import Newletter from "@/components/Newletter";
import Footer from "@/components/Footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <NavBar />
      <Hero />
      <ContentSection />
      <Gallery />
      <VisitUs />
      <BrandSection />
      <Newletter />
      <Footer />
    </div>
  );
}

export default LandingPage;
