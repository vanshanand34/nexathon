import { useEffect, useState } from 'react';
import { 
  getCurrentAIProvider, 
  setAIProvider, 
  checkAllProviderApiKeys, 
  getProviderModels,
  type ProviderModel
} from '@/lib/ai-service';
import { AlertCircle, Brain, CheckCircle, Key, Settings, Shield } from 'lucide-react';
import { ask_secrets } from '@/lib/utils';
import { useToast } from '@/hooks/simple-toast';

export default function AIServicePage() {
  const [currentProvider, setCurrentProvider] = useState<string>('mock');
  const [providerStatus, setProviderStatus] = useState<Record<string, boolean>>({
    openai: false,
    anthropic: false,
    perplexity: false,
    huggingface: false,
    mock: true
  });
  const [models, setModels] = useState<ProviderModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load current provider and statuses
  useEffect(() => {
    async function loadProviderInfo() {
      try {
        setLoading(true);
        // Get current provider
        const provider = await getCurrentAIProvider();
        setCurrentProvider(provider);
        
        // Check all providers' API keys
        const statuses = await checkAllProviderApiKeys();
        setProviderStatus(statuses);
        
        // Get models for current provider
        const providerModels = await getProviderModels(provider);
        setModels(providerModels);
        
        // Set default model if available
        const defaultModel = providerModels.find(model => model.default)?.id;
        if (defaultModel) {
          setSelectedModel(defaultModel);
        } else if (providerModels.length > 0) {
          setSelectedModel(providerModels[0].id);
        }
      } catch (error) {
        console.error('Error loading provider info:', error);
        toast({
          title: 'Error',
          description: 'Failed to load AI provider information',
          variant: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadProviderInfo();
  }, [toast]);

  // Handle provider change
  const handleProviderChange = async (provider: string) => {
    try {
      setLoading(true);
      
      // Set the new provider
      const success = await setAIProvider(provider);
      
      if (success) {
        setCurrentProvider(provider);
        toast({
          title: 'Provider Updated',
          description: `AI provider changed to ${provider}`,
          variant: 'success'
        });
        
        // Get models for the new provider
        const providerModels = await getProviderModels(provider);
        setModels(providerModels);
        
        // Set default model if available
        const defaultModel = providerModels.find(model => model.default)?.id;
        if (defaultModel) {
          setSelectedModel(defaultModel);
        } else if (providerModels.length > 0) {
          setSelectedModel(providerModels[0].id);
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to change AI provider',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Error changing provider:', error);
      toast({
        title: 'Error',
        description: 'Failed to change AI provider',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle requesting API key
  const handleRequestApiKey = async (provider: string) => {
    let apiKeyName = '';
    
    if (provider === 'openai') {
      apiKeyName = 'OPENAI_API_KEY';
    } else if (provider === 'anthropic') {
      apiKeyName = 'ANTHROPIC_API_KEY';
    } else if (provider === 'perplexity') {
      apiKeyName = 'PERPLEXITY_API_KEY';
    } else if (provider === 'huggingface') {
      apiKeyName = 'HUGGINGFACE_API_KEY';
    } else {
      return;
    }
    
    try {
      await ask_secrets([apiKeyName], `To use the ${provider.charAt(0).toUpperCase() + provider.slice(1)} AI service provider, we need an API key. 
      
Please provide your ${apiKeyName} to enable this service.

You can obtain an API key from:
${provider === 'openai' ? 'https://platform.openai.com/api-keys' : 
  provider === 'anthropic' ? 'https://console.anthropic.com/settings/keys' : 
  provider === 'huggingface' ? 'https://huggingface.co/settings/tokens' :
  'https://www.perplexity.ai/settings/api'}

After adding the key, you'll be able to use ${provider.charAt(0).toUpperCase() + provider.slice(1)}'s advanced AI capabilities for code analysis.`);
      
      // Refresh provider statuses
      const statuses = await checkAllProviderApiKeys();
      setProviderStatus(statuses);
      
      if (statuses[provider]) {
        toast({
          title: 'API Key Added',
          description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} API key has been configured successfully.`,
          variant: 'success'
        });
      }
    } catch (error) {
      console.error(`Error setting up ${provider} API key:`, error);
      toast({
        title: 'Error',
        description: `Failed to set up ${provider} API key.`,
        variant: 'error'
      });
    }
  };

  const getProviderCard = (provider: string, name: string, description: string, icon: JSX.Element) => {
    const isConfigured = providerStatus[provider] || provider === 'mock';
    const isSelected = currentProvider === provider;
    
    return (
      <div className={`w-full border rounded-lg shadow-sm p-4 ${isSelected ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium flex items-center gap-2">
              {icon}
              {name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${isConfigured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {isConfigured ? "Configured" : "Not Configured"}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          {provider !== 'mock' && !isConfigured && (
            <button 
              onClick={() => handleRequestApiKey(provider)}
              className="inline-flex items-center text-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
            >
              <Key className="mr-2 h-4 w-4" />
              Add API Key
            </button>
          )}
          {provider !== 'mock' && !isConfigured && (
            <div className="w-4"></div>
          )}
          <button 
            onClick={() => handleProviderChange(provider)}
            disabled={loading || (isSelected && isConfigured) || !isConfigured}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isSelected 
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } ${loading || (isSelected && isConfigured) || !isConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSelected ? "Selected" : "Select"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Service Settings</h1>
        <p className="text-gray-500">
          Configure the AI service provider used for code analysis and reviews. 
          Different providers offer varying capabilities and performance.
        </p>
      </div>
      
      {!providerStatus.openai && !providerStatus.anthropic && !providerStatus.perplexity && !providerStatus.huggingface && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-amber-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">AI Services Need Configuration</h3>
              <p className="text-sm text-amber-700 mt-1">
                You're currently using the mock provider, which provides sample responses. 
                To access enhanced AI capabilities, configure at least one AI service provider.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {getProviderCard(
          'openai', 
          'OpenAI', 
          'Powered by GPT-4o and other advanced models. Best for comprehensive code analysis and complex suggestions.',
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5-2.6067-1.4997z" />
          </svg>
        )}
        
        {getProviderCard(
          'anthropic', 
          'Anthropic Claude', 
          'Powered by Claude 3.7 Sonnet and other models. Strong at understanding code intent and providing context-aware improvements.',
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.22 8.287c.172-.237.45-.237.621 0l8.14 11.252a.41.41 0 0 1-.313.672H3.425a.41.41 0 0 1-.313-.672L11.22 8.287zm10.89 2.018c.163-.225.42-.24.6-.035l.049.04L23.94 12a.448.448 0 0 1 0 .552l-1.178 1.691a.402.402 0 0 1-.649.036l-.033-.036-.812-1.155a.448.448 0 0 1 0-.552l.812-1.155a.419.419 0 0 1 .033-.076zm-19.992.6c.173-.24.45-.241.62-.014l.032.014.808 1.15a.448.448 0 0 1 0 .552l-.808 1.155a.402.402 0 0 1-.62.041l-.033-.04-.808-1.156a.448.448 0 0 1 0-.552l.808-1.15z"/>
            <path d="M11.22 5.288c.172-.237.45-.237.621 0l.808 1.102a.448.448 0 0 1 0 .552l-.796 1.087a.402.402 0 0 1-.621.041l-.036-.04-.764-1.088a.448.448 0 0 1 0-.552l.788-1.102z"/>
          </svg>
        )}
        
        {getProviderCard(
          'perplexity', 
          'Perplexity', 
          'Powered by Llama 3.1 Sonar models. Strong at generating detailed explanations and finding recent information.',
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.679 1.772C21.165 1.267 22 1.595 22 2.298v10.757c0 .703-.835 1.031-1.321.526l-4.757-4.713a.749.749 0 0 1 0-1.064l4.757-4.713v-.32ZM4.266 3.323C2.455 3.323 1 4.753 1 6.68v10.656c0 1.927 1.455 3.357 3.266 3.357h7.744c1.81 0 3.265-1.43 3.265-3.357v-.32l-8.063-7.994 8.063-7.993v-.32a3.29 3.29 0 0 0-3.266-3.357H8.025 4.266L4.267 3.323Z" />
          </svg>
        )}
        
        {getProviderCard(
          'huggingface', 
          'HuggingFace', 
          'Powered by CodeLlama and other open models. Good for code analysis with support for multiple programming languages.',
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.556 8c.045-.145.083-.293.113-.444C13.002 6.8 12.883 6 12.344 6a.481.481 0 00-.48.48v1.04c.122.18.53.33.164.48 .16 0 .314-.01.459-.032L12.556 8zm-1.111 0c.045.145.083.293.113.444C11.891 9.2 11.772 10 11.233 10a.481.481 0 01-.48-.48V8.48c.122-.18.53-.33.164-.48.16 0 .314.01.459.032L11.445 8zM10.778 5c-.045.145-.083.293-.113.444C10.332 6.2 10.451 7 10.99 7a.481.481 0 00.48-.48V5.48c-.122-.18-.53-.33-.164-.48-.16 0-.314.01-.459.032L10.778 5zm1.111 0c-.045-.145-.083-.293-.113-.444C11.442 3.8 11.561 3 12.1 3a.481.481 0 01.48.48v1.04c-.122.18-.53.33-.164.48-.16 0-.314-.01-.459-.032L11.889 5zM13.667 9c-.045.145-.083.293-.113.444C13.221 10.2 13.34 11 13.879 11a.481.481 0 00.48-.48V9.48c-.122-.18-.53-.33-.164-.48-.16 0-.314.01-.459.032L13.667 9zm1.111 0c-.045-.145-.083-.293-.113-.444C14.332 7.8 14.451 7 14.99 7a.481.481 0 01.48.48v1.04c-.122.18-.53.33-.164.48-.16 0-.314-.01-.459-.032L14.778 9zM9.444 9c.045.145.083.293.113.444C9.89 10.2 9.772 11 9.233 11a.481.481 0 01-.48-.48V9.48c.122-.18.53-.33.164-.48.16 0 .314.01.459.032L9.444 9zm-1.111 0c.045-.145.083-.293.113-.444C8.78 7.8 8.66 7 8.122 7a.481.481 0 00-.48.48v1.04c.122.18.53.33.164.48.16 0 .314-.01.459-.032L8.333 9z" />
          </svg>
        )}
        
        {getProviderCard(
          'mock', 
          'Mock Provider', 
          'Uses pre-generated responses for demonstration purposes. Always available but provides limited analysis depth.',
          <Brain className="h-5 w-5" />
        )}
      </div>
      
      {currentProvider !== 'mock' && providerStatus[currentProvider] && (
        <div className="mb-10 border rounded-lg shadow-sm p-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Settings
            </h3>
            <p className="mt-1 text-sm text-gray-500">Configure advanced options for the selected AI provider</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Model</label>
              <select 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="" disabled>Select model</option>
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Other advanced settings could go here */}
          </div>
        </div>
      )}
      
      <div className="mb-10 border rounded-lg shadow-sm p-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Shield className="h-5 w-5" />
            API Key Security
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Information about how your API keys are handled
          </p>
        </div>
        <p className="text-sm text-gray-600">
          Your API keys are stored securely as environment variables on the server. 
          They are never exposed to the client or stored in the database.
          Keys are only used to make requests to the respective AI service providers.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2">
          {Object.entries(providerStatus).map(([provider, configured]) => (
            provider !== 'mock' && (
              <div key={provider} className="flex items-center">
                {configured ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                )}
                <span className="capitalize">{provider}</span>
                <span className="ml-2 text-gray-500 text-sm">
                  {configured ? "API key configured" : "API key not configured"}
                </span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}