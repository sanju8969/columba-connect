import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, TrendingUp } from 'lucide-react';

interface Grade {
  id: string;
  assessment_type: string;
  marks_obtained: number;
  max_marks: number;
  grade?: string;
  remarks?: string;
  graded_at: string;
  enrollments?: {
    courses?: {
      name: string;
      code: string;
    };
  };
}

interface StudentGradesProps {
  studentId: string;
}

const StudentGrades: React.FC<StudentGradesProps> = ({ studentId }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGrades();
  }, [studentId]);

  const fetchGrades = async () => {
    try {
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', studentId);

      if (enrollError) throw enrollError;

      const enrollmentIds = enrollments?.map(e => e.id) || [];

      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          enrollments (
            courses (name, code)
          )
        `)
        .in('enrollment_id', enrollmentIds)
        .order('graded_at', { ascending: false });

      if (error) throw error;
      setGrades(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading grades",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'outline';
    if (grade.startsWith('A')) return 'default';
    if (grade.startsWith('B')) return 'secondary';
    if (grade.startsWith('C')) return 'outline';
    return 'destructive';
  };

  const calculatePercentage = (obtained: number, max: number) => {
    return ((obtained / max) * 100).toFixed(1);
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
          <GraduationCap className="w-5 h-5" />
          My Grades
        </CardTitle>
      </CardHeader>

      <CardContent>
        {grades.length === 0 ? (
          <div className="text-center py-8">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No grades available yet</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>
                      {grade.enrollments?.courses && (
                        <Badge variant="outline">
                          {grade.enrollments.courses.code}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="capitalize">{grade.assessment_type}</TableCell>
                    <TableCell>
                      {grade.marks_obtained} / {grade.max_marks}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        {calculatePercentage(grade.marks_obtained, grade.max_marks)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getGradeColor(grade.grade)}>
                        {grade.grade || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {grade.remarks || '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(grade.graded_at).toLocaleDateString()}
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

export default StudentGrades;
