# Ollama Basic Test App

A simple TypeScript Node.js application to test your local Ollama LLM installation and perform basic text generation.

## 🎯 Purpose

This app demonstrates how to:

- Connect to a locally running Ollama instance
- Check which models are available
- Generate text responses using the Ollama API
- Handle errors and connection issues

## 📋 Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Ollama** installed and running locally

## 🛠️ Setup

### 1. Install Ollama

Download and install Ollama from [https://ollama.com](https://ollama.com)

### 2. Download and Start a Model

```bash
# Pull the Llama 3.1 8B model (recommended)
ollama pull llama3.1:8b

# Start Ollama server (if not already running)
ollama serve
```

### 3. Install Project Dependencies

```bash
npm install
```

## 🚀 Running the App

### Development Mode (Recommended)

```bash
npm run dev
```

### Build and Run

```bash
npm run build:run
```

## 🧠 What the App Does

1. **Connection Test**: Checks if Ollama is running on `localhost:11434`
2. **Model Discovery**: Lists all available models in your Ollama installation
3. **Text Generation**: Sends a sample prompt and displays the response
4. **Error Handling**: Provides clear error messages if something goes wrong

## 🔧 Configuration

You can customize the app by modifying these values in `test-llm-locally.ts`:

```typescript
// Change the model
const model = "llama3.1:8b"; // Try: "mistral:7b", "codellama:13b", etc.

// Change the test prompt
const prompt = "Explain what a neural network is in one sentence.";

// Change the Ollama server URL (if needed)
const client = new OllamaClient("http://localhost:11434");
```

## 📊 Expected Output

```
🚀 Testing Ollama connection and LLM...

✅ Ollama is running!
Available models: [ 'llama3.1:8b', 'mistral:7b' ]

🧠 Testing LLM generation...
Model: llama3.1:8b
Prompt: Explain what a neural network is in one sentence.
Generating response...

Response: A neural network is a computational model inspired by the human brain that uses interconnected nodes (neurons) to process information and learn patterns from data through training.
```

## ❌ Troubleshooting

### "Ollama not running" Error

```bash
# Start Ollama server
ollama serve
```

### "Model not found" Error

```bash
# Make sure you have the model downloaded
ollama pull llama3.1:8b
ollama list  # Check available models
```

### Port 11434 Already in Use

If Ollama is running on a different port, update the base URL in the code:

```typescript
const client = new OllamaClient("http://localhost:YOUR_PORT");
```

### TypeScript Compilation Errors

```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

## 🔗 API Reference

The app uses Ollama's REST API endpoints:

- `GET /api/tags` - List available models
- `POST /api/generate` - Generate text from a prompt

For full API documentation, visit: [Ollama API Docs](https://github.com/ollama/ollama/blob/main/docs/api.md)
