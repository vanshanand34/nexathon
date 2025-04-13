// app/api/code-review/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Environment variable for Hugging Face API token
const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_API_URL = "https://api-inference.huggingface.co/models/bigcode/starcoder";

// Interface for request body
export interface CodeReviewRequest {
    code: string;
    language: string;
    description: string;
}

// Interface for review response
export interface CodeReviewResponse {
    review: string;
    suggestions: string[];
    potentialBugs: string[];
    securityIssues: string[];
    refactoredCode: string;
}

// Function to call Hugging Face API for code review
export async function getAIReview(code: string, language: string, description: string): Promise<CodeReviewResponse> {
    if (!HF_API_TOKEN) {
        throw new Error("Hugging Face API token is not configured");
    }

    try {
        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: `You are an expert code reviewer with deep knowledge of ${language}. Review the following code based on the provided description and return a detailed analysis in the exact format specified below. Be thorough, specific, and actionable in your feedback. Consider best practices, performance, readability, maintainability, and security.

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
[Provide the complete refactored code with improvements applied. If no changes are needed, return the original code unchanged. Include comments explaining changes.]`,
                parameters: {
                    max_new_tokens: 1000,
                    temperature: 0.5,
                    return_full_text: false,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
        }

        const result: { generated_text: string }[] = await response.json();
        const aiResponse = result[0]?.generated_text ?? "No response generated";

        // Adjusted regex without 's' flag - using [\s\S]* to match across newlines
        const reviewMatch = aiResponse.match(/1\. Code Review: ([\s\S]*?)(?=2\. Suggestions)/);
        const suggestionsMatch = aiResponse.match(/2\. Suggestions:([\s\S]*?)(?=3\. Potential Bugs)/);
        const bugsMatch = aiResponse.match(/3\. Potential Bugs:([\s\S]*?)(?=4\. Security Issues)/);
        const securityMatch = aiResponse.match(/4\. Security Issues:([\s\S]*?)(?=5\. Refactored Code)/);
        const refactoredMatch = aiResponse.match(/5\. Refactored Code:([\s\S]*)/);

        const parseList = (match: RegExpMatchArray | null): string[] => {
            return match?.[1]?.trim()
                ? match[1]
                    .split('\n')
                    .filter(line => line.trim().startsWith('-'))
                    .map(line => line.trim().slice(1).trim())
                    .filter(Boolean)
                : [];
        };

        return {
            review: reviewMatch?.[1]?.trim() ?? "No review provided",
            suggestions: parseList(suggestionsMatch),
            potentialBugs: parseList(bugsMatch),
            securityIssues: parseList(securityMatch),
            refactoredCode: refactoredMatch?.[1]?.trim() ?? code,
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

// POST /api/code-review - Full code review
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
