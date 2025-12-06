# Web App Workflow

```mermaid
flowchart TD
    subgraph Unauthenticated
        Login[Login Page]
    end

    subgraph Authenticated
        Home[Home Dashboard]
        Emails[Email Management]
        Schedule[Schedule Generator]
        History[Schedule History]
        Tasks[Tasks]
        Notes[Notes]
        Legalese[Legalese Summarizer]
        Calendar[Calendar]
    end

    Login -->|Sign In| Home
    Home -->|Navigate| Emails
    Home -->|Navigate| Schedule
    Home -->|Navigate| Tasks
    Home -->|Navigate| Notes
    Home -->|Navigate| Legalese
    Home -->|Navigate| Calendar
    
    Schedule -->|View History| History
    
    %% Global Navigation
    Emails -.->|Global Header| Home
    Schedule -.->|Global Header| Home
    History -.->|Global Header| Home
    Tasks -.->|Global Header| Home
    Notes -.->|Global Header| Home
    Legalese -.->|Global Header| Home
    Calendar -.->|Global Header| Home
```
