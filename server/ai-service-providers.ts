import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { type AnalysisResult } from "@shared/schema";
import { 
  analyzeCodeWithHuggingFace,
  securityAuditWithHuggingFace,
  performanceAnalysisWithHuggingFace,
  refactoringAnalysisWithHuggingFace,
  documentationAnalysisWithHuggingFace
} from "./huggingface-service";

// TS 4.1+ fix for Anthropic SDK typing issues
declare module '@anthropic-ai/sdk' {
  interface AnthropicMessage {
    content: Array<{
      type: string;
      text: string;
    }>;
  }
}

// Define interfaces for providers
export interface AIServiceProvider {
  analyzeCode(code: string, language: string, options: any): Promise<AnalysisResult>;
  securityAudit(code: string, language: string, options: any): Promise<AnalysisResult>;
  performanceAnalysis(code: string, language: string, options: any): Promise<AnalysisResult>;
  refactoringAnalysis(code: string, language: string, options: any): Promise<AnalysisResult>;
  documentationAnalysis(code: string, language: string, options: any): Promise<AnalysisResult>;
}

// Mock provider for demonstration purposes
export class MockProvider implements AIServiceProvider {
  async analyzeCode(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Use the default implementation from ai-service.ts
    const { analyzeCode } = await import('./ai-service');
    return analyzeCode(code, language, options);
  }

  async securityAudit(code: string, language: string, options: any): Promise<AnalysisResult> {
    const { securityAudit } = await import('./ai-service');
    return securityAudit(code, language, options);
  }

  async performanceAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    const { performanceAnalysis } = await import('./ai-service');
    return performanceAnalysis(code, language, options);
  }

  async refactoringAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    const { refactoringAnalysis } = await import('./ai-service');
    return refactoringAnalysis(code, language, options);
  }

  async documentationAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    const { documentationAnalysis } = await import('./ai-service');
    return documentationAnalysis(code, language, options);
  }
}

// OpenAI provider implementation
export class OpenAIProvider implements AIServiceProvider {
  private client: OpenAI;
  
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  async analyzeCode(code: string, language: string, options: any): Promise<AnalysisResult> {
    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert code reviewer analyzing code for quality, issues, and improvements. Respond with a detailed analysis in JSON format."
          },
          {
            role: "user",
            content: `Analyze this ${language} code: \n\n${code}\n\nFocus on ${options.securityAnalysis ? 'security issues, ' : ''}${options.performanceOptimization ? 'performance optimizations, ' : ''}${options.codingStandards ? 'coding standards, ' : ''}${options.documentationQuality ? 'documentation quality, ' : ''}${options.improvementSuggestions ? 'and provide improvement suggestions.' : ''}`
          }
        ],
        response_format: { type: "json_object" },
      });
      
      const messageContent = response.choices[0].message.content;
      const result = messageContent ? JSON.parse(messageContent) : {};
      
      // Convert to our expected AnalysisResult format
      return {
        overallQuality: result.overallQuality || 'Average',
        overallScore: result.overallScore || 3,
        issuesCount: result.issues?.length || 0,
        codeEfficiency: result.codeEfficiency || 70,
        bestPractices: result.bestPractices || 70,
        issues: (result.issues || []).map((issue: any, index: number) => ({
          id: issue.id || `issue-${index}`,
          type: issue.type || 'suggestion',
          title: issue.title || 'Code Issue',
          description: issue.description || 'Issue description not provided',
          lineStart: issue.lineStart || 1,
          lineEnd: issue.lineEnd || 1,
          code: issue.code || '',
          suggestionCode: issue.suggestionCode || '',
          explanation: issue.explanation || 'No explanation provided'
        }))
      };
    }
    catch (error) {
      console.error("Error in OpenAI analysis:", error);
      
      // Fall back to mock implementation if OpenAI fails
      const mockProvider = new MockProvider();
      return mockProvider.analyzeCode(code, language, options);
    }
  }
  
  async securityAudit(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on security
    const securityOptions = {
      ...options,
      securityAnalysis: true,
      performanceOptimization: false,
      codingStandards: false,
      documentationQuality: false,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, securityOptions);
  }
  
  async performanceAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on performance
    const perfOptions = {
      ...options,
      securityAnalysis: false,
      performanceOptimization: true,
      codingStandards: false,
      documentationQuality: false,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, perfOptions);
  }
  
  async refactoringAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on refactoring
    const refactorOptions = {
      ...options,
      securityAnalysis: false,
      performanceOptimization: false,
      codingStandards: true,
      documentationQuality: false,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, refactorOptions);
  }
  
  async documentationAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on documentation
    const docOptions = {
      ...options,
      securityAnalysis: false,
      performanceOptimization: false,
      codingStandards: false,
      documentationQuality: true,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, docOptions);
  }
}

