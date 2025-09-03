import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, FileText, Calendar } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  course_id: string;
  due_date: string;
  max_marks: number;
  created_at: string;
  courses?: {
    name: string;
    code: string;
  };
}

interface Course {
  id: string;
  name: string;
  code: string;
}

interface AssignmentManagementProps {
  facultyId: string;
}

const AssignmentManagement: React.FC<AssignmentManagementProps> = ({ facultyId }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    due_date: '',
    max_marks: ''
  });

  useEffect(() => {
    fetchAssignments();
    fetchFacultyCourses();
  }, [facultyId]);

  const fetchAssignments = async () => {
    try {
      // First get enrollments to find courses taught by this faculty
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('faculty_id', facultyId);

      if (!enrollmentData || enrollmentData.length === 0) {
        setAssignments([]);
        setLoading(false);
        return;
      }

      const courseIds = [...new Set(enrollmentData.map(e => e.course_id))];

      // Then get assignments for those courses
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          courses (name, code)
        `)
        .in('course_id', courseIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assignments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultyCourses = async () => {
    try {
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select(`
          course_id,
          courses (id, name, code)
        `)
        .eq('faculty_id', facultyId);

      if (!enrollmentData) return;

      const uniqueCourses = enrollmentData
        .filter((item, index, self) => 
          index === self.findIndex(t => t.course_id === item.course_id)
        )
        .map(item => item.courses)
        .filter(Boolean);

      setCourses(uniqueCourses as Course[]);
    } catch (error) {
      console.error('Error fetching faculty courses:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        course_id: formData.course_id,
        due_date: formData.due_date,
        max_marks: parseInt(formData.max_marks),
        faculty_id: facultyId
      };

      if (editingAssignment) {
        const { error } = await supabase
          .from('assignments')
          .update(assignmentData)
          .eq('id', editingAssignment.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Assignment updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('assignments')
          .insert(assignmentData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Assignment created successfully"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchAssignments();
    } catch (error: any) {
      console.error('Error saving assignment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save assignment",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment deleted successfully"
      });

      fetchAssignments();
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete assignment",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      course_id: assignment.course_id,
      due_date: assignment.due_date.split('T')[0], // Format for date input
      max_marks: assignment.max_marks.toString()
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingAssignment(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      course_id: '',
      due_date: '',
      max_marks: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignment Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Assignment 1: Data Structures"
                  />
                </div>
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} ({course.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_marks">Maximum Marks</Label>
                    <Input
                      id="max_marks"
                      type="number"
                      value={formData.max_marks}
                      onChange={(e) => setFormData({ ...formData, max_marks: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Assignment description and requirements..."
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingAssignment ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading assignments...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Max Marks</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No assignments found. Create your first assignment!
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{assignment.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {assignment.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {assignment.courses?.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(assignment.due_date)}
                      </div>
                    </TableCell>
                    <TableCell>{assignment.max_marks}</TableCell>
                    <TableCell>{formatDate(assignment.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(assignment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(assignment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentManagement;