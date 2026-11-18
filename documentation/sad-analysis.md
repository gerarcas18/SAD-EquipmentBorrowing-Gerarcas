# Systems Analysis and Design

## Problem statement
The College currently records equipment borrowing manually, making it difficult for the equipment custodian to identify available items, current borrowers, expected return dates, completed returns, and overdue transactions. This process can cause delays, incomplete records, and difficulty monitoring equipment. The proposed Online Equipment Borrowing and Return Monitoring System centralizes equipment inventory and borrowing records in Supabase. An authenticated custodian can manage equipment, record borrowing and returns, search and filter records, and monitor overdue items.

## Actors
- **System User / Equipment Custodian:** logs in, manages equipment, records borrowing and returns, and monitors transactions.
- **Borrower:** student, faculty member, or staff whose details are recorded by the custodian; no direct portal is included.

## Functional requirements
FR-01 Login/logout. FR-02 Dashboard counts. FR-03 Add equipment. FR-04 View equipment. FR-05 Edit equipment. FR-06 Delete with confirmation. FR-07 Record borrower and loan details. FR-08 Mark equipment Borrowed. FR-09 Process return and mark Available. FR-10 Detect overdue loans. FR-11 Search equipment and transactions. FR-12 Filter by availability/status.

## Non-functional requirements
Usability: clear navigation and validation. Security: Supabase Auth and RLS. Compatibility: modern browsers. Availability: GitHub Pages frontend and Supabase backend. Maintainability: separated HTML, CSS, JavaScript, SQL, and documentation.

## Scope and limitations
The system covers inventory and borrowing/return monitoring. Borrowers do not directly log in. Fines, notifications, barcode scanning, and borrower self-service are excluded. Overdue is calculated for display when due_date is before today and the loan is not returned.

## Business rules
BR-01 Equipment name is required. BR-02 Asset code is unique. BR-03 Only Available equipment may be borrowed. BR-04 Borrower name is required. BR-05 Due date cannot precede borrowing date. BR-06 New loans are Borrowed. BR-07 Borrowing makes equipment unavailable. BR-08 Returning makes equipment available. BR-09 Unreturned loans past due are Overdue. BR-10 Deletion requires confirmation. BR-11 Only authenticated users manage records. BR-12 A returned loan cannot be returned again.