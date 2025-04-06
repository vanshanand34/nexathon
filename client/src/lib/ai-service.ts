import { apiRequest } from "./queryClient";

// Interface for the AI service
export interface AIServiceSettings {
  provider: string;
  model?: string;
  streamingEnabled?: boolean;
  cacheEnabled?: boolean;
}

// Provider API key status
export interface ProviderStatus {
  provider: string;
  configured: boolean;
}

// Provider model
export interface ProviderModel {
  id: string;
  name: string;
  default?: boolean;
}

/**
 * Get current AI service provider
 */
export async function getCurrentAIProvider(): Promise<string> {
  try {
    const response = await apiRequest('GET', '/api/ai-service/provider');
    const data = await response.json();
    return data.provider;
  } catch (error) {
    console.error('Error getting current AI provider:', error);
    return 'mock'; // Default to mock if error
  }
}

/**
 * Set AI service provider
 */
export async function setAIProvider(provider: string): Promise<boolean> {
  try {
    const response = await apiRequest('POST', '/api/ai-service/provider', { provider });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error setting AI provider:', error);
    return false;
  }
}

/**
 * Check if a provider has an API key configured
 */
export async function checkProviderApiKey(provider: string): Promise<ProviderStatus> {
  try {
    const response = await apiRequest('GET', `/api/ai-service/provider/${provider}/status`);
    return await response.json();
  } catch (error) {
    console.error(`Error checking API key for ${provider}:`, error);
    return {
      provider,
      configured: false
    };
  }
}

/**
 * Get available models for a provider
 */
export async function getProviderModels(provider: string): Promise<ProviderModel[]> {
  try {
    const response = await apiRequest('GET', `/api/ai-service/provider/${provider}/models`);
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error(`Error getting models for ${provider}:`, error);
    return [];
  }
}

/**
 * Check all providers' API key status
 */
export async function checkAllProviderApiKeys(): Promise<Record<string, boolean>> {
  try {
    const providers = ['openai', 'anthropic', 'perplexity', 'huggingface', 'mock'];
    const results = await Promise.all(
      providers.map(provider => checkProviderApiKey(provider))
    );
    
    const statusMap: Record<string, boolean> = {};
    results.forEach(result => {
      statusMap[result.provider] = result.configured;
    });
    
    return statusMap;
  } catch (error) {
    console.error('Error checking all provider API keys:', error);
    return {
      openai: false,
      anthropic: false,
      perplexity: false,
      huggingface: false,
      mock: true // Mock is always available
    };
  }
}