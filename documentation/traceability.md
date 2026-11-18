# Requirements Traceability Matrix

| Requirement | Implemented feature | Test case |
|---|---|---|
| FR-01 | Login/logout | TC-01 |
| FR-02 | Dashboard summary | TC-10 |
| FR-03 | Add equipment | TC-02 |
| FR-04 | View equipment | TC-02 |
| FR-05 | Edit equipment | TC-03 |
| FR-06 | Delete equipment | TC-04 |
| FR-07 | Record borrower details | TC-05 |
| FR-08 | Mark equipment borrowed | TC-05 |
| FR-09 | Return equipment | TC-06 |
| FR-10 | Overdue detection | TC-07 |
| FR-11 | Search | TC-08 |
| FR-12 | Filter | TC-09 |

## Manual functional test evidence
Execute each test and record the observed result. Do not claim PASS until the test has actually been run.

| ID | Test | Expected result | Actual |
|---|---|---|---|
| TC-01 | Login with valid user | Dashboard appears | NOT TESTED |
| TC-02 | Add equipment | Equipment is listed | NOT TESTED |
| TC-03 | Edit equipment | Updated values appear | NOT TESTED |
| TC-04 | Delete equipment | Confirmation then deletion | NOT TESTED |
| TC-05 | Borrow available item | Transaction saved; item Borrowed | NOT TESTED |
| TC-06 | Return active loan | Return date saved; item Available | NOT TESTED |
| TC-07 | Check loan past due | Status displays Overdue | NOT TESTED |
| TC-08 | Search by name/code | Matching records appear | NOT TESTED |
| TC-09 | Filter status | Matching statuses only | NOT TESTED |
| TC-10 | Dashboard counts | Counts match database records | NOT TESTED |