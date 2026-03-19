// components/studentAttendancePDF.jsx

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Optional: Add a font (Roboto used as per your request)
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf',
    },
  ],
});

// PDF styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    padding: 30,
    fontSize: 11,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    paddingBottom: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottom: '0.5 solid #ccc',
  },
  col: {
    width: '20%',
    paddingRight: 4,
  },
  colLong: {
    width: '40%',
    paddingRight: 4,
  },
});

const StudentAttendancePDF = ({ studentName, studentId, attendance = [] }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Attendance Report</Text>
        <Text>Student Name: {studentName}</Text>
        <Text>Student ID: {studentId}</Text>
        <Text style={{ marginBottom: 10 }}>
          Total Records: {attendance.length}
        </Text>

        <View style={styles.headerRow}>
          <Text style={styles.col}>Date</Text>
          <Text style={styles.colLong}>Subject</Text>
          <Text style={styles.col}>Status</Text>
          <Text style={styles.col}>Course</Text>
          <Text style={styles.col}>Semester</Text>
        </View>

        {attendance.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.col}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
            <Text style={styles.colLong}>{item.subject}</Text>
            <Text style={styles.col}>{item.status}</Text>
            <Text style={styles.col}>{item.course}</Text>
            <Text style={styles.col}>{item.semester}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default StudentAttendancePDF;
