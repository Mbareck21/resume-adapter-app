// src/app/api/adapt/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// --- Configuration ---
const MODEL_NAME = "gemini-1.5-flash-latest"; // Using a generally available model
const API_KEY = process.env.GOOGLE_API_KEY;

// Safety settings for the Gemini model (adjust as needed)
// Blocks content with high probability of being harmful.
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Generation configuration (optional, controls randomness, etc.)
const generationConfig = {
    temperature: 1, // Controls randomness (higher = more creative, lower = more predictable)
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048, // Limit the length of the generated response
};

// --- POST Handler ---
export async function POST(request) {
    console.log("API Route /api/adapt received POST request");

    // 1. Check API Key
    if (!API_KEY) {
        console.error("GOOGLE_API_KEY is not set in environment variables.");
        return NextResponse.json({ error: "Server configuration error: Missing API Key." }, { status: 500 });
    }

    // Initialize the Generative AI client
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME, safetySettings, generationConfig });

    try {
        // 2. Get Request Body
        const body = await request.json();
        const { jobDescription, resumeText } = body;

        // Basic validation
        if (!jobDescription || !resumeText) {
            console.log("Missing jobDescription or resumeText in request body");
            return NextResponse.json({ error: "Missing job description or resume text" }, { status: 400 });
        }
        console.log("Received JD length:", jobDescription.length, "Resume length:", resumeText.length);

        // 3. Construct the Prompt
        // Be specific about the desired output format and task.
// 3. Construct the Prompt
const prompt = `You are an expert professional resume writer with over 15 years of experience helping candidates secure interviews. Your task is to thoughtfully adapt the provided resume to perfectly align with the specific job description.

Instructions:
1. Carefully analyze the Job Description to identify:
   - Essential technical skills and qualifications
   - Soft skills and personal attributes valued by the employer
   - Industry-specific terminology and keywords for ATS optimization
   - The company's culture and values (if evident)

2. Review the Original Resume to find:
   - Relevant experiences that demonstrate the required skills
   - Accomplishments that prove competency in key areas
   - Transferable skills that might not be explicitly mentioned but are applicable

3. Transform the resume by:
   - Tailoring the professional summary to address the employer's specific needs
   - Reordering and rephrasing experience bullet points to prioritize relevant achievements
   - Adjusting the skills section to emphasize matching qualifications
   - Using natural, conversational language rather than rigid "resume-speak"
   - Varying sentence structure to sound like a real person wrote it
   - Incorporating appropriate industry terminology without overloading with keywords

4. Write in a confident, personable tone that:
   - Avoids excessive jargon and unnecessarily complex language
   - Balances professionalism with personality
   - Uses contractions occasionally (I've, I'm, etc.) where appropriate
   - Varies sentence length for natural rhythm
   - Incorporates occasional transition phrases between sections (e.g., "Additionally," "Moreover,")
   
5. Critical guidelines:
   - Never fabricate experiences, skills, or qualifications not present in the original resume
   - Only rephrase, reorder, and emphasize existing content
   - Ensure the adapted resume maintains the candidate's authentic voice and background
   - Use varied action verbs rather than repeating the same ones throughout

Output only the complete text of the adapted resume, formatted and ready to be copied. Do not include any explanatory text, commentary, or notes.

Job Description:
${jobDescription}

Original Resume:
${resumeText}

Adapted Resume:`;
console.log("Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);

        // --- Debugging: Log the raw response ---
        console.log("Raw Gemini Result:", JSON.stringify(result, null, 2));
        // --- End Debugging ---

        // 5. Process the Response
        // Check for safety blocks or other issues before accessing text
         if (!result.response) {
            console.error("Gemini API call failed: No response object.", result);
             // Attempt to log any safety feedback if available
             const blockReason = result?.promptFeedback?.blockReason;
             const safetyRatings = result?.promptFeedback?.safetyRatings;
             console.error("Block Reason:", blockReason);
             console.error("Safety Ratings:", JSON.stringify(safetyRatings));
             const errorMessage = blockReason ? `Content blocked due to ${blockReason}.` : "Gemini API call failed. No response.";
            throw new Error(errorMessage);
        }

        const response = result.response; // Get the response object

        // Check if the response finished correctly (e.g., not due to safety)
        if (response.promptFeedback?.blockReason) {
           console.error("Gemini response blocked:", response.promptFeedback.blockReason);
           throw new Error(`Content generation blocked by safety filter: ${response.promptFeedback.blockReason}`);
       }

        // Extract the text
         // Gemini API often returns text directly, but might be nested. Check candidates.
        const adaptedResumeText = response.text ? response.text() : (response.candidates?.[0]?.content?.parts?.[0]?.text || null);


        if (!adaptedResumeText) {
            console.error("Gemini API response missing text content.", response);
             // Log the full response candidate if available for debugging
             console.error("Full Candidate:", JSON.stringify(response.candidates?.[0]));
            // Add more context to the error log
            console.error("Full Response Object causing empty text:", JSON.stringify(response, null, 2));
            throw new Error("Gemini API returned an empty response.");
        }

        console.log("Successfully generated adapted resume. Length:", adaptedResumeText.length);
        // 6. Return the Result
        return NextResponse.json({ adaptedResume: adaptedResumeText.trim() }); // Trim whitespace

    } catch (error) {
        // 7. Error Handling
        console.error("Error in /api/adapt:", error);
        // Provide a more generic error message to the client for security
        let errorMessage = "Failed to adapt resume due to an internal server error.";
        let statusCode = 500;

        // Check for specific error types if needed, e.g., API errors vs. other errors
        if (error.message.includes("Content blocked") || error.message.includes("Content generation blocked")) {
             errorMessage = `Generation failed due to safety settings: ${error.message}`;
             statusCode = 400; // Bad request (problem with input leading to safety block)
        } else if (error.message.includes("API call failed")) {
            errorMessage = `AI generation failed: ${error.message}`;
            statusCode = 502; // Bad Gateway (issue communicating with the LLM)
         } else if (error.message.includes("empty response")) {
            errorMessage = "AI generation failed: Received an empty response.";
            statusCode = 502;
         }


        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}
