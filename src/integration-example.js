// Integration example for the Virtual Engineer Office
// This shows how the gas checker can be integrated with the existing frontend

const { runGasChecker } = require('./jobs/gasChecker');

// Example function that could be called from the Virtual Engineer Office HTML
async function updateGasCertificateStatus() {
  try {
    console.log('🔄 Updating gas certificate display...');
    
    const result = await runGasChecker();
    
    // Transform the data for the frontend display
    const statusDisplay = result.certificates_checked.map(cert => {
      let statusClass = 'status ok';
      let statusText = 'Valid';
      
      if (cert.status === 'expired') {
        statusClass = 'status alert';
        statusText = 'Expired';
      } else if (cert.status === 'expiring_soon') {
        statusClass = 'status warning';
        statusText = 'Renew Soon';
      } else if (cert.upload_status === 'missing') {
        statusClass = 'status alert';
        statusText = 'Missing';
      }
      
      return {
        name: cert.property_name,
        expiry: cert.expiry_date,
        statusClass,
        statusText,
        assigned: cert.assigned_engineer
      };
    });
    
    // This would be used to update the DOM in the Virtual Engineer Office
    console.log('📊 Certificate status for frontend:', statusDisplay);
    
    // Generate summary for dashboard
    const summary = {
      total: result.total_certificates,
      valid: result.valid_certificates,
      expiring: result.expiring_soon,
      expired: result.expired_certificates,
      missing: result.missing_uploads,
      alerts: result.alerts
    };
    
    console.log('📋 Dashboard summary:', summary);
    
    // Return data that can be used by the frontend
    return {
      certificates: statusDisplay,
      summary,
      lastChecked: result.timestamp
    };
    
  } catch (error) {
    console.error('❌ Error updating gas certificate status:', error);
    return null;
  }
}

// Example of how this could be integrated with the existing Virtual Engineer Office
function integrateWithVirtualEngineerOffice() {
  console.log('🛠️ Virtual Engineer Office Integration Example');
  console.log('');
  console.log('To integrate with virtual-engineer-office.html, add this JavaScript:');
  console.log('');
  console.log(`
// Add to virtual-engineer-office.html <script> section:
async function refreshGasCerts() {
  try {
    const response = await fetch('/api/gas-checker/run', { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
      updateCertificateDisplay(data.data);
    }
  } catch (error) {
    console.error('Error refreshing gas certificates:', error);
  }
}

function updateCertificateDisplay(result) {
  const certList = document.querySelector('#gas-cert-list');
  if (!certList) return;
  
  certList.innerHTML = '';
  
  result.certificates_checked.forEach(cert => {
    const li = document.createElement('li');
    let statusClass = 'status ok';
    let statusText = 'Valid';
    
    if (cert.status === 'expired') {
      statusClass = 'status alert';
      statusText = 'Expired';
    } else if (cert.status === 'expiring_soon') {
      statusClass = 'status warning';
      statusText = 'Renew Soon';
    } else if (cert.upload_status === 'missing') {
      statusClass = 'status alert';
      statusText = 'Missing Upload';
    }
    
    li.innerHTML = \`\${cert.property_name} – Expires: \${cert.expiry_date} <span class="\${statusClass}">\${statusText}</span>\`;
    certList.appendChild(li);
  });
}

// Auto-refresh every 5 minutes
setInterval(refreshGasCerts, 5 * 60 * 1000);
  `);
  console.log('');
  console.log('📝 Update the HTML to include an ID for the certificate list:');
  console.log('<ul id="gas-cert-list">');
  console.log('  <!-- Certificates will be populated by JavaScript -->');
  console.log('</ul>');
}

// Run the example
if (require.main === module) {
  updateGasCertificateStatus().then(() => {
    console.log('');
    integrateWithVirtualEngineerOffice();
  });
}

module.exports = {
  updateGasCertificateStatus,
  integrateWithVirtualEngineerOffice
};