import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import WellnessBenefitsSection from "@/components/WellnessBenefitsSection";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";
import GallerySection from "@/components/GallerySection";
import SpaPacksSection from "@/components/SpaPacksSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/hooks/useSiteContent";

const Index = () => {
  const { content, loading } = useSiteContent();

  if (loading) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection content={content.hero} />
      <AboutSection content={content.about} />
      <SpaPacksSection />
      <WhyChooseUsSection content={content.whyChooseUs} />
      <WellnessBenefitsSection content={content.wellness} />
      <PremiumFeaturesSection content={content.premiumFeatures} />
      <GallerySection content={content.gallery} />
      <ContactSection content={content.contact} />
      <Footer content={content.footer} />
    </div>
  );
};

export default Index;
