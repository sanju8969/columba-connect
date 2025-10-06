import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail, Phone } from 'lucide-react';

interface Student {
  id: string;
  student_id: string;
  profiles?: {
    full_name: string;
    email: string;
    phone?: string;
  };
  students?: {
    student_id?: string;
    gpa?: number;
    current_semester?: number;
  };
  status: string;
  enrollment_date: string;
  grade?: string;
}

interface StudentListProps {
  facultyId: string;
}

const StudentList: React.FC<StudentListProps> = ({ facultyId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, [facultyId]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles!enrollments_student_id_fkey (
            full_name,
            email,
            phone
          ),
          students!students_id_fkey (
            student_id,
            gpa,
            current_semester
          )
        `)
        .eq('faculty_id', facultyId)
        .order('enrollment_date', { ascending: false });

      if (error) throw error;
      setStudents(data as any || []);
    } catch (error: any) {
      toast({
        title: "Error loading students",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled': return 'default';
      case 'completed': return 'secondary';
      case 'dropped': return 'destructive';
      default: return 'outline';
    }
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
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Enrolled Students
        </CardTitle>
      </CardHeader>

      <CardContent>
        {students.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No students enrolled yet</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.students?.student_id || '-'}
                    </TableCell>
                    <TableCell>{student.profiles?.full_name || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {student.profiles?.email || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {student.profiles?.phone || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      Sem {student.students?.current_semester || '-'}
                    </TableCell>
                    <TableCell>
                      {student.students?.gpa ? student.students.gpa.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.grade ? (
                        <Badge variant="outline">{student.grade}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Not graded</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentList;
