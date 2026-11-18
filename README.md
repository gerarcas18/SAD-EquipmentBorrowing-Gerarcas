# Online Equipment Borrowing and Return Monitoring System

A responsive laboratory prototype using HTML, CSS, JavaScript, Supabase Auth, and Supabase PostgreSQL.

## Features
- Authenticated login/logout
- Dashboard counts for equipment, availability, borrowed, returned, and overdue
- Equipment CRUD with unique asset codes
- Borrowing transaction capture and availability update
- Return processing with return date
- Automatic overdue display
- Search and status/availability filters

## Setup
1. Create a Supabase project.
2. Run `database/schema.sql` in the Supabase SQL Editor.
3. Create a test/custodian user in Supabase Authentication > Users.
4. Copy the Project URL and anon/public key from Project Settings > API.
5. Paste them into `js/supabase.js`. Never use the service_role key in browser code.
6. Open the site with a local static server such as VS Code Live Server.
7. Sign in using the user created in Supabase Auth.

## GitHub Pages
The repository includes a GitHub Actions Pages workflow. In Settings > Pages, set the source to **GitHub Actions**. After pushing to main, wait for the workflow to finish.
Expected URL: https://gerarcas18.github.io/SAD-EquipmentBorrowing-Gerarcas/

## Security and known limitations
- RLS is enabled. The included policies are classroom-demo policies: all authenticated users can manage equipment and transactions. Tighten them for production.
- Overdue status is computed in JavaScript at display time; the database status is not automatically rewritten.
- Borrow and return currently use sequential browser requests, not a database transaction/RPC. A production version should use atomic PostgreSQL functions to avoid race conditions.
- Create auth users through the Supabase dashboard; this frontend does not expose public registration.

## Submission
See `documentation/` for analysis, use cases, ERD, traceability matrix, and manual test evidence template. Record PASS/FAIL only after executing each test yourself.