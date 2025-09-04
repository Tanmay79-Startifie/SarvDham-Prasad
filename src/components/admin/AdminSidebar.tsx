import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Menu,
  X,
  LayoutDashboard,
  MapPin, 
  Building2, 
  Utensils, 
  Package, 
  ShoppingCart,
  FileText
} from "lucide-react";
import { AdminSection } from "./AdminDashboard";

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (section: AdminSection) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AdminSidebar = ({ 
  activeSection, 
  setActiveSection, 
  isOpen, 
  setIsOpen 
}: AdminSidebarProps) => {
  const menuItems = [
    {
      id: "dashboard" as AdminSection,
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview"
    },
    {
      id: "locations" as AdminSection,
      label: "Locations",
      icon: MapPin,
      description: "Manage locations"
    },
    {
      id: "temples" as AdminSection,
      label: "Temples",
      icon: Building2,
      description: "Manage temples"
    },
    {
      id: "prasad" as AdminSection,
      label: "Prasad",
      icon: Utensils,
      description: "Manage prasad items"
    },
    {
      id: "products" as AdminSection,
      label: "Spiritual Products",
      icon: Package,
      description: "Manage products"
    },
    {
      id: "prasad-orders" as AdminSection,
      label: "Prasad Orders",
      icon: ShoppingCart,
      description: "View prasad orders"
    },
    {
      id: "product-orders" as AdminSection,
      label: "Product Orders",
      icon: FileText,
      description: "View product orders"
    },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-card border-r border-border shadow-divine transition-all duration-300 z-50 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-divine rounded-lg flex items-center justify-center">
                <span className="text-lg text-primary-foreground">ॐ</span>
              </div>
              <div>
                <h3 className="font-bold text-primary">Admin Panel</h3>
                <p className="text-xs text-muted-foreground">Management</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-8"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-3 ${
                isActive 
                  ? "bg-gradient-divine text-primary-foreground shadow-golden" 
                  : "hover:bg-muted"
              } ${!isOpen ? "px-2" : ""}`}
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className={`w-5 h-5 ${isOpen ? "mr-3" : ""}`} />
              {isOpen && (
                <div className="flex flex-col items-start">
                  <span className="font-medium">{item.label}</span>
                  <span className={`text-xs ${
                    isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}>
                    {item.description}
                  </span>
                </div>
              )}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;