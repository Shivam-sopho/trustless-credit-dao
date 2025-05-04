import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { amount, duration, purpose, metadata } = req.body;

        // Analyze creditworthiness using GPT-4
        const creditAnalysis = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a credit risk analyst. Analyze the loan application and provide a credit score (0-1000) and reasoning."
                },
                {
                    role: "user",
                    content: `Loan Application:
Amount: ${amount} SMR
Duration: ${duration} days
Purpose: ${purpose}
Additional Info: ${metadata}

Please analyze this loan application and provide:
1. A credit score (0-1000)
2. A fraud risk score (0-100)
3. Detailed reasoning for both scores`
                }
            ],
            temperature: 0.7,
        });

        const analysis = creditAnalysis.choices[0].message.content;

        // Extract scores and reasoning from the AI response
        const creditScore = extractScore(analysis, 'credit score');
        const fraudScore = extractScore(analysis, 'fraud risk');
        const reasoning = extractReasoning(analysis);

        res.status(200).json({
            creditScore,
            fraudScore,
            reasoning,
        });
    } catch (error) {
        console.error('Error analyzing loan:', error);
        res.status(500).json({ error: 'Error analyzing loan application' });
    }
}

function extractScore(text: string, scoreType: string): number {
    const regex = new RegExp(`${scoreType}.*?(\\d+)`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1]) : 500; // Default score if not found
}

function extractReasoning(text: string): string {
    // Extract the reasoning part after the scores
    const reasoningMatch = text.match(/reasoning:(.*)/is);
    return reasoningMatch ? reasoningMatch[1].trim() : 'No reasoning provided';
} 