import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/shared/HeroSection";
import FeaturesSection from "@/components/shared/FeatureSection";
import HowItWorksSection from "@/components/shared/HowItWork";
import PricingSection from "@/components/shared/PricingSection";
import TestimonialsSection from "@/components/shared/TestimonialsSection";
import FAQSection from "@/components/shared/FAQSection";
import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";

const Index = () => (
  <div className="min-h-screen ">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <PricingSection />
    <TestimonialsSection />
    <FAQSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
