import * as readline from "readline";

// Types for our agent system
interface Tool {
  name: string;
  description: string;
  func: (input: string) => Promise<string> | string;
}

interface AgentStep {
  thought: string;
  action?: string;
  actionInput?: string;
  observation?: string;
}

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream: boolean;
  options?: {
    temperature?: number;
  };
}

interface OllamaGenerateResponse {
  response: string;
  done: boolean;
}

class OllamaClient {
  private baseUrl: string;
  private model: string;
  private temperature: number;

  constructor(
    baseUrl: string = "http://localhost:11434",
    model: string = "llama3.1:8b",
    temperature: number = 0.1
  ) {
    this.baseUrl = baseUrl;
    this.model = model;
    this.temperature = temperature;
  }

  async generate(prompt: string): Promise<string> {
    const requestBody: OllamaGenerateRequest = {
      model: this.model,
      prompt,
      stream: false,
      options: {
        temperature: this.temperature,
      },
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

// Tool implementations
async function getCurrentTime(): Promise<string> {
  return new Date().toLocaleString();
}

async function simpleCalculator(expression: string): Promise<string> {
  try {
    // Only allow basic operations for safety
    const allowedChars = new Set("0123456789+-*/.() ");
    const cleanExpression = expression.trim();

    if (cleanExpression.split("").every((c) => allowedChars.has(c))) {
      // Use Function constructor for safer evaluation
      const result = Function(`"use strict"; return (${cleanExpression})`)();
      return String(result);
    } else {
      return "Error: Invalid characters in expression";
    }
  } catch (error) {
    return "Error: Could not evaluate expression";
  }
}

async function getWeatherInfo(city: string = "New York"): Promise<string> {
  // Mock weather function - in a real app, you'd call a weather API
  return `The weather in ${city} is sunny and 72°F (this is mock data)`;
}

// Create tools array
const tools: Tool[] = [
  {
    name: "get_time",
    func: getCurrentTime,
    description: "Get the current date and time",
  },
  {
    name: "calculator",
    func: simpleCalculator,
    description: "Calculate simple math expressions like '2 + 2' or '10 * 5'",
  },
  {
    name: "weather",
    func: getWeatherInfo,
    description: "Get weather information for a city",
  },
];

class ReactAgent {
  private llm: OllamaClient;
  private tools: Tool[];
  private maxIterations: number;
  private verbose: boolean;

  constructor(
    llm: OllamaClient,
    tools: Tool[],
    maxIterations: number = 3,
    verbose: boolean = true
  ) {
    this.llm = llm;
    this.tools = tools;
    this.maxIterations = maxIterations;
    this.verbose = verbose;
  }

  private createPrompt(input: string, scratchpad: string = ""): string {
    const toolDescriptions = this.tools
      .map((tool) => `${tool.name}: ${tool.description}`)
      .join("\n");
    const toolNames = this.tools.map((tool) => tool.name).join(", ");

    return `You are a helpful assistant with access to tools.

You have access to the following tools:
${toolDescriptions}

Use the following format:
Question: the input question you must answer
Thought: think about what you need to do
Action: the action to take, should be one of [${toolNames}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: ${input}
Thought: ${scratchpad}`;
  }

  private parseAgentResponse(response: string): AgentStep {
    const lines = response
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    const step: AgentStep = { thought: "" };

    for (const line of lines) {
      if (line.startsWith("Thought:")) {
        step.thought = line.substring(8).trim();
      } else if (line.startsWith("Action:")) {
        step.action = line.substring(7).trim();
      } else if (line.startsWith("Action Input:")) {
        step.actionInput = line.substring(13).trim();
      } else if (line.startsWith("Final Answer:")) {
        step.observation = line.substring(13).trim();
        break;
      }
    }

    return step;
  }

  private async executeTool(toolName: string, input: string): Promise<string> {
    const tool = this.tools.find((t) => t.name === toolName);
    if (!tool) {
      return `Error: Tool '${toolName}' not found. Available tools: ${this.tools
        .map((t) => t.name)
        .join(", ")}`;
    }

    try {
      return await tool.func(input);
    } catch (error) {
      return `Error executing tool '${toolName}': ${error}`;
    }
  }

  async invoke(input: string): Promise<{ output: string }> {
    let scratchpad = "";
    let finalAnswer = "";

    if (this.verbose) {
      console.log(`\n🤔 Processing: "${input}"`);
    }

    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      if (this.verbose) {
        console.log(`\n--- Iteration ${iteration + 1} ---`);
      }

      const prompt = this.createPrompt(input, scratchpad);
      const response = await this.llm.generate(prompt);

      if (this.verbose) {
        console.log(`🧠 LLM Response:\n${response}`);
      }

      // Check if we have a final answer
      if (response.includes("Final Answer:")) {
        const finalAnswerMatch = response.match(/Final Answer:\s*(.+)/);
        if (finalAnswerMatch) {
          finalAnswer = finalAnswerMatch[1].trim();
          break;
        }
      }

      const step = this.parseAgentResponse(response);

      if (step.action && step.actionInput !== undefined) {
        if (this.verbose) {
          console.log(
            `🔧 Executing tool: ${step.action} with input: "${step.actionInput}"`
          );
        }

        const observation = await this.executeTool(
          step.action,
          step.actionInput
        );
        step.observation = observation;

        if (this.verbose) {
          console.log(`📋 Observation: ${observation}`);
        }

        // Add to scratchpad for next iteration
        scratchpad += `${step.thought ? "I" : "I"} need to use the ${
          step.action
        } tool.\n`;
        scratchpad += `Action: ${step.action}\n`;
        scratchpad += `Action Input: ${step.actionInput}\n`;
        scratchpad += `Observation: ${observation}\n`;
        scratchpad += `Thought: `;
      } else {
        // No action found, might be final answer or need to continue
        scratchpad += step.thought + "\n";
      }
    }

    if (!finalAnswer) {
      finalAnswer =
        "I couldn't complete the task within the maximum iterations.";
    }

    return { output: finalAnswer };
  }
}

class AgentChat {
  private agent: ReactAgent;
  private rl: readline.Interface;

  constructor(agent: ReactAgent) {
    this.agent = agent;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start(): Promise<void> {
    console.log("🤖 Local Agent Ready! Type 'quit' to exit.");
    console.log(
      "Try: 'What time is it?' or 'Calculate 15 * 23' or 'What's the weather?'"
    );

    while (true) {
      const userInput = await this.askQuestion("\nYou: ");

      if (
        userInput.toLowerCase().trim() === "quit" ||
        userInput.toLowerCase().trim() === "exit" ||
        userInput.toLowerCase().trim() === "bye"
      ) {
        console.log("👋 Goodbye!");
        break;
      }

      try {
        const response = await this.agent.invoke(userInput);
        console.log(`\n🤖 Agent: ${response.output}`);
      } catch (error) {
        console.log(`❌ Error: ${error}`);
      }
    }

    this.rl.close();
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }
}

// Main function
async function main(): Promise<void> {
  console.log("🚀 Starting Local Agentic AI...\n");

  // Test Ollama connection first
  const llm = new OllamaClient("http://localhost:11434", "llama3.1:8b", 0.1);

  try {
    console.log("🔍 Testing Ollama connection...");
    await llm.generate("Hello");
    console.log("✅ Ollama connection successful!\n");
  } catch (error) {
    console.log(
      "❌ Could not connect to Ollama. Make sure it's running with 'ollama serve'"
    );
    console.log(`Error: ${error}`);
    return;
  }

  // Create and start agent
  const agent = new ReactAgent(llm, tools, 3, true);
  const chat = new AgentChat(agent);

  await chat.start();
}

// Handle process exit
process.on("SIGINT", () => {
  console.log("\n👋 Goodbye!");
  process.exit(0);
});

// Run the application
if (require.main === module) {
  main().catch(console.error);
}
