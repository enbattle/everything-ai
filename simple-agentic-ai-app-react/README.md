# Ollama Agentic AI App

An interactive TypeScript application demonstrating agentic AI using the ReAct (Reasoning + Acting) pattern with locally hosted LLMs via Ollama.

## 🎯 Purpose

This app showcases how to build an AI agent that can:

- **Reason** through problems step-by-step
- **Use tools** to gather information or perform actions
- **Chain multiple actions** together to solve complex tasks
- **Interact** with users in a conversational manner

## 🤖 What is Agentic AI?

Agentic AI refers to AI systems that can autonomously plan, reason, and take actions to achieve goals. Unlike simple chatbots, agents can:

- Break down complex problems into steps
- Use external tools and APIs
- Gather information from multiple sources
- Make decisions based on observations

## 📋 Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Ollama** installed and running locally
- **Basic understanding** of AI/LLM concepts (helpful but not required)

## 🛠️ Setup

### 1. Install Ollama and Model

```bash
# Download Ollama from https://ollama.com
# Then pull a model (Llama 3.1 8B recommended for good performance)
ollama pull llama3.1:8b

# Start Ollama server
ollama serve
```

### 2. Install Dependencies

```bash
npm install
```

## 🚀 Running the Agent

### Interactive Chat Mode

```bash
# Development mode (recommended)
npm run dev

# Or build and run
npm run build:run
```

### Example Session

```
🤖 Local Agent Ready! Type 'quit' to exit.
Try: 'What time is it?' or 'Calculate 15 * 23' or 'What's the weather?'

You: What time is it and what's 15 times 23?

🤔 Processing: "What time is it and what's 15 times 23?"

--- Iteration 1 ---
🧠 LLM Response:
Thought: I need to get the current time and calculate 15 times 23. Let me start with getting the time.
Action: get_time
Action Input:

🔧 Executing tool: get_time with input: ""
📋 Observation: 2025-08-10 3:42:15 PM

--- Iteration 2 ---
🧠 LLM Response:
Thought: Now I need to calculate 15 times 23.
Action: calculator
Action Input: 15 * 23

🔧 Executing tool: calculator with input: "15 * 23"
📋 Observation: 345

🤖 Agent: The current time is 2025-08-10 3:42:15 PM and 15 times 23 equals 345.
```

## 🧰 Available Tools

The agent comes with three built-in tools:

### 1. **Time Tool** (`get_time`)

- **Purpose**: Get current date and time
- **Usage**: "What time is it?", "What's the date?"

### 2. **Calculator Tool** (`calculator`)

- **Purpose**: Perform mathematical calculations
- **Usage**: "Calculate 15 \* 23", "What's 100 divided by 4?"
- **Safety**: Only allows basic math operations (+, -, \*, /, parentheses)

### 3. **Weather Tool** (`weather`)

- **Purpose**: Get weather information (currently returns mock data)
- **Usage**: "What's the weather?", "Weather in London"
- **Note**: Replace with real weather API for production use

## 🏗️ Architecture

### Core Components

1. **OllamaClient**: Handles communication with local LLM
2. **ReactAgent**: Implements the ReAct reasoning pattern
3. **Tool Interface**: Defines how tools work
4. **AgentChat**: Manages user interaction

### ReAct Pattern

The agent follows the **ReAct** (Reasoning + Acting) pattern:

1. **Thought**: Analyze the problem
2. **Action**: Choose a tool to use
3. **Action Input**: Provide input to the tool
4. **Observation**: Review the tool's output
5. **Repeat** until the problem is solved
6. **Final Answer**: Provide the complete response

## 🎮 Example Use Cases

### Simple Queries

- "What time is it?"
- "Calculate 25 + 17"
- "What's the weather like?"

### Complex Multi-Step Tasks

- "What time is it and what's the weather in Paris?"
- "Calculate 15% of 250 and tell me the current time"
- "What's 100 divided by 4, plus 25, and what's today's date?"

### Tool Chaining

The agent can automatically chain tools together based on your request.

## ⚙️ Configuration

### Change the Model

```typescript
// In agentic-ai.ts, modify the OllamaClient initialization
const llm = new OllamaClient("http://localhost:11434", "mistral:7b", 0.1);
```

### Add Custom Tools

```typescript
// Add to the tools array
const customTool: Tool = {
  name: "my_tool",
  description: "Description of what the tool does",
  func: async (input: string) => {
    // Your tool logic here
    return "Tool result";
  },
};
```

### Adjust Agent Parameters

```typescript
// Modify agent settings
const agent = new ReactAgent(
  llm,
  tools,
  5, // Max iterations (default: 3)
  true // Verbose logging (default: true)
);
```

## 🐛 Troubleshooting

### "Could not connect to Ollama"

```bash
# Make sure Ollama is running
ollama serve

# Check if your model is available
ollama list
```

### Agent Gets Stuck in Loops

- Increase `maxIterations` in ReactAgent constructor
- Check if tool descriptions are clear and specific
- Verify tool functions return meaningful results

### Poor Reasoning Quality

- Try a larger model (e.g., `llama3.1:70b` if you have enough RAM)
- Adjust temperature (lower = more consistent, higher = more creative)
- Improve tool descriptions to be more specific

### Tool Execution Errors

- Check tool function implementations
- Verify input validation in tools
- Add error handling to custom tools

## 🚀 Extending the Agent

### Adding Real APIs

Replace mock tools with real functionality:

```typescript
// Real weather API example
async function getRealWeather(city: string): Promise<string> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`
  );
  const data = await response.json();
  return `Weather in ${city}: ${data.weather[0].description}, ${data.main.temp}°K`;
}
```

### Creating Complex Workflows

Chain multiple agents or add state management for more sophisticated applications.

### Web Integration

Wrap the agent in an Express.js server to create a web API or chat interface.

## 📚 Learning Resources

- [ReAct Paper](https://arxiv.org/abs/2210.03629) - Original research on Reasoning + Acting
- [Ollama Documentation](https://ollama.com/docs) - Complete Ollama guide
- [Agentic AI Patterns](https://lilianweng.github.io/posts/2023-06-23-agent/) - Comprehensive overview
