// components/PayslipPdf.jsx

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  heading: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  text: { fontSize: 12 }
});

const PayslipPdf = ({ payslip }) => {
  const { staffId, earnings, deductions } = payslip;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Employee Payslip</Text>

        <View style={styles.section}>
          <Text style={styles.text}>Name: {staffId?.name}</Text>
          <Text style={styles.text}>Designation: {staffId?.designation}</Text>
          <Text style={styles.text}>Department: {staffId?.department}</Text>
          <Text style={styles.text}>Month: {payslip.month} {payslip.year}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Earnings</Text>
          <Text style={styles.text}>Basic: ₹{earnings?.basic}</Text>
          <Text style={styles.text}>HRA: ₹{earnings?.hra}</Text>
          <Text style={styles.text}>DA: ₹{earnings?.da}</Text>
          <Text style={styles.text}>Special Allowance: ₹{earnings?.specialAllowance}</Text>
          <Text style={styles.text}>Bonus: ₹{earnings?.bonus}</Text>
          <Text style={styles.text}>Other: ₹{earnings?.other}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Deductions</Text>
          <Text style={styles.text}>PF: ₹{deductions?.pf}</Text>
          <Text style={styles.text}>TDS: ₹{deductions?.tds}</Text>
          <Text style={styles.text}>Loan: ₹{deductions?.loan}</Text>
          <Text style={styles.text}>Leave: ₹{deductions?.leave}</Text>
          <Text style={styles.text}>Other: ₹{deductions?.other}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Summary</Text>
          <Text style={styles.text}>Gross Earnings: ₹{payslip.grossEarnings}</Text>
          <Text style={styles.text}>Total Deductions: ₹{payslip.totalDeductions}</Text>
          <Text style={styles.text}>Net Salary: ₹{payslip.netSalary}</Text>
          <Text style={styles.text}>Payment Status: {payslip.paymentStatus}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PayslipPdf;

