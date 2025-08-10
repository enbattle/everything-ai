interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

interface OllamaTagsResponse {
  models: OllamaModel[];
}

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  done_reason: string;
  context: number[];
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

class OllamaClient {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:11434") {
    this.baseUrl = baseUrl;
  }

  /**
   * Test if Ollama is running and get available models
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);

      if (response.ok) {
        const data = (await response.json()) as OllamaTagsResponse;
        console.log("✅ Ollama is running!");
        console.log(
          "Available models:",
          data.models.map((model) => model.name)
        );
        return true;
      } else {
        console.log(`❌ Ollama responded with status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.log("❌ Ollama not running. Start it with: ollama serve");
      console.log(`Error: ${error}`);
      return false;
    }
  }

  /**
   * Generate text using Ollama
   */
  async generate(model: string, prompt: string): Promise<string> {
    const requestBody: OllamaGenerateRequest = {
      model,
      prompt,
      stream: false,
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as OllamaGenerateResponse;
      return data.response;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
}

/**
 * Basic LLM test
 */
async function basicLlmTest(client: OllamaClient): Promise<void> {
  try {
    // Using llama3.1:8b as discussed earlier, but you can change this
    const model = "llama3.1:8b";
    const prompt = "Explain what a neural network is in one sentence.";

    console.log("\n🧠 Testing LLM generation...");
    console.log(`Model: ${model}`);
    console.log(`Prompt: ${prompt}`);
    console.log("Generating response...\n");

    const response = await client.generate(model, prompt);
    console.log(`Response: ${response}`);
  } catch (error) {
    console.error("❌ LLM test failed:", error);
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("🚀 Testing Ollama connection and LLM...\n");

  const client = new OllamaClient();

  const isConnected = await client.testConnection();

  if (isConnected) {
    await basicLlmTest(client);
  } else {
    console.log("\nPlease ensure Ollama is running before testing the LLM.");
  }
}

// Run the main function
main().catch(console.error);
