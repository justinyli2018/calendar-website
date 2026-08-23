# Project Blueprint: Student Time & Schedule Manager (PWA)

## 1. Core Objectives

 - **Primary Goal**: Build a personalized task and schedule manager that prevents last-minute cramming and protects sleep schedules.

 - **Accessibility**: Usable on school computers (web) and mobile devices (via Progressive Web App functionality).

 - **Flexibility**: Seamlessly handle complex school block schedules (e.g., A/B days) and breaks without breaking repeating events.

 - **Audience**: The app is designed for use by one person, but may be adapted to allow for a wider audience later. Keep it simple for now, but don’t prevent more complicated systems to be put in place later if needed.

## 2. Technology Stack

 - **Frontend**: HTML, CSS (Tailwind CSS for fast, responsive styling), and JavaScript. We will design it as a single-page application (SPA) for a smooth, app-like feel.

 - **Backend & Database**: Firebase (Firestore for real-time NoSQL database, Firebase Hosting for deployment). Firestore is ideal because its document-based structure works perfectly with calendar events and to-do lists.

 - **PWA Framework**: `manifest.json` for app installation and a Service Worker for caching and offline access.

 - **External APIs**: Canvas REST API (using a Personal Access Token).

## 3. Core Logic & Frameworks

### A. The "Generators" (Schedule Logic)

Instead of standard chronological repetition (e.g., "every Tuesday"), classes and recurring school tasks will map to a Generator.

 - **Data Structure**: A Firestore collection called `AcademicCalendar`. Each document represents a day:
`{ date: "2026-08-25", type: "A_DAY", isBreak: false }`

 - **Event Logic**: An event like `"AP Calculus"` is saved as: `{ name: "AP Calculus", repeatsOn: "A_DAY" }`.

 - **Rendering**: When the user views August 25th, the app fetches the day type from `AcademicCalendar`. Seeing it is an `"A_DAY"`, it pulls all events tagged with `"A_DAY"`.

#### Handling Complex Edge Cases

 - **The "Shift vs. Skip" Dilemma**: If Monday (an A-Day) gets canceled for snow, some schools push the A-Day to Tuesday (a "Shift"). Other schools just lose the A-Day, keeping Tuesday as a B-Day (a "Skip").

    - *Solution*: The UI for marking a day as a "Snow Day" will have two buttons: "Shift Schedule Forward" (which rewrites the subsequent `type` values in the database) or "Skip Day" (which just changes that specific day's `type` to `BREAK` without altering the rest of the week).

 - **Testing Days or Finals (Complete Overrides)**: Days like the PSAT or finals week completely break the A/B model.

     - *Solution*: We add a day type called CUSTOM. If the app sees `{ type: "CUSTOM" }`, it temporarily disables the Generator for that day and allows you to manually input one-off time blocks for your exams.

 - **Altered Bell Schedules (Delays or Pep Rallies)**: The day is still an A-Day, but every class is 20 minutes shorter and starts at a different time.

     - *Solution*: We add a `modifier` property to the database object. e.g., `{ type: "A_DAY", modifier: "2_HOUR_DELAY" }`. You can save predefined modifiers that adjust the visual start and end times of the generated blocks without having to edit the classes themselves.

### B. Canvas API Integration

 - **Authentication**: A permanent Personal Access Token will be generated from inside Canvas account settings. Store this securely in the app's environment variables or Firestore.

 - **Data Fetching**: A JavaScript function will ping Canvas endpoints (e.g., `/api/v1/users/self/todo`).

 - **Data Translation**: The app will map the Canvas JSON response to our local database schema, using the Canvas `assignment_id` as the primary key to prevent duplicating tasks on subsequent syncs.

### C. Procrastination & Sleep Protection Logic

 - **Sleep Block**: User defines a global variable (e.g., `const sleepStart = "23:30";`).

 - **Reverse Scheduling**: When a Canvas assignment is imported with a due date of Friday, the app automatically generates a "Start Assignment" task 48 hours prior.

 - **Workload Warning**: If the user attempts to add a 2-hour task at 10:00 PM, the app calculates `current_time + duration`. Because 12:00 AM crosses into the Sleep Block, the UI flags the task in red and suggests moving it to the next day.

### D. Frictionless Entry (Natural Language Processing)

 - **Tool**: We will use a lightweight JavaScript library like `chrono-node`.

 - **Implementation**: A single text bar at the top of the app. If the user types "Finish history essay by next Thursday at 5pm", `chrono-node` parses "next Thursday at 5pm" into a standard Date object and separates "Finish history essay" as the title. Make sure to prompt the user for confirmation before adding the item in. Add a setting to toggle between asking for permission and notifying to undo the action.

4. Minimum Viable Product (MVP) Roadmap

To avoid getting overwhelmed, we will build this in iterative phases. The MVP focuses strictly on getting the app functional for daily use. Ignore the style of the UI and use basic objects to start out.

**Phase 1**: The Foundation (Core UI & Firebase)

 - Initialize Firebase project and Firestore database.

 - Build the basic mobile-first layout (Header, To-Do List view, Calendar view).

 - Implement basic CRUD operations (Create, Read, Update, Delete) for standalone to-do items.

 - Host on Firebase to verify access on school network.

**Phase 2**: The Schedule

 - Create the Generator database structure and populate it for the current semester.

 - Create the UI and backend needed to create standalone events, including events that occur over a time range, single time, and all-day or multiple day events.

 - Implement the logic to display repeating classes based on the current day's "Type" (A/B) and handle the Custom/Modifier edge cases.

**Phase 3**: PWA & Smart Features (Polish)

 - Add `manifest.json` and Service Worker to make it installable on your phone.

 - Integrate `chrono-node` for the smart, one-line text entry.

 - Implement the "Sleep Block" warning logic.

 - Write the fetch function to pull due dates from Canvas using the Access Token.