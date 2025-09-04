import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, MapPin, Star, Weight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface Temple {
  id: string;
  name: string;
  description: string;
  image_url: string;
  location_id: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  weights: any; // JSON field from database
  temples: Temple & { locations: Location };
}

interface BookingModalProps {
  product: Product | null;
  selectedWeight: string;
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string, options?: any) => void;
}

const BookingModal = ({ product, selectedWeight, isOpen, onClose, navigate }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    city: '',
    pincode: '',
    quantity: 1,
    notes: ''
  });

  if (!isOpen || !product) return null;

  const getPrice = (weight: string) => {
    const multiplier = parseFloat(weight);
    return Math.round(product.base_price * multiplier * 2);
  };

  const totalAmount = getPrice(selectedWeight) * formData.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        deliveryAddress: formData.deliveryAddress,
        city: formData.city,
        pincode: formData.pincode,
        productId: product.id,
        productName: product.name,
        quantity: formData.quantity,
        weight: selectedWeight,
        notes: formData.notes || ''
      };

      // Create Razorpay payment order
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'create-razorpay-payment',
        {
          body: { orderData, amount: totalAmount }
        }
      );

      if (paymentError || !paymentData.success) {
        throw new Error(paymentData?.error || 'Failed to create payment order');
      }

      // Initialize Razorpay payment
      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Sacred Prasad',
        description: `${product.name} - ${selectedWeight} kg`,
        order_id: paymentData.razorpayOrderId,
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          paylater: true
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'verify-razorpay-payment',
              {
                body: {
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                  orderId: paymentData.orderId
                }
              }
            );

            if (verifyError || !verifyData.success) {
              throw new Error('Payment verification failed');
            }

            // Navigate to confirmation page with order details
            navigate('/order-confirmation', {
              state: {
                orderDetails: {
                  orderId: paymentData.orderId,
                  customerName: formData.customerName,
                  customerEmail: formData.customerEmail,
                  customerPhone: formData.customerPhone,
                  deliveryAddress: formData.deliveryAddress,
                  city: formData.city,
                  pincode: formData.pincode,
                  productName: product.name,
                  quantity: formData.quantity,
                  weight: selectedWeight,
                  totalAmount: totalAmount,
                  paymentId: response.razorpay_payment_id,
                  orderDate: new Date().toISOString(),
                  notes: formData.notes || ''
                }
              }
            });
            
            onClose();
            setFormData({
              customerName: '',
              customerEmail: '',
              customerPhone: '',
              deliveryAddress: '',
              city: '',
              pincode: '',
              quantity: 1,
              notes: ''
            });
          } catch (verifyErr) {
            console.error('Payment verification error:', verifyErr);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.customerName,
          email: formData.customerEmail,
          contact: formData.customerPhone
        },
        theme: {
          color: '#F97316'
        }
      };

      // Load Razorpay script if not already loaded
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('भुगतान में त्रुटि। Payment error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-primary/20 shadow-divine">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-divine rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-primary">प्रसाद बुक करें</h2>
            <p className="text-elderly-lg text-muted-foreground">Book Your Prasad</p>
          </div>

          <div className="bg-gradient-sunset p-6 rounded-2xl border border-primary/20">
            <h3 className="text-elderly-lg font-semibold text-card-foreground mb-3">{product.name}</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-elderly-base text-muted-foreground">Weight: {selectedWeight} kg</p>
                <p className="text-elderly-base text-muted-foreground">Quantity: {formData.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">₹{(totalAmount / 100).toFixed(0)}</p>
                <p className="text-elderly-sm text-muted-foreground">Total Amount</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                  नाम | Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                  मोबाइल | Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  className="w-full p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                ईमेल | Email *
              </label>
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                className="w-full p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                पूरा पता | Complete Address *
              </label>
              <textarea
                required
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                className="w-full p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                rows={3}
                placeholder="House/Flat No., Street, Area, Landmark"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                  शहर | City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                  placeholder="Your city"
                />
              </div>
              
              <div>
                <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                  पिन कोड | PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  className="w-full p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                  placeholder="110001"
                />
              </div>
            </div>

            <div>
              <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                मात्रा | Quantity
              </label>
              <select
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                className="w-full p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
              >
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-elderly-base font-medium text-card-foreground mb-2">
                विशेष निर्देश | Special Instructions
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-4 text-elderly-base border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                rows={2}
                placeholder="Any special instructions for delivery"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                type="button" 
                variant="outline" 
                size="lg" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="divine" 
                size="lg"
                className="flex-1"
              >
                <ShoppingBag className="w-5 h-5" />
                ₹{(totalAmount / 100).toFixed(0)} - Pay Now
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PrasadamProducts = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedTemple, setSelectedTemple] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    selectedWeight: string;
  }>({
    isOpen: false,
    product: null,
    selectedWeight: '0.5'
  });

  // Set up real-time subscription for prasad products
  useEffect(() => {
    const channel = supabase
      .channel('prasad-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: 'type=eq.prasad'
        },
        () => {
          if (selectedTemple) {
            fetchProducts(selectedTemple);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedTemple]);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchTemples(selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedTemple) {
      fetchProducts(selectedTemple);
    }
  }, [selectedTemple]);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setLocations(data || []);
      if (data && data.length > 0) {
        setSelectedLocation(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemples = async (locationId: string) => {
    try {
      const { data, error } = await supabase
        .from('temples')
        .select('*')
        .eq('location_id', locationId)
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setTemples(data || []);
      if (data && data.length > 0) {
        setSelectedTemple(data[0].id);
      } else {
        // Clear temple selection and products if no temples found for this location
        setSelectedTemple('');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching temples:', error);
    }
  };

  const fetchProducts = async (templeId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          temples (
            *,
            locations (*)
          )
        `)
        .eq('temple_id', templeId)
        .eq('is_active', true)
        .eq('type', 'prasad')
        .order('display_order');

      if (error) throw error;
      // Process the weights field which comes as JSON
      const processedData = (data || []).map(product => ({
        ...product,
        weights: Array.isArray(product.weights) ? product.weights : JSON.parse(String(product.weights) || '["0.5", "1", "2"]')
      }));
      setProducts(processedData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const openBookingModal = (product: Product, weight: string) => {
    setBookingModal({
      isOpen: true,
      product,
      selectedWeight: weight
    });
  };

  const closeBookingModal = () => {
    setBookingModal({
      isOpen: false,
      product: null,
      selectedWeight: '0.5'
    });
  };

  const getPrice = (basePrice: number, weight: string) => {
    const multiplier = parseFloat(weight);
    return Math.round(basePrice * multiplier * 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">🕉️</div>
            <p className="text-elderly-lg text-muted-foreground">Loading sacred prasad...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Location Selection */}
      <div className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          स्थान चुनें | Select Location
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-6">
          {locations.map((location) => (
            <Card
              key={location.id}
              className={`cursor-pointer hover:shadow-divine transition-all duration-300 hover:scale-105 ${
                selectedLocation === location.id 
                  ? 'border-2 border-primary shadow-divine' 
                  : 'border border-border'
              } rounded-2xl overflow-hidden`}
              onClick={() => setSelectedLocation(location.id)}
            >
              <CardContent className="p-2 sm:p-4 lg:p-6 text-center space-y-2 sm:space-y-4">
                <div className="text-2xl sm:text-3xl lg:text-4xl">🏛️</div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-elderly-lg font-bold text-card-foreground">{location.name}</h3>
                  <p className="text-xs sm:text-sm lg:text-elderly-sm text-muted-foreground">{location.description}</p>
                </div>
                {selectedLocation === location.id && (
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    Selected
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Temple Selection */}
      {temples.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
            मंदिर चुनें | Select Temple
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {temples.map((temple) => (
              <Card 
                key={temple.id}
                className={`cursor-pointer hover:shadow-divine transition-all duration-300 hover:scale-105 ${
                  selectedTemple === temple.id 
                    ? 'border-2 border-primary shadow-divine' 
                    : 'border border-border'
                } rounded-2xl overflow-hidden relative h-32 sm:h-40 lg:h-48`}
                onClick={() => setSelectedTemple(temple.id)}
                style={{
                  backgroundImage: temple.image_url ? `url(${temple.image_url})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                
                <CardContent className="p-2 sm:p-4 lg:p-6 text-center space-y-2 sm:space-y-4 relative z-10 h-full flex flex-col justify-center">
                  {!temple.image_url && (
                    <div className="text-2xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4">🛕</div>
                  )}
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-elderly-lg font-bold text-white drop-shadow-lg">{temple.name}</h3>
                    <p className="text-xs sm:text-sm lg:text-elderly-sm text-white/90 drop-shadow-lg">{temple.description}</p>
                  </div>
                  {selectedTemple === temple.id && (
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {products.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
            प्रसाद चुनें | Select Prasad
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-divine transition-all duration-500 hover:scale-105 border-2 border-border hover:border-primary/30 rounded-3xl overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-divine text-primary-foreground px-3 py-2 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-elderly-sm font-medium">Sacred</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-elderly-lg lg:text-elderly-xl font-bold text-card-foreground">{product.name}</h3>
                    <p className="text-sm sm:text-elderly-sm lg:text-elderly-base text-muted-foreground leading-relaxed">{product.description}</p>
                    
                    <div className="flex items-center space-x-2 text-elderly-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{product.temples.locations.name} - {product.temples.name}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-elderly-lg font-semibold text-card-foreground flex items-center space-x-2">
                      <Weight className="w-5 h-5" />
                      <span>Available Weights</span>
                    </h4>
                    
                    <div className="space-y-3">
                      {product.weights.map((weight) => (
                        <div key={weight} className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gradient-sunset rounded-xl border border-border">
                          <div className="space-y-1">
                            <p className="text-sm sm:text-elderly-sm lg:text-elderly-base font-medium text-card-foreground">{weight} kg</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                              ₹{(getPrice(product.base_price, weight) / 100).toFixed(0)}
                            </p>
                          </div>
                          <Button 
                            variant="divine" 
                            size="sm"
                            onClick={() => openBookingModal(product, weight)}
                            className="divine-glow text-xs sm:text-sm"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span className="hidden sm:inline">Book Now</span>
                            <span className="sm:hidden">Book</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <BookingModal
        product={bookingModal.product}
        selectedWeight={bookingModal.selectedWeight}
        isOpen={bookingModal.isOpen}
        onClose={closeBookingModal}
        navigate={navigate}
      />
    </div>
  );
};

export default PrasadamProducts;