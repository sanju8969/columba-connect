import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Mail, Phone, Briefcase, Calendar, X } from 'lucide-react';

interface Alumni {
  id: string;
  name: string;
  graduation_year: number;
  course: string;
  current_position?: string;
  company?: string;
  email?: string;
  phone?: string;
  bio?: string;
  created_at: string;
}

const Alumni = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAlumni, setNewAlumni] = useState({
    name: '',
    graduation_year: new Date().getFullYear(),
    course: '',
    current_position: '',
    company: '',
    email: '',
    phone: '',
    bio: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Database integration will be added once types are updated
    setIsLoading(false);
  }, []);

  const fetchAlumni = async () => {
    // Placeholder - will connect to database once types are updated
    setIsLoading(false);
  };

  const handleAddAlumni = async () => {
    if (!newAlumni.name || !newAlumni.course) {
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

  const handleDeleteAlumni = async (id: string) => {
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
          <h1 className="text-4xl font-display font-bold mb-4">Our Alumni</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with our distinguished alumni network and explore their achievements
          </p>
        </div>

        {isAdmin && (
          <div className="mb-8 flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Add Alumni
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Alumni</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      value={newAlumni.name}
                      onChange={(e) => setNewAlumni({ ...newAlumni, name: e.target.value })}
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Graduation Year</label>
                    <Input
                      type="number"
                      value={newAlumni.graduation_year}
                      onChange={(e) => setNewAlumni({ ...newAlumni, graduation_year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Course *</label>
                    <Input
                      value={newAlumni.course}
                      onChange={(e) => setNewAlumni({ ...newAlumni, course: e.target.value })}
                      placeholder="Enter course"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Current Position</label>
                    <Input
                      value={newAlumni.current_position}
                      onChange={(e) => setNewAlumni({ ...newAlumni, current_position: e.target.value })}
                      placeholder="Enter position"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <Input
                      value={newAlumni.company}
                      onChange={(e) => setNewAlumni({ ...newAlumni, company: e.target.value })}
                      placeholder="Enter company"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={newAlumni.email}
                      onChange={(e) => setNewAlumni({ ...newAlumni, email: e.target.value })}
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={newAlumni.phone}
                      onChange={(e) => setNewAlumni({ ...newAlumni, phone: e.target.value })}
                      placeholder="Enter phone"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={newAlumni.bio}
                      onChange={(e) => setNewAlumni({ ...newAlumni, bio: e.target.value })}
                      placeholder="Enter bio"
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2">
                    <Button onClick={handleAddAlumni} className="w-full">
                      Add Alumni
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {alumni.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No alumni profiles available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumni.map((person) => (
              <Card key={person.id} className="hover-lift">
                <CardHeader className="relative">
                  <CardTitle className="flex items-center justify-between">
                    <span>{person.name}</span>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAlumni(person.id)}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    <span>Class of {person.graduation_year}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-primary">{person.course}</p>
                  </div>
                  
                  {person.current_position && (
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-muted-foreground" />
                      <span className="text-sm">
                        {person.current_position}
                        {person.company && ` at ${person.company}`}
                      </span>
                    </div>
                  )}

                  {person.bio && (
                    <p className="text-sm text-muted-foreground">{person.bio}</p>
                  )}

                  <div className="pt-3 border-t space-y-2">
                    {person.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-muted-foreground" />
                        <a 
                          href={`mailto:${person.email}`}
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {person.email}
                        </a>
                      </div>
                    )}
                    {person.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-muted-foreground" />
                        <a 
                          href={`tel:${person.phone}`}
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {person.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alumni;