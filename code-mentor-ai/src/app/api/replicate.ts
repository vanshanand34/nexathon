import { CodeReviewResponse } from "./code-review/route";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const MODEL_VERSION_ID = process.env.REPLICATE_MODEL_VERSION_ID;
const REPLICATE_URL_TRIES = 10;



const getReplicateAiReview = async (code: string, language: string, description: string) => {
    if (!REPLICATE_API_TOKEN) {
        throw new Error("Replicate API token is not configured");
    }

    let resultText = "";
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
        [Provide the complete refactored code with improvements applied. If no changes are needed, return the original code unchanged. Include comments explaining changes.]
        `;

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

        if (predictionData.status == 402) {
            return {
                status: false,
                message: "API limit exceeded"
            };
        }

        const predictionUrl = predictionData?.urls?.get;
        let count = REPLICATE_URL_TRIES;

        while (count--) {
            const res = await fetch(predictionUrl, {
                headers: { "Authorization": `Token ${REPLICATE_API_TOKEN}` }
            });

            const status = await res.json();

            if (status.status === "succeeded") {

                // Process the prediction result 
                // (combining all words received in string array into single string)
                resultText = "";
                for (const output of status.output) {
                    resultText += output;
                }

            } else if (status.status === "failed") {
                throw new Error("Replicate prediction failed");
            }

            // Wait for 1 second before checking the status again
            await new Promise(r => setTimeout(r, 1000));
        }

        return resultText;

    } catch (error) {

        console.error(error);
        return null;

    }
}

export default getReplicateAiReview;