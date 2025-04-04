# Still Here - Proof of life
This app implements a digital "dead man's switch" system that regularly checks if a user is still alive by requesting periodic acknowledgments. If the user fails to respond after multiple attempts, the system assumes they may have passed away and notifies a designated recipient.

## Core Functionality
1. **Periodic Check-ins**: The system sends emails at regular intervals (default 90 days) asking the user to confirm they're still alive by clicking a link.

2. **Retry Mechanism**: If a user doesn't respond, the system tries again up to a configurable number of times (default 3 attempts) with a configurable delay between attempts (default 1 day).

3. **Final Notification**: If the user fails to respond after all retry attempts, the system sends a notification to a pre-configured recipient (likely a family member, lawyer, or other trusted person).

## Technical Architecture
![Architecture Diagram](./still%20here%20architecture.jpg)

The application is built with:
- **Node.js** backend with Express
- **PostgreSQL** database (hosted on Aiven)
- **Netlify** serverless functions for API endpoints
- **GitHub Actions** for scheduled execution
- **Nodemailer** for email delivery

## Key components
1. **API Endpoints**:
   - `/notify`: Sends email notifications to the primary user
   - `/acknowledge`: Records when a user confirms they're still alive
   - `/check`: Displays status information about notification schedules

2. **Database Structure**:
   The PostgreSQL database tracks:
   - Last acknowledgment date
   - Number of retry attempts
   - Last notification date
   - User email and security token

3. **Configuration**:
   The system is highly configurable with environment variables for:
   - Notification intervals
   - Retry attempts and timing
   - Email settings (SMTP server, credentials)
   - Custom email templates and subjects

## Workflow
1. A GitHub Actions workflow runs daily, triggering the notification endpoint
2. The system checks if it's time to send a notification based on the last acknowledgment date
3. If needed, an email is sent with a unique acknowledgment link
4. When the user clicks the link, their status is updated in the database
5. If they don't respond after multiple attempts, the final notification is triggered


This type of service provides peace of mind that important information or instructions will be shared with designated people if something happens to you.