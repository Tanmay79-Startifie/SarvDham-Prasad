import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Shield, Clock, Heart, Phone, Star } from "lucide-react";

const WhyChooseSection = () => {
  const features = [
    {
      icon: Heart,
      title: "भक्ति भाव से सेवा",
      subtitle: "Service with Devotion",
      description: "प्रत्येक प्रसाद भक्ति भाव और श्रद्धा से तैयार किया जाता है",
      color: "bg-gradient-saffron"
    },
    {
      icon: Truck,
      title: "तत्काल डिलीवरी",
      subtitle: "Fast Delivery",
      description: "24-48 घंटों में आपके घर तक सुरक्षित पहुंच",
      color: "bg-gradient-golden"
    },
    {
      icon: Shield,
      title: "शुद्धता की गारंटी",
      subtitle: "Purity Guaranteed",
      description: "100% शुद्ध और ताज़ा प्रसाद की गारंटी",
      color: "bg-gradient-divine"
    },
    {
      icon: Clock,
      title: "24/7 सेवा",
      subtitle: "24/7 Service",
      description: "दिन-रात उपलब्ध ग्राहक सेवा और सहायता",
      color: "bg-accent"
    }
  ];

  return (
    <section className="py-20 bg-gradient-sunset">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-4xl">✨</div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              हमें क्यों चुनें
            </h2>
            <div className="text-4xl">✨</div>
          </div>
          <p className="text-elderly-lg text-muted-foreground">
            Why Choose Braj Divine Delivery
          </p>
          <div className="w-24 h-1 bg-gradient-divine mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-divine transition-all duration-500 hover:scale-105 border-2 border-border hover:border-primary/30 rounded-3xl overflow-hidden">
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`w-20 h-20 ${feature.color} rounded-full flex items-center justify-center mx-auto shadow-golden`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-elderly-lg font-bold text-card-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-elderly-base text-primary font-medium">
                      {feature.subtitle}
                    </p>
                    <p className="text-elderly-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-primary text-primary-foreground border-none rounded-3xl overflow-hidden">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-5xl font-bold">50+</div>
              <div className="space-y-1">
                <p className="text-elderly-lg font-semibold">पवित्र मंदिर</p>
                <p className="text-elderly-base opacity-90">Sacred Temples</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent text-accent-foreground border-none rounded-3xl overflow-hidden">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-5xl font-bold">10K+</div>
              <div className="space-y-1">
                <p className="text-elderly-lg font-semibold">खुश भक्त</p>
                <p className="text-elderly-base opacity-90">Happy Devotees</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary text-accent border-none rounded-3xl overflow-hidden">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-5xl font-bold">
                <span>5</span>
                <Star className="w-10 h-10 fill-current" />
              </div>
              <div className="space-y-1">
                <p className="text-elderly-lg font-semibold">रेटिंग</p>
                <p className="text-elderly-base opacity-90">Star Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <Card className="inline-block bg-background border-2 border-primary/30 rounded-3xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <Phone className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <p className="text-elderly-lg font-semibold text-card-foreground">
                    सहायता चाहिए? | Need Help?
                  </p>
                  <p className="text-elderly-base text-primary font-medium">
                    +91 98765 43210
                  </p>
                </div>
              </div>
              <Button variant="divine" size="lg">
                <Phone className="w-5 h-5" />
                अभी कॉल करें | Call Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;