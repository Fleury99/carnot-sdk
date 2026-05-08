import { ComputeTier, RoutingDecision, ThermodynamicRecord, EnergyCost } from '../types';
export class ThermodynamicLedger {
    private static readonly CLOUD_COST_PER_TOKEN_USD = 0.00001;
    private static readonly CLOUD_COST_PER_TOKEN_WATT = 0.0015;
    private static readonly EDGE_COST_MULTIPLIER = 0.05;
    private static readonly LOCAL_COST_MULTIPLIER = 0.001;
    private ledger: ThermodynamicRecord[] = [];
    private readonly MAX_BUFFER_SIZE = 1000; 
    public recordDecision(prompt: string, decision: RoutingDecision): ThermodynamicRecord {
        const estimatedTokens = this.estimateTokens(prompt);
        const legacyCost = this.calculateCost(estimatedTokens, 1.0);
        let actualMultiplier = 1.0;
        if (decision.tier === ComputeTier.EDGE_LLM) actualMultiplier = ThermodynamicLedger.EDGE_COST_MULTIPLIER;
        if (decision.tier === ComputeTier.LOCAL_LOGIC) actualMultiplier = ThermodynamicLedger.LOCAL_COST_MULTIPLIER;
        const actualCost = this.calculateCost(estimatedTokens, actualMultiplier);
        const record: ThermodynamicRecord = {
            id: Math.random().toString(36).slice(2, 13), timestamp: Date.now(),
            promptPreview: prompt.substring(0, 50) + (prompt.length > 50 ? "..." : ""),
            routingDecision: decision, legacyCost, actualCost,
            savings: { dollars: legacyCost.dollars - actualCost.dollars, estimatedWatts: legacyCost.estimatedWatts - actualCost.estimatedWatts }
        };
        if (this.ledger.length >= this.MAX_BUFFER_SIZE) this.ledger.shift();
        this.ledger.push(record);
        return record;
    }
    public getAggregateValue(): { totalDollarsSaved: number; totalWattsSaved: number; requestsProcessed: number } {
        return this.ledger.reduce((acc, record) => { acc.totalDollarsSaved += record.savings.dollars; acc.totalWattsSaved += record.savings.estimatedWatts; acc.requestsProcessed += 1; return acc; }, { totalDollarsSaved: 0, totalWattsSaved: 0, requestsProcessed: 0 });
    }
    public exportRecords(): ThermodynamicRecord[] { const copy = [...this.ledger]; this.ledger = []; return copy; }
    private estimateTokens(text: string): number { return Math.ceil(text.length / 4); }
    private calculateCost(tokens: number, multiplier: number): EnergyCost {
        return { dollars: parseFloat((tokens * ThermodynamicLedger.CLOUD_COST_PER_TOKEN_USD * multiplier).toFixed(6)), estimatedWatts: parseFloat((tokens * ThermodynamicLedger.CLOUD_COST_PER_TOKEN_WATT * multiplier).toFixed(4)) };
    }
}
