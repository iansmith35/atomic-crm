// modules/accounting.js
// Accounting module for handling financial operations

// In-memory storage for demo purposes (in production, use a proper database)
let customers = [];
let invoices = [];
let payments = [];

// Generate unique IDs
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Create a new customer
async function createCustomer(customerData) {
  const customer = {
    id: generateId(),
    name: customerData.name,
    email: customerData.email,
    address: customerData.address,
    createdAt: new Date().toISOString(),
    ...customerData
  };
  
  customers.push(customer);
  return customer;
}

// Create a new invoice
async function createInvoice(invoiceData) {
  const invoice = {
    id: generateId(),
    customerId: invoiceData.customerId,
    amount: parseFloat(invoiceData.amount),
    currency: invoiceData.currency || 'GBP',
    status: 'pending',
    items: invoiceData.items || [],
    dueDate: invoiceData.dueDate,
    createdAt: new Date().toISOString(),
    ...invoiceData
  };
  
  invoices.push(invoice);
  return invoice;
}

// Record a payment
async function recordPayment(paymentData) {
  const payment = {
    id: generateId(),
    invoiceId: paymentData.invoiceId,
    amount: parseFloat(paymentData.amount),
    currency: paymentData.currency || 'GBP',
    method: paymentData.method || 'bank_transfer',
    reference: paymentData.reference,
    createdAt: new Date().toISOString(),
    ...paymentData
  };
  
  // Update invoice status if payment covers full amount
  const invoice = invoices.find(inv => inv.id === paymentData.invoiceId);
  if (invoice && payment.amount >= invoice.amount) {
    invoice.status = 'paid';
    invoice.paidAt = payment.createdAt;
  }
  
  payments.push(payment);
  return payment;
}

// Get Profit & Loss summary for a date range
async function getPNLSummary(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate revenue from paid invoices
  const paidInvoices = invoices.filter(invoice => {
    if (invoice.status !== 'paid' || !invoice.paidAt) return false;
    const paidDate = new Date(invoice.paidAt);
    return paidDate >= start && paidDate <= end;
  });
  
  const revenue = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  
  // Mock expenses for demo (in reality, you'd track actual expenses)
  const expenses = revenue * 0.3; // Assume 30% expenses
  const profit = revenue - expenses;
  
  return {
    period: {
      start: startDate,
      end: endDate
    },
    revenue: revenue,
    expenses: expenses,
    profit: profit,
    invoiceCount: paidInvoices.length,
    currency: 'GBP'
  };
}

// Compute VAT for a date range
async function computeVAT(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Get invoices in the date range
  const periodInvoices = invoices.filter(invoice => {
    const invoiceDate = new Date(invoice.createdAt);
    return invoiceDate >= start && invoiceDate <= end;
  });
  
  const netAmount = periodInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const vatRate = 0.20; // 20% VAT rate for UK
  const vatAmount = netAmount * vatRate;
  const grossAmount = netAmount + vatAmount;
  
  return {
    period: {
      start: startDate,
      end: endDate
    },
    netAmount: netAmount,
    vatRate: vatRate,
    vatAmount: vatAmount,
    grossAmount: grossAmount,
    invoiceCount: periodInvoices.length,
    currency: 'GBP'
  };
}

module.exports = {
  createCustomer,
  createInvoice,
  recordPayment,
  getPNLSummary,
  computeVAT
};