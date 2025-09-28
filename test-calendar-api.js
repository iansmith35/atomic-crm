// Simple test script for the calendar API functions
// This tests the backend integration functions directly

const { listCalendarEvents, createCalendarEvent } = require('./integrations/rubeGoogle-cjs.js');

async function testCalendarAPI() {
  console.log('🧪 Testing Calendar API Functions...\n');

  try {
    // Test 1: List calendar events
    console.log('📅 Test 1: Fetching calendar events...');
    const events = await listCalendarEvents('primary', new Date().toISOString());
    console.log(`✅ Successfully fetched ${events.length} events`);
    console.log('Events:', JSON.stringify(events, null, 2));
    console.log('');

    // Test 2: Create a new calendar event
    console.log('📝 Test 2: Creating a new calendar event...');
    const testEvent = {
      summary: 'Test Meeting from API',
      description: 'This is a test event created via the API',
      start: { dateTime: new Date(Date.now() + 3600000).toISOString() }, // 1 hour from now
      end: { dateTime: new Date(Date.now() + 7200000).toISOString() } // 2 hours from now
    };

    const createdEvent = await createCalendarEvent(testEvent);
    console.log('✅ Successfully created event:', createdEvent.summary);
    console.log('Event ID:', createdEvent.id);
    console.log('');

    // Test 3: Fetch events again to confirm the new event
    console.log('🔄 Test 3: Refreshing calendar events...');
    const updatedEvents = await listCalendarEvents('primary', new Date().toISOString());
    console.log(`✅ Successfully fetched ${updatedEvents.length} events after creation`);
    console.log('');

    console.log('🎉 All tests passed! Calendar API functions are working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testCalendarAPI();