// Anthropic provider implementation
export class AnthropicProvider implements AIServiceProvider {
  private client: Anthropic;
  
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  
  async analyzeCode(code: string, language: string, options: any): Promise<AnalysisResult> {
    try {
      // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      const message = await this.client.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 4000,
        system: "You are an expert code reviewer analyzing code for quality, issues, and improvements. Return your analysis in JSON format with the following fields: overallQuality (Excellent, Good, Average, Poor), overallScore (1-5), issuesCount (number), codeEfficiency (0-100), bestPractices (0-100), issues (array of issues). Each issue should have: id, type (error, warning, suggestion), title, description, lineStart, lineEnd, code, suggestionCode, and explanation.",
        messages: [
          {
            role: "user", 
            content: `Analyze this ${language} code: \n\n${code}\n\nFocus on ${options.securityAnalysis ? 'security issues, ' : ''}${options.performanceOptimization ? 'performance optimizations, ' : ''}${options.codingStandards ? 'coding standards, ' : ''}${options.documentationQuality ? 'documentation quality, ' : ''}${options.improvementSuggestions ? 'and provide improvement suggestions.' : ''}`
          }
        ],
      });

      // Parse the response which should be in JSON format
      const contentBlock = message.content[0];
      const content = 'text' in contentBlock ? contentBlock.text : '';
      let result;
      try {
        // Try to extract JSON if it's wrapped in backticks
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          result = JSON.parse(jsonMatch[1]);
        } else {
          result = JSON.parse(content);
        }
      } catch (parseError) {
        console.error("Error parsing Anthropic JSON response:", parseError);
        throw new Error("Failed to parse Anthropic response");
      }
      
      // Convert to our expected AnalysisResult format
      return {
        overallQuality: result.overallQuality || 'Average',
        overallScore: result.overallScore || 3,
        issuesCount: result.issues?.length || 0,
        codeEfficiency: result.codeEfficiency || 70,
        bestPractices: result.bestPractices || 70,
        issues: (result.issues || []).map((issue: any, index: number) => ({
          id: issue.id || `issue-${index}`,
          type: issue.type || 'suggestion',
          title: issue.title || 'Code Issue',
          description: issue.description || 'Issue description not provided',
          lineStart: issue.lineStart || 1,
          lineEnd: issue.lineEnd || 1,
          code: issue.code || '',
          suggestionCode: issue.suggestionCode || '',
          explanation: issue.explanation || 'No explanation provided'
        }))
      };
    }
    catch (error) {
      console.error("Error in Anthropic analysis:", error);
      
      // Fall back to mock implementation if Anthropic fails
      const mockProvider = new MockProvider();
      return mockProvider.analyzeCode(code, language, options);
    }
  }
  
  async securityAudit(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on security
    const securityOptions = {
      ...options,
      securityAnalysis: true,
      performanceOptimization: false,
      codingStandards: false,
      documentationQuality: false,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, securityOptions);
  }
  
  async performanceAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on performance
    const perfOptions = {
      ...options,
      securityAnalysis: false,
      performanceOptimization: true,
      codingStandards: false,
      documentationQuality: false,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, perfOptions);
  }
  
  async refactoringAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on refactoring
    const refactorOptions = {
      ...options,
      securityAnalysis: false,
      performanceOptimization: false,
      codingStandards: true,
      documentationQuality: false,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, refactorOptions);
  }
  
  async documentationAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on documentation
    const docOptions = {
      ...options,
      securityAnalysis: false,
      performanceOptimization: false,
      codingStandards: false,
      documentationQuality: true,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, docOptions);
  }
}

// HuggingFace provider implementation
export class HuggingFaceProvider implements AIServiceProvider {
  constructor() {
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.warn("HuggingFace API key is missing");
    }
  }
  
  async analyzeCode(code: string, language: string, options: any): Promise<AnalysisResult> {
    try {
      return await analyzeCodeWithHuggingFace(code, language, options);
    } catch (error) {
      console.error("Error in HuggingFace analysis:", error);
      // Fall back to mock implementation if HuggingFace fails
      const mockProvider = new MockProvider();
      return mockProvider.analyzeCode(code, language, options);
    }
  }
  
  async securityAudit(code: string, language: string, options: any): Promise<AnalysisResult> {
    try {
      return await securityAuditWithHuggingFace(code, language, options);
    } catch (error) {
      console.error("Error in HuggingFace security audit:", error);
      const mockProvider = new MockProvider();
      return mockProvider.securityAudit(code, language, options);
    }
  }
  
  async performanceAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    try {
      return await performanceAnalysisWithHuggingFace(code, language, options);
    } catch (error) {
      console.error("Error in HuggingFace performance analysis:", error);
      const mockProvider = new MockProvider();
      return mockProvider.performanceAnalysis(code, language, options);
    }
  }
  
  async refactoringAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    try {
      return await refactoringAnalysisWithHuggingFace(code, language, options);
    } catch (error) {
      console.error("Error in HuggingFace refactoring analysis:", error);
      const mockProvider = new MockProvider();
      return mockProvider.refactoringAnalysis(code, language, options);
    }
  }
  
  async documentationAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    try {
      return await documentationAnalysisWithHuggingFace(code, language, options);
    } catch (error) {
      console.error("Error in HuggingFace documentation analysis:", error);
      const mockProvider = new MockProvider();
      return mockProvider.documentationAnalysis(code, language, options);
    }
  }
}

