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
import { Plus, Edit, Trash2, Building2, Upload, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";

interface Temple {
  id: string;
  name: string;
  description: string;
  image_url: string;
  location_id: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  locations: {
    name: string;
  };
}

interface Location {
  id: string;
  name: string;
}

interface TempleForm {
  name: string;
  description: string;
  image_url: string;
  location_id: string;
}

const TemplesSection = () => {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemple, setEditingTemple] = useState<Temple | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, control, watch } = useForm<TempleForm>();

  useEffect(() => {
    fetchTemples();
    fetchLocations();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('temples-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'temples'
        },
        () => {
          fetchTemples();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTemples = async () => {
    try {
      const { data, error } = await supabase
        .from('temples')
        .select(`
          *,
          locations (name)
        `)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTemples(data || []);
    } catch (error) {
      console.error('Error fetching temples:', error);
      toast({
        title: "Error",
        description: "Failed to fetch temples",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setValue('image_url', publicUrl);
      setImagePreview(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setValue('image_url', '');
    setImagePreview(null);
  };

  const onSubmit = async (data: TempleForm) => {
    try {
      if (editingTemple) {
        const { error } = await supabase
          .from('temples')
          .update(data)
          .eq('id', editingTemple.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Temple updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('temples')
          .insert([data]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Temple created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingTemple(null);
      reset();
    } catch (error) {
      console.error('Error saving temple:', error);
      toast({
        title: "Error",
        description: "Failed to save temple",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (temple: Temple) => {
    setEditingTemple(temple);
    setValue('name', temple.name);
    setValue('description', temple.description || '');
    setValue('image_url', temple.image_url || '');
    setValue('location_id', temple.location_id);
    setImagePreview(temple.image_url || null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this temple?')) return;

    try {
      const { error } = await supabase
        .from('temples')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Temple deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting temple:', error);
      toast({
        title: "Error",
        description: "Failed to delete temple",
        variant: "destructive",
      });
    }
  };

  const handleNewTemple = () => {
    setEditingTemple(null);
    reset();
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading temples...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Temples Management</h2>
          <p className="text-muted-foreground text-elderly-base">
            Manage temples in different locations
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewTemple} className="gap-2 bg-gradient-divine shadow-divine">
              <Plus className="w-4 h-4" />
              Add Temple
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTemple ? 'Edit Temple' : 'Add New Temple'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Temple Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Krishna Janmabhoomi"
                  {...register("name", { required: true })}
                />
              </div>
              
              <div>
                <Label htmlFor="location_id">Location *</Label>
                <Controller
                  name="location_id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
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
                  placeholder="Describe this sacred temple..."
                  {...register("description")}
                />
              </div>
              
              <div>
                <Label>Temple Image</Label>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Upload temple image</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                  {uploadingImage && (
                    <p className="text-sm text-muted-foreground">Uploading image...</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-divine">
                  {editingTemple ? 'Update' : 'Create'} Temple
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
        {temples.map((temple) => (
          <Card key={temple.id} className="shadow-soft hover:shadow-divine transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <CardTitle className="text-elderly-lg">{temple.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(temple)}
                    className="h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(temple.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="w-full h-32 rounded-md mb-3 bg-cover bg-center bg-gray-100 flex items-center justify-center"
                style={{
                  backgroundImage: temple.image_url ? `url(${temple.image_url})` : 'none'
                }}
              >
                {!temple.image_url && (
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <p className="text-primary text-sm mb-2">
                📍 {temple.locations?.name}
              </p>
              <p className="text-muted-foreground text-sm mb-2">
                {temple.description || 'No description'}
              </p>
              <div className="flex justify-end items-center text-xs text-muted-foreground">
                <span className={`px-2 py-1 rounded ${
                  temple.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {temple.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {temples.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-elderly-lg font-semibold mb-2">No Temples Found</h3>
            <p className="text-muted-foreground mb-4">
              {locations.length === 0 
                ? "Please add locations first before adding temples."
                : "Start by adding your first temple."
              }
            </p>
            {locations.length > 0 && (
              <Button onClick={handleNewTemple} className="bg-gradient-divine">
                <Plus className="w-4 h-4 mr-2" />
                Add First Temple
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TemplesSection;