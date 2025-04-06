// src/lib/docx-generator.js
import { Document, Packer, Paragraph, TextRun, HeadingLevel, UnorderedList, Bullet } from 'docx';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

// Basic function to convert simple text (split by newlines) into docx paragraphs
// A real implementation would need a proper Markdown parser
export async function generateDocx(markdownContent) {
    if (!markdownContent) {
        throw new Error("Markdown content cannot be empty.");
    }

    try {
        // Parse the Markdown content into an AST
        const ast = unified()
            .use(remarkParse)
            .use(remarkGfm) // Use GitHub Flavored Markdown
            .parse(markdownContent);
        
        // Convert AST to docx paragraphs
        const paragraphs = processNode(ast);

        const doc = new Document({
            sections: [{
                properties: {},
                children: paragraphs.flat(), // Flatten the array of arrays
            }],
        });

        // Use Packer to generate the blob
        const blob = await Packer.toBlob(doc);
        return blob;
    } catch (error) {
        console.error("Error generating DOCX:", error);
        throw new Error(`Failed to generate DOCX: ${error.message}`);
    }
}

// Function to recursively process AST nodes
function processNode(node) {
    if (!node) return [];

    switch (node.type) {
        case 'root':
            return node.children.map(processNode).flat();
            
        case 'paragraph':
            const runs = processTextNodes(node.children);
            return [new Paragraph({ children: runs })];
            
        case 'heading':
            const headingRuns = processTextNodes(node.children);
            const headingLevel = getHeadingLevel(node.depth);
            return [new Paragraph({ 
                heading: headingLevel,
                children: headingRuns
            })];
            
        case 'list':
            // Handle lists
            const listItems = node.children.map(item => {
                // Process each list item
                const itemContents = processListItem(item);
                // Create bullets for each item
                return itemContents.map(content => 
                    new Paragraph({
                        bullet: { level: 0 },
                        children: content
                    })
                );
            }).flat();
            return listItems;
            
        case 'blockquote':
            // Process blockquotes as indented paragraphs
            const quoteChildren = node.children.map(processNode).flat();
            return quoteChildren.map(child => {
                child.indent = { left: 720 }; // ~0.5 inch indent
                return child;
            });
            
        default:
            // For unhandled types, try to process children
            if (node.children) {
                return node.children.map(processNode).flat();
            }
            return [];
    }
}

// Process list items
function processListItem(node) {
    if (!node || node.type !== 'listItem') return [];
    
    return node.children.map(childNode => {
        if (childNode.type === 'paragraph') {
            return processTextNodes(childNode.children);
        } else {
            // Handle nested structures
            return processNode(childNode);
        }
    });
}

// Process text-level elements (text, strong, emphasis, etc.)
function processTextNodes(nodes) {
    if (!nodes || !Array.isArray(nodes)) return [];
    
    return nodes.map(node => {
        switch (node.type) {
            case 'text':
                return new TextRun({ text: node.value });
                
            case 'strong':
                const boldChildren = processTextNodes(node.children);
                return boldChildren.map(child => {
                    // Copy properties and add bold
                    return new TextRun({
                        ...child,
                        bold: true
                    });
                });
                
            case 'emphasis':
                const italicChildren = processTextNodes(node.children);
                return italicChildren.map(child => {
                    // Copy properties and add italic
                    return new TextRun({
                        ...child,
                        italic: true
                    });
                });
                
            case 'inlineCode':
                return new TextRun({
                    text: node.value,
                    font: 'Courier New'
                });
                
            default:
                if (node.children) {
                    return processTextNodes(node.children);
                }
                return new TextRun({ text: '' });
        }
    }).flat();
}

// Helper to convert heading depth to docx HeadingLevel
function getHeadingLevel(depth) {
    switch (depth) {
        case 1: return HeadingLevel.HEADING_1;
        case 2: return HeadingLevel.HEADING_2;
        case 3: return HeadingLevel.HEADING_3;
        case 4: return HeadingLevel.HEADING_4;
        case 5: return HeadingLevel.HEADING_5;
        case 6: return HeadingLevel.HEADING_6;
        default: return HeadingLevel.HEADING_3;
    }
}