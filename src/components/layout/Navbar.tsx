import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap, Phone, Mail, LogOut, LayoutDashboard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import collegeLogo from '@/assets/college-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check current auth state
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Signed out successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Departments', path: '/departments' },
    { name: 'Admissions', path: '/admissions' },
    // Only show Gallery if user is not logged in
    ...(user ? [] : [{ name: 'Gallery', path: '/gallery' }]),
    { name: 'Alumni', path: '/alumni' },
    { name: 'Academics', path: '/academics' },
    { name: 'Notices', path: '/notices' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm hidden md:block">
        <div className="container-width flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>+91-6546-272XXX</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>admin@stcolumbascollege.edu.in</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-secondary">Established 1899</span>
            <span>•</span>
            <span>NAAC Accredited</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-50 smooth-transition ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-card' 
          : 'bg-background'
      }`}>
        <div className="container-width">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 hover-lift">
              <img 
                src={collegeLogo} 
                alt="St. Columba's College Logo" 
                className="h-12 w-12 object-contain"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-display font-bold text-primary">
                  St. Columba's College
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  Hazaribagh • Since 1899
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium smooth-transition relative ${
                    isActive(item.path)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 gold-gradient rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut size={16} />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/auth">
                      <GraduationCap size={16} />
                      Login
                    </Link>
                  </Button>
                  <Button variant="hero" size="sm" asChild>
                    <Link to="/gallery">Gallery</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-background border-t shadow-card">
            <div className="container-width py-4">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`font-medium py-2 smooth-transition ${
                      isActive(item.path)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-4 border-t">
                  {user ? (
                    <>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                        <LogOut size={16} />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/auth" onClick={() => setIsOpen(false)}>
                          <GraduationCap size={16} />
                          Login
                        </Link>
                      </Button>
                      <Button variant="hero" size="sm" asChild>
                        <Link to="/gallery" onClick={() => setIsOpen(false)}>Gallery</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;