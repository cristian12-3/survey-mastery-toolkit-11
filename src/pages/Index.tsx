
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FileText, BarChart3, PlusCircle, CheckSquare, Star, MoveVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Intuitive Survey Builder",
      description: "Create beautiful surveys with our drag-and-drop interface. No coding required.",
      icon: <FileText className="w-8 h-8" />,
    },
    {
      title: "Powerful Analytics",
      description: "Get real-time insights with customizable reports and advanced visualizations.",
      icon: <BarChart3 className="w-8 h-8" />,
    },
    {
      title: "Multiple Question Types",
      description: "Choose from a variety of question types to gather the precise data you need.",
      icon: <CheckSquare className="w-8 h-8" />,
    },
    {
      title: "Rating Scales",
      description: "Measure sentiment and satisfaction with customizable rating scales.",
      icon: <Star className="w-8 h-8" />,
    },
    {
      title: "Ranking Questions",
      description: "Allow respondents to rank items in order of preference or importance.",
      icon: <MoveVertical className="w-8 h-8" />,
    },
    {
      title: "Logic Branching",
      description: "Create dynamic surveys that adapt based on previous answers.",
      icon: <PlusCircle className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="animate-slide-down">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              The future of surveys is here
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Survey creation & analytics made <span className="text-primary">simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Build beautiful surveys, collect responses, and analyze results with our intuitive platform. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/create')}
                className="animate-slide-up transition-all duration-300"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Create a Survey
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/results')}
                className="animate-slide-up transition-all duration-300 delay-100"
              >
                <BarChart3 className="mr-2 h-5 w-5" /> Explore Analytics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-6 bg-accent/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional surveys and gain valuable insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={cn(
                  "border hover-lift overflow-hidden transition-all duration-300",
                  "hover:border-primary/20 hover:bg-accent/70"
                )}
              >
                <CardContent className="p-6 flex flex-col items-start">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to create your first survey?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10">
            Join thousands of users who are already collecting valuable insights with our platform.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/create')}
            className="animate-pulse-slow"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
