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

  const handleDepthChange = (value: number) => {
    onChange({ ...options, analysisDepth: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Options</h2>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <input
            id="check-security"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            checked={options.securityAnalysis}
            onChange={(e) => handleOptionChange("securityAnalysis", e.target.checked)}
          />
          <div className="ml-3 text-sm">
            <label htmlFor="check-security" className="font-medium text-gray-700">Security Analysis</label>
            <p className="text-gray-500">Check for common security vulnerabilities</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <input
            id="check-performance"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            checked={options.performanceOptimization}
            onChange={(e) => handleOptionChange("performanceOptimization", e.target.checked)}
          />
          <div className="ml-3 text-sm">
            <label htmlFor="check-performance" className="font-medium text-gray-700">Performance Optimization</label>
            <p className="text-gray-500">Identify performance bottlenecks</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <input
            id="check-standards"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            checked={options.codingStandards}
            onChange={(e) => handleOptionChange("codingStandards", e.target.checked)}
          />
          <div className="ml-3 text-sm">
            <label htmlFor="check-standards" className="font-medium text-gray-700">Coding Standards</label>
            <p className="text-gray-500">Check adherence to best practices</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <input
            id="check-docs"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            checked={options.documentationQuality}
            onChange={(e) => handleOptionChange("documentationQuality", e.target.checked)}
          />
          <div className="ml-3 text-sm">
            <label htmlFor="check-docs" className="font-medium text-gray-700">Documentation Quality</label>
            <p className="text-gray-500">Evaluate code documentation</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <input
            id="check-suggest"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            checked={options.improvementSuggestions}
            onChange={(e) => handleOptionChange("improvementSuggestions", e.target.checked)}
          />
          <div className="ml-3 text-sm">
            <label htmlFor="check-suggest" className="font-medium text-gray-700">Improvement Suggestions</label>
            <p className="text-gray-500">Get AI recommendations for code improvement</p>
          </div>
        </div>
      </div>
      
      <div className="mt-5">
        <div className="flex justify-between mb-1">
          <label htmlFor="analysis-depth" className="text-sm font-medium text-gray-700">Analysis Depth</label>
          <span className="text-sm text-gray-500">{depthLabels[options.analysisDepth - 1]}</span>
        </div>
        <input
          id="analysis-depth"
          type="range"
          min="1"
          max="3"
          step="1"
          value={options.analysisDepth}
          onChange={(e) => handleDepthChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Basic</span>
          <span>Standard</span>
          <span>Comprehensive</span>
        </div>
      </div>
    </div>
  );
}