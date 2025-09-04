import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "श्रीमती सुनीता देवी",
    englishName: "Smt. Sunita Devi",
    location: "दिल्ली",
    englishLocation: "Delhi",
    rating: 5,
    testimonial: "ब्रज दिव्य डिलीवरी से मिला प्रसाद बिल्कुल मंदिर जैसा ताज़ा और शुद्ध था। भगवान का आशीर्वाद घर तक पहुंच गया।",
    englishTestimonial: "The prasad from Braj Divine Delivery was as fresh and pure as from the temple. Lord's blessings reached our home.",
    image: "/placeholder.svg"
  },
  {
    name: "श्री राम किशोर शर्मा",
    englishName: "Shri Ram Kishore Sharma",
    location: "गुड़गांव",
    englishLocation: "Gurgaon",
    rating: 5,
    testimonial: "बांके बिहारी का प्रसाद इतनी जल्दी घर पहुंचा कि हैरान रह गए। पैकिंग भी बहुत अच्छी थी।",
    englishTestimonial: "Banke Bihari's prasad reached home so quickly, we were amazed. Packaging was also excellent.",
    image: "/placeholder.svg"
  },
  {
    name: "श्रीमती मीरा जी",
    englishName: "Smt. Meera Ji",
    location: "जयपुर",
    englishLocation: "Jaipur",
    rating: 5,
    testimonial: "राधा रानी मंदिर का प्रसाद मिलने से घर में दिव्यता का अनुभव हुआ। धन्यवाद!",
    englishTestimonial: "Receiving prasad from Radha Rani temple brought divine feelings to our home. Thank you!",
    image: "/placeholder.svg"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-4xl">🙏</div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              भक्तों के अनुभव
            </h2>
            <div className="text-4xl">🙏</div>
          </div>
          <p className="text-elderly-lg text-muted-foreground">
            Devotees' Experiences
          </p>
          <div className="w-24 h-1 bg-gradient-divine mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-divine transition-all duration-500 hover:scale-105 bg-gradient-sunset border-2 border-border hover:border-primary/30 rounded-3xl overflow-hidden">
              <CardContent className="p-8 space-y-6">
                {/* Quote Icon */}
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-gradient-divine rounded-full flex items-center justify-center">
                    <Quote className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex justify-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <div className="space-y-4 text-center">
                  <blockquote className="text-elderly-base text-card-foreground leading-relaxed">
                    "{testimonial.testimonial}"
                  </blockquote>
                  <p className="text-elderly-sm text-muted-foreground italic">
                    "{testimonial.englishTestimonial}"
                  </p>
                </div>

                {/* User Info */}
                <div className="flex items-center justify-center space-x-4 pt-4 border-t border-border">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.englishName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-border bg-muted"
                  />
                  <div className="text-center">
                    <h4 className="text-elderly-base font-semibold text-card-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-elderly-sm text-primary font-medium">
                      {testimonial.englishName}
                    </p>
                    <p className="text-elderly-sm text-muted-foreground">
                      {testimonial.location} | {testimonial.englishLocation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto bg-accent/10 rounded-3xl p-8 border-2 border-accent/20">
            <div className="text-6xl mb-4">🕉️</div>
            <blockquote className="text-2xl md:text-3xl font-medium text-accent mb-4">
              "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
            </blockquote>
            <p className="text-elderly-lg text-muted-foreground italic">
              "May all beings be happy, may all beings be healthy"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;