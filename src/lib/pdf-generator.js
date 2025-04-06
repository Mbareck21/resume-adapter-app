// src/lib/pdf-generator.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

// Register standard fonts (optional, but good for consistency)
// Ensure you have font files or use standard PDF fonts like 'Helvetica', 'Times-Roman'
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: '', fontWeight: 'normal' }, // Placeholder, relies on built-in Helvetica
    { src: '', fontWeight: 'bold' },   // Placeholder, relies on built-in Helvetica-Bold
  ],
});
Font.register({
    family: 'Times-Roman', // Example using another standard font
    fonts: [
      { src: '' },
      { src: '', fontStyle: 'italic' },
      { src: '', fontWeight: 'bold' },
    ]
});


// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingVertical: 40,
    paddingHorizontal: 50,
    fontFamily: 'Helvetica', // Default font
    fontSize: 11,
    lineHeight: 1.4,
  },
  view: { // General view container
    marginBottom: 5,
  },
  paragraph: {
    marginBottom: 8,
  },
  heading1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
  },
  heading2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 8,
  },
  heading3: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 6,
  },
  list: {
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  listItemBullet: {
    width: 10,
    fontSize: 11,
    marginRight: 5,
  },
  listItemContent: {
    flex: 1,
  },
  strong: {
    fontWeight: 'bold',
  },
  emphasis: {
    fontStyle: 'italic', // Note: Italic might depend on font registration/availability
  },
  text: { // Default text style
  }
});

// Function to recursively render AST nodes to React-PDF components
const renderNode = (node, index = 0) => {
  if (!node) return null;

  const nodeStyle = styles[node.type] || styles.view; // Default to 'view' style if specific type style not found

  switch (node.type) {
    case 'root':
      return <View key={`root-${index}`} style={nodeStyle}>{node.children.map(renderNode)}</View>;
    case 'paragraph':
      return <Text key={`p-${index}`} style={styles.paragraph}>{node.children.map(renderNode)}</Text>;
    case 'heading':
      const HeadingTag = Text; // Use Text for all headings
      const headingStyle = styles[`heading${node.depth}`] || styles.heading3; // Default to h3 style
      return <HeadingTag key={`h${node.depth}-${index}`} style={headingStyle}>{node.children.map(renderNode)}</HeadingTag>;
    case 'list':
      // React-PDF doesn't have native list elements, simulate with Views/Text
      return <View key={`list-${index}`} style={styles.list}>{node.children.map(renderNode)}</View>;
    case 'listItem':
      return (
        <View key={`li-${index}`} style={styles.listItem}>
          <Text style={styles.listItemBullet}>• </Text>
          {/* Wrap content in a View to allow block elements inside list items if needed */}
          <View style={styles.listItemContent}>
            {/* Render children; paragraphs inside lists might need special handling */}
            {node.children.map((childNode, childIndex) => {
               // If the child is a paragraph, render its children directly as Text
               if (childNode.type === 'paragraph') {
                 return <Text key={`li-p-${childIndex}`}>{childNode.children.map(renderNode)}</Text>;
               }
               return renderNode(childNode, childIndex);
            })}
          </View>
        </View>
      );
    case 'text':
      return node.value; // Render text value directly
    case 'strong':
      return <Text key={`strong-${index}`} style={styles.strong}>{node.children.map(renderNode)}</Text>;
    case 'emphasis':
       // Note: Italic rendering depends on font support in React-PDF
      return <Text key={`em-${index}`} style={styles.emphasis}>{node.children.map(renderNode)}</Text>;
    // Add cases for other Markdown elements as needed (e.g., blockquote, code, link, image)
    default:
      // For unknown nodes, try rendering children if they exist
      // console.warn("Unsupported node type:", node.type);
      return node.children ? node.children.map(renderNode) : null;
  }
};

// Main PDF Document Component
export const AdaptedResumeDocument = ({ adaptedResume }) => {
  let ast = null;
  try {
    // Parse the Markdown content into an AST
    ast = unified()
      .use(remarkParse)
      .use(remarkGfm) // Use GitHub Flavored Markdown
      .parse(adaptedResume || ''); // Ensure input is a string
  } catch (error) {
    console.error("Error parsing Markdown:", error);
    // Render an error message in the PDF
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={{ color: 'red' }}>Error parsing resume content.</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document title="Adapted Resume" author="Resume Adapter AI">
      <Page size="A4" style={styles.page}>
        {renderNode(ast)}
      </Page>
    </Document>
  );
};
