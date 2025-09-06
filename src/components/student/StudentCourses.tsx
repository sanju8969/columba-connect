import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, User, Calendar, Award } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  semester: number;
}

interface Enrollment {
  id: string;
  status: string;
  grade?: string;
  enrollment_date: string;
  courses: Course;
  faculty?: {
    full_name: string;
  };
}

interface StudentCoursesProps {
  studentId: string;
}

const StudentCourses: React.FC<StudentCoursesProps> = ({ studentId }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            id,
            name,
            code,
            description,
            credits,
            semester
          ),
          profiles!enrollments_faculty_id_fkey (
            full_name
          )
        `)
        .eq('student_id', studentId)
        .order('enrollment_date', { ascending: false });

      if (error) throw error;

      setEnrollments(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading courses",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [studentId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'withdrawn':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'outline';
    
    const gradeValue = grade.toUpperCase();
    if (['A+', 'A'].includes(gradeValue)) return 'default';
    if (['B+', 'B'].includes(gradeValue)) return 'secondary';
    if (['C+', 'C'].includes(gradeValue)) return 'outline';
    return 'destructive';
  };

  const calculateProgress = (status: string, grade?: string) => {
    if (status === 'completed') return 100;
    if (status === 'enrolled') return 60;
    if (status === 'withdrawn') return 25;
    return 0;
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
          <BookOpen className="w-5 h-5" />
          My Courses
        </CardTitle>
      </CardHeader>

      <CardContent>
        {enrollments.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No courses enrolled yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{enrollment.courses.name}</h3>
                    <p className="text-sm text-muted-foreground">{enrollment.courses.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusColor(enrollment.status)}>
                      {enrollment.status}
                    </Badge>
                    {enrollment.grade && (
                      <Badge variant={getGradeColor(enrollment.grade)}>
                        {enrollment.grade}
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {enrollment.courses.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{enrollment.courses.credits} Credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Semester {enrollment.courses.semester}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {enrollment.faculty?.full_name || 'TBD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">
                      {calculateProgress(enrollment.status, enrollment.grade)}%
                    </span>
                  </div>
                  <Progress 
                    value={calculateProgress(enrollment.status, enrollment.grade)} 
                    className="h-2"
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Assignments
                  </Button>
                  <Button variant="outline" size="sm">
                    View Grades
                  </Button>
                  {enrollment.status === 'enrolled' && (
                    <Button variant="outline" size="sm">
                      Course Materials
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentCourses;