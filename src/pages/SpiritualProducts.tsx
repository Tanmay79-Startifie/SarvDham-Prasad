import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Bell, Gift, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  stock_quantity: number;
  categories: {
    name: string;
  } | null;
}

const SpiritualProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Set up real-time subscription for spiritual products
  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('spiritual-products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: 'type=eq.spiritual_products'
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name)
        `)
        .eq('type', 'spiritual_products')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching spiritual products:', error);
      toast({
        title: "Error",
        description: "Failed to load spiritual products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const comingSoonProducts = [
    {
      category: "माला और रुद्राक्ष",
      englishCategory: "Mala & Rudraksha",
      icon: "📿",
      items: ["तुलसी माला", "रुद्राक्ष माला", "कृष्ण माला", "Tulsi Mala", "Rudraksha Mala", "Krishna Mala"]
    },
    {
      category: "मूर्तियां",
      englishCategory: "Murtis & Idols",
      icon: "🕉️",
      items: ["राधा कृष्ण मूर्ति", "गणेश मूर्ति", "हनुमान मूर्ति", "Radha Krishna Murti", "Ganesha Murti", "Hanuman Murti"]
    },
    {
      category: "पवित्र जल",
      englishCategory: "Sacred Water",
      icon: "💧",
      items: ["गंगा जल", "यमुना जल", "गोमती चक्र", "Ganga Jal", "Yamuna Jal", "Gomti Chakra"]
    },
    {
      category: "पूजा सामग्री",
      englishCategory: "Pooja Items",
      icon: "🪔",
      items: ["धूप अगरबत्ती", "कपूर", "पुष्प माला", "Dhoop Agarbatti", "Camphor", "Flower Garlands"]
    },
    {
      category: "ग्रंथ और मंत्र",
      englishCategory: "Books & Mantras",
      icon: "📖",
      items: ["भगवद गीता", "हनुमान चालीसा", "विष्णु सहस्रनाम", "Bhagavad Gita", "Hanuman Chalisa", "Vishnu Sahasranama"]
    },
    {
      category: "यंत्र और तावीज़",
      englishCategory: "Yantras & Amulets",
      icon: "🔯",
      items: ["श्री यंत्र", "हनुमान यंत्र", "गणेश यंत्र", "Shri Yantra", "Hanuman Yantra", "Ganesha Yantra"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-4xl">🙏</div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary">
                आध्यात्मिक उत्पाद
              </h1>
              <div className="text-4xl">🙏</div>
            </div>
            <p className="text-elderly-lg text-muted-foreground mb-4">
              Spiritual Products
            </p>
            <div className="w-24 h-1 bg-gradient-divine mx-auto rounded-full"></div>
          </div>

          {/* Available Products */}
          {products.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  उपलब्ध आध्यात्मिक उत्पाद
                </h2>
                <p className="text-elderly-lg text-muted-foreground">
                  Available Spiritual Products
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-divine transition-all duration-500 hover:scale-105 border-2 border-border hover:border-primary/30 rounded-3xl overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                      {product.image_url && (
                        <div className="w-full h-48 bg-gradient-sunset rounded-2xl overflow-hidden">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="space-y-3">
                        <h3 className="text-elderly-xl font-bold text-card-foreground">
                          {product.name}
                        </h3>
                        {product.categories && (
                          <p className="text-elderly-base text-primary font-medium">
                            📦 {product.categories.name}
                          </p>
                        )}
                        <p className="text-elderly-sm text-muted-foreground">
                          {product.description || 'Premium spiritual product for your devotional needs'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            ₹{(product.base_price / 100).toFixed(0)}
                          </p>
                          <p className="text-elderly-sm text-muted-foreground">
                            Stock: {product.stock_quantity} units
                          </p>
                        </div>
                        <Button variant="divine" size="lg">
                          <ShoppingCart className="w-5 h-5" />
                          Order Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Coming Soon Section */}
          {products.length === 0 && (
            <div className="max-w-4xl mx-auto mb-16">
              <Card className="bg-gradient-divine text-primary-foreground border-none rounded-3xl overflow-hidden shadow-divine">
                <CardContent className="p-12 text-center space-y-8">
                  <div className="relative">
                    <div className="text-8xl mb-6 floating-diya">🕉️</div>
                    <div className="absolute -top-4 -right-4 text-4xl floating-diya" style={{ animationDelay: "1s" }}>✨</div>
                    <div className="absolute -bottom-4 -left-4 text-3xl floating-diya" style={{ animationDelay: "2s" }}>🌟</div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold">जल्द आ रहा है</h2>
                    <h3 className="text-2xl md:text-3xl font-medium opacity-90">Coming Soon</h3>

                    <p className="text-elderly-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
                      हम आपके लिए सभी आध्यात्मिक उत्पादों का एक व्यापक संग्रह तैयार कर रहे हैं।
                      माला, मूर्तियां, गंगा जल, और अन्य पवित्र वस्तुएं जल्द ही उपलब्ध होंगी।
                    </p>

                    <p className="text-elderly-base opacity-70 italic max-w-2xl mx-auto">
                      We are preparing a comprehensive collection of all spiritual products for you.
                      Mala, murtis, Ganga jal, and other sacred items will be available soon.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button
                      variant="outline"
                      size="xl"
                      className="w-full flex items-center justify-center gap-2
             border-2 border-orange-700 text-orange-800 bg-white
             hover:bg-orange-600 hover:text-white hover:border-orange-600
             font-semibold rounded-lg transition-all duration-300 text-base sm:text-lg"
                    >
                      <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Notify Me When Ready</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="xl"
                      className="w-full flex items-center justify-center gap-2
             border-2 border-orange-700 text-orange-800 bg-white
             hover:bg-orange-600 hover:text-white hover:border-orange-600
             font-semibold rounded-lg transition-all duration-300 text-base sm:text-lg"
                    >
                      <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Request Product</span>
                    </Button>

                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Product Categories Preview */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                आने वाले उत्पाद श्रेणियां
              </h2>
              <p className="text-elderly-lg text-muted-foreground">
                Upcoming Product Categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {comingSoonProducts.map((category, index) => (
                <Card key={index} className="group hover:shadow-divine transition-all duration-500 hover:scale-105 border-2 border-border hover:border-primary/30 rounded-3xl overflow-hidden">
                  <CardContent className="p-8 text-center space-y-6">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-elderly-xl font-bold text-card-foreground">
                        {category.category}
                      </h3>
                      <p className="text-elderly-lg text-primary font-medium">
                        {category.englishCategory}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className={`p-2 rounded-lg text-elderly-sm ${itemIndex % 2 === 0
                          ? "bg-gradient-sunset text-card-foreground"
                          : "text-muted-foreground"
                          }`}>
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="bg-accent/10 rounded-full px-4 py-2 border border-accent/20">
                        <p className="text-elderly-sm text-accent font-medium">
                          {products.length > 0 ? 'अधिक आ रहे हैं | More Coming' : 'जल्द उपलब्ध | Coming Soon'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>


        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SpiritualProducts;