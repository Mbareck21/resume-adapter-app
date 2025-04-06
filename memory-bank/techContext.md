# Resume Adapter AI Technical Context

## Technology Stack

### Frontend
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: JavaScript with React 19
- **Styling**: 
  - Tailwind CSS 4
  - PostCSS for processing
- **UI Components**: 
  - Shadcn UI (built on Radix UI primitives)
  - Custom components
- **Icons**: 
  - Lucide React
  - Heroicons

### Backend
- **Framework**: Next.js API routes (serverless functions)
- **Runtime**: Node.js 20+
- **Deployment**: Vercel Platform

### AI Integration
- **AI Service**: Google Generative AI
- **SDK**: @google/generative-ai v0.24.0
- **Model**: gemini-1.5-flash-latest
- **Configuration**: Custom prompt engineering with safety settings

### Document Processing
- **Text Parsing**: 
  - Native text handling
  - Future: Mammoth for DOCX, pdf-parse for PDF
- **PDF Generation**: @react-pdf/renderer v4.3.0
- **DOCX Generation**: docx v8.5.0
- **File Handling**: file-saver v2.0.5
- **Markdown Rendering**: 
  - react-markdown v10.1.0
  - remark-gfm v4.0.0

### Form Handling
- **State Management**: React Context API with hooks
- **Validation**: Native form validation (with future plans for Zod)

## Development Environment

### Required Tools
- **Node.js**: v20.x or later
- **npm**: v10.x or later
- **Code Editor**: Any modern editor with JavaScript/React support
- **Git**: For version control

### Environment Variables
- `GOOGLE_API_KEY`: Required for Google Generative AI access

### Local Setup
1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file with the required environment variables
4. Run the development server with `npm run dev`

### Build and Deployment
- **Development**: `npm run dev` - Runs with Turbopack for faster development
- **Build**: `npm run build` - Creates production build
- **Production**: `npm start` - Runs the built application
- **Linting**: `npm run lint` - Runs ESLint to check code quality

## Technical Constraints

### AI Service Limitations
- **Rate Limits**: Google Generative AI API has usage quotas and rate limits
- **Response Time**: AI generation may take 5-15 seconds depending on input length
- **Content Safety**: Some inputs may be rejected by AI safety filters
- **Token Limits**: Maximum input length is constrained by token limits

### Browser Compatibility
- **Modern Browsers**: Optimized for Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support**: Responsive design works on mobile devices, but primary focus is desktop

### Performance Targets
- **Initial Load Time**: < 2 seconds for main interface
- **Time to Interactive**: < 3 seconds
- **AI Processing Time**: 5-15 seconds (dependent on external API)
- **PDF/DOCX Generation**: < 5 seconds

### Security Considerations
- **API Key Protection**: Server-side only, not exposed to client
- **Input Validation**: Sanitation of user inputs
- **Content Safety**: AI safety settings prevent harmful content generation
- **File Handling**: Proper validation of uploaded files

## Dependencies

### Core Dependencies
```json
{
  "dependencies": {
    "@google/generative-ai": "^0.24.0",
    "@heroicons/react": "^2.2.0",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-switch": "^1.1.3",
    "@react-pdf/renderer": "^4.3.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "docx": "^8.5.0",
    "file-saver": "^2.0.5",
    "html2canvas": "^1.4.1",
    "jspdf": "^3.0.1",
    "lucide-react": "^0.487.0",
    "next": "15.2.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-markdown": "^10.1.0",
    "remark-gfm": "^4.0.1",
    "remark-parse": "^11.0.0",
    "tailwind-merge": "^3.1.0",
    "tw-animate-css": "^1.2.5",
    "unified": "^11.0.5"
  }
}
```

### Development Dependencies
```json
{
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.2.4",
    "tailwindcss": "^4"
  }
}
```

## Future Technical Considerations

### Planned Enhancements
- **File Format Support**: Add support for DOCX and PDF uploads
- **State Management**: Consider Zustand for more complex state needs
- **Form Validation**: Implement Zod for schema validation
- **Testing**: Add unit and integration tests
- **Authentication**: Integrate Clerk Auth for user accounts
- **Database**: Add Supabase (PostgreSQL) for data persistence
- **Analytics**: Implement PostHog for user behavior tracking

### Technical Debt
- **Document Generators**: Need improvement to properly handle Markdown formatting
- **Error Handling**: Enhance error handling and user feedback
- **Streaming Responses**: Implement streaming for better UX during AI processing
- **Code Organization**: Further refine service and component structure
- **Accessibility**: Ensure full WCAG 2.1 AA compliance 