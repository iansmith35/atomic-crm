// emailHelpers.js
// Helper functions for email operations using the Google API integration

/**
 * Get unread emails from Gmail API
 * @returns {Promise<Array>} Array of unread email objects
 */
export async function getUnreadEmails() {
  try {
    const response = await fetch('/api/gmail/unread');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const emails = await response.json();
    return emails;
  } catch (error) {
    console.error('Error fetching unread emails:', error);
    throw error;
  }
}

/**
 * Send an email using Gmail API
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body content
 * @returns {Promise<Object>} Response object with send status
 */
export async function sendEmail(to, subject, body) {
  try {
    const response = await fetch('/api/gmail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, body }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}