// app/api/code-review/route.ts
import { NextRequest, NextResponse } from 'next/server';
import getGroqAiReview from '../groq';

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

const matchSection = (data: string, labels: string[], regexStr: string, fallback = ''): string => {
    for (const label of labels) {
        const regex = new RegExp(`${label}${regexStr}`, 'i');
        const match = data.match(regex);
        if (match) return match[1].trim();
    }
    return fallback;
};

// Parses bullet-pointed list (- item) and numbered list (1. item)
const parseList = (text: string, isNumbered: boolean = false): string[] => {
    return (
        isNumbered ?
            text
                .split('\n')
                .filter((line, index) => line.trim().startsWith(`${index}.`))
                .map(line => line.trim().slice(1).trim())
                .filter(Boolean) :
            text
                .split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.trim().slice(1).trim())
                .filter(Boolean)
    );

};

export async function getAIReview(
    code: string, language: string, description: string
): Promise<CodeReviewResponse> {
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
        1. Code Review: [Provide a detailed paragraph reviewing the code's quality, structure, and adherence to best practices for ${language}. Mention specific strengths and weaknesses.]
        2. Suggestions:
        - [Specific, actionable suggestion 1 with explanation]
        - [Specific, actionable suggestion 2 with explanation]
        - [Add more as needed, or leave empty if none]
        3. Potential Bugs:
        - [Specific potential bug 1 with line number if applicable and explanation]
        - [Specific potential bug 2 with line number if applicable and explanation]
        - [Add more as needed, or leave empty if none]
        4. Security Issues:
        - [Specific security issue 1 with explanation and potential impact]
        - [Specific security issue 2 with explanation and potential impact]
        - [Add more as needed, or leave empty if none]
        5. Refactored Code:
        [Provide the complete refactored code with improvements applied. If no changes are needed, return the original code unchanged. Include comments explaining changes.]`;

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
        let resultText = "";
        let res: CodeReviewResponse;

        const predictionData = await predictionResponse.json();

        if (predictionData.status == 402) {
            // If replicate limit exceeds, switch to groq API
            const groqAiReview = await getGroqAiReview(code, language, description);
            resultText += groqAiReview + "\n****";
            const regexStr = '([\\s\\S]*?)(?=\\n*\\s*(\\d+\\.\\s|\\*\\*[\\s]*|$))';
            res = {
                review: matchSection(resultText, ['Code Review:'], regexStr, "No review provided"),
                suggestions: parseList(matchSection(resultText, ['Suggestions:'], regexStr), false),
                potentialBugs: parseList(matchSection(resultText, ['Potential Bugs:'], regexStr), false),
                securityIssues: parseList(matchSection(resultText, ['Security Issues:'], regexStr), false),
                refactoredCode: matchSection(
                    resultText, ['Refactored Code:'],
                    '([\\s\\S]*?)(?=\\n*\\s*(\\*\\*\\*\\*))', code
                ),
            }
        } else {
            const predictionUrl = predictionData?.urls?.get;
            while (true) {
                const res = await fetch(predictionUrl, {
                    headers: { "Authorization": `Token ${REPLICATE_API_TOKEN}` }
                });
                const status = await res.json();
                if (status.status === "succeeded") {
                    resultText = "";
                    for (const output of status.output) {
                        resultText += output;
                    }
                    resultText += '\n**';
                    break;
                } else if (status.status === "failed") {
                    throw new Error("Replicate prediction failed");
                }
                await new Promise(r => setTimeout(r, 1000));
            }

            const regexStr = '([\\s\\S]*?)(?=\\n*\\s*(\\d+\\.\\s|\\*\\*[\\s]*|$))';
            res = {
                review: matchSection(resultText, ['Code Review'], regexStr, "No review provided"),
                suggestions: parseList(matchSection(resultText, ['Suggestions'], regexStr)),
                potentialBugs: parseList(matchSection(resultText, ['Potential Bugs'], regexStr)),
                securityIssues: parseList(matchSection(resultText, ['Security Issues'], regexStr)),
                refactoredCode: matchSection(resultText, ['Refactored Code'], regexStr, code),
            }

        }

        console.log(res);
        return res;

    } catch (error: unknown) {
        console.error("AI Review Error:", error instanceof Error ? error.message : String(error), error);
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