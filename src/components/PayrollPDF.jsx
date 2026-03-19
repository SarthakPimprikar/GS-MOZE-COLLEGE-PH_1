import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30
  },
  // Add your PDF styles here
});

export default function PayrollPDF({ data }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* PDF content using the data prop */}
        <Text>Payroll Slip for {data.name}</Text>
        {/* Add all your PDF content here */}
      </Page>
    </Document>
  );
}