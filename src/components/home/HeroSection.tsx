import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, BookOpen, Users, Award, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import campusHero from '@/assets/campus-hero.jpg';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Hero animation sequence
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 100, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
    )
    .fromTo(
      subtitleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
    .fromTo(
      buttonsRef.current?.children,
      { opacity: 0, y: 30, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.2, 
        ease: 'back.out(1.7)' 
      },
      '-=0.4'
    )
    .fromTo(
      statsRef.current?.children,
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: 'power2.out' 
      },
      '-=0.3'
    );

    // Parallax effect for background
    gsap.to(heroRef.current, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const heroStats = [
    {
      icon: Users,
      number: '3000+',
      label: 'Students',
      color: 'text-secondary'
    },
    {
      icon: BookOpen,
      number: '25+',
      label: 'Courses',
      color: 'text-accent'
    },
    {
      icon: Award,
      number: '125+',
      label: 'Years Legacy',
      color: 'text-college-crimson'
    },
    {
      icon: MapPin,
      number: '28',
      label: 'Acre Campus',
      color: 'text-college-forest'
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        ref={heroRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${campusHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-1">
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-college-crimson/10 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-width text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Title */}
          <h1 
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight"
          >
            <span className="block">St. Columba's</span>
            <span className="block text-gradient-gold">College</span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-secondary mt-2">
              Hazaribagh
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-white/90 max-w-3xl mx-auto"
          >
            <span className="font-display italic">"Truth and Service"</span> • Empowering minds since 1899 • 
            A legacy of academic excellence and character formation in the heart of Jharkhand
          </p>

          {/* Action Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="gold" size="xl" asChild className="group">
              <Link to="/admissions">
                <BookOpen size={24} />
                Apply for Admission 2024
                <ArrowRight size={20} className="group-hover:translate-x-1 smooth-transition" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-sm">
              <Play size={20} />
              Virtual Campus Tour
            </Button>
          </div>

          {/* Quick Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {heroStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover-lift border border-white/20">
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-secondary">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/80 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;