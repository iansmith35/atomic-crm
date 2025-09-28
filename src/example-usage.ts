// Example usage of the accounting module
import { 
  createCustomer, 
  createInvoice, 
  recordPayment, 
  getPNLSummary, 
  computeVAT 
} from './modules/accounting';

// Example: Create a complete customer-invoice-payment workflow
export async function exampleWorkflow() {
  try {
    // 1. Create a customer
    const customer = await createCustomer({
      name: "John Doe Ltd",
      email: "billing@johndoe.com",
      address: "123 Business Street, London, UK"
    });
    
    console.log('Customer created:', customer);
    
    // 2. Create an invoice with line items
    const invoice = await createInvoice({
      customer_id: (customer as any).id,
      date: new Date().toISOString().split('T')[0],
      total: 1250.00,
      lines: [
        {
          description: "Gas Safety Certificate",
          qty: 1,
          unit_price: 850.00
        },
        {
          description: "Emergency Call Out Fee",
          qty: 1,
          unit_price: 400.00
        }
      ]
    });
    
    console.log('Invoice created:', invoice);
    
    // 3. Record a payment
    const payment = await recordPayment({
      invoice_id: (invoice as any).id,
      amount: 1250.00,
      date: new Date().toISOString().split('T')[0]
    });
    
    console.log('Payment recorded:', payment);
    
    // 4. Get P&L summary for current month
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const pnlSummary = await getPNLSummary(firstDay, lastDay);
    console.log('P&L Summary:', pnlSummary);
    
    // 5. Compute VAT for current quarter
    const vatSummary = await computeVAT(firstDay, lastDay);
    console.log('VAT Summary:', vatSummary);
    
  } catch (error) {
    console.error('Error in accounting workflow:', error);
  }
}