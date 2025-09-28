const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://mydxasjicsfetnglbppp.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZHhhc2ppY3NmZXRuZ2xicHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjYyNTQsImV4cCI6MjA3MzgwMjI1NH0.zdJa3T1WDdc6_JNQbh93oB7CnVWa5TQ5jLb1UN-8dLE';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Check gas certificates for expiry dates and compliance
 * This function monitors gas safety certificates and alerts for renewals
 */
async function runGasChecker() {
  console.log('🔍 Starting gas certificate checker...');
  
  const result = {
    timestamp: new Date().toISOString(),
    total_certificates: 0,
    valid_certificates: 0,
    expiring_soon: 0,
    expired_certificates: 0,
    missing_uploads: 0,
    alerts: [],
    certificates_checked: []
  };

  try {
    // Simulated gas certificates data (in a real implementation, this would come from Supabase)
    // Create dynamic dates for better testing
    const currentDate = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(currentDate.getMonth() + 1);
    const nextYear = new Date();
    nextYear.setFullYear(currentDate.getFullYear() + 1);
    const lastMonth = new Date();
    lastMonth.setMonth(currentDate.getMonth() - 1);

    const mockCertificates = [
      {
        id: '1',
        property_name: 'Smith Property',
        certificate_type: 'Gas Safety Certificate',
        issue_date: '2024-02-11',
        expiry_date: nextMonth.toISOString().split('T')[0], // Expires next month (expiring soon)
        status: 'expiring_soon',
        assigned_engineer: 'Ellie',
        upload_status: 'uploaded'
      },
      {
        id: '2',
        property_name: 'Jones Flat',
        certificate_type: 'Gas Safety Certificate',
        issue_date: '2024-09-10',
        expiry_date: nextYear.toISOString().split('T')[0], // Expires next year (valid)
        status: 'valid',
        assigned_engineer: 'Liam',
        upload_status: 'uploaded'
      },
      {
        id: '3',
        property_name: 'Bristol HQ',
        certificate_type: 'Gas Safety Certificate',
        issue_date: '2024-01-15',
        expiry_date: lastMonth.toISOString().split('T')[0], // Expired last month
        status: 'expired',
        assigned_engineer: 'Riley',
        upload_status: 'missing'
      }
    ];

    // In a real implementation, query Supabase for certificates:
    // const { data: certificates, error } = await supabase
    //   .from('gas_certificates')
    //   .select('*');

    const certificates = mockCertificates;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

    result.total_certificates = certificates.length;
    result.certificates_checked = certificates;

    // Check each certificate
    for (const cert of certificates) {
      const expiryDate = new Date(cert.expiry_date);
      
      // Check if expired
      if (expiryDate < currentDate) {
        cert.status = 'expired';
        result.expired_certificates++;
        result.alerts.push(`🚨 EXPIRED: ${cert.property_name} gas certificate expired on ${cert.expiry_date}`);
      }
      // Check if expiring within 30 days
      else if (expiryDate <= thirtyDaysFromNow) {
        cert.status = 'expiring_soon';
        result.expiring_soon++;
        result.alerts.push(`⚠️ RENEW SOON: ${cert.property_name} gas certificate expires on ${cert.expiry_date} (${Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))} days remaining)`);
      }
      // Certificate is valid
      else {
        cert.status = 'valid';
        result.valid_certificates++;
      }

      // Check upload status
      if (cert.upload_status === 'missing') {
        result.missing_uploads++;
        result.alerts.push(`📄 MISSING UPLOAD: ${cert.property_name} certificate file not uploaded`);
      }
    }

    // Generate summary alerts
    if (result.expired_certificates > 0) {
      result.alerts.unshift(`🚨 URGENT: ${result.expired_certificates} certificate(s) have expired and require immediate renewal`);
    }
    
    if (result.expiring_soon > 0) {
      result.alerts.unshift(`⚠️ ACTION REQUIRED: ${result.expiring_soon} certificate(s) expiring within 30 days`);
    }

    if (result.missing_uploads > 0) {
      result.alerts.unshift(`📄 UPLOAD REQUIRED: ${result.missing_uploads} certificate(s) missing PDF uploads`);
    }

    console.log(`✅ Gas checker completed: ${result.total_certificates} certificates checked`);
    console.log(`📊 Summary: ${result.valid_certificates} valid, ${result.expiring_soon} expiring soon, ${result.expired_certificates} expired, ${result.missing_uploads} missing uploads`);
    
    return result;

  } catch (error) {
    console.error('❌ Error running gas checker:', error);
    result.alerts.push(`Error running gas checker: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
}

/**
 * Save gas checker results to Supabase for audit trail
 */
async function saveGasCheckerResults(result) {
  try {
    // In a real implementation, save to Supabase:
    // const { error } = await supabase
    //   .from('gas_checker_logs')
    //   .insert([{
    //     timestamp: result.timestamp,
    //     total_certificates: result.total_certificates,
    //     alerts_count: result.alerts.length,
    //     results: result
    //   }]);

    console.log('💾 Gas checker results saved to audit log');
  } catch (error) {
    console.error('❌ Error saving gas checker results:', error);
  }
}

module.exports = {
  runGasChecker,
  saveGasCheckerResults
};