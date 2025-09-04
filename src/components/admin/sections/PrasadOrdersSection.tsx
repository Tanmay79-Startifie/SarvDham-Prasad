import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, Package, Calendar, User, MapPin, Phone, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  pincode: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  order_date: string;
  delivery_date: string;
  weight: string;
  quantity: number;
  notes: string;
  products: {
    name: string;
    type: string;
    temples?: {
      name: string;
      locations: {
        name: string;
      };
    };
  };
}

const PrasadOrdersSection = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrasadOrders();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('prasad-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchPrasadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPrasadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products!inner (
            name,
            type,
            temples (
              name,
              locations (name)
            )
          )
        `)
        .eq('products.type', 'prasad')
        .order('order_date', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching prasad orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch prasad orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading prasad orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary">Prasad Orders</h2>
        <p className="text-muted-foreground text-elderly-base">
          View and manage prasad order details
        </p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="shadow-soft hover:shadow-divine transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-elderly-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Order #{order.id.slice(0, 8)}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {order.products?.name} - {order.products?.temples?.name}, {order.products?.temples?.locations?.name}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge className={getPaymentStatusColor(order.payment_status)}>
                    {order.payment_status === 'completed' ? 'PAID' : order.payment_status.toUpperCase()}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewOrder(order)}
                    className="h-8 w-8"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                  </div>
                </div>
                 <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-muted-foreground" />
                   <div>
                     <p className="font-medium">
                       {new Date(order.order_date).toLocaleDateString()}
                     </p>
                     <p className="text-sm text-muted-foreground">
                       Qty: {order.quantity} | Weight: {order.weight}
                     </p>
                   </div>
                 </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{order.city}, {order.pincode}</p>
                    <p className="font-medium">Total: ₹{(order.total_amount / 100).toFixed(0)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Badge className={getPaymentStatusColor(order.payment_status)}>
                      {order.payment_status === 'completed' ? 'PAID' : order.payment_status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-elderly-lg font-semibold mb-2">No Prasad Orders Found</h3>
            <p className="text-muted-foreground">
              Prasad orders will appear here when customers place them.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                    <p className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedOrder.customer_phone}
                    </p>
                    <p className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedOrder.customer_email}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Prasad Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Item:</strong> {selectedOrder.products?.name}</p>
                    <p><strong>Temple:</strong> {selectedOrder.products?.temples?.name}</p>
                    <p><strong>Location:</strong> {selectedOrder.products?.temples?.locations?.name}</p>
                    <p><strong>Weight:</strong> {selectedOrder.weight}</p>
                    <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                    <p><strong>Amount:</strong> <span className="text-lg font-bold text-primary">₹{(selectedOrder.total_amount / 100).toFixed(0)}</span></p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Delivery Address
                </h4>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">
                  {selectedOrder.delivery_address}<br/>
                  {selectedOrder.city} - {selectedOrder.pincode}
                </p>
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold mb-3">Special Instructions</h4>
                  <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Payment Status</h4>
                  <Badge className={getPaymentStatusColor(selectedOrder.payment_status)}>
                    {selectedOrder.payment_status === 'completed' ? 'PAYMENT SUCCESSFUL' : selectedOrder.payment_status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Order Date</h4>
                  <p className="text-sm">
                    {new Date(selectedOrder.order_date).toLocaleString('hi-IN', {
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrasadOrdersSection;