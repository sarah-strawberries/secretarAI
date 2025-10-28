# Project Proposal
### Elevator pitch
Simplify your life with this personal AI-integrated secretary. Generate schedules, manage email subscriptions, handle to-do tasks, get summaries of information, and keep notes of things you need to remember, all in one place.

---

### Feature List
> *Custom agent functions =* 🤖 | *Additional target tasks =* 🎯

- Email summarization
  - Summarize emails at the click of a button (🤖1️⃣ -> generate email summary)
- Email subscription management
  - Your email subscriptions will be auto-tracked, and if an AI agent determines that you often don't read emails from a specific subscription, you'll be presented with the unsubscribe link and a prompt asking if you want to unsubscribe (🎯 -> implement an MCP server)
  The AI agent will automatically recognize when you haven't been reading certain subscription-based emails very often and suggest that you unsubscribe from them, presenting you with the link to save you the time of finding it in the email (🤖2️⃣ -> estimate user's interest in an email subscription)
- Calendar management
  - Add generated daily schedules to calendar as calendar events and/or reminders
  - Create new calendar events via voice or text input (🎯 -> audio input from user with auto-transcribe; 🤖3️⃣ -> generate calendar event from text input)
- To-do list management
  - Create to-do tasks via voice input or text input, and set reminders for them as preferred by user (🤖4️⃣ -> generate to-do task from text input/generate calendar reminder from text input)
- Schedule generation
  - Generate schedule for the day by converting calendar events into list of start/stop times and event names; optionally add in to-do items (🤖5️⃣ -> generate schedule from calendar and optionally to-dos)
<!-- - Legalese summarizer/Agreement Manager
  - Save time reading privacy policies or terms of use when creating accounts: list out in advance your privacy concerns/preferences or what rights aren't negligible for you, and have the AI agent summarize legalese documents for you with special focus on things that relate to your concerns, preferences, and requirements. -->
- Notes/reminder management
  - Use voice or text input to make note of things you want to remember, and set reminders for when you want to be shown that information next 
  - Get "nudges" to respond to certain emails if you haven't by a pre-specified date and time

**Pages**
1. Login page
1. Email management page
1. Voice/text input page for prompting Agent
1. Calendar page
1. Schedule generator page
1. Schedule history page (view past generated schedules)
1. Reminders page
1. To-do list page
<!-- 1. Legalese summarizer/Agreement management page -->

**Views**
1. Email summarization view
1. Email subscription view
1. Reminders view
1. To-do list view

---

### Project Risks

- Integrating an MCP server
- Working with Google APIs
- Working with voice-to-text AI functionality/auto-transcribing audio input