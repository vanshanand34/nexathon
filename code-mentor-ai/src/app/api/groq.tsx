import { headers } from "next/headers";
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const getGroqAiReview = async (code: string, language: string, description: string) => {

    try {

        const url = "https://api.groq.com/openai/v1/chat/completions"

        const body = JSON.stringify({
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    role: "user",
                    content: `You are an expert code reviewer with deep knowledge of ${language}. Review the following code based on the provided description and return a detailed analysis in the exact format specified below. Be thorough, specific, and actionable in your feedback. Consider best practices, performance, readability, maintainability, and security.
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
                    [Provide the complete refactored code with improvements applied. If no changes are needed, return the original code unchanged. Include comments explaining changes.]`
                }
            ]
        });

        const response = await fetch(
            url,
            {
                method: "POST",
                body: body,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                }
            }
        );
        const data = await response.json();

        if (!response.ok) {
            console.log("error\n", response, "\n");
            throw new Error(response.statusText);
        }

        console.log("output\n", data?.choices[0]?.message?.content, "\n");
        return data?.choices[0]?.message?.content;
    } catch (err) {
        console.log(err);
        return {};
    }
}

export default getGroqAiReview;