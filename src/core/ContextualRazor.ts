export class ContextualRazor {
    private lastContextHash: string | null = null;
    public shave(rawPrompt: string): { optimizedPrompt: string; contextTokensSaved: number } {
        const contextRegex = /<context>([\s\S]*?)<\/context>|([\s\S]*?)\n\n(?!.*\n\n)/;
        const match = rawPrompt.match(contextRegex);
        if (!match) return { optimizedPrompt: rawPrompt, contextTokensSaved: 0 };
        const contextBlock = match[1] || match[2] || "";
        const newQuery = rawPrompt.replace(match[0], "").trim();
        if (!contextBlock || !newQuery) return { optimizedPrompt: rawPrompt, contextTokensSaved: 0 };
        const currentHash = this.simpleHash(contextBlock);
        if (currentHash === this.lastContextHash) {
            const marker = "[CTX_CACHED]";
            const optimized = `${marker} ${newQuery}`;
            const tokensSaved = Math.ceil(contextBlock.length / 4);
            this.lastContextHash = currentHash;
            return { optimizedPrompt: optimized, contextTokensSaved: tokensSaved };
        }
        this.lastContextHash = currentHash;
        return { optimizedPrompt: rawPrompt, contextTokensSaved: 0 };
    }
    private simpleHash(str: string): string {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) { hash = ((hash << 5) + hash) + str.charCodeAt(i); hash = hash & hash; }
        return hash.toString(36);
    }
}