// Perplexity provider implementation
export class PerplexityProvider implements AIServiceProvider {
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || '';
  }
  
  async analyzeCode(code: string, language: string, options: any): Promise<AnalysisResult> {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an expert code reviewer analyzing code for quality, issues, and improvements. Return your analysis in JSON format with the following fields: overallQuality (Excellent, Good, Average, Poor), overallScore (1-5), issuesCount (number), codeEfficiency (0-100), bestPractices (0-100), issues (array of issues). Each issue should have: id, type (error, warning, suggestion), title, description, lineStart, lineEnd, code, suggestionCode, and explanation.'
            },
            {
              role: 'user',
              content: `Analyze this ${language} code: \n\n${code}\n\nFocus on ${options.securityAnalysis ? 'security issues, ' : ''}${options.performanceOptimization ? 'performance optimizations, ' : ''}${options.codingStandards ? 'coding standards, ' : ''}${options.documentationQuality ? 'documentation quality, ' : ''}${options.improvementSuggestions ? 'and provide improvement suggestions.' : ''}`
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 4000,
          stream: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`Perplexity API request failed: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Parse the response
      const content = responseData.choices[0].message.content;
      let result;
      try {
        // Try to extract JSON if it's wrapped in backticks
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          result = JSON.parse(jsonMatch[1]);
        } else {
          result = JSON.parse(content);
        }
      } catch (parseError) {
        console.error("Error parsing Perplexity JSON response:", parseError);
        throw new Error("Failed to parse Perplexity response");
      }
      
      // Convert to our expected AnalysisResult format
      return {
        overallQuality: result.overallQuality || 'Average',
        overallScore: result.overallScore || 3,
        issuesCount: result.issues?.length || 0,
        codeEfficiency: result.codeEfficiency || 70,
        bestPractices: result.bestPractices || 70,
        issues: (result.issues || []).map((issue: any, index: number) => ({
          id: issue.id || `issue-${index}`,
          type: issue.type || 'suggestion',
          title: issue.title || 'Code Issue',
          description: issue.description || 'Issue description not provided',
          lineStart: issue.lineStart || 1,
          lineEnd: issue.lineEnd || 1,
          code: issue.code || '',
          suggestionCode: issue.suggestionCode || '',
          explanation: issue.explanation || 'No explanation provided'
        }))
      };
    }
    catch (error) {
      console.error("Error in Perplexity analysis:", error);
      
      // Fall back to mock implementation if Perplexity fails
      const mockProvider = new MockProvider();
      return mockProvider.analyzeCode(code, language, options);
    }
  }
  
  async securityAudit(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on security
    const securityOptions = {
      ...options,
      securityAnalysis: true,
      performanceOptimization: false,
      codingStandards: false,
      documentationQuality: false,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, securityOptions);
  }
  
  async performanceAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on performance
    const perfOptions = {
      ...options,
      securityAnalysis: false,
      performanceOptimization: true,
      codingStandards: false,
      documentationQuality: false,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, perfOptions);
  }
  
  async refactoringAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on refactoring
    const refactorOptions = {
      ...options,
      securityAnalysis: false,
      performanceOptimization: false,
      codingStandards: true,
      documentationQuality: false,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, refactorOptions);
  }
  
  async documentationAnalysis(code: string, language: string, options: any): Promise<AnalysisResult> {
    // Adjust options to focus on documentation
    const docOptions = {
      ...options,
      securityAnalysis: false,
      performanceOptimization: false,
      codingStandards: false,
      documentationQuality: true,
      improvementSuggestions: true,
      analysisDepth: options.analysisDepth || 3
    };
    
    return this.analyzeCode(code, language, docOptions);
  }
}

// Provider factory
export function getAIProvider(provider: string = "mock"): AIServiceProvider {
  switch (provider.toLowerCase()) {
    case "openai":
      if (!process.env.OPENAI_API_KEY) {
        console.warn("OpenAI API key not found, falling back to mock provider");
        return new MockProvider();
      }
      return new OpenAIProvider();
      
    case "anthropic":
      if (!process.env.ANTHROPIC_API_KEY) {
        console.warn("Anthropic API key not found, falling back to mock provider");
        return new MockProvider();
      }
      return new AnthropicProvider();
      
    case "perplexity":
      if (!process.env.PERPLEXITY_API_KEY) {
        console.warn("Perplexity API key not found, falling back to mock provider");
        return new MockProvider();
      }
      return new PerplexityProvider();
      
    case "huggingface":
      if (!process.env.HUGGINGFACE_API_KEY) {
        console.warn("HuggingFace API key not found, falling back to mock provider");
        return new MockProvider();
      }
      return new HuggingFaceProvider();
      
    case "mock":
    default:
      return new MockProvider();
  }
}

// Singleton instance of the current provider
let currentProvider: string = "mock";
let providerInstance: AIServiceProvider = getAIProvider(currentProvider);

// Utility to set/get provider
export function setAIProvider(provider: string): void {
  currentProvider = provider;
  providerInstance = getAIProvider(provider);
}

export function getCurrentProvider(): string {
  return currentProvider;
}

export function getProviderInstance(): AIServiceProvider {
  return providerInstance;
}