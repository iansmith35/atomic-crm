# Gas Checker Cron Job System

## Overview

The Gas Checker system is an automated cron job that monitors gas safety certificates for the ISHE Group CRM system. It checks certificate expiry dates, upload status, and generates alerts for required actions.

## Features

- 🔍 **Automated Certificate Monitoring**: Checks all gas certificates in the system
- ⚠️ **Expiry Alerts**: Identifies certificates expiring within 30 days
- 🚨 **Expired Certificate Detection**: Flags certificates that have already expired
- 📄 **Upload Status Monitoring**: Tracks missing PDF certificate uploads
- 📊 **Comprehensive Reporting**: Provides detailed status reports and metrics
- 💾 **Audit Trail**: Logs all checker results for compliance tracking

## Files Structure

```
src/jobs/
├── cron.js              # Main cron job scheduler
├── cron.ts              # TypeScript version of cron scheduler
├── gasChecker.js        # Gas certificate checker logic
└── gasChecker.ts        # TypeScript version of checker logic
```

## Configuration

### Environment Variables

- `GAS_CHECKER_CRON`: Cron schedule expression (default: `'0 * * * *'` - every hour)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key for database access

### Cron Schedule Examples

```bash
# Every hour (default)
GAS_CHECKER_CRON="0 * * * *"

# Every 6 hours
GAS_CHECKER_CRON="0 */6 * * *"

# Every day at 9:00 AM
GAS_CHECKER_CRON="0 9 * * *"

# Every Monday at 9:00 AM
GAS_CHECKER_CRON="0 9 * * 1"

# Every 10 seconds (for testing)
GAS_CHECKER_CRON="*/10 * * * * *"
```

## Usage

### Running the Cron Job

```bash
# Install dependencies
npm install

# Run with default schedule (every hour)
npm run cron

# Or run directly
node src/jobs/cron.js

# Run with custom schedule
GAS_CHECKER_CRON="0 9 * * *" node src/jobs/cron.js
```

### Running One-Time Check

```bash
# Test the gas checker function directly
node -e "const { runGasChecker } = require('./src/jobs/gasChecker'); runGasChecker().then(result => console.log(JSON.stringify(result, null, 2)));"
```

## Sample Output

```
🕒 Gas Checker cron job initialized with schedule: 0 * * * *
🚀 Gas Checker cron job started successfully
🔄 Running gasChecker cron job...
🔍 Starting gas certificate checker...
✅ Gas checker completed: 3 certificates checked
📊 Summary: 1 valid, 1 expiring soon, 1 expired, 1 missing uploads
✅ GasChecker results: {
  timestamp: '2025-09-28T21:58:20.481Z',
  totalCertificates: 3,
  validCertificates: 1,
  expiringSoon: 1,
  expired: 1,
  missingUploads: 1,
  alertsCount: 6
}
🚨 ALERTS GENERATED:
  1. 📄 UPLOAD REQUIRED: 1 certificate(s) missing PDF uploads
  2. ⚠️ ACTION REQUIRED: 1 certificate(s) expiring within 30 days
  3. 🚨 URGENT: 1 certificate(s) have expired and require immediate renewal
  4. ⚠️ RENEW SOON: Smith Property gas certificate expires on 2025-10-28 (30 days remaining)
  5. 🚨 EXPIRED: Bristol HQ gas certificate expired on 2025-08-28
  6. 📄 MISSING UPLOAD: Bristol HQ certificate file not uploaded
💾 Gas checker results saved to audit log
```

## Alert Types

### 🚨 URGENT - Expired Certificates
- Certificates that have already passed their expiry date
- Require immediate renewal and compliance action

### ⚠️ ACTION REQUIRED - Expiring Soon
- Certificates expiring within the next 30 days
- Allow time for renewal process completion

### 📄 UPLOAD REQUIRED - Missing Files
- Certificates that exist in the system but lack PDF file uploads
- Required for compliance documentation

## Data Structure

### Gas Certificate Object
```javascript
{
  id: string,
  property_name: string,
  certificate_type: string,
  issue_date: string,           // ISO date format
  expiry_date: string,          // ISO date format
  status: 'valid' | 'expiring_soon' | 'expired' | 'missing',
  assigned_engineer: string,
  upload_status: 'uploaded' | 'pending' | 'missing'
}
```

### Gas Checker Result
```javascript
{
  timestamp: string,            // ISO timestamp
  total_certificates: number,
  valid_certificates: number,
  expiring_soon: number,
  expired_certificates: number,
  missing_uploads: number,
  alerts: string[],             // Array of alert messages
  certificates_checked: GasCertificate[]
}
```

## Integration Points

### Current Implementation
- Uses mock data for demonstration purposes
- Logs results to console and audit trail
- Timezone configured for "Europe/London"

### Production Integration
For production deployment, uncomment and configure:

1. **Supabase Database Queries**:
   ```javascript
   const { data: certificates, error } = await supabase
     .from('gas_certificates')
     .select('*');
   ```

2. **Audit Log Storage**:
   ```javascript
   const { error } = await supabase
     .from('gas_checker_logs')
     .insert([{ /* results */ }]);
   ```

3. **Notification Systems**:
   - Email notifications for critical alerts
   - Dashboard status updates
   - Calendar reminders for renewals
   - Slack/Teams notifications for assigned engineers

## Deployment

### As a Service
```bash
# Using PM2 process manager
npm install -g pm2
pm2 start src/jobs/cron.js --name "gas-checker"
pm2 startup
pm2 save
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src/ ./src/
CMD ["node", "src/jobs/cron.js"]
```

### Environment Variables for Production
```bash
GAS_CHECKER_CRON="0 9 * * *"  # Daily at 9 AM
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-key"
NODE_ENV="production"
```

## Monitoring and Logging

The system includes comprehensive logging:
- 📊 Certificate status summary
- 🚨 Alert generation and categorization
- 💾 Audit trail for compliance
- ⚡ Performance metrics and timing

For production monitoring, consider integrating with:
- Application Performance Monitoring (APM) tools
- Log aggregation services (ELK stack, Splunk)
- Alerting systems (PagerDuty, Slack)
- Health check endpoints

## Compliance Notes

This system helps maintain compliance with gas safety regulations by:
- Ensuring certificates are renewed before expiry
- Maintaining complete documentation (PDF uploads)
- Providing audit trails for regulatory inspections
- Automated alerting prevents oversight and missed renewals

## Testing

The system includes mock data for testing purposes. To verify functionality:

1. Run a one-time check to verify the logic
2. Use a frequent cron schedule (e.g., every 10 seconds) for testing
3. Check log output for proper alert generation
4. Verify certificate status calculations are accurate

## Support

For issues or questions regarding the Gas Checker system:
1. Check the console logs for error messages
2. Verify environment variables are properly set
3. Ensure Supabase connection is configured
4. Test with mock data before production deployment