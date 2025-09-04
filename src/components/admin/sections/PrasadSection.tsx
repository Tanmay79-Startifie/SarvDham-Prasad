import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Utensils, Upload } from "lucide-react";
import { useForm, Controller } from "react-hook-form";

interface Prasad {
  id: string;
  name: string;
  description: string;
  image_url: string;
  temple_id: string;
  base_price: number;
  weights: any;
  display_order: number;
  is_active: boolean;
  created_at: string;
  temples: {
    name: string;
    locations: {
      name: string;
    };
  };
}

interface Temple {
  id: string;
  name: string;
  locations: {
    name: string;
  };
}

interface PrasadForm {
  name: string;
  description: string;
  image_url: string;
  temple_id: string;
  base_price: number;
  weight_05_price: number;
  weight_1_price: number;
  weight_2_price: number;
}

const PrasadSection = () => {
  const [prasads, setPrasads] = useState<Prasad[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingPrasad, setEditingPrasad] = useState<Prasad | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, control } = useForm<PrasadForm>();

  useEffect(() => {
    fetchPrasads();
    fetchTemples();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('prasad-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: "type=eq.prasad"
        },
        () => {
          fetchPrasads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPrasads = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          temples (
            name,
            locations (name)
          )
        `)
        .eq('type', 'prasad')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPrasads(data || []);
    } catch (error) {
      console.error('Error fetching prasads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch prasads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTemples = async () => {
    try {
      const { data, error } = await supabase
        .from('temples')
        .select(`
          id, 
          name,
          locations (name)
        `)
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setTemples(data || []);
    } catch (error) {
      console.error('Error fetching temples:', error);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `prasad/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setValue('image_url', imageUrl);
      toast({ title: "Image uploaded successfully!" });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: PrasadForm) => {
    try {
      const weights = ["0.5", "1", "2"];
      const prasadData = {
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        temple_id: data.temple_id,
        base_price: Math.round(data.weight_05_price * 100), // 0.5kg price as base price in cents
        weights: weights,
        display_order: 0,
        type: 'prasad' as const,
        currency: 'INR',
        stock_quantity: 999,
        prep_time_minutes: 30
      };

      if (editingPrasad) {
        const { error } = await supabase
          .from('products')
          .update(prasadData)
          .eq('id', editingPrasad.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Prasad updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([prasadData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Prasad created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingPrasad(null);
      reset();
    } catch (error) {
      console.error('Error saving prasad:', error);
      toast({
        title: "Error",
        description: "Failed to save prasad",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (prasad: Prasad) => {
    setEditingPrasad(prasad);
    setValue('name', prasad.name);
    setValue('description', prasad.description || '');
    setValue('image_url', prasad.image_url || '');
    setValue('temple_id', prasad.temple_id || '');
    setValue('weight_05_price', prasad.base_price / 100); // Convert from cents
    setValue('weight_1_price', Math.round((prasad.base_price * 2) / 100)); // Estimate 2x price for 1kg
    setValue('weight_2_price', Math.round((prasad.base_price * 3.5) / 100)); // Estimate 3.5x price for 2kg
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prasad?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Prasad deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting prasad:', error);
      toast({
        title: "Error",
        description: "Failed to delete prasad",
        variant: "destructive",
      });
    }
  };

  const handleNewPrasad = () => {
    setEditingPrasad(null);
    reset();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading prasads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Prasad Management</h2>
          <p className="text-muted-foreground text-elderly-base">
            Manage sacred prasad offerings from temples
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewPrasad} className="gap-2 bg-gradient-divine shadow-divine">
              <Plus className="w-4 h-4" />
              Add Prasad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPrasad ? 'Edit Prasad' : 'Add New Prasad'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Prasad Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Laddu Prasad"
                  {...register("name", { required: true })}
                />
              </div>
              
              <div>
                <Label htmlFor="temple_id">Temple *</Label>
                <Controller
                  name="temple_id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select temple" />
                      </SelectTrigger>
                      <SelectContent>
                        {temples.map((temple) => (
                          <SelectItem key={temple.id} value={temple.id}>
                            {temple.name} - {temple.locations?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this prasad..."
                  {...register("description")}
                />
              </div>
              
              <div>
                <Label htmlFor="image_url">Prasad Image</Label>
                <div className="space-y-2">
                  <Input
                    id="image_url"
                    placeholder="https://example.com/prasad.jpg"
                    {...register("image_url")}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload Image"}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="weight_05_price">0.5kg Price (₹)</Label>
                  <Input
                    id="weight_05_price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("weight_05_price", { valueAsNumber: true, required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="weight_1_price">1kg Price (₹)</Label>
                  <Input
                    id="weight_1_price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("weight_1_price", { valueAsNumber: true, required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="weight_2_price">2kg Price (₹)</Label>
                  <Input
                    id="weight_2_price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("weight_2_price", { valueAsNumber: true, required: true })}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-divine">
                  {editingPrasad ? 'Update' : 'Create'} Prasad
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
        {prasads.map((prasad) => (
          <Card key={prasad.id} className="shadow-soft hover:shadow-divine transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" />
                  <CardTitle className="text-elderly-lg">{prasad.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(prasad)}
                    className="h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(prasad.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {prasad.image_url && (
                <img 
                  src={prasad.image_url} 
                  alt={prasad.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              <p className="text-primary text-sm mb-2">
                🏛️ {prasad.temples?.name} - {prasad.temples?.locations?.name}
              </p>
              <p className="text-muted-foreground text-sm mb-3">
                {prasad.description || 'No description'}
              </p>
              <div className="space-y-1 mb-3">
                <p className="text-sm font-medium">Prices:</p>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <span>0.5kg: ₹{(prasad.base_price / 100).toFixed(2)}</span>
                  <span>1kg: ₹{((prasad.base_price * 2) / 100).toFixed(2)}</span>
                  <span>2kg: ₹{((prasad.base_price * 3.5) / 100).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className={`px-2 py-1 rounded ${
                  prasad.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {prasad.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {prasads.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-elderly-lg font-semibold mb-2">No Prasads Found</h3>
            <p className="text-muted-foreground mb-4">
              {temples.length === 0 
                ? "Please add temples first before adding prasads."
                : "Start by adding your first prasad offering."
              }
            </p>
            {temples.length > 0 && (
              <Button onClick={handleNewPrasad} className="bg-gradient-divine">
                <Plus className="w-4 h-4 mr-2" />
                Add First Prasad
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrasadSection;