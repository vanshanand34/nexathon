// app/api/code-review/route.ts
import { NextRequest, NextResponse } from 'next/server';

export interface CodeReviewRequest {
    code: string;
    language: string;
    description: string;
}

export interface CodeReviewResponse {
    review: string;
    suggestions: string[];
    potentialBugs: string[];
    securityIssues: string[];
    refactoredCode: string;
}

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const MODEL_VERSION_ID = "meta/meta-llama-3-8b-instruct"; // Chosen for cost-effective high-volume use

export async function getAIReview(code: string, language: string, description: string): Promise<CodeReviewResponse> {
    if (!REPLICATE_API_TOKEN) {
        throw new Error("Replicate API token is not configured");
    }

    try {
        const prompt = `You are an expert code reviewer with deep knowledge of ${language}. Review the following code based on the provided description and return a detailed analysis in the exact format specified below. Be thorough, specific, and actionable in your feedback.

Language: ${language}
Description: ${description}
Code:
${code}

Respond in this exact format:
1.Code Review: [Detailed review]
2.Suggestions:
   - [Suggestion 1]
   - [Suggestion 2]
3. Potential Bugs:
   - [Bug 1]
4. Security Issues:
   - [Issue 1]
5. Refactored Code:
[Refactored code here]`;

        const predictionResponse = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Token ${REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                version: MODEL_VERSION_ID,
                input: {
                    prompt,
                    temperature: 0.2,
                    top_p: 0.9,
                    max_new_tokens: 1024
                }
            })
        });

        const predictionData = await predictionResponse.json();
        const predictionUrl = predictionData.urls.get;

        let resultText = "";
        while (true) {
            const res = await fetch(predictionUrl, {
                headers: { "Authorization": `Token ${REPLICATE_API_TOKEN}` }
            });
            const status = await res.json();
            if (status.status === "succeeded") {
                console.log("Replicate prediction succeeded", status, status.output);
                resultText = "";
                for (const output of status.output) {
                    resultText += output;
                }
                console.log(resultText);
                break;
            } else if (status.status === "failed") {
                throw new Error("Replicate prediction failed");
            }
            await new Promise(r => setTimeout(r, 1000));
        }

        const matchSection = (labels: string[], fallback = ''): string => {
            for (const label of labels) {
                const regex = new RegExp(`${label}([\\s\\S]*?)(?=\\n\\s*(\\*\\*|\\d+\\.\\s|$))`, 'i');
                const match = resultText.match(regex);
                if (match) return match[1].trim();
            }
            return fallback;
        };

        const review = matchSection(['1\\. Code Review:', '\\*\\*Code Review:\\*\\*']);
        const suggestionsText = matchSection(['2\\. Suggestions:', '\\*\\*Suggestions:\\*\\*']);
        const bugsText = matchSection(['3\\. Potential Bugs:', '\\*\\*Potential Bugs:\\*\\*']);
        const securityText = matchSection(['4\\. Security Issues:', '\\*\\*Security Issues:\\*\\*']);
        const refactoredCode = matchSection(['5\\. Refactored Code:', '\\*\\*Refactored Code:\\*\\*'], code);

        // Parses bullet-pointed list (- item)
        const parseList = (text: string): string[] => {
            return text
                .split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.trim().slice(1).trim())
                .filter(Boolean);
        };

        return {
            review: matchSection(['1\\. Code Review:', '\\*\\*Code Review:\\*\\*'], "No review provided"),
            suggestions: parseList(matchSection(['2\\. Suggestions:', '\\*\\*Suggestions:\\*\\*'])),
            potentialBugs: parseList(matchSection(['3\\. Potential Bugs:', '\\*\\*Potential Bugs:\\*\\*'])),
            securityIssues: parseList(matchSection(['4\\. Security Issues:', '\\*\\*Security Issues:\\*\\*'])),
            refactoredCode: matchSection(['5\\. Refactored Code:', '\\*\\*Refactored Code:\\*\\*'], code),
        };
    } catch (error: unknown) {
        console.error("AI Review Error:", error instanceof Error ? error.message : String(error));
        return {
            review: "Unable to generate review due to API error",
            suggestions: [],
            potentialBugs: [],
            securityIssues: [],
            refactoredCode: code,
        };
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = (await request.json()) as CodeReviewRequest;

        if (!body.code || !body.language || !body.description) {
            return NextResponse.json(
                { error: "Missing required fields: code, language, and description" },
                { status: 400 }
            );
        }

        const reviewResult = await getAIReview(body.code, body.language, body.description);

        return NextResponse.json({
            success: true,
            data: reviewResult,
        });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}