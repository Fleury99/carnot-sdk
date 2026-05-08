<div align="center">
  <h1>carnot-sdk</h1>
  <p>Zero-latency edge routing for LLMs using Shannon entropy.</p>
  
  [![npm version](https://img.shields.io/npm/v/carnot-sdk?style=flat&color=white)](https://www.npmjs.com/package/carnot-sdk)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Bundle Size](https://img.shields.io/badge/Bundle-5kb-4ADE80.svg)]()
</div>

### The Problem
Sending every user prompt to massive cloud models is a thermodynamic waste. The industry treats all prompts as equal, burning compute and dollars on simple queries that could be handled locally.

### The Solution
**Carnot** is an 11kb stateless routing protocol that evaluates the "cognitive weight" of a prompt before a single token is sent over the network. 

It runs entirely on the edge (client-side) and decides in **< 5ms** whether to route to:
*   **Local Execution** (Regex/Cache)
*   **Edge Inference** (On-device small models)
*   **Cloud Relocation** (Frontier massive-parameter models)

### How it Works (Under the Hood)
We don't use AI to route AI. We use deterministic mathematics. Carnot relies on three O(N) heuristics:
1. **Shannon Entropy Engine:** Calculates the character unpredictability of the prompt.
2. **Contextual Razor:** Uses DJB2 hashing to detect and eliminate redundant system prompts in conversational loops.
3. **Academic/Jargon Detection:** Identifies high lexical density to prevent routing complex philosophy to small models.

### Installation

npm install carnot-sdk

### Usage

typescript
import { CarnotAgent, ComputeTier } from 'carnot-sdk';

const agent = new CarnotAgent();

async function handleInference(rawPrompt: string) {
  // Analyze the prompt in < 5ms
  const verdict = agent.execute(rawPrompt);

  if (verdict.tier === ComputeTier.CLOUD_GOD_TIER) {
      return await expensiveCloudLLM.fetch(rawPrompt); 
  }
  
  // Route to local or edge...
}


### Run the Benchmark
Want to see the routing logic in action? Clone the repo and run:

node examples/enterprise-demo.js

### Why Open Source?
The compute crisis in AI is an infrastructure problem that requires a community standard. By open-sourcing the routing engine, we ensure it becomes the universal optimization layer for any developer building with LLMs, regardless of their cloud provider.

### Concrete Integration Scenarios

Carnot is a routing engine. It does not execute the AI, it tells your app *where* to execute it. Here is how to implement the 3 tiers in a real-world application:

#### 1. Local Execution (Regex / Cache / App State)
**When to use:** Simple factual queries, greetings, or UI interactions.

```typescript
// Example: User asks for app settings
if (verdict.tier === ComputeTier.LOCAL_LOGIC) {
    return getAppSettingsFromLocalDatabase(); // Takes 0.001ms. $0 cost.
}
```

#### 2. Edge Inference (On-Device Small Models)
**When to use:** Summarizations, basic translations, or formatting. Tasks too complex for Regex, but not requiring frontier logic.

```typescript
// Example: User wants a text summarized
if (verdict.tier === ComputeTier.EDGE_LLM) {
    // Route to an on-device model like Llama-3-8B (using react-native-llama, for instance)
    const result = await LocalDeviceModel.generate(rawPrompt); // Takes ~2s. $0 cost.
    return result;
}
```

#### 3. Cloud Relocation (Frontier Massive-Parameter Models)
**When to use:** Highly complex reasoning, deep philosophical analysis, or code generation that small models cannot handle.
```typescript
// Example: Complex philosophical prompt
if (verdict.tier === ComputeTier.CLOUD_GOD_TIER) {
    // Safely send to OpenAI/Anthropic, knowing you avoided paying for the simple queries
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "user", content: rawPrompt }] })
    });
    return response;
}
```

**The Result:** Your users get the exact same experience, but your infrastructure costs drop drastically because simple tasks never touch the network.

### License
MIT



