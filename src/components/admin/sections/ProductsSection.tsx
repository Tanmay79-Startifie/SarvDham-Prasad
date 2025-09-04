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
import { Plus, Edit, Trash2, Package, Upload } from "lucide-react";
import { useForm, Controller } from "react-hook-form";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category_id: string;
  base_price: number;
  stock_quantity: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  categories: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface ProductForm {
  name: string;
  description: string;
  image_url: string;
  category_id: string;
  base_price: number;
  stock_quantity: number;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, control } = useForm<ProductForm>();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: "type=eq.spiritual_products"
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
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `spiritual-products/${fileName}`;

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

  const onSubmit = async (data: ProductForm) => {
    try {
      const productData = {
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        category_id: data.category_id,
        base_price: Math.round(data.base_price * 100), // Convert to cents
        stock_quantity: data.stock_quantity,
        display_order: 0,
        type: 'spiritual_products' as const,
        currency: 'INR',
        weights: ["1"], // Spiritual products typically don't have weight variants
        prep_time_minutes: 0
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      reset();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('description', product.description || '');
    setValue('image_url', product.image_url || '');
    setValue('category_id', product.category_id || '');
    setValue('base_price', product.base_price / 100); // Convert from cents
    setValue('stock_quantity', product.stock_quantity);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    reset();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Spiritual Products Management</h2>
          <p className="text-muted-foreground text-elderly-base">
            Manage spiritual products and religious items
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewProduct} className="gap-2 bg-gradient-divine shadow-divine">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Rudraksha Mala"
                  {...register("name", { required: true })}
                />
              </div>
              
              <div>
                <Label htmlFor="category_id">Category</Label>
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                  placeholder="Describe this spiritual product..."
                  {...register("description")}
                />
              </div>
              
              <div>
                <Label htmlFor="image_url">Product Image</Label>
                <div className="space-y-2">
                  <Input
                    id="image_url"
                    placeholder="https://example.com/product.jpg"
                    {...register("image_url")}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="product-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('product-image-upload')?.click()}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload Image"}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="base_price">Price (₹) *</Label>
                  <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("base_price", { valueAsNumber: true, required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    min="0"
                    {...register("stock_quantity", { valueAsNumber: true })}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-divine">
                  {editingProduct ? 'Update' : 'Create'} Product
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
        {products.map((product) => (
          <Card key={product.id} className="shadow-soft hover:shadow-divine transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <CardTitle className="text-elderly-lg">{product.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(product)}
                    className="h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {product.image_url && (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              {product.categories && (
                <p className="text-primary text-sm mb-2">
                  📦 {product.categories.name}
                </p>
              )}
              <p className="text-muted-foreground text-sm mb-3">
                {product.description || 'No description'}
              </p>
              <div className="space-y-2 mb-3">
                <p className="text-lg font-semibold text-primary">
                  ₹{(product.base_price / 100).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stock_quantity} units
                </p>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className={`px-2 py-1 rounded ${
                  product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {products.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-elderly-lg font-semibold mb-2">No Spiritual Products Found</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first spiritual product.
            </p>
            <Button onClick={handleNewProduct} className="bg-gradient-divine">
              <Plus className="w-4 h-4 mr-2" />
              Add First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductsSection;