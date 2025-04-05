// src/app/page.js
"use client"; // Necessary for hooks and event handlers
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import remarkGfm from 'remark-gfm';        // Import remark-gfm plugin
import React, { useState, useCallback } from 'react'; // useCallback might be useful later
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  // --- State Variables ---
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [adaptedResume, setAdaptedResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Event Handlers ---
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];

    setResumeFile(file);
    setResumeText("");
    setAdaptedResume("");
    setError("");

    if (!file) return;

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target.result);
        console.log("Resume text extracted.");
      };
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
        setError("Error reading the resume file.");
        setResumeFile(null);
        event.target.value = null;
      };
      reader.readAsText(file);
    } else {
      setError("Invalid file type. Please upload a plain text (.txt) file.");
      setResumeFile(null);
      event.target.value = null;
    }
  }, []); // Empty dependency array means this function doesn't need recreation on re-renders

  const handleAdaptClick = useCallback(async () => {
    console.log("Adapt button clicked");
    if (!jobDescription || !resumeText) {
        setError("Please provide both a job description and a resume file.");
        return;
    }
    setIsLoading(true);
    setError("");
    setAdaptedResume("");

    // --- API Call (Phase 3 - Will use /api/adapt) ---
    console.log("Calling backend API route...");
    try {
      const response = await fetch('/api/adapt', { // Relative URL works for API routes
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription, resumeText }),
      });

      if (!response.ok) {
        // Try to get error message from backend response body
        const errorData = await response.json().catch(() => ({})); // Catch if body isn't JSON
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAdaptedResume(data.adaptedResume);
      console.log("API call successful.");

    } catch (error) {
        console.error("API call failed:", error);
        setError(`Failed to adapt resume: ${error.message}`);
        setAdaptedResume(""); // Clear any partial results on error
    } finally {
        setIsLoading(false);
    }
    // --- End API Call ---

  }, [jobDescription, resumeText]); // Recreate this function if JD or resume text changes

  // --- JSX Structure ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 lg:p-24 bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Resume Adapter AI</CardTitle>
          <CardDescription>Paste a job description, upload your resume (.txt), and get an AI-tailored version using Google Gemini.</CardDescription> {/* Updated description */}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Job Description Input */}
          <div className="grid w-full gap-1.5">
            <Label htmlFor="job-description" className="text-base sm:text-lg font-semibold">Job Description</Label>
            <Textarea
              placeholder="Paste the full job description here..."
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              className="text-sm"
            />
          </div>

          <Separator />

          {/* Resume Upload Input */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="resume-upload" className="text-base sm:text-lg font-semibold">Your Resume (.txt)</Label>
            <Input
              id="resume-upload"
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
             {resumeFile && !(error && error.includes("file")) && <p className="text-xs text-muted-foreground mt-1">Selected: {resumeFile.name}</p>}
             {error && error.includes("file") && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
          </div>

          <Separator />

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleAdaptClick}
              disabled={isLoading || !jobDescription || !resumeText}
              size="lg"
              className="text-base px-8 py-6"
            >
              {isLoading ? "Adapting..." : "Adapt Resume"}
              {/* Loading spinner icon can be added here */}
            </Button>
          </div>

          {/* General Error Display */}
          {error && !error.includes("file") && (
            <p className="text-center text-red-600 dark:text-red-400 pt-2">{error}</p>
          )}

           {/* Adapted Resume Output Section - MODIFIED */}
           {(isLoading || adaptedResume) && (
             <div className="grid w-full gap-1.5 pt-6">
                <Label htmlFor="adapted-resume-output" className="text-base sm:text-lg font-semibold">Adapted Resume</Label>
                {isLoading && (
                    <div className="flex items-center justify-center h-40 border border-dashed rounded-md bg-slate-50 dark:bg-slate-800">
                        <p className="text-muted-foreground animate-pulse">Generating your tailored resume...</p>
                    </div>
                )}
                {/* Display the adapted resume using ReactMarkdown */}
                {!isLoading && adaptedResume && (
                    // Add an ID here to target for download
                    <div id="adapted-resume-output" className="p-4 border rounded-md bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none">
                      {/* Apply Tailwind prose for basic Markdown styling */}
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {adaptedResume}
                      </ReactMarkdown>
                    </div>
                )}
                {/* Download buttons will go here in the next step */}
             </div>
           )}
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground pt-6">
         Powered by Google Gemini ✨
        </CardFooter>
      </Card>
    </main>
  );
}