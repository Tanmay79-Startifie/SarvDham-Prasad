import { Button } from "@/components/ui/button";
import { Heart, Users, Shield, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import srv1 from "@/assets/srv1.jpg";
import srv2 from "@/assets/srv2.jpeg";
import srv3 from "@/assets/srv3.jpg";
import srv4 from "@/assets/sarv4.jpg";
import srv5 from "@/assets/srv5.jpg";
import srv6 from "@/assets/srv6.jpg";
import srv7 from "@/assets/srv7.jpg";
import srv8 from "@/assets/srv8.jpg";


const AboutSection = () => {
  const slideImages = [
    { src: srv1, alt: " Temple" },
    { src: srv2, alt: " Temple" },
    { src: srv3, alt: " Temple" },
    { src: srv4, alt: " Temple" },
    { src: srv5, alt: " Temple" },
    { src: srv6, alt: " Temple" },
    { src: srv7, alt: " Temple" },
    { src:srv8, alt: " Temple" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, [slideImages.length]);

  const features = [
    {
      icon: Heart,
      title: "भक्ति भाव",
      subtitle: "Devotional Spirit",
      description: "प्रत्येक प्रसाद भक्ति भाव से तैयार किया जाता है"
    },
    {
      icon: Shield,
      title: "गुणवत्ता",
      subtitle: "Quality Assured",
      description: "शुद्ध और ताज़ा प्रसाद की गारंटी"
    },
    {
      icon: Clock,
      title: "तत्काल डिलीवरी",
      subtitle: "Quick Delivery",
      description: "आपके घर तक त्वरित और सुरक्षित पहुंच"
    },
    {
      icon: Users,
      title: "भक्त परिवार",
      subtitle: "Devotee Family",
      description: "हजारों संतुष्ट भक्तों का विश्वास"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-divine rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary">
                  हमारे बारे में
                </h2>
              </div>
              <h3 className="text-2xl md:text-3xl font-medium text-muted-foreground">
                About Our Divine Mission
              </h3>
            </div>

            <div className="space-y-6 text-elderly-lg leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-primary">सर्वधाम प्रसाद</strong> का उद्देश्य ब्रज धाम के पवित्र मंदिरों से प्राप्त 
                दिव्य प्रसाद को आपके घर तक पहुंचाना है। हम मानते हैं कि भगवान का प्रसाद हर भक्त का अधिकार है।
              </p>
              
              <p>
                Our mission at <strong className="text-primary">SarvDham Prasad</strong> is to bridge the 
                distance between devotees and the sacred temples of Braj Dham. We ensure that the divine 
                blessings reach every devotee's home with complete purity and devotion.
              </p>

              <p className="text-accent font-medium bg-accent/10 p-4 rounded-xl border border-accent/20">
                "प्रसादे सर्वदुःखानां हानिरस्योपजायते" - प्रसाद से सभी दुःखों का नाश होता है।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-card rounded-xl border border-border hover:shadow-soft transition-all">
                    <div className="w-12 h-12 bg-gradient-golden rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-elderly-base font-semibold text-card-foreground">
                        {feature.title}
                      </h4>
                      <p className="text-elderly-sm text-primary font-medium">
                        {feature.subtitle}
                      </p>
                      <p className="text-elderly-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative bg-gradient-sunset rounded-3xl p-8 shadow-divine">
              {/* Slideshow Container */}
              <div className="relative w-full h-[650px] rounded-2xl overflow-hidden">
                {slideImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                      index === currentSlide 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-105'
                    }`}
                  />
                ))}
                
                {/* Slide indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slideImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              
            </div>
            
            {/* Stats overlay */}
            <div className="absolute bottom-8 left-8 right-8 bg-background/95 backdrop-blur-md rounded-2xl p-6 border border-border shadow-soft">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">50+</p>
                  <p className="text-elderly-sm text-muted-foreground">मंदिर</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">10K+</p>
                  <p className="text-elderly-sm text-muted-foreground">भक्त</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">5★</p>
                  <p className="text-elderly-sm text-muted-foreground">रेटिंग</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;