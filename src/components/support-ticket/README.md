# Support Ticket System

This module provides a complete support ticket system for the NextByte platform, allowing users to create and manage support tickets with status tracking and meeting link functionality.

## Features

- Create new support tickets
- View existing tickets with status indicators
- Automatic meet link display for pending tickets
- Status-based UI (open, pending, closed)
- Real-time ticket management

## API Endpoints

### POST /tickets

Creates a new support ticket with auto-generated serial number and default "open" status.

**Request Body:**

```json
{
  "title": "Need help with React Hooks",
  "description": "I'm struggling with understanding useState and useEffect hooks in React. Can someone help me understand the concepts and provide some examples?",
  "userId": 1
}
```

**Response:**

```json
{
  "status": "open",
  "userId": 1,
  "mentorId": null,
  "meetLink": "https://meet.google.com/abc-defg-hij"
}
```

### GET /tickets/user

Get all tickets for the authenticated user.

### GET /tickets/:id

Get a specific ticket by ID.

### PATCH /tickets/:id/status

Update ticket status.

### POST /tickets/:id/comments

Add a comment to a ticket.

### GET /tickets/:id/comments

Get all comments for a ticket.

## Components

### SupportTicketModal

Main modal component that handles:

- Creating new tickets
- Viewing existing tickets
- Status-based meet link display
- Tab navigation between create and view modes

## Usage

```jsx
import SupportTicketModal from "@/components/support-ticket/support-ticket-modal";

// In your component
const [isModalOpen, setIsModalOpen] = useState(false);

<SupportTicketModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>;
```

## Status Types

- **open**: Ticket is created and awaiting response
- **pending**: Ticket is being processed, meet link may be available
- **closed**: Ticket has been resolved

## Meet Link Display

When a ticket status is "pending" and a `meetLink` is available, it will be prominently displayed in the UI with a video icon and clickable link.
