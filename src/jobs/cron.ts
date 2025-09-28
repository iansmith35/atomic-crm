// src/jobs/cron.ts or in your server entry
import { runGasChecker, saveGasCheckerResults } from './gasChecker';
import cron from 'node-cron';

// Get cron interval from environment variable or default to every hour
const CRON_INTERVAL = process.env.GAS_CHECKER_CRON || '0 * * * *';  // every hour, for example

console.log(`🕒 Gas Checker cron job initialized with schedule: ${CRON_INTERVAL}`);
console.log('📋 Schedule examples:');
console.log('  "0 * * * *"    - Every hour');
console.log('  "0 */6 * * *"  - Every 6 hours');
console.log('  "0 9 * * *"    - Every day at 9:00 AM');
console.log('  "0 9 * * 1"    - Every Monday at 9:00 AM');

// Schedule the gas checker cron job
cron.schedule(CRON_INTERVAL, async () => {
  console.log('🔄 Running gasChecker cron job...');
  
  try {
    const result = await runGasChecker();
    
    // Log the results
    console.log('✅ GasChecker results:', {
      timestamp: result.timestamp,
      totalCertificates: result.total_certificates,
      validCertificates: result.valid_certificates,
      expiringSoon: result.expiring_soon,
      expired: result.expired_certificates,
      missingUploads: result.missing_uploads,
      alertsCount: result.alerts.length
    });

    // Log alerts if any
    if (result.alerts.length > 0) {
      console.log('🚨 ALERTS GENERATED:');
      result.alerts.forEach((alert, index) => {
        console.log(`  ${index + 1}. ${alert}`);
      });
    } else {
      console.log('✅ No alerts - all certificates are in good standing');
    }

    // Save results for audit trail
    await saveGasCheckerResults(result);

    // In a production environment, you might want to:
    // 1. Send email notifications for critical alerts
    // 2. Update dashboard status indicators
    // 3. Create calendar reminders for renewals
    // 4. Notify assigned engineers via Slack/Teams
    
  } catch (error) {
    console.error('❌ Error in gasChecker cron job:', error);
  }
}, {
  timezone: "Europe/London" // Adjust timezone as needed
});

console.log('🚀 Gas Checker cron job started successfully');

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('🛑 Shutting down Gas Checker cron job...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down Gas Checker cron job...');
  process.exit(0);
});

// Keep the process alive
process.stdin.resume();