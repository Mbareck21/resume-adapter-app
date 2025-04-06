// src/lib/docx-generator.js
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Basic function to convert simple text (split by newlines) into docx paragraphs
// A real implementation would need a proper Markdown parser
export async function generateDocx(markdownContent) {
    if (!markdownContent) {
        throw new Error("Markdown content cannot be empty.");
    }

    // Super basic "parser": split by lines, treat each non-empty line as a paragraph
    // This WON'T handle Markdown formatting (bold, lists, headings) correctly yet.
    const lines = markdownContent.split('\n');
    const paragraphs = lines
        .map(line => line.trim()) // Trim whitespace
        .filter(line => line.length > 0) // Filter out empty lines
        .map(line => new Paragraph({
            children: [new TextRun(line)],
            spacing: { after: 120 } // Add some spacing after paragraphs (optional)
        }));


    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs,
        }],
    });

    // Use Packer to generate the blob
    const blob = await Packer.toBlob(doc);
    return blob;
}