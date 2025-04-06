import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Zap, 
  Lightbulb, 
  Code, 
  Sliders, 
  Share2 
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Security Analysis",
      description: "Detect security vulnerabilities and potential risks in your code.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Identify bottlenecks and optimize your code for better performance.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Lightbulb,
      title: "Smart Suggestions",
      description: "Get intelligent recommendations to improve code quality.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Code,
      title: "Multi-Language Support",
      description: "Analyze code in JavaScript, Python, Java, and many more languages.",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Sliders,
      title: "Customizable Rules",
      description: "Configure analysis rules to match your team's coding standards.",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Share2,
      title: "Export & Integrate",
      description: "Export results or integrate with your CI/CD pipeline.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Features</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
              <div className="mt-4">
                <img 
                  className="rounded-md object-cover w-full h-32" 
                  src={feature.image} 
                  alt={feature.title} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
