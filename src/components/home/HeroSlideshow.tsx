import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroMathura from "@/assets/mathura.jpg";
import heroVrindavan from "@/assets/vrindha.jpg";
import heroBarsana from "@/assets/brsana.jpg";

const slides = [
  {
    image: heroMathura,
    title: "श्री कृष्ण जन्मभूमि",
    subtitle: "Krishna Janmabhoomi",
    quote: "जन्म कर्म च मे दिव्यम्",
    englishQuote: "My birth and activities are divine",
    description: "मथुरा से पवित्र प्रसाद मंगवाएं",
    englishDescription: "Order sacred prasad from Mathura"
  },
  {
    image: heroVrindavan,
    title: "वृंदावन धाम",
    subtitle: "Vrindavan Dham",
    quote: "राधे कृष्ण राधे कृष्ण",
    englishQuote: "Radhe Krishna Radhe Krishna",
    description: "बांके बिहारी के दिव्य प्रसाद का आनंद लें",
    englishDescription: "Enjoy divine prasad from Banke Bihari"
  },
  {
    image: heroBarsana,
    title: "बरसाना धाम",
    subtitle: "Barsana Dham",
    quote: "राधे राधे श्याम",
    englishQuote: "Radhe Radhe Shyam",
    description: "राधा रानी के पावन प्रसाद से मन पावन करें",
    englishDescription: "Purify your heart with Radha Rani's sacred prasad"
  }
];

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-screen sm:h-[80vh] lg:h-[85vh] overflow-hidden rounded-b-3xl">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
      ))}

      

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-2 py-4 sm:px-4 sm:py-8">
        <div className="container mx-auto max-w-full overflow-hidden">
          <div className="max-w-4xl px-2 sm:px-4 w-full">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${
                  index === currentSlide 
                    ? "opacity-100 translate-x-0" 
                    : "opacity-0 translate-x-8"
                }`}
              >
                {index === currentSlide && (
                    <div className="space-y-3 sm:space-y-4 md:space-y-6 text-white m-2">
                   

                    {/* Title */}
                    <div className="space-y-1 sm:space-y-2">
                      <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        {slide.title}
                      </h1>
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-primary-glow">
                        {slide.subtitle}
                      </h2>
                    </div>

                    {/* Quote */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-primary-glow/30 max-w-full sm:max-w-2xl">
                      <blockquote className="space-y-1 sm:space-y-2 md:space-y-3">
                        <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-medium text-center">
                          "{slide.quote}"
                        </p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-glow text-center italic">
                          "{slide.englishQuote}"
                        </p>
                      </blockquote>
                    </div>

                    {/* Description */}
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium">
                        {slide.description}
                      </p>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-glow">
                        {slide.englishDescription}
                      </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                      <Link to="/prasadam" className="w-full sm:w-auto">
                        <Button variant="divine" size="lg" className="w-full h-12 sm:h-14 text-base sm:text-lg bg-gradient-saffron hover:bg-gradient-divine text-primary-foreground font-bold shadow-divine hover:shadow-golden transform hover:scale-105 transition-all duration-300">
                          <Sparkles className="w-6 h-6" />
                          प्रसाद ऑर्डर करें
                        </Button>
                      </Link>
                      <Link to="/spiritual-products" className="w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="w-full h-12 sm:h-14 text-base sm:text-lg border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary font-bold shadow-soft hover:shadow-divine transform hover:scale-105 transition-all duration-300"
                        >
                          <Sparkles className="w-6 h-6" />
                          आध्यात्मिक उत्पाद
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5 sm:w-8 sm:h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all ${
              index === currentSlide 
                ? "bg-primary-glow scale-110 sm:scale-125" 
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlideshow;