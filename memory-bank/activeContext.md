# Resume Adapter AI Active Context

## Current Project Status

Resume Adapter AI is in the initial MVP development phase. The core functionality has been implemented, allowing users to:

1. Upload a resume as a text file or paste resume text
2. Enter a job description
3. Submit both for AI adaptation
4. View the AI-adapted resume in Markdown format
5. Download the adapted resume as PDF or DOCX

The application has a functioning UI based on Shadcn UI components and Tailwind CSS, with the ability to switch between dark and light modes.

## Current Work Focus

The following areas are currently being actively worked on:

1. **Document Generation Improvements**:
   - Enhancing Markdown parsing in PDF and DOCX generators
   - Ensuring proper formatting and styling in exported documents
   - Fixing any formatting inconsistencies

2. **User Experience Refinements**:
   - Improving error handling and user feedback
   - Enhancing loading states and progress indicators
   - Polishing UI components and interactions

3. **AI Prompt Engineering**:
   - Refining the prompt to generate more effective resume adaptations
   - Ensuring consistent output formatting
   - Optimizing for relevant keyword incorporation

## Recent Changes

1. **Core Application Setup**:
   - Initialized Next.js 15 project with App Router
   - Configured Tailwind CSS and Shadcn UI
   - Set up basic UI layout and navigation

2. **AI Integration**:
   - Implemented Google Generative AI SDK integration
   - Created the adaptation API endpoint
   - Configured appropriate safety settings

3. **Document Processing**:
   - Implemented basic PDF and DOCX generation
   - Set up file upload and text extraction
   - Created download functionality for exported documents

4. **UI Implementation**:
   - Developed resume upload and job description input components
   - Created adapted resume display with Markdown rendering
   - Implemented dark/light mode toggle

## Next Steps

The following items are prioritized for immediate development:

1. **Document Generation Enhancements**:
   - Properly parse and format Markdown in DOCX output
   - Improve PDF styling and layout
   - Ensure consistent handling of lists, bold/italic text, and headings

2. **Input Flexibility**:
   - Add support for DOCX and PDF resume uploads
   - Implement text extraction from these formats
   - Allow editing of extracted text before processing

3. **UI/UX Improvements**:
   - Add side-by-side comparison of original and adapted resumes
   - Implement more detailed loading states during AI processing
   - Enhance error handling and user feedback

4. **Performance Optimization**:
   - Optimize API response handling
   - Consider implementing streaming for AI responses
   - Improve client-side rendering performance

## Active Decisions & Considerations

1. **AI Model Selection**:
   - Currently using `gemini-1.5-flash-latest` for faster response times
   - Evaluating if `gemini-1.5-pro` would provide better quality adaptations
   - Monitoring token usage and API costs

2. **State Management Approach**:
   - Currently using React Context API and hooks
   - Evaluating if Zustand would be beneficial for more complex state
   - Considering performance implications of current approach

3. **Document Format Handling**:
   - Deciding on libraries for parsing DOCX and PDF uploads
   - Evaluating tradeoffs between client-side and server-side parsing
   - Determining optimal approach for formatting preservation

4. **UI Component Strategy**:
   - Balancing between Shadcn UI components and custom implementations
   - Ensuring consistent styling and behavior
   - Prioritizing accessibility and responsive design

5. **Future Authentication**:
   - Evaluating authentication providers (Clerk Auth being considered)
   - Planning database integration for user accounts
   - Designing secure API routes with authentication 