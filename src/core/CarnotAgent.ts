import { ComputeTier, RoutingDecision, ThermodynamicRecord, ObserverCallback } from '../types';
import { ContextualRazor } from './ContextualRazor';
import { CarnotEngine } from './CarnotEngine';
import { ThermodynamicLedger } from './ThermodynamicLedger';

// L'interface des options avancées (Le tuyau de contournement)
export interface CarnotOptions {
    forceTier?: ComputeTier;
}

export class CarnotAgent {
    private readonly razor: ContextualRazor;
    private readonly engine: CarnotEngine;
    private readonly ledger: ThermodynamicLedger;
    private observers: Set<ObserverCallback> = new Set();

    constructor() {
        this.razor = new ContextualRazor();
        this.engine = new CarnotEngine();
        this.ledger = new ThermodynamicLedger();
    }

    // NOUVELLE SIGNATURE : On accepte maintenant les options
    /**
     * Evaluates the cognitive weight of a prompt to route it to the optimal compute tier.
     * @param rawPrompt The raw string input from the user.
     * @param options Optional overrides. Use `forceTier` to bypass heuristics and maintain conversation state with a cloud model.
     * @returns A ThermodynamicRecord containing the routing decision and estimated savings.
     */
    public execute(rawPrompt: string, options?: CarnotOptions): ThermodynamicRecord {
        const { optimizedPrompt, contextTokensSaved } = this.razor.shave(rawPrompt);
        
        // LE CONTOURNEMENT DE SÉCURITÉ :
        // Si le développeur spécifie un forceTier (parce que c'est une réponse à un Cloud),
        // on court-circuite l'Entropy Engine pour garantir le fil de la conversation.
        const decision: RoutingDecision = options?.forceTier 
            ? this.buildForcedDecision(options.forceTier, optimizedPrompt)
            : this.engine.route(optimizedPrompt);

        const record = this.ledger.recordDecision(optimizedPrompt, decision);
        record.contextTokensShaved = contextTokensSaved;
        
        if (this.observers.size > 0) {
            Promise.resolve().then(() => this.notifyObservers(record));
        }

        return record;
    }

    // Méthode privée pour générer une décision forcée propre pour le Ledger
    private buildForcedDecision(tier: ComputeTier, prompt: string): RoutingDecision {
        return {
            tier,
            entropyScore: 0, // Non calculé
            metrics: { shannonEntropy: 0, lexicalDensity: 0, syntacticDepth: 0, noiseProbability: 0 },
            reasoning: `Forced ${tier} via API options (Contextual Reply).`
        };
    }

    public onRecordGenerated(callback: ObserverCallback): () => void {
        this.observers.add(callback);
        return () => this.observers.delete(callback);
    }

    public getImpactMetrics() {
        return this.ledger.getAggregateValue();
    }

    public flushRecords(): ThermodynamicRecord[] {
        return this.ledger.exportRecords();
    }

    private notifyObservers(record: ThermodynamicRecord): void {
        this.observers.forEach(callback => {
            try { callback(record); } 
            catch (error) { console.error("[CARNOT] Observer failed.", error); }
        });
    }
}
