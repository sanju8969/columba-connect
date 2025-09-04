import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Upload, X } from 'lucide-react';

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  created_at: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', description: '', image_url: '' });
  const { toast } = useToast();

  useEffect(() => {
    // Database integration will be added once types are updated
    setIsLoading(false);
  }, []);

  const fetchImages = async () => {
    // Placeholder - will connect to database once types are updated
    setIsLoading(false);
  };

  const handleAddImage = async () => {
    if (!newImage.title || !newImage.image_url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Placeholder - will connect to database once types are updated
    toast({
      title: "Info",
      description: "Database integration pending - types updating",
    });
  };

  const handleDeleteImage = async (id: string) => {
    // Placeholder - will connect to database once types are updated
    toast({
      title: "Info", 
      description: "Database integration pending - types updating",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-20">
      <div className="container-width">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">College Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the vibrant campus life and memories of St. Columba's College
          </p>
        </div>

        {isAdmin && (
          <div className="mb-8 flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Add Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={newImage.title}
                      onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                      placeholder="Enter image title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newImage.description}
                      onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                      placeholder="Enter image description"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Image URL *</label>
                    <Input
                      value={newImage.image_url}
                      onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
                      placeholder="Enter image URL"
                    />
                  </div>
                  <Button onClick={handleAddImage} className="w-full">
                    <Upload size={16} className="mr-2" />
                    Add Image
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No images in gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden hover-lift">
                <div className="relative">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-64 object-cover"
                  />
                  {isAdmin && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-muted-foreground">{image.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;