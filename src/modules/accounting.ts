// src/modules/accounting.ts

import { createClient } from '@supabase/supabase-js';  // or your DB client

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Create customer
export async function createCustomer(data: { name: string; email?: string; address?: string }) {
  const { data: d, error } = await supabase.from('customers').insert([data]).single();
  if (error) throw error;
  return d;
}

// Create invoice & lines
export async function createInvoice(data: { customer_id: number; date: string; total: number; lines: { description: string; qty: number; unit_price: number }[] }) {
  const { data: inv, error } = await supabase.from('invoices').insert([{ customer_id: data.customer_id, date: data.date, total: data.total }]).single();
  if (error) throw error;
  const invoiceId = (inv as any).id;
  const lines = data.lines.map(line => ({
    invoice_id: invoiceId,
    description: line.description,
    qty: line.qty,
    unit_price: line.unit_price,
    line_total: line.qty * line.unit_price
  }));
  const { error: le } = await supabase.from('invoice_lines').insert(lines);
  if (le) throw le;
  return inv;
}

// Record payment
export async function recordPayment(data: { invoice_id: number; amount: number; date: string }) {
  const { data: pay, error } = await supabase.from('payments').insert([data]).single();
  if (error) throw error;
  return pay;
}

// Fetch P&L summary
export async function getPNLSummary(startDate: string, endDate: string) {
  // simplistic approach: sum incomes (invoices) minus payments, group by month
  const { data: invs, error: ie } = await supabase.rpc('pnl_summary', { start_date: startDate, end_date: endDate });
  if (ie) throw ie;
  return invs;
}

// VAT return
export async function computeVAT(periodStart: string, periodEnd: string) {
  // This assumes each invoice line has a tax rate or tax amount
  const { data, error } = await supabase.rpc('vat_summary', { start_date: periodStart, end_date: periodEnd });
  if (error) throw error;
  return data;
}