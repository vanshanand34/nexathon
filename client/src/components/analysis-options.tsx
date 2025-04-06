import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface AnalysisOptionsProps {
  options: {
    securityAnalysis: boolean;
    performanceOptimization: boolean;
    codingStandards: boolean;
    documentationQuality: boolean;
    improvementSuggestions: boolean;
    analysisDepth: number;
  };
  onChange: (options: any) => void;
}

export default function AnalysisOptions({ options, onChange }: AnalysisOptionsProps) {
  const depthLabels = ["Basic", "Standard", "Comprehensive"];

  const handleOptionChange = (option: string, value: boolean) => {
    onChange({ ...options, [option]: value });
  };

  const handleDepthChange = (value: number[]) => {
    onChange({ ...options, analysisDepth: value[0] });
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Options</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Checkbox
              id="check-security"
              checked={options.securityAnalysis}
              onCheckedChange={(checked) => handleOptionChange("securityAnalysis", checked as boolean)}
            />
            <div className="ml-3 text-sm">
              <Label htmlFor="check-security" className="font-medium text-gray-700">Security Analysis</Label>
              <p className="text-gray-500">Check for common security vulnerabilities</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Checkbox
              id="check-performance"
              checked={options.performanceOptimization}
              onCheckedChange={(checked) => handleOptionChange("performanceOptimization", checked as boolean)}
            />
            <div className="ml-3 text-sm">
              <Label htmlFor="check-performance" className="font-medium text-gray-700">Performance Optimization</Label>
              <p className="text-gray-500">Identify performance bottlenecks</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Checkbox
              id="check-standards"
              checked={options.codingStandards}
              onCheckedChange={(checked) => handleOptionChange("codingStandards", checked as boolean)}
            />
            <div className="ml-3 text-sm">
              <Label htmlFor="check-standards" className="font-medium text-gray-700">Coding Standards</Label>
              <p className="text-gray-500">Check adherence to best practices</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Checkbox
              id="check-docs"
              checked={options.documentationQuality}
              onCheckedChange={(checked) => handleOptionChange("documentationQuality", checked as boolean)}
            />
            <div className="ml-3 text-sm">
              <Label htmlFor="check-docs" className="font-medium text-gray-700">Documentation Quality</Label>
              <p className="text-gray-500">Evaluate code documentation</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Checkbox
              id="check-suggest"
              checked={options.improvementSuggestions}
              onCheckedChange={(checked) => handleOptionChange("improvementSuggestions", checked as boolean)}
            />
            <div className="ml-3 text-sm">
              <Label htmlFor="check-suggest" className="font-medium text-gray-700">Improvement Suggestions</Label>
              <p className="text-gray-500">Get AI recommendations for code improvement</p>
            </div>
          </div>
        </div>
        
        <div className="mt-5">
          <div className="flex justify-between mb-1">
            <Label htmlFor="analysis-depth" className="text-sm font-medium text-gray-700">Analysis Depth</Label>
            <span className="text-sm text-gray-500">{depthLabels[options.analysisDepth - 1]}</span>
          </div>
          <Slider
            id="analysis-depth"
            value={[options.analysisDepth]}
            min={1}
            max={3}
            step={1}
            onValueChange={handleDepthChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Basic</span>
            <span>Standard</span>
            <span>Comprehensive</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
