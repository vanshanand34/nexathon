import { Request, Response } from 'express';
import { getCurrentProvider, setAIProvider, getProviderInstance } from './ai-service-providers';

// Current provider state is managed in ai-service-providers.ts

/**
 * Get the current AI service provider
 */
export async function getCurrentAIProvider(req: Request, res: Response) {
  try {
    const provider = getCurrentProvider();
    
    return res.status(200).json({
      provider,
      success: true
    });
  } catch (error) {
    console.error('Error getting current AI provider:', error);
    return res.status(500).json({
      message: 'Failed to get current AI provider',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
}

/**
 * Set the current AI service provider
 */
export async function setCurrentAIProvider(req: Request, res: Response) {
  try {
    const { provider } = req.body;
    
    if (!provider) {
      return res.status(400).json({
        message: 'Provider name is required',
        success: false
      });
    }
    
    // Validate provider
    const validProviders = ['openai', 'anthropic', 'perplexity', 'mock'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({
        message: `Invalid provider. Must be one of: ${validProviders.join(', ')}`,
        success: false
      });
    }
    
    // Set the provider
    setAIProvider(provider);
    
    return res.status(200).json({
      provider,
      success: true,
      message: `AI provider set to ${provider}`
    });
  } catch (error) {
    console.error('Error setting AI provider:', error);
    return res.status(500).json({
      message: 'Failed to set AI provider',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
}

/**
 * Check if a provider has an API key configured
 */
export async function checkProviderApiKey(req: Request, res: Response) {
  try {
    const { provider } = req.params;
    
    if (!provider) {
      return res.status(400).json({
        message: 'Provider name is required',
        success: false
      });
    }
    
    // Check if the provider is valid
    const validProviders = ['openai', 'anthropic', 'perplexity', 'mock'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({
        message: `Invalid provider. Must be one of: ${validProviders.join(', ')}`,
        success: false
      });
    }
    
    // Check if API key is configured
    let configured = false;
    
    if (provider === 'mock') {
      // Mock provider is always configured
      configured = true;
    } else if (provider === 'openai') {
      configured = !!process.env.OPENAI_API_KEY;
    } else if (provider === 'anthropic') {
      configured = !!process.env.ANTHROPIC_API_KEY;
    } else if (provider === 'perplexity') {
      configured = !!process.env.PERPLEXITY_API_KEY;
    }
    
    return res.status(200).json({
      provider,
      configured,
      success: true
    });
  } catch (error) {
    console.error('Error checking provider API key:', error);
    return res.status(500).json({
      message: 'Failed to check provider API key',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
}

/**
 * Get available models for a provider
 */
export async function getProviderModels(req: Request, res: Response) {
  try {
    const { provider } = req.params;
    
    if (!provider) {
      return res.status(400).json({
        message: 'Provider name is required',
        success: false
      });
    }
    
    // Get available models based on provider
    let models = [];
    
    if (provider === 'openai') {
      models = [
        { id: 'gpt-4o', name: 'GPT-4o (Latest)', default: true },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
      ];
    } else if (provider === 'anthropic') {
      models = [
        { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet (Latest)', default: true },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' }
      ];
    } else if (provider === 'perplexity') {
      models = [
        { id: 'llama-3.1-sonar-small-128k-online', name: 'Llama 3.1 Sonar Small (Latest)', default: true },
        { id: 'llama-3.1-sonar-large-128k-online', name: 'Llama 3.1 Sonar Large' },
        { id: 'llama-3.1-sonar-huge-128k-online', name: 'Llama 3.1 Sonar Huge' }
      ];
    } else if (provider === 'mock') {
      models = [
        { id: 'mock-standard', name: 'Mock Standard', default: true }
      ];
    } else {
      return res.status(400).json({
        message: `Invalid provider: ${provider}`,
        success: false
      });
    }
    
    return res.status(200).json({
      provider,
      models,
      success: true
    });
  } catch (error) {
    console.error('Error getting provider models:', error);
    return res.status(500).json({
      message: 'Failed to get provider models',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
}