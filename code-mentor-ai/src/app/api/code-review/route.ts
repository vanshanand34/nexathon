// app/api/code-review/route.ts
import { NextRequest, NextResponse } from 'next/server';
import getGroqAiReview from '../groq';
import getReplicateAiReview from '../replicate';


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

const CURRENT_AI_MODEL = process.env.CURRENT_AI_MODEL;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;


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


const parseGroqAiResponse = async (
    code: string, language: string, description: string
): Promise<CodeReviewResponse> => {

    const groqAiReview = await getGroqAiReview(code, language, description);

    // Added **** to mark the end of the review 
    // (so that refactored code can be parsed easily, as it may have some comments starting with /** */)
    const resultText = groqAiReview + "\n****";

    const regexStr = '([\\s\\S]*?)(?=\\n*\\s*(\\d+\\.\\s|\\*\\*[\\s]*|$))';
    return {
        review: matchSection(resultText, ['Code Review:'], regexStr, "No review provided"),
        suggestions: parseList(matchSection(resultText, ['Suggestions:'], regexStr), false),
        potentialBugs: parseList(matchSection(resultText, ['Potential Bugs:'], regexStr), false),
        securityIssues: parseList(matchSection(resultText, ['Security Issues:'], regexStr), false),
        refactoredCode: matchSection(
            resultText, ['Refactored Code:'],
            '([\\s\\S]*?)(?=\\n*\\s*(\\*\\*\\*\\*))', code
        ),
    }
}


const parseReplicateAiResponse = async (
    code: string, language: string, description: string
): Promise<CodeReviewResponse | undefined> => {

    const replicateAiResponse = await getReplicateAiReview(code, language, description);

    if (!replicateAiResponse) {
        return undefined;
    }

    const resultText = replicateAiResponse + "\n**";
    const regexStr = '([\\s\\S]*?)(?=\\n*\\s*(\\d+\\.\\s|\\*\\*[\\s]*|$))';
    return {
        review: matchSection(resultText, ['Code Review'], regexStr, "No review provided"),
        suggestions: parseList(matchSection(resultText, ['Suggestions'], regexStr)),
        potentialBugs: parseList(matchSection(resultText, ['Potential Bugs'], regexStr)),
        securityIssues: parseList(matchSection(resultText, ['Security Issues'], regexStr)),
        refactoredCode: matchSection(resultText, ['Refactored Code'], regexStr, code),
    }
}


export async function getAIReview(
    code: string, language: string, description: string
): Promise<CodeReviewResponse> {
    if (!REPLICATE_API_TOKEN) {
        throw new Error("Replicate API token is not configured");
    }

    try {

        let res: CodeReviewResponse = {
            review: "Unable to generate review due to API error",
            suggestions: [],
            potentialBugs: [],
            securityIssues: [],
            refactoredCode: code,
        };

        if (CURRENT_AI_MODEL == "GROQ") {
            // If replicate limit exceeds, switch to groq API
            res = await parseGroqAiResponse(code, language, description);

        } else {
            const response = await parseReplicateAiResponse(code, language, description);
            res = response ? response : res;
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