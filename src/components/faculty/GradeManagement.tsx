import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Plus, Edit } from 'lucide-react';

interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  profiles?: { full_name: string };
  students?: { student_id: string };
  courses?: { name: string; code: string };
  grade?: string;
}

interface Grade {
  id: string;
  enrollment_id: string;
  assessment_type: string;
  marks_obtained: number;
  max_marks: number;
  grade?: string;
  remarks?: string;
}

interface GradeManagementProps {
  facultyId: string;
}

const GradeManagement: React.FC<GradeManagementProps> = ({ facultyId }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<string>('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    assessmentType: 'assignment',
    marksObtained: 0,
    maxMarks: 100,
    grade: '',
    remarks: ''
  });

  useEffect(() => {
    fetchData();
  }, [facultyId]);

  const fetchData = async () => {
    try {
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles!enrollments_student_id_fkey (full_name),
          students!students_id_fkey (student_id),
          courses (name, code)
        `)
        .eq('faculty_id', facultyId);

      if (enrollmentsError) throw enrollmentsError;

      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select('*')
        .in('enrollment_id', enrollmentsData?.map(e => e.id) || []);

      if (gradesError) throw gradesError;

      setEnrollments(enrollmentsData as any || []);
      setGrades(gradesData || []);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEnrollment) {
      toast({
        title: "Please select a student",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('grades')
        .insert([{
          enrollment_id: selectedEnrollment,
          assessment_type: formData.assessmentType,
          marks_obtained: formData.marksObtained,
          max_marks: formData.maxMarks,
          grade: formData.grade || calculateGrade(formData.marksObtained, formData.maxMarks),
          remarks: formData.remarks,
          graded_by: facultyId
        }]);

      if (error) throw error;

      // Update enrollment grade
      const calculatedGrade = formData.grade || calculateGrade(formData.marksObtained, formData.maxMarks);
      await supabase
        .from('enrollments')
        .update({ grade: calculatedGrade })
        .eq('id', selectedEnrollment);

      toast({
        title: "Grade added successfully"
      });

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error adding grade",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const calculateGrade = (obtained: number, max: number): string => {
    const percentage = (obtained / max) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const resetForm = () => {
    setFormData({
      assessmentType: 'assignment',
      marksObtained: 0,
      maxMarks: 100,
      grade: '',
      remarks: ''
    });
    setSelectedEnrollment('');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Grade Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Grade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Grade</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Student</Label>
                  <Select value={selectedEnrollment} onValueChange={setSelectedEnrollment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {enrollments.map((enrollment) => (
                        <SelectItem key={enrollment.id} value={enrollment.id}>
                          {enrollment.profiles?.full_name} - {enrollment.courses?.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Assessment Type</Label>
                  <Select 
                    value={formData.assessmentType} 
                    onValueChange={(value) => setFormData({ ...formData, assessmentType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="midterm">Midterm</SelectItem>
                      <SelectItem value="final">Final Exam</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Marks Obtained</Label>
                  <Input
                    type="number"
                    value={formData.marksObtained}
                    onChange={(e) => setFormData({ ...formData, marksObtained: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>Maximum Marks</Label>
                  <Input
                    type="number"
                    value={formData.maxMarks}
                    onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>Grade (Optional)</Label>
                  <Input
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="Auto-calculated if left empty"
                  />
                </div>

                <div>
                  <Label>Remarks (Optional)</Label>
                  <Input
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  Add Grade
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {enrollments.length === 0 ? (
          <div className="text-center py-8">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No students to grade</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Current Grade</TableHead>
                  <TableHead>Total Assessments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => {
                  const studentGrades = grades.filter(g => g.enrollment_id === enrollment.id);
                  return (
                    <TableRow key={enrollment.id}>
                      <TableCell>{enrollment.students?.student_id || '-'}</TableCell>
                      <TableCell className="font-medium">
                        {enrollment.profiles?.full_name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {enrollment.courses?.code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {enrollment.grade ? (
                          <Badge>{enrollment.grade}</Badge>
                        ) : (
                          <span className="text-muted-foreground">Not graded</span>
                        )}
                      </TableCell>
                      <TableCell>{studentGrades.length}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GradeManagement;
