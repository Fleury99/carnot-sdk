export enum ComputeTier {
    LOCAL_LOGIC = 'LOCAL_LOGIC',
    EDGE_LLM = 'EDGE_LLM',
    CLOUD_GOD_TIER = 'CLOUD_GOD_TIER'
}
export interface EnergyCost { dollars: number; estimatedWatts: number; }
export interface RoutingDecision {
    tier: ComputeTier; entropyScore: number;
    metrics: { shannonEntropy: number; lexicalDensity: number; syntacticDepth: number; noiseProbability: number; };
    reasoning: string;
}
export interface ThermodynamicRecord {
    id: string; timestamp: number; promptPreview: string;
    routingDecision: RoutingDecision; legacyCost: EnergyCost; actualCost: EnergyCost; savings: EnergyCost;
    contextTokensShaved?: number;
}
export type ObserverCallback = (record: ThermodynamicRecord) => void;
