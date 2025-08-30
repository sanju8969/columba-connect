import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, FileText, Calendar, TrendingUp, User } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'faculty' | 'student';
  avatar_url?: string;
  phone?: string;
}

interface StudentDashboardProps {
  profile: Profile;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ profile }) => {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    currentGPA: 0,
    currentSemester: 1
  });

  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Fetch student profile
        const { data: studentData } = await supabase
          .from('students')
          .select('*, departments(*)')
          .eq('id', profile.id)
          .single();

        setStudentInfo(studentData);

        // Fetch enrollment statistics
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('*, courses(*)')
          .eq('student_id', profile.id);

        const enrolledCount = enrollments?.filter(e => e.status === 'enrolled').length || 0;
        const completedCount = enrollments?.filter(e => e.status === 'completed').length || 0;

        setStats({
          enrolledCourses: enrolledCount,
          completedCourses: completedCount,
          currentGPA: studentData?.gpa || 0,
          currentSemester: studentData?.current_semester || 1
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [profile.id]);

  const statCards = [
    {
      title: 'Current Semester',
      value: stats.currentSemester,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Enrolled Courses',
      value: stats.enrolledCourses,
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      title: 'Completed Courses',
      value: stats.completedCourses,
      icon: GraduationCap,
      color: 'text-purple-600'
    },
    {
      title: 'Current GPA',
      value: stats.currentGPA.toFixed(2),
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Student Dashboard</h2>
          {studentInfo && (
            <p className="text-muted-foreground">
              {studentInfo.student_id} - {studentInfo.departments?.name}
            </p>
          )}
        </div>
        <Badge variant="secondary">Student</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student Profile Card */}
      {studentInfo && (
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                <p className="text-sm">{studentInfo.student_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-sm">{studentInfo.departments?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admission Year</p>
                <p className="text-sm">{studentInfo.admission_year}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={studentInfo.status === 'active' ? 'default' : 'secondary'}>
                  {studentInfo.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Semester</p>
                <p className="text-sm">{studentInfo.current_semester}</p>
              </div>
              {studentInfo.graduation_year && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expected Graduation</p>
                  <p className="text-sm">{studentInfo.graduation_year}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => alert('My Courses functionality coming soon!')}
            >
              <BookOpen className="h-6 w-6" />
              <span>My Courses</span>
            </Button>
            <Button 
              className="h-auto p-4 flex flex-col items-center space-y-2" 
              variant="outline"
              onClick={() => alert('View Grades functionality coming soon!')}
            >
              <TrendingUp className="h-6 w-6" />
              <span>View Grades</span>
            </Button>
            <Button 
              className="h-auto p-4 flex flex-col items-center space-y-2" 
              variant="outline"
              onClick={() => alert('Assignments functionality coming soon!')}
            >
              <FileText className="h-6 w-6" />
              <span>Assignments</span>
            </Button>
            <Button 
              className="h-auto p-4 flex flex-col items-center space-y-2" 
              variant="outline"
              onClick={() => alert('Update Profile functionality coming soon!')}
            >
              <User className="h-6 w-6" />
              <span>Update Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Assignment submitted for CS101</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New grade received for MATH201</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Enrolled in new course</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;