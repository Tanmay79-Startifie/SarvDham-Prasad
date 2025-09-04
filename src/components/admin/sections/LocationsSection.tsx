import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";

interface Location {
  id: string;
  name: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

interface LocationForm {
  name: string;
  description: string;
}

const LocationsSection = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue } = useForm<LocationForm>();

  useEffect(() => {
    fetchLocations();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('locations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'locations'
        },
        () => {
          fetchLocations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch locations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LocationForm) => {
    try {
      if (editingLocation) {
        const { error } = await supabase
          .from('locations')
          .update(data)
          .eq('id', editingLocation.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Location updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('locations')
          .insert([data]);

        if (error) throw error;
        
        toast({
          title: "Success", 
          description: "Location created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingLocation(null);
      reset();
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: "Error",
        description: "Failed to save location",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setValue('name', location.name);
    setValue('description', location.description || '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      });
    }
  };

  const handleNewLocation = () => {
    setEditingLocation(null);
    reset();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading locations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Locations Management</h2>
          <p className="text-muted-foreground text-elderly-base">
            Manage sacred locations for temples
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewLocation} className="gap-2 bg-gradient-divine shadow-divine">
              <Plus className="w-4 h-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Location Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Mathura, Vrindavan"
                  {...register("name", { required: true })}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this sacred location..."
                  {...register("description")}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-divine">
                  {editingLocation ? 'Update' : 'Create'} Location
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <Card key={location.id} className="shadow-soft hover:shadow-divine transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <CardTitle className="text-elderly-lg">{location.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(location)}
                    className="h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(location.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {location.image_url && (
                <img 
                  src={location.image_url} 
                  alt={location.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              <p className="text-muted-foreground text-sm mb-2">
                {location.description || 'No description'}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Order: {location.display_order}</span>
                <span className={`px-2 py-1 rounded ${
                  location.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {location.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {locations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-elderly-lg font-semibold mb-2">No Locations Found</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first sacred location.
            </p>
            <Button onClick={handleNewLocation} className="bg-gradient-divine">
              <Plus className="w-4 h-4 mr-2" />
              Add First Location
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationsSection;