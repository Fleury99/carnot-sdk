import { CarnotAgent, ComputeTier } from 'carnot-sdk';
import { useState } from 'react';

const agent = new CarnotAgent();

export default function ChatApp() {
    const [history, setHistory] = useState([]);

    const sendMessage = async (userText: string) => {
        const newUserMsg = { role: 'user', content: userText };
        const updatedHistory = [...history, newUserMsg];

        // Evaluate only the typed text, not the history
        const verdict = agent.execute(userText);

        let aiResponse;

        if (verdict.tier === ComputeTier.CLOUD_GOD_TIER) {
            // Call the backend API with the full history
            const res = await fetch('/api/chat', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: updatedHistory }) 
            });
            aiResponse = await res.json();
        } else {
            // Otherwise, save the network request and process locally
            aiResponse = { role: "assistant", content: "Local processing executed." };
        }

        setHistory([...updatedHistory, aiResponse]);
    };

    return <div>{/* Chat interface here */}</div>;
}
