import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Star, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  temples: {
    name: string;
    locations: {
      name: string;
    };
  };
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          image_url,
          base_price,
          temples (
            name,
            locations (
              name
            )
          )
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(3);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-sunset">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              लोकप्रिय प्रसाद
            </h2>
            <p className="text-elderly-lg text-muted-foreground">
              Our Most Selling Prasad
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-sunset">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-8 h-8 text-primary">🌟</div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              लोकप्रिय प्रसाद
            </h2>
            <div className="w-8 h-8 text-primary">🌟</div>
          </div>
          <p className="text-elderly-lg text-muted-foreground">
            Our Most Selling Prasad
          </p>
          <div className="w-24 h-1 bg-gradient-divine mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-divine transition-all duration-500 hover:scale-105 bg-card border-2 border-border hover:border-primary/30 rounded-2xl overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-gradient-divine text-primary-foreground px-3 py-1 rounded-full flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-elderly-sm font-medium">Featured</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-elderly-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm sm:text-elderly-base text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs sm:text-elderly-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{product.temples?.locations?.name} - {product.temples?.name}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-border gap-3 sm:gap-0">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-elderly-sm text-muted-foreground">Starting from</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      {formatPrice(product.base_price)}
                      <span className="text-xs sm:text-elderly-sm text-muted-foreground ml-1">/½kg</span>
                    </p>
                  </div>
                  
                  <Button variant="divine" size="default" className="divine-glow w-full sm:w-auto">
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Book Now</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="xl" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <ShoppingBag className="w-6 h-6" />
            सभी प्रसाद देखें | View All Prasad
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;