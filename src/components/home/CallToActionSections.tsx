import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Sparkles, ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import prasadOfferings from "@/assets/prasad-offerings.jpg";

const CallToActionSections = () => {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-gradient-sunset">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Prasad Section */}
          <Card className="group hover:shadow-divine transition-all duration-500 hover:scale-105 bg-gradient-saffron border-none overflow-hidden rounded-3xl">
            <div className="relative">
              <img
                src={prasadOfferings}
                alt="Sacred Prasad"
                className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Floating elements */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-lg sm:text-xl floating-diya">🪔</div>
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 text-base sm:text-lg floating-diya" style={{ animationDelay: "1s" }}>🌺</div>
            </div>

            <CardContent className="p-3 sm:p-4 md:p-6 text-center space-y-3 sm:space-y-4 text-primary-foreground">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  प्रसाद ग्रहण करें
                </h3>
                <p className="text-sm sm:text-base md:text-lg font-medium opacity-90">
                  Receive Divine Prasad
                </p>

                <p className="text-xs sm:text-sm md:text-base leading-relaxed opacity-80 hidden sm:block">
                  ब्रज धाम के पवित्र मंदिरों से ताज़ा और शुद्ध प्रसाद का आनंद लें।
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm opacity-90">
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>50+ मंदिर</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>100% शुद्ध</span>
                  </div>
                </div>

                <Link to="/prasadam">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 
             border-2 border-orange-700 text-orange-800 bg-white 
             hover:bg-orange-600 hover:text-white hover:border-orange-600 
             font-semibold rounded-lg transition-all duration-300 text-xs sm:text-sm mt-3"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>प्रसाद ऑर्डर करें</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>

                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Spiritual Products Section */}
          <Card className="group hover:shadow-divine transition-all duration-500 hover:scale-105 bg-gradient-divine border-none overflow-hidden rounded-3xl">
            <div className="relative">
              <div className="w-full h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-3xl sm:text-4xl md:text-6xl">🕉️</div>
                  <div className="text-lg sm:text-xl md:text-2xl space-x-2">
                    <span>📿</span>
                    <span>🔱</span>
                    <span>💧</span>
                  </div>
                </div>
              </div>

              {/* Coming Soon Badge */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-accent text-accent-foreground px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-soft">
                जल्द आ रहा है
              </div>

              {/* Floating elements */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-lg sm:text-xl floating-diya">🌟</div>
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 text-base sm:text-lg floating-diya" style={{ animationDelay: "1.5s" }}>🚩</div>
            </div>

            <CardContent className="p-3 sm:p-4 md:p-6 text-center space-y-3 sm:space-y-4 text-primary-foreground">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  घर शुद्धी करें
                </h3>
                <p className="text-sm sm:text-base md:text-lg font-medium opacity-90">
                  Purify Your Home
                </p>

                <p className="text-xs sm:text-sm md:text-base leading-relaxed opacity-80 hidden sm:block">
                  आध्यात्मिक उत्पादों से अपने घर को पावन बनाएं।
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm opacity-90">
                  <div className="flex items-center space-x-1">
                    <span>📿</span>
                    <span>माला</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <span>🏺</span>
                    <span>जल</span>
                  </div>
                </div>

                <Link to="/spiritual-products">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2
             border-2 border-orange-700 text-orange-800 bg-white
             hover:bg-orange-600 hover:text-white hover:border-orange-600
             font-semibold rounded-lg transition-all duration-300 text-xs sm:text-sm mt-3"
                  >
                    <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>जल्द उपलब्ध</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>

                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSections;