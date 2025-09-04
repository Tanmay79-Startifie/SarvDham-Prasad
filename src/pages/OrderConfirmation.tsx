import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, MapPin, Calendar, Phone, Mail, CreditCard, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  pincode: string;
  productName: string;
  quantity: number;
  weight: string;
  totalAmount: number;
  paymentId: string;
  orderDate: string;
  notes?: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Get order details from navigation state
    const details = location.state?.orderDetails;
    if (details) {
      setOrderDetails(details);
    } else {
      // If no order details, redirect to prasadam page
      navigate('/prasadam');
    }
  }, [location.state, navigate]);

  const handleBackToPrasadam = () => {
    navigate('/prasadam');
  };

  const handleTrackOrder = () => {
    // Future implementation for order tracking
    alert("Order tracking feature will be available soon!");
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-divine rounded-full flex items-center justify-center shadow-divine mx-auto mb-4 animate-pulse">
            <span className="text-2xl text-primary-foreground">ॐ</span>
          </div>
          <p className="text-elderly-lg text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              भुगतान सफल! 🙏
            </h1>
            <p className="text-elderly-lg text-muted-foreground mb-4">
              Payment Successful! Your prasadam order has been confirmed.
            </p>
            <Badge variant="default" className="bg-green-100 text-green-800 text-lg px-4 py-2">
              Order Confirmed
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Package className="w-6 h-6" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-elderly-sm text-muted-foreground">Order ID</p>
                    <p className="font-semibold text-elderly-base">#{orderDetails.orderId.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-elderly-sm text-muted-foreground">Order Date</p>
                    <p className="font-semibold text-elderly-base">
                      {new Date(orderDetails.orderDate).toLocaleDateString('hi-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-elderly-lg mb-3">Product Details</h4>
                  <div className="bg-gradient-sunset p-4 rounded-xl">
                    <p className="font-semibold text-elderly-lg text-card-foreground mb-2">{orderDetails.productName}</p>
                    <div className="grid grid-cols-2 gap-4 text-elderly-sm">
                      <div>
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="ml-2 font-medium">{orderDetails.weight} kg</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="ml-2 font-medium">{orderDetails.quantity}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-elderly-base text-muted-foreground">Total Amount:</span>
                        <span className="text-2xl font-bold text-primary">
                          ₹{(orderDetails.totalAmount / 100).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {orderDetails.notes && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-elderly-base mb-2">Special Instructions</h4>
                    <p className="text-elderly-sm text-muted-foreground">{orderDetails.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer & Delivery Details */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Mail className="w-6 h-6" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-elderly-sm font-medium text-primary">
                        {orderDetails.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-elderly-base">{orderDetails.customerName}</p>
                      <p className="text-elderly-sm text-muted-foreground">Customer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <p className="text-elderly-sm">{orderDetails.customerEmail}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <p className="text-elderly-sm">{orderDetails.customerPhone}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <MapPin className="w-6 h-6" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold text-elderly-base">{orderDetails.customerName}</p>
                    <p className="text-elderly-sm text-muted-foreground">{orderDetails.deliveryAddress}</p>
                    <p className="text-elderly-sm text-muted-foreground">
                      {orderDetails.city}, {orderDetails.pincode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CreditCard className="w-6 h-6" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-elderly-sm text-muted-foreground">Payment ID:</span>
                    <span className="text-elderly-sm font-medium">{orderDetails.paymentId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-elderly-sm text-muted-foreground">Status:</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Paid
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-elderly-sm text-muted-foreground">Amount:</span>
                    <span className="text-elderly-base font-semibold text-primary">
                      ₹{(orderDetails.totalAmount / 100).toFixed(0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button variant="outline" onClick={handleBackToPrasadam} className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Button>
            <Button variant="divine" onClick={handleTrackOrder} className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Track Order
            </Button>
          </div>

          {/* Additional Information */}
          <Card className="mt-8 bg-gradient-sunset border border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-elderly-xl font-bold text-card-foreground mb-2">
                Delivery Information
              </h3>
              <p className="text-elderly-base text-muted-foreground mb-4">
                Your prasadam will be prepared with devotion and delivered to your address within 3-5 business days.
              </p>
              <p className="text-elderly-sm text-muted-foreground">
                For any queries, please contact our support team at support@brajdivinedelivery.com
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;