import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Heart, Clock } from "lucide-react";
import logo from "/srvdham-logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-sunset border-t border-border">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-divine rounded-xl flex items-center justify-center shadow-golden">
                <img
                  src={logo}
                  alt="SarvdhamPrasad Logo"
                  className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                />
              </div>

              <div>
                <h3 className="text-lg sm:text-elderly-xl font-bold text-primary">
                  सर्वधाम प्रसाद
                </h3>
                <p className="text-sm sm:text-elderly-base text-muted-foreground">
                  SarvDham Prasad
                </p>
              </div>
            </div>
            <p className="text-sm sm:text-elderly-base text-muted-foreground leading-relaxed">
              ब्रज धाम के पवित्र मंदिरों से आपके घर तक दिव्य प्रसाद की पहुंच।
              Bringing sacred prasad from Braj Dham temples to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-elderly-lg font-semibold text-primary">त्वरित लिंक</h4>
            <nav className="space-y-3">
              <Link to="/" className="block text-sm sm:text-elderly-base text-muted-foreground hover:text-primary transition-colors">
                होम
              </Link>
              <Link to="/prasadam" className="block text-elderly-base text-muted-foreground hover:text-primary transition-colors">
                प्रसादम्
              </Link>
              <Link to="/spiritual-products" className="block text-elderly-base text-muted-foreground hover:text-primary transition-colors">
                आध्यात्मिक उत्पाद
              </Link>
              <Link to="/contact" className="block text-elderly-base text-muted-foreground hover:text-primary transition-colors">
                संपर्क करें
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-elderly-lg font-semibold text-primary">संपर्क जानकारी</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-elderly-base text-muted-foreground">
                    श्री कृष्ण जन्मभूमि मार्ग<br />
                    मथुरा, उत्तर प्रदेश 281001
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <p className="text-elderly-base text-muted-foreground">+91 98765 43210</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <p className="text-elderly-base text-muted-foreground">contact@brajdivine.com</p>
              </div>
            </div>
          </div>

          {/* Service Hours */}
          <div className="space-y-4">
            <h4 className="text-elderly-lg font-semibold text-primary">सेवा समय</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-elderly-base text-muted-foreground">
                    <strong>दैनिक सेवा:</strong><br />
                    प्रातः 5:00 - रात्रि 10:00
                  </p>
                  <p className="text-elderly-sm text-muted-foreground mt-2">
                    Daily Service: 5:00 AM - 10:00 PM
                  </p>
                </div>
              </div>
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <p className="text-elderly-sm text-accent font-medium text-center">
                  त्योहारों पर विशेष सेवा उपलब्ध<br />
                  <span className="text-elderly-sm">Special service during festivals</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-elderly-base text-muted-foreground text-center md:text-left">
              © 2024 ब्रज दिव्य डिलीवरी। सभी अधिकार सुरक्षित।
            </p>
            <div className="flex items-center space-x-2 text-elderly-base text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-5 h-5 text-accent fill-current" />
              <span>for devotees</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;