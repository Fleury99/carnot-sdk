const { CarnotAgent, ComputeTier } = require('../dist/index.cjs');

const agent = new CarnotAgent();

function modernRoutedCall(prompt) {
    const analysis = agent.execute(prompt);
    switch (analysis.routingDecision.tier) {
        case ComputeTier.LOCAL_LOGIC: console.log(`   ⚪ [LOCAL]  Bloqué : "${prompt.substring(0, 40)}..."`); break;
        case ComputeTier.EDGE_LLM: console.log(`   🟣 [EDGE]   Routed : "${prompt.substring(0, 40)}..."`); break;
        case ComputeTier.CLOUD_GOD_TIER: console.log(`   🔵 [CLOUD]  Autorisé : "${prompt.substring(0, 40)}..."`); break;
    }
}

console.log('\n🚀 DÉMARRAGE DU TRAFIC SIMULÉ...\n');

const fakeUserRequests = [
    "Bonjour",
    "Quelle est la capitale de la France ?",
    "Résume-moi l'histoire de France en 3 phrases.",
    "Analyse les subtilités ontologiques entre la phénoménologie de Husserl.",
    "Combien font 15 * 24 ?",
    "Fix le bug dans ma fonction React",
    "Hello"
];

fakeUserRequests.forEach(req => modernRoutedCall(req));

const finalMetrics = agent.getImpactMetrics();
console.log('\n--- RAPPORT THERMODYNAMIQUE ---');
console.log(`💰 Dollars Économisés : $${finalMetrics.totalDollarsSaved.toFixed(5)}`);
console.log(`⚡ Watts Épargnés    : ${finalMetrics.totalWattsSaved.toFixed(3)} W`);
console.log('----------------------------\n');
