import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import { departments } from '@/data/departments';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, isLoading, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    course: '',
    department: '',
    semester: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (isSignUp) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
        setError('Please fill in all required fields');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }

      if (formData.role === 'student' && (!formData.course || !formData.department)) {
        setError('Please select course and department for student registration');
        return false;
      }
    } else {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      if (isSignUp) {
        const userData = {
          name: formData.name,
          email: formData.email,
          role: formData.role as 'student' | 'faculty' | 'admin' | 'alumni',
          course: formData.course || undefined,
          department: formData.department || undefined,
          semester: formData.semester ? parseInt(formData.semester) : undefined
        };

        const success = await register(userData, formData.password);
        if (success) {
          setSuccess('Registration successful! You can now login to your account.');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          setError('Email already exists. Please use a different email address.');
        }
      } else {
        const success = await login(formData.email, formData.password);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Invalid email or password');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const getCourses = () => {
    if (!formData.department) return [];
    const dept = departments.find(d => d.id === formData.department);
    return dept ? dept.courses : [];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-2xl">SC</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isSignUp ? 'Join Our Community' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {isSignUp ? "Create your St. Columba's College account" : "Sign in to your account"}
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{isSignUp ? 'Create Account' : 'Sign In'}</CardTitle>
            <CardDescription>
              {isSignUp ? 'Fill in your details to register' : 'Enter your credentials to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 text-green-800 dark:border-green-800 dark:text-green-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData.role === 'student' || formData.role === 'faculty') && (
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select value={formData.department} onValueChange={(value) => handleSelectChange('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name} ({dept.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.role === 'student' && formData.department && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="course">Course *</Label>
                        <Select value={formData.course} onValueChange={(value) => handleSelectChange('course', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            {getCourses().map((course) => (
                              <SelectItem key={course} value={course}>
                                {course}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="semester">Current Semester</Label>
                        <Select value={formData.semester} onValueChange={(value) => handleSelectChange('semester', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                              <SelectItem key={sem} value={sem.toString()}>
                                Semester {sem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{isSignUp ? 'Password *' : 'Password'}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isSignUp ? "Enter password (min. 6 characters)" : "Enter your password"}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Separator />
              <div className="mt-6">
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                      setSuccess('');
                    }}
                  >
                    {isSignUp ? 'Sign in here' : 'Sign up here'}
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-sm"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;