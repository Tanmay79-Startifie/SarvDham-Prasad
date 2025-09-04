import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutSection from "@/components/home/AboutSection";
import CallToActionSections from "@/components/home/CallToActionSections";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSlideshow />
        <FeaturedProducts />
        <AboutSection />
        <CallToActionSections />
        <TestimonialsSection />
        <WhyChooseSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;