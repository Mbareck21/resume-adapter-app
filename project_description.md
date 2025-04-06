# Project Description: Resume Adapter AI

## Project Overview

Resume Adapter AI is a web application designed to help users tailor their resumes to specific job descriptions using Artificial Intelligence. Users provide a job description and their existing resume (as a plain text file), and the application leverages Google's Gemini AI model to generate an adapted version of the resume optimized for the target role. The adapted resume is displayed in the browser and can be downloaded as either a PDF or a DOCX file.

## Core Functionality

1.  **Input:** The user pastes a job description into a text area and uploads their current resume as a `.txt` file.
2.  **Processing:** Upon clicking "Adapt Resume", the frontend sends the job description and the resume text to a backend API endpoint (`/api/adapt`).
3.  **AI Adaptation:** The API route uses the Google Generative AI SDK (specifically the `gemini-1.5-flash-latest` model) with a detailed prompt instructing it to analyze both inputs and rewrite the resume, focusing on relevant skills and experiences while maintaining a professional and natural tone. Safety settings are configured to prevent harmful content generation.
4.  **Output:** The API returns the AI-generated adapted resume text (formatted as Markdown) to the frontend.
5.  **Display:** The adapted resume is rendered directly on the page using `react-markdown`.
6.  **Download:** Users can download the adapted resume in two formats:
    *   **PDF:** Generated using the `@react-pdf/renderer` library (via `src/lib/pdf-generator.js`, inferred).
    *   **DOCX:** Generated using the `docx` library (via `src/lib/docx-generator.js`).

## Technology Stack

*   **Framework:** Next.js 15.2.4 (App Router)
*   **Language:** JavaScript (with React 19)
*   **Styling:** Tailwind CSS 4 with PostCSS
*   **UI Components:** Shadcn UI (using Radix UI primitives like Label, Separator, Slot)
*   **AI Model:** Google Gemini (`gemini-1.5-flash-latest`) via `@google/generative-ai` SDK
*   **Document Generation:**
    *   DOCX: `docx` library
    *   PDF: `@react-pdf/renderer` library
*   **File Handling:** `file-saver` for triggering downloads
*   **Markdown Rendering:** `react-markdown` with `remark-gfm`
*   **Linting:** ESLint with `eslint-config-next`
*   **Package Manager:** npm

## Potential Improvements

1.  **Enhanced Document Generation:**
    *   **Markdown Parsing:** Implement proper Markdown parsing (e.g., using `unified`, `remark-parse`, and potentially `remark-docx` or a similar transformer) in `docx-generator.js` to correctly translate Markdown formatting (bold, italics, lists, headings) into the DOCX file, instead of just plain text paragraphs.
    *   Similarly, ensure the `pdf-generator.js` correctly interprets and renders the Markdown structure in the PDF output.
2.  **Input Flexibility:** Allow users to upload resumes in more common formats like `.docx` or `.pdf`. This would require adding server-side or client-side libraries to parse these formats (e.g., `mammoth` for DOCX, `pdf-parse` for PDF).
3.  **Error Handling & User Feedback:**
    *   Provide more specific feedback if the AI generation fails (e.g., distinguishing between API errors, content safety blocks, or timeouts).
    *   Improve frontend validation and error messages (e.g., clearer messages for file type errors).
4.  **Streaming Responses:** For potentially long AI responses, implement streaming from the API route to the frontend to show the adapted resume progressively, improving perceived performance.
5.  **State Management:** For larger applications, consider a dedicated state management library (like Zustand or Redux Toolkit) although for the current scope, React's built-in state seems adequate.
6.  **Testing:** Add unit tests for utility functions (like document generators) and integration tests for the API route and potentially end-to-end tests for the user flow.
7.  **UI/UX Refinements:**
    *   Consider adding a loading indicator specifically for the file reading process.
    *   Allow users to edit the extracted resume text before sending it to the AI.
    *   Provide options for different AI adaptation "styles" or "tones".
8.  **Security:** Ensure robust validation of API inputs and consider rate limiting for the API endpoint to prevent abuse. Ensure the `GOOGLE_API_KEY` is securely managed via environment variables and not exposed client-side.
