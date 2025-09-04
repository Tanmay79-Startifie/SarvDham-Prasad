import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  LogOut, 
  MapPin, 
  Building2, 
  Utensils, 
  Package, 
  ShoppingCart,
  Star
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import LocationsSection from "./sections/LocationsSection";
import TemplesSection from "./sections/TemplesSection";
import PrasadSection from "./sections/PrasadSection";
import ProductsSection from "./sections/ProductsSection";
import PrasadOrdersSection from "./sections/PrasadOrdersSection";
import ProductOrdersSection from "./sections/ProductOrdersSection";

interface AdminDashboardProps {
  user: User;
}

export type AdminSection = 
  | "dashboard" 
  | "locations" 
  | "temples" 
  | "prasad" 
  | "products" 
  | "prasad-orders" 
  | "product-orders";

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const sectionComponents = {
    dashboard: <DashboardOverview />,
    locations: <LocationsSection />,
    temples: <TemplesSection />,
    prasad: <PrasadSection />,
    products: <ProductsSection />,
    "prasad-orders": <PrasadOrdersSection />,
    "product-orders": <ProductOrdersSection />,
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="bg-card border-b border-border p-4 shadow-soft">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
              <p className="text-muted-foreground">Welcome, {user.email}</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-6">
          {sectionComponents[activeSection]}
        </main>
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    locations: 0,
    temples: 0,
    products: 0,
    loading: true
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch locations count
      const { count: locationsCount } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch temples count
      const { count: templesCount } = await supabase
        .from('temples')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch products count (both prasad and spiritual products)
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        locations: locationsCount || 0,
        temples: templesCount || 0,
        products: productsCount || 0,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  if (stats.loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground text-elderly-base">
            Loading dashboard data...
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-soft animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="w-20 h-4 bg-muted rounded"></div>
                <div className="w-4 h-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="w-8 h-8 bg-muted rounded mb-1"></div>
                <div className="w-16 h-3 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground text-elderly-base">
          Manage your Braj Divine Delivery platform
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.locations}</div>
            <p className="text-xs text-muted-foreground">
              Active locations
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Temples</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.temples}</div>
            <p className="text-xs text-muted-foreground">
              Registered temples
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-muted-foreground">
              Prasad & spiritual items
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            <span>Manage Locations</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <span>Manage Temples</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Utensils className="w-6 h-6 text-primary" />
            <span>Add Prasad</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;