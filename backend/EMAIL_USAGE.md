# Email Functionality Usage Guide

## Overview
This backend now supports sending emails from clients to project managers. The system allows clients (users with role 'customer') to send messages to project managers (users with role 'manager') via email.

## API Endpoints

### 1. Send Message to Manager
**POST** `/api/v1/users/req`

**Request Body:**
```json
{
  "clientId": "client_user_id",
  "managerId": "manager_user_id", 
  "message": "Your message content here",
  "subject": "Optional subject (defaults to 'New Project Message')"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Message sent to project manager successfully"
}
```

### 2. Get All Managers
**GET** `/api/v1/users/managers`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "manager_id",
      "name": "Manager Name",
      "email": "manager@example.com",
      "role": "manager"
    }
  ]
}
```

## Setup Requirements

### Environment Variables
Make sure your `config.env` file contains:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for your application
3. Use the App Password in `SMTP_PASSWORD` (not your regular password)

## Usage Example

```javascript
// Frontend example
const sendMessageToManager = async (clientId, managerId, message, subject) => {
  try {
    const response = await fetch('/api/v1/users/req', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId,
        managerId,
        message,
        subject
      })
    });
    
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
```

## Error Handling

The API returns appropriate error messages for:
- Missing required fields (400)
- User not found (404)
- Invalid role permissions (403)
- Email sending failures (401)
- Server errors (500)

## Email Template

The system uses a professional HTML email template that includes:
- Client information (name, email)
- Message content
- Timestamp
- Professional styling
- Call-to-action button

## Testing

To test the email functionality:
1. Create users with roles 'customer' and 'manager'
2. Use the POST endpoint with valid client and manager IDs
3. Check the manager's email inbox for the message
