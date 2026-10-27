# Aysqo Technologies — Employee Enrollment System: Professional Demo Walkthrough

Use this script to guide your company representative through the complete Employee Enrollment System.

---

## 1. Executive Summary & Architecture
- **Company:** Aysqo Technologies
- **System:** Enterprise Employee Enrollment & HR Master Records
- **Stack:** React 18, Vite, Tailwind CSS (Navy Corporate Theme), Java 17/26, Spring Boot 3, Spring Security (BCrypt + JWT), MySQL 8.x
- **Data Source:** Persistent MySQL 8 database with automatic administrative bootstrap and synthetic demonstration employees.

---

## 2. Step-by-Step Live Demonstration Script

### Step 1: Launch and Application Status (30 seconds)
1. Point out the two local services running in VS Code terminals:
   - Backend API: `http://localhost:8080` (Spring Boot + MySQL)
   - Frontend UI: `http://localhost:5173` (Vite + React)
2. Open your browser to `http://localhost:8080/actuator/health` to show health status:
   ```json
   { "status": "UP" }
   ```
3. Open `http://localhost:5173`. Show the corporate sign-in screen styled in Aysqo's navy and slate enterprise theme.

### Step 2: Authentication & Security (1 minute)
1. Demonstrate security validation: enter wrong credentials to show the generic rejection banner preventing account enumeration.
2. Click the **"Fill HR Lead"** button to auto-fill `hr_manager` / `Hr@123`.
3. Click **"Sign In"**. Show the transition into the protected dashboard.
4. Open browser DevTools (`F12`) -> Application -> Cookies to show the secure `aysqo_token` session cookie.

### Step 3: Executive HR Dashboard (1 minute)
1. Point out the live metric cards loaded directly from MySQL:
   - **Total Workforce**
   - **Active Headcount**
   - **Pending Approvals**
   - **Draft Enrollments**
2. Show the **"Workforce by Department"** breakdown bars showing real proportions.
3. Show the **"Recent Employee Enrollments"** list with status tags (`Approved`, `Submitted`, `Draft`).
4. Click **"Refresh"** to show instant live data synchronization.

### Step 4: Employee Master Directory & Live Filtering (2 minutes)
1. Click **"Employee Directory"** in the sidebar.
2. In the search box, type `Alex` or `AYS-2026-0001` -> Observe instant, debounced server filtering.
3. Select the **Department** filter -> Pick `Engineering` -> Only engineering staff are displayed.
4. Select the **Employment Type** filter -> Pick `Full-Time`.
5. Demonstrate server pagination: change per-page selector from 10 to 20 or 50.
6. Click **"Reset"** to clear all filters back to the full directory.

### Step 5: Adding a New Employee Enrollment (2 minutes)
1. Click **"New Enrollment"** (or **"+ Add Employee"**).
2. Attempt to submit empty to show field-specific validation (First Name, Last Name, Email, Phone, DOB, Address, Emergency Contact).
3. Fill in a new synthetic employee:
   - First Name: `Lucas`
   - Last Name: `Sterling`
   - Email: `lucas.sterling@aysqo-demo.com`
   - Phone: `+1-555-0812`
   - DOB: `1992-07-22`
   - Address: `88 Tech Parkway, Austin, TX`
   - Department: `Engineering`
   - Job Title: `Senior Cloud Solutions Architect`
   - Employment Type: `Full-Time`
   - Emergency Contact: `Sarah Sterling (+1-555-0813)`
4. Click **"Submit Enrollment"**.
5. **Highlight the Confirmation Screen:**
   - The backend generated a unique ID: e.g. `AYS-2026-0011`.
   - Click the copy button -> Copies to clipboard.
   - Click **"View Employee Details"**.

### Step 6: Employee Details & Status Lifecycle (1 minute)
1. Review the detailed card: Contact, Position, Emergency Contact, and Audit timestamps.
2. Click **"Approve Enrollment"** in the Workflow Transition panel -> Status changes to `Approved` with live green badge.
3. Click **"Edit Profile"** -> Change the job title to `Director of Cloud Architecture` -> Save Changes -> View updated record.

### Step 7: Deactivation & Reactivation Workflow (1 minute)
1. Click **"Deactivate"** -> Confirm modal appears with warning.
2. Confirm deactivation -> Employee is marked inactive.
3. Navigate to **"Inactive Employees"** in the sidebar -> View the deactivated employee in the archive.
4. Click **"Reactivate"** -> Employee is returned to the active directory.

### Step 8: Account Profile & Sign Out (30 seconds)
1. Click **"Account Profile"** in the sidebar (or top right user menu).
2. Show the user identity, role, and security status.
3. Click **"Sign Out"** -> Tokens and cookies are invalidated, returning safely to the login screen.
