import { ComputeTier, RoutingDecision } from '../types';

export class CarnotEngine {
    private static readonly THRESHOLD_EDGE = 55;
    private static readonly THRESHOLD_CLOUD = 85;

    public route(prompt: string): RoutingDecision {
        const trimmedPrompt = prompt.trim();
        if (trimmedPrompt.length === 0) return this.buildDecision(0, 0, 0, 0, 0, ComputeTier.LOCAL_LOGIC, "Empty prompt");
        if (trimmedPrompt.length < 25) return this.buildDecision(0, 0, 0, 0, 0, ComputeTier.LOCAL_LOGIC, "Sub-25 char. Local.");

        const words = trimmedPrompt.toLowerCase().split(/[\s,.!?;:'"()]+/).filter(w => w.length > 0);
        
        // BYPASS MATHS : Les calculs (2+2, 5*4) ne nécessitent aucune IA
        const mathRegex = /[\d]+\s*[+\-*/]\s*[\d]+/;
        if (mathRegex.test(trimmedPrompt) && words.length < 15) {
            return this.buildDecision(0, 0, 0, 0, 0, ComputeTier.LOCAL_LOGIC, "Basic arithmetic. Local.");
        }

        const shannon = this.calculateShannonEntropy(trimmedPrompt);
        const syntactic = this.calculateSyntacticDepth(trimmedPrompt);
        
        const spaces = (trimmedPrompt.match(/ /g) || []).length;
        const noiseProbability = trimmedPrompt.length > 20 ? Math.max(0, 1 - (spaces / (trimmedPrompt.length / 5))) : 0;

        // PLAFOND LEXICAL
        let lexicalRaw = new Set(words).size / Math.max(words.length, 1);
        let lexical = Math.min(lexicalRaw, 0.5);

        // Détecteur de Jargon (>30% de mots > 7 lettres)
        const longWords = words.filter(w => w.length > 7).length;
        if ((longWords / Math.max(words.length, 1)) > 0.3 && noiseProbability <= 0.8) {
            return this.buildDecision(100, shannon, lexical, syntactic, noiseProbability, ComputeTier.CLOUD_GOD_TIER, "Academic/Jargon density. Forced Cloud.");
        }

        let rawScore = (shannon * 0.5) + (lexical * 0.3) + (syntactic * 0.2);
        if (noiseProbability > 0.8) rawScore = rawScore * 0.1;

        const normalizedScore = Math.min(100, (rawScore / 3.5) * 100);

        let tier: ComputeTier; let reasoning: string;

        if (noiseProbability > 0.8) { tier = ComputeTier.LOCAL_LOGIC; reasoning = "Gibberish detected. Blocked."; }
        else if (normalizedScore < CarnotEngine.THRESHOLD_EDGE) { tier = ComputeTier.LOCAL_LOGIC; reasoning = "Low density. Local."; }
        else if (normalizedScore < CarnotEngine.THRESHOLD_CLOUD) { tier = ComputeTier.EDGE_LLM; reasoning = "Moderate complexity. Edge."; }
        else { tier = ComputeTier.CLOUD_GOD_TIER; reasoning = "High cognitive weight. Cloud."; }

        return this.buildDecision(normalizedScore, shannon, lexical, syntactic, noiseProbability, tier, reasoning);
    }

    private calculateShannonEntropy(text: string): number {
        const freq = new Map<string, number>(); const len = text.length;
        for (let i = 0; i < len; i++) { const char = text[i]; freq.set(char, (freq.get(char) || 0) + 1); }
        let entropy = 0;
        freq.forEach((count) => { const p = count / len; if (p > 0) entropy -= p * Math.log2(p); });
        return entropy;
    }

    private calculateSyntacticDepth(text: string): number {
        const len = text.length; if (len === 0) return 0; let depthMarkers = 0;
        for (let i = 0; i < len; i++) { 
            const char = text[i]; 
            if (char === ',' || char === ';' || char === '(' || char === ')' || char === ':') depthMarkers++; 
        }
        return (depthMarkers / Math.max(len, 1)) * 100; 
    }

    private buildDecision(score: number, shannon: number, lexical: number, syntactic: number, noise: number, tier: ComputeTier, reasoning: string): RoutingDecision {
        return { tier, entropyScore: Math.round(score * 100) / 100, metrics: { shannonEntropy: Math.round(shannon * 1000) / 1000, lexicalDensity: Math.round(lexical * 1000) / 1000, syntacticDepth: Math.round(syntactic * 1000) / 1000, noiseProbability: Math.round(noise * 100) / 100 }, reasoning };
    }
}
