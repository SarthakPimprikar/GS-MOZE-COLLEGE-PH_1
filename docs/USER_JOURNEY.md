# ERP Detailed User Journey Document

This document provides an in-depth look into the daily operations, key touchpoints, and detailed workflows for each role within the ERP system.

---

## 1. Admin (The System Orchestrator)

### Persona Overview
The Admin is the "Super User" who ensures the platform is correctly configured for the institution's hierarchy, financial policies, and academic cycles.

### Detailed Journey & Touchpoints
1.  **Morning Dashboard Pulse**:
    *   Logs in to see a bird's-eye view of the institution.
    *   Checks `Attendance Overview` to see if any department has unusually low student/staff turnout.
    *   Reviews `Enquiry & Leads` to see if marketing campaigns are converting.
2.  **Academic Lifecycle Management**:
    *   **Setup Phase**: Navigates to `Academic Configuration` to define new batches or semesters.
    *   **Course Assignment**: Links `Subjects` to specific `Courses` and ensures `Teacher` assignments are balanced.
3.  **Financial Operations**:
    *   Defines `Fee Structures` for various student categories (e.g., General, Scholarship, Merit).
    *   Sets up `Late Fee Rules` and `Installment Plans` that govern automated fee reminders.
4.  **Admin Security & Support**:
    *   Manages user roles in `Manage Users`, ensuring that a new HOD or HR person has exactly the right permissions.
    *   Audits `Admission Applications` to ensure transparency in the intake process.

### Key Modules
*   `/admin/admission-applications` (Reviewing full admission funnel)
*   `/admin/feeStructure&payments` (Financial policy management)
*   `/admin/manage-users` (Role-based access control)
*   `/admin/student-profiles` (Master record of all students)

---

## 2. HOD (The Departmental Captain)

### Persona Overview
The HOD bridges the gap between high-level management and classroom delivery. They are responsible for the academic health of their specific branch (e.g., CS, Mechanical).

### Detailed Journey & Touchpoints
1.  **Departmental Health Check**:
    *   Uses the HOD Dashboard to see real-time counts of `Active Students` vs. `Total Students`.
    *   Identifies teachers with high absenteeism.
2.  **Student Performance Oversight**:
    *   Navigates to `Student Management` to look at division-wise performance.
    *   Identifies "At-Risk" students based on low attendance or poor internal marks.
3.  **Academic Planning & Coordination**:
    *   Supervises the `Timetable` to resolve scheduling conflicts between labs and lecture halls.
    *   Coordinates with Teachers in `Academic Management` to ensure syllabus completion is on track.
4.  **Crisis Management**:
    *   Approves/Rejects major student requests or leave applications that escalate beyond the teacher level.

### Key Modules
*   `/hod/academic-management` (Syllabus and Teacher tracking)
*   `/hod/student-management` (Branch-specific student list)
*   `/hod/timetable` (Conflict resolution and scheduling)

---

## 3. HR (The Talent & Payroll Manager)

### Persona Overview
HR manages the people who make the institution run. Their work is heavily focused on record-keeping, compliance, and financial disbursements.

### Detailed Journey & Touchpoints
1.  **Staff Directory & Documentation**:
    *   Maintains the `Staff Directory`, ensuring every employee has up-to-date contact information and digital document copies.
2.  **Attendance & Benefit Tracking**:
    *   Monitors `Attendance` logs across the institution for non-teaching and teaching staff.
    *   Processes `Leave` applications, ensuring appropriate deductions are calculated for the payroll cycle.
3.  **The Monthly Payroll Cycle**:
    *   **Preparation**: Adjusts salary components in the `Salary` module (bonuses, deductions, tax).
    *   **Execution**: Generates `Payslips` in bulk at the end of the month.
    *   **Distribution**: Ensures staff can view and download their payslips securely.

### Key Modules
*   `/hr/attendance` & `/hr/leave` (Workforce management)
*   `/hr/salary` (Financial component configuration)
*   `/hr/payslip` (Document generation and distribution)

---

## 4. Staff (The Operational Engine)

### Persona Overview
Operational staff members are the first point of contact for the public. They drive the conversion of leads into enrolled students.

### Detailed Journey & Touchpoints
1.  **Lead Nurturing**:
    *   Records every phone call or walk-in enquiry in `Enquiry & Leads`.
    *   Sets reminders for follow-ups to maximize conversion rates.
2.  **Admission Funnel Management**:
    *   Works daily in `Application Management` to verify uploaded documents from students.
    *   Communicates with applicants whose documentation is incomplete.
3.  **Information Retrieval**:
    *   Uses `Profile` search to quickly help a parent with their child's fee status or current class location.

### Key Modules
*   `/staff/enquiry&leads` (CRM for the institution)
*   `/staff/application-management` (The digital intake office)
*   `/staff/profile` (Quick information lookup)

---

## 5. Teacher (The Academic Facilitator)

### Persona Overview
Teachers are in the "trenches" of daily education. Their journey is high-frequency and focused on content delivery and student engagement.

### Detailed Journey & Touchpoints
1.  **The Daily Routine**:
    *   Logs into `My Classes` to see their schedule for the day.
    *   Takes `Attendance` immediately as a lecture begins, which might trigger automated SMS alerts to parents.
2.  **Curriculum Progress**:
    *   Uses `Course-Plan -> Syllabus` to check what needs to be covered today.
    *   Clicks `Execute` on a syllabus topic once it has been taught in the lab or lecture.
3.  **Assessment & Feedback**:
    *   Enters `Marks` for class tests or mid-term exams.
    *   Generates `Report` cards for their assigned divisions.
4.  **Resource Sharing**:
    *   Uploads PPTs or PDFs in `Upload Notes` so students can study after hours.

### Key Modules
*   `/teacher/attendance` (High-frequency daily task)
*   `/teacher/course-plan` (Detailed syllabus tracking with "Execution" status)
*   `/teacher/marks` (Continuous assessment entry)
*   `/teacher/upload-notes` (Content sharing)

---

## 6. Student (The Learner)

### Persona Overview
The student is the primary user and beneficiary. Their journey is about self-management and academic achievement.

### Detailed Journey & Touchpoints
1.  **Daily Preparedness**:
    *   Checks the `Timetable` to see which room a lecture is scheduled in.
    *   Reviews `Assignments` to check for upcoming deadlines.
2.  **Personal Progress Tracking**:
    *   Keeps a close eye on `Attendance` percentages to ensure they meet the minimum required for exams.
    *   Checks `Myexams` to view recently released results or download marksheets.
3.  **Asynchronous Learning**:
    *   Downloads study materials from `Studymaterial` to prepare for upcoming tests.
4.  **Administrative Independence**:
    *   Downloads their own `Certificates` (ID cards, Bonafide certificates) without needing to visit the office.

### Key Modules
*   `/student/attendance` (Personal dashboard)
*   `/student/studymaterial` & `/student/assignments` (Learning tools)
*   `/student/myexams` (Academic results)
*   `/student/certificates` (Self-service document portal)
