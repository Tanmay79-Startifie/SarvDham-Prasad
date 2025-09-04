import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "होम", href: "/", label: "Home" },
    { name: "प्रसादम्", href: "/prasadam", label: "Prasadam" },
    { name: "आध्यात्मिक उत्पाद", href: "/spiritual-products", label: "Spiritual Products" },
    { name: "संपर्क", href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-background/98 via-background/95 to-background/98 backdrop-blur-lg border-b border-gradient-to-r from-transparent via-border to-transparent shadow-elegant">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 lg:space-x-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-divine rounded-xl flex items-center justify-center shadow-golden group-hover:shadow-golden-lg transition-all duration-300 group-hover:scale-110">
              <span className="text-xl lg:text-2xl text-primary-foreground font-bold group-hover:animate-pulse">ॐ</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base lg:text-lg font-bold bg-gradient-divine bg-clip-text text-transparent leading-none">
                ब्रज दिव्य डिलीवरी
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground leading-none">
                Braj Divine Delivery
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-3 bg-muted/30 rounded-full px-4 py-2 backdrop-blur-sm border border-border/50">
            {navigation.map((item, index) => (
              <Link key={item.href} to={item.href} className="group">
                <Button
                  variant={isActive(item.href) ? "divine" : "ghost"}
                  size="default"
                  className={`
                    text-base xl:text-lg px-4 xl:px-6 py-2 rounded-full transition-all duration-300
                    ${isActive(item.href) 
                      ? 'bg-gradient-divine text-primary-foreground shadow-golden transform scale-105' 
                      : 'hover:bg-gradient-to-r hover:from-primary/10 hover:to-saffron/10 hover:text-primary hover:scale-105'
                    }
                  `}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Contact Info & Mobile Menu */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="hidden xl:flex items-center space-x-4 text-sm text-muted-foreground bg-muted/20 rounded-full px-4 py-2 border border-border/30">
              <div className="flex items-center space-x-1 hover:text-primary transition-colors">
                <Phone className="w-3 h-3" />
                <span className="hidden 2xl:inline">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-primary transition-colors">
                <MapPin className="w-3 h-3" />
                <span className="hidden 2xl:inline">Mathura, UP</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 rounded-full hover:bg-gradient-divine hover:text-primary-foreground transition-all duration-300 hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gradient-to-r from-transparent via-border to-transparent py-4 space-y-2 animate-fade-in bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-sm rounded-b-xl">
            {navigation.map((item, index) => (
              <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)} className="block">
                <Button
                  variant={isActive(item.href) ? "divine" : "ghost"}
                  size="lg"
                  className={`
                    w-full justify-start text-base rounded-xl transition-all duration-300
                    ${isActive(item.href) 
                      ? 'bg-gradient-divine text-primary-foreground shadow-golden' 
                      : 'hover:bg-gradient-to-r hover:from-primary/10 hover:to-saffron/10 hover:text-primary hover:translate-x-2'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            <div className="pt-4 border-t border-border/50 space-y-3 bg-muted/20 rounded-xl p-4 mt-4">
              <div className="flex items-center space-x-2 text-base text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-base text-muted-foreground hover:text-primary transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Mathura, Uttar Pradesh</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;