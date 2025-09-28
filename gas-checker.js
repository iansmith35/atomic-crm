// gas-checker.js - Client-side gas checker utility
// This file can be included in virtual-engineer-office.html to provide gas checking functionality

// Import Supabase client from config
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://mydxasjicsfetnglbppp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZHhhc2ppY3NmZXRuZ2xicHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjYyNTQsImV4cCI6MjA3MzgwMjI1NH0.zdJa3T1WDdc6_JNQbh93oB7CnVWa5TQ5jLb1UN-8dLE'
);

// Gas checker functionality that mirrors the Supabase Edge Function
export async function runGasChecker() {
  try {
    // Call the Supabase Edge Function
    const response = await fetch('https://mydxasjicsfetnglbppp.supabase.co/functions/v1/gas-checker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZHhhc2ppY3NmZXRuZ2xicHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjYyNTQsImV4cCI6MjA3MzgwMjI1NH0.zdJa3T1WDdc6_JNQbh93oB7CnVWa5TQ5jLb1UN-8dLE`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Gas checker error:', error);
    return { success: false, error: error.message };
  }
}

// Alternative local implementation for testing/fallback
export async function runGasCheckerLocal() {
  try {
    // Fetch gas readings directly from database
    const { data: sensors, error } = await supabase.from('gas_readings').select('*');
    if (error) throw error;

    const results = sensors.map((row) => {
      // simplistic: if reading > threshold, warn
      const threshold = row.threshold ?? 100;  
      return {
        id: row.id,
        status: row.value > threshold ? 'HIGH' : 'OK',
        value: row.value,
      };
    });

    // write results to table
    for (const r of results) {
      const { error: e } = await supabase.from('gas_status').upsert({
        reading_id: r.id,
        status: r.status,
        value: r.value,
        updated_at: new Date().toISOString()
      });
      if (e) console.error('GasChecker upsert error:', e);
    }

    return { success: true, results };
  } catch (error) {
    console.error('Local gas checker error:', error);
    return { success: false, error: error.message };
  }
}

// UI helper function to display gas checker results
export function displayGasCheckerResults(results) {
  if (!results.success) {
    alert(`Gas Checker Error: ${results.error}`);
    return;
  }

  const statusCounts = results.results.reduce((acc, reading) => {
    acc[reading.status] = (acc[reading.status] || 0) + 1;
    return acc;
  }, {});

  const highAlerts = results.results.filter(r => r.status === 'HIGH');
  
  let message = `🔍 Gas Safety Check Complete\n\n`;
  message += `📊 Summary:\n`;
  message += `• Total readings: ${results.results.length}\n`;
  message += `• OK readings: ${statusCounts.OK || 0}\n`;
  message += `• HIGH alerts: ${statusCounts.HIGH || 0}\n\n`;

  if (highAlerts.length > 0) {
    message += `⚠️ HIGH ALERTS:\n`;
    highAlerts.forEach(alert => {
      message += `• Reading ${alert.id}: ${alert.value} (threshold exceeded)\n`;
    });
    message += `\n🚨 Immediate attention required!`;
  } else {
    message += `✅ All readings within safe limits`;
  }

  alert(message);
}