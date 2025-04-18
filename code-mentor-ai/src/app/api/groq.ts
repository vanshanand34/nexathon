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
                    content: `You are an expert ${language} code reviewer. Review the code below based on the description. Be thorough, specific, and actionable. Evaluate best practices, performance, readability, maintainability, and security.

                    Language: ${language}  
                    Description: ${description}  
                    Code:  
                    ${code}

                    Respond in this exact format:
                    1. Code Review:
                    [Detailed paragraph reviewing code quality, structure, and adherence to ${language} best practices. Mention strengths and weaknesses.]
                    2. Suggestions:  
                    - [Actionable suggestion 1 with explanation]  
                    - [Add more as needed, or leave empty if none]
                    3. Potential Bugs:  
                    - [Bug 1 with line number if applicable and explanation]  
                    - [Add more as needed, or leave empty if none]
                    4. Security Issues:  
                    - [Security issue 1 with explanation and potential impact]  
                    - [Security issue 2 with explanation and potential impact]  
                    - [Add more as needed, or leave empty if none]
                    5. Refactored Code:  
                    [Complete refactored code with improvements. If no changes, return original code. Add comments explaining changes.]`
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
            throw new Error(response.statusText);
        }

        return data?.choices[0]?.message?.content;

    } catch (err) {
        console.log(err);
        return {};
    }
}

export default getGroqAiReview;