# everything-ai

A collection of TypeScript applications demonstrating how to build AI-powered applications using locally hosted Large Language Models (LLMs) via Ollama.

## 💻 About Ollama

Strengths of Ollama

- Easy setup: Simple installation and model management
- Good model selection: Supports Llama, Mistral, CodeLlama, and many other popular models
- REST API: Makes it easy to integrate into your apps
- Resource management: Automatically handles GPU/CPU allocation
- Active community: Regular updates and good documentation

Breakdown of different Ollama models

- Llama 3.1 8B: Great balance of capability and speed, good for most agentic tasks
- Mistral 7B: Fast and capable, particularly good at following instructions
- CodeLlama: If your agents need to write/analyze code
- Llama 3.1 70B: Much more capable but requires significant hardware (32GB+ RAM)

Ollama models and hardware considerations

- 8B models: 8-16GB RAM minimum
- 13B models: 16-32GB RAM
- 70B models: 64GB+ RAM (or quantized versions with 32GB+)

To setup Ollama

- Download from the official Ollama page (Windows, MacOS, Linux)
- Once installed, you will need to install the models
- For higher end machines and setups, feel free to choose any model you like
- For lower end machines, recommend starting with the model llama3.1:8b

Note: When Ollama is set up and running, it runs a server usually at localhost:11434 that you can use

Other alternative options (if you do not want to use Ollama)

- LM Studio: Similar to Ollama but with a GUI, good for testing different models
- vLLM: Better for high-throughput production use

## 🎯 Project Overview

This repository contains two complementary applications that showcase different aspects of working with local LLMs:

1. **Basic LLM Test App** - Simple connection testing and text generation
2. **Agentic AI App** - Advanced agent with reasoning and tool use capabilities

## 🚀 Quick Start

### 1. Prerequisites Setup

```bash
# Install Node.js (v18+) from https://nodejs.org
# Install Ollama from https://ollama.com

# Download and start a model
ollama pull llama3.1:8b
ollama serve
```

### 2. Project Setup

```bash
# Clone or download this project
npm install
```

### 3. Run Applications

```bash
# Test basic LLM connection
npm run dev

# Run the agentic AI chat
npm run dev:agent
```

## 📱 Applications

### 🧪 Basic LLM Test App

**Purpose**: Test your Ollama setup and understand basic LLM interaction

**Features**:

- ✅ Connection testing
- 📋 Model discovery
- 💬 Simple text generation
- 🔧 Error handling

**Best for**:

- First-time Ollama users
- Testing new models
- Basic integration examples
- Learning LLM API basics

---

### 🤖 Agentic AI App

**Purpose**: Demonstrate advanced AI agent capabilities with reasoning and tool use

**Features**:

- 🧠 Multi-step reasoning (ReAct pattern)
- 🛠️ Tool integration (calculator, time, weather)
- 🔄 Action chaining
- 💭 Transparent thinking process
- 💬 Interactive chat interface

**Best for**:

- Learning agentic AI concepts
- Building complex AI applications
- Understanding ReAct pattern
- Tool-augmented AI systems

## 🎓 Learning Path

### Beginner Path

1. **Start with Basic Test** - Understand LLM basics
2. **Read the code** - Learn TypeScript + Ollama integration
3. **Experiment with models** - Try different LLMs
4. **Modify prompts** - See how responses change

### Intermediate Path

1. **Run Agentic AI** - Experience tool-augmented AI
2. **Study ReAct pattern** - Understand reasoning + acting
3. **Add custom tools** - Extend agent capabilities
4. **Experiment with workflows** - Chain multiple actions

### Advanced Path

1. **Integrate real APIs** - Replace mock tools
2. **Add memory/state** - Build stateful agents
3. **Create web interfaces** - Build full applications
4. **Deploy at scale** - Production considerations

## 🎯 Use Cases

### Basic App Use Cases

- ✅ Testing new Ollama installations
- 🔍 Exploring different LLM models
- 📚 Learning LLM API integration
- 🛠️ Building simple AI-powered features

### Agentic AI Use Cases

- 🤖 Virtual assistants with tool access
- 📊 Data analysis workflows
- 🔄 Multi-step automation
- 🧠 Complex reasoning applications
- 🛠️ Tool-augmented problem solving
