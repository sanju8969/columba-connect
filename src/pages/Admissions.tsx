import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap,
  FileText,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  Award,
  BookOpen,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Admissions = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // Process animation
    gsap.fromTo(processRef.current?.children || [], 
      { opacity: 0, x: -50 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        stagger: 0.2,
        scrollTrigger: {
          trigger: processRef.current,
          start: "top 80%",
        }
      }
    );

    // Programs animation
    gsap.fromTo(programsRef.current?.children || [], 
      { opacity: 0, scale: 0.9 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.1,
        scrollTrigger: {
          trigger: programsRef.current,
          start: "top 80%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const admissionProcess = [
    {
      step: 1,
      title: "Online Application",
      description: "Fill out the online application form with required documents",
      icon: FileText,
      timeline: "March - May"
    },
    {
      step: 2,
      title: "Document Verification",
      description: "Submit and verify all academic documents and certificates",
      icon: CheckCircle,
      timeline: "Within 7 days"
    },
    {
      step: 3,
      title: "Entrance Exam/Merit",
      description: "Appear for entrance exam or merit-based selection",
      icon: Award,
      timeline: "June"
    },
    {
      step: 4,
      title: "Counseling",
      description: "Attend counseling session for course and seat allocation",
      icon: Users,
      timeline: "July"
    },
    {
      step: 5,
      title: "Fee Payment",
      description: "Pay admission fees and complete enrollment process",
      icon: DollarSign,
      timeline: "Within 15 days"
    }
  ];

  const programs = {
    undergraduate: [
      {
        name: "B.Sc. (Physics, Chemistry, Mathematics)",
        duration: "3 Years",
        eligibility: "12th with Science (60%)",
        seats: 60,
        fee: "₹15,000/year",
        highlights: ["Research Projects", "Industry Exposure", "Lab Facilities"]
      },
      {
        name: "B.Sc. (Computer Science)",
        duration: "3 Years", 
        eligibility: "12th with Math (55%)",
        seats: 40,
        fee: "₹25,000/year",
        highlights: ["Modern Labs", "Industry Partnerships", "Placement Support"]
      },
      {
        name: "B.A. (English, History, Political Science)",
        duration: "3 Years",
        eligibility: "12th (50%)",
        seats: 100,
        fee: "₹12,000/year",
        highlights: ["Language Labs", "Research Opportunities", "Cultural Programs"]
      },
      {
        name: "B.Com",
        duration: "3 Years",
        eligibility: "12th (50%)",
        seats: 80,
        fee: "₹18,000/year",
        highlights: ["Industry Training", "Internships", "Skill Development"]
      }
    ],
    postgraduate: [
      {
        name: "M.Sc. (Physics)",
        duration: "2 Years",
        eligibility: "B.Sc. Physics (55%)",
        seats: 30,
        fee: "₹20,000/year",
        highlights: ["Research Focus", "PhD Preparation", "Advanced Labs"]
      },
      {
        name: "M.A. (English)",
        duration: "2 Years",
        eligibility: "B.A. English (50%)",
        seats: 25,
        fee: "₹15,000/year",
        highlights: ["Literary Research", "Publications", "Seminars"]
      },
      {
        name: "M.Com",
        duration: "2 Years",
        eligibility: "B.Com (50%)",
        seats: 40,
        fee: "₹22,000/year",
        highlights: ["Advanced Accounting", "Business Analytics", "Case Studies"]
      }
    ],
    professional: [
      {
        name: "B.Ed.",
        duration: "2 Years",
        eligibility: "Graduation (50%)",
        seats: 100,
        fee: "₹30,000/year",
        highlights: ["Teaching Practice", "Modern Pedagogy", "School Partnerships"]
      },
      {
        name: "BCA",
        duration: "3 Years",
        eligibility: "12th with Math (50%)",
        seats: 60,
        fee: "₹35,000/year",
        highlights: ["Coding Skills", "Project Work", "Industry Internships"]
      }
    ]
  };

  const importantDates = [
    { event: "Application Form Release", date: "March 1, 2024" },
    { event: "Last Date to Apply", date: "May 31, 2024" },
    { event: "Entrance Exam", date: "June 15, 2024" },
    { event: "Merit List Declaration", date: "June 25, 2024" },
    { event: "Counseling Begins", date: "July 1, 2024" },
    { event: "Classes Begin", date: "July 20, 2024" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 text-primary bg-white/10 border-white/20">
              Admissions Open • Session 2024-25
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text">
              Join Our Legacy
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Begin your journey of academic excellence and personal growth at 
              St. Columba's College, Hazaribagh.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={() => window.location.href = '/auth'}>
                <FileText className="mr-2 h-5 w-5" />
                Apply Online
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => window.open('/prospectus.pdf', '_blank')}>
                <Download className="mr-2 h-5 w-5" />
                Download Prospectus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-primary">Important Dates</h2>
            <p className="text-xl text-muted-foreground">Stay updated with admission timeline</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-primary flex items-center justify-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Admission Schedule 2024-25
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {importantDates.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <span className="font-medium">{item.event}</span>
                      <Badge variant="outline" className="ml-4">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.date}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Admission Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow these simple steps to secure your admission at St. Columba's College
            </p>
          </div>
          <div ref={processRef} className="max-w-6xl mx-auto space-y-8">
            {admissionProcess.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center gap-8 group">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white font-bold text-xl">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <Card className="group-hover:shadow-lg transition-all duration-300 border-l-4 border-primary">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Icon className="h-8 w-8 text-primary mt-1" />
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-primary mb-2">{step.title}</h3>
                            <p className="text-gray-700 text-lg mb-3">{step.description}</p>
                            <Badge variant="secondary" className="text-accent">
                              {step.timeline}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs & Courses */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Programs & Courses</h2>
            <p className="text-xl text-muted-foreground">Explore our diverse academic offerings</p>
          </div>
          
          <Tabs defaultValue="undergraduate" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="undergraduate">UG Programs</TabsTrigger>
              <TabsTrigger value="postgraduate">PG Programs</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
            </TabsList>

            {Object.entries(programs).map(([key, programList]) => (
              <TabsContent key={key} value={key}>
                <div ref={programsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {programList.map((program, index) => (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-xl text-primary">{program.name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline">{program.duration}</Badge>
                          <Badge variant="secondary">{program.seats} Seats</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-primary mb-1">Eligibility</h4>
                          <p className="text-sm text-muted-foreground">{program.eligibility}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary mb-1">Annual Fee</h4>
                          <p className="text-lg font-bold text-accent">{program.fee}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Program Highlights</h4>
                          <div className="space-y-1">
                            {program.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button className="w-full group-hover:bg-primary-dark" onClick={() => window.location.href = '/auth'}>
                          Apply Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Need Help?</h2>
            <p className="text-xl text-muted-foreground">Our admissions team is here to support you</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-primary">Call Us</h3>
                <p className="text-muted-foreground mb-4">Speak directly with our admissions counselors</p>
                <p className="font-semibold">+91-6546-222-333</p>
                <p className="text-sm text-muted-foreground">Mon-Sat: 9 AM - 5 PM</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-primary">Email Us</h3>
                <p className="text-muted-foreground mb-4">Send us your queries and get detailed responses</p>
                <p className="font-semibold">admissions@stcolumba.ac.in</p>
                <p className="text-sm text-muted-foreground">Response within 24 hours</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-primary">Visit Us</h3>
                <p className="text-muted-foreground mb-4">Come for a campus tour and personal consultation</p>
                <p className="font-semibold">St. Columba's College</p>
                <p className="text-sm text-muted-foreground">Hazaribagh, Jharkhand</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Don't miss the opportunity to be part of our prestigious institution. 
            Apply today and take the first step towards your bright future.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={() => window.location.href = '/auth'}>
              <GraduationCap className="mr-2 h-5 w-5" />
              Start Application
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => window.open('/syllabus.pdf', '_blank')}>
              <BookOpen className="mr-2 h-5 w-5" />
              View Syllabus
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;