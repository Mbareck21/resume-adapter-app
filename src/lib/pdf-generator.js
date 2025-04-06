// src/lib/pdf-generator.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30, // Add padding to the page
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 5, // Add space between paragraphs
    fontFamily: 'Times-Roman' // Use a standard font
  }
});

// Basic component to render markdown as simple paragraphs
export const AdaptedResumeDocument = ({ adaptedResume }) => {
  // Basic "parsing": split by lines, treat each non-empty line as a paragraph
  // This won't handle complex Markdown formatting yet.
  const lines = adaptedResume ? adaptedResume.split('\n') : [];
  const paragraphs = lines
    .map(line => line.trim()) // Trim whitespace
    .filter(line => line.length > 0); // Filter out empty lines

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {paragraphs.map((line, index) => (
            <Text key={index} style={styles.paragraph}>
              {line}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};
