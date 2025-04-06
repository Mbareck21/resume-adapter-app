// src/app/page.js
"use client"; // Necessary for hooks and event handlers

// --- Core React/Next Imports ---
import React, { useState, useCallback, useEffect } from 'react';

// --- Shadcn UI Imports ---
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// --- Custom UI Components ---
import { BentoCard, BentoGrid } from "@/components/ui/bento-card";
import { StepIndicator } from "@/components/ui/step-indicator";
import { PillButton } from "@/components/ui/pill-button";
import { ProcessingIndicator } from "@/components/ui/processing-indicator";
import { ComparisonView, HighlightedText } from "@/components/ui/comparison-view";

// --- Markdown Rendering Imports ---
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- File Download Imports ---
import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import { generateDocx } from '@/lib/docx-generator'; // Make sure src/lib/docx-generator.js exists
// --- React-PDF Imports ---
import { pdf } from '@react-pdf/renderer';
import { AdaptedResumeDocument } from '@/lib/pdf-generator'; // Import the new component

// --- Icons ---
import { 
  DocumentTextIcon, 
  ArrowPathIcon, 
  CloudArrowDownIcon, 
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  DocumentDuplicateIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  SwatchIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  // State variables
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [adaptedResume, setAdaptedResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [processingStage, setProcessingStage] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [progress, setProgress] = useState(0);

  // Process steps
  const steps = ["Upload Resume", "Enter Job Description", "Adapt Resume", "Download Results"];

  // Processing stages for AI
  const processingSteps = [
    "Analyzing resume content",
    "Identifying key skills and experiences",
    "Matching with job requirements",
    "Generating optimized resume"
  ];

  // --- Effect to simulate progress during loading ---
  useEffect(() => {
    let interval;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          // Increase progress by 2-5% randomly
          const increment = Math.floor(Math.random() * 4) + 2;
          const newProgress = prev + increment;
          // Cap at 95% until complete
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 500);
    } else if (progress > 0 && progress < 100) {
      // Complete the progress bar when loading finishes
      setProgress(100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, progress]);

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
  }, []);

  const handleAdaptClick = useCallback(async () => {
    console.log("Adapt button clicked");
    if (!jobDescription || !resumeText) {
      setError("Please provide both a job description and a resume file.");
      return;
    }
    setIsLoading(true);
    setError("");
    setAdaptedResume("");
    setProcessingStage(1);
    setEstimatedTime(15); // Initial estimate in seconds

    console.log("Calling backend API route...");
    try {
      // Simulate different processing stages
      setProcessingStage(0); // Analyzing resume
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingStage(1); // Identifying key skills
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingStage(2); // Matching with job requirements
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch('/api/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumeText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAdaptedResume(data.adaptedResume);
      setProcessingStage(3); // Generating optimized resume
      console.log("API call successful.");
      setCurrentStep(3); // Move to results step

    } catch (error) {
      console.error("API call failed:", error);
      setError(`Failed to adapt resume: ${error.message}`);
      setAdaptedResume("");
    } finally {
      setIsLoading(false);
      setProcessingStage(0);
      setEstimatedTime(0);
    }
  }, [jobDescription, resumeText]);

  // --- Download Handlers ---
  const handleDownloadPDF = useCallback(async () => { // Make async
    setError(""); // Clear previous errors
    if (!adaptedResume) { // Check if we have the Markdown content
      setError("No adapted resume content available for PDF download.");
      return;
    }

    console.log("Generating PDF using React-PDF...");
    try {
      // Generate the PDF blob using the component and adaptedResume state
      const blob = await pdf(<AdaptedResumeDocument adaptedResume={adaptedResume} />).toBlob();
      saveAs(blob, "adapted-resume.pdf"); // Use file-saver
      console.log("PDF file generated and download triggered.");
    } catch (error) {
      console.error("Error generating PDF with React-PDF:", error);
      setError(`Failed to generate PDF file: ${error.message}`);
    }
  }, [adaptedResume]); // Depends on adaptedResume state

  const handleDownloadDOCX = useCallback(async () => {
    setError(""); // Clear previous errors
    if (!adaptedResume) { // Check if we have the Markdown content
      setError("No adapted resume content available for DOCX download.");
      return;
    }

    console.log("Generating DOCX from Markdown content...");
    try {
        // Pass the raw Markdown string to the generator
        const blob = await generateDocx(adaptedResume);
        saveAs(blob, "adapted-resume.docx"); // Use file-saver
        console.log("DOCX file generated and download triggered.");
    } catch (error) {
        console.error("Error generating DOCX:", error);
        setError(`Failed to generate DOCX file: ${error.message}`);
    }
  }, [adaptedResume]); // Depends on adaptedResume state

  // Add keyboard navigation handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle sidebar with Alt + S
      if (e.altKey && e.key === 's') {
        setIsNavOpen(prev => !prev);
      }
      
      // Toggle dark mode with Alt + D
      if (e.altKey && e.key === 'd') {
        setIsDarkMode(prev => !prev);
      }

      // Navigate steps with Alt + arrow keys
      if (e.altKey && e.key === 'ArrowRight') {
        setCurrentStep(prev => Math.min(prev + 1, 4));
      }
      if (e.altKey && e.key === 'ArrowLeft') {
        setCurrentStep(prev => Math.max(prev - 1, 1));
      }

      // Trigger adapt with Alt + Enter when form is complete
      if (e.altKey && e.key === 'Enter') {
        if (!isLoading && jobDescription && resumeText) {
          handleAdaptClick();
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleAdaptClick, isLoading, jobDescription, resumeText]);

  // Apply dark mode class to document body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Render different steps based on current step state
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Upload Resume
        return (
          <BentoCard 
            title="Upload Your Resume"
            description="Start by uploading your current resume as a .txt file"
            className="animate-fade-in max-w-4xl mx-auto"
          >
            <div className="space-y-6 p-2">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="resume-upload">Upload Resume (.txt file)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-all duration-200">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <DocumentTextIcon className="h-12 w-12 text-primary" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your resume file here, or click to browse
                      </p>
                      <Input
                        id="resume-upload"
                        type="file"
                        accept=".txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <PillButton
                        onClick={() => document.getElementById('resume-upload').click()}
                        variant="default"
                        className="mt-2"
                      >
                        Browse Files
                      </PillButton>
                    </div>
                  </div>
                </div>
              </div>

              {resumeFile && (
                <div className="rounded-lg bg-secondary p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">{resumeFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(resumeFile.size / 1024)} KB
                        </p>
                      </div>
                    </div>
                    <PillButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setResumeFile(null);
                        setResumeText("");
                        document.getElementById('resume-upload').value = null;
                      }}
                    >
                      Remove
                    </PillButton>
                  </div>
                </div>
              )}

              {resumeText && (
                <div className="mt-4">
                  <Label htmlFor="resume-preview">Resume Preview</Label>
                  <div className="mt-2 rounded-lg bg-card border border-border p-4 max-h-60 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">{resumeText}</pre>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <PillButton
                  onClick={() => setCurrentStep(2)}
                  disabled={!resumeText}
                  variant="default"
                  className="gap-2"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </PillButton>
              </div>
            </div>
          </BentoCard>
        );

      case 2: // Job Description
        return (
          <BentoCard 
            title="Enter Job Description"
            description="Paste the job description you're applying for"
            className="animate-fade-in max-w-4xl mx-auto"
          >
            <div className="space-y-6 p-2">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the complete job description here..."
                  className="form-textarea min-h-40"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Character count: {jobDescription.length}
                </p>
              </div>

              <div className="flex flex-wrap justify-between pt-4 gap-2">
                <PillButton
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                >
                  Back
                </PillButton>
                <PillButton
                  onClick={handleAdaptClick}
                  disabled={!jobDescription || !resumeText || isLoading}
                  variant="default"
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Adapt Resume
                      <ChevronRightIcon className="h-4 w-4" />
                    </>
                  )}
                </PillButton>
              </div>
            </div>
          </BentoCard>
        );

      case 3: // Results
        return (
          <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            {adaptedResume ? (
              <>
                <BentoCard 
                  title="Resume Successfully Adapted!"
                  description="Your resume has been optimized for the job description"
                  className="mb-4"
                >
                  <div className="p-2">
                    <div className="flex flex-wrap justify-between gap-4 mb-4">
                      <div className="flex gap-2">
                        <PillButton
                          onClick={() => setShowComparison(!showComparison)}
                          variant="outline"
                          className="gap-2"
                        >
                          {showComparison ? "Hide Comparison" : "Show Comparison"}
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </PillButton>
                      </div>
                      <div className="flex gap-2">
                        <PillButton
                          onClick={handleDownloadPDF}
                          variant="default"
                          className="gap-2"
                        >
                          Download PDF
                          <CloudArrowDownIcon className="h-4 w-4" />
                        </PillButton>
                        <PillButton
                          onClick={handleDownloadDOCX}
                          variant="secondary"
                          className="gap-2"
                        >
                          Download DOCX
                          <CloudArrowDownIcon className="h-4 w-4" />
                        </PillButton>
                      </div>
                    </div>
                  </div>
                </BentoCard>

                {showComparison ? (
                  <ComparisonView
                    original={
                      <pre className="text-sm whitespace-pre-wrap font-mono">{resumeText}</pre>
                    }
                    adapted={
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {adaptedResume}
                        </ReactMarkdown>
                      </div>
                    }
                  />
                ) : (
                  <BentoCard className="p-2">
                    <div className="prose prose-sm dark:prose-invert max-w-none overflow-auto">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {adaptedResume}
                      </ReactMarkdown>
                    </div>
                  </BentoCard>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <p className="text-lg text-muted-foreground">
                    No results yet. Please adapt your resume first.
                  </p>
                  <PillButton
                    onClick={() => setCurrentStep(1)}
                    variant="default"
                    className="mt-4"
                  >
                    Start Over
                  </PillButton>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Show processing UI when loading
  if (isLoading) {
    return (
      <div className="container py-12 max-w-6xl mx-auto">
        <ProcessingIndicator
          steps={processingSteps}
          currentStep={processingStage}
          progress={progress}
          message={`${processingSteps[processingStage]} (${Math.round(progress)}%)`}
          className="animate-fade-in py-12"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen`}>
      {/* Navigation bar */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Bars3Icon
              className="h-6 w-6 cursor-pointer lg:hidden"
              onClick={() => setIsNavOpen(!isNavOpen)}
            />
            <h1 className="text-xl font-bold">Resume Adapter AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Label htmlFor="dark-mode" className="sr-only">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              {isDarkMode ? (
                <MoonIcon className="h-5 w-5 ml-2" />
              ) : (
                <SunIcon className="h-5 w-5 ml-2" />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 px-4 max-w-6xl mx-auto">
        {/* Multi-step indicator */}
        {!isLoading && (
          <StepIndicator
            steps={steps}
            currentStep={currentStep - 1}
            className="mb-8"
          />
        )}

        {/* Error display */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive p-4 mb-6 animate-slide-up">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Main content area */}
        {renderStepContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          Resume Adapter AI &copy; {new Date().getFullYear()} - Powered by Google Gemini AI
        </div>
      </footer>

      {/* Sidebar navigation (mobile) */}
      {isNavOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border p-6 shadow-lg animate-slide-right">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <XMarkIcon
                className="h-6 w-6 cursor-pointer"
                onClick={() => setIsNavOpen(false)}
              />
            </div>
            <nav className="space-y-4">
              <div
                className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary cursor-pointer"
                onClick={() => {
                  setCurrentStep(1);
                  setIsNavOpen(false);
                }}
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>Upload Resume</span>
              </div>
              <div
                className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary cursor-pointer"
                onClick={() => {
                  setCurrentStep(2);
                  setIsNavOpen(false);
                }}
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>Job Description</span>
              </div>
              <div
                className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary cursor-pointer"
                onClick={() => {
                  setCurrentStep(3);
                  setIsNavOpen(false);
                }}
              >
                <DocumentDuplicateIcon className="h-5 w-5" />
                <span>Results</span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary cursor-pointer">
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Settings</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary cursor-pointer">
                <SwatchIcon className="h-5 w-5" />
                <span>Themes</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary cursor-pointer">
                <UserCircleIcon className="h-5 w-5" />
                <span>Account</span>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
