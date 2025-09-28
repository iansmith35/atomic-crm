# Accounting Module

This module provides TypeScript functions for managing accounting operations in the Atomic CRM system.

## Setup

The module uses Supabase for database operations and requires the following environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

## Functions

### `createCustomer(data)`
Creates a new customer record.

**Parameters:**
- `data`: Object with properties:
  - `name` (string): Customer name
  - `email` (string, optional): Customer email
  - `address` (string, optional): Customer address

**Returns:** Customer record

### `createInvoice(data)`
Creates an invoice with line items.

**Parameters:**
- `data`: Object with properties:
  - `customer_id` (number): Customer ID
  - `date` (string): Invoice date (ISO format)
  - `total` (number): Invoice total amount
  - `lines` (array): Array of line items with:
    - `description` (string): Item description
    - `qty` (number): Quantity
    - `unit_price` (number): Unit price

**Returns:** Invoice record

### `recordPayment(data)`
Records a payment against an invoice.

**Parameters:**
- `data`: Object with properties:
  - `invoice_id` (number): Invoice ID
  - `amount` (number): Payment amount
  - `date` (string): Payment date (ISO format)

**Returns:** Payment record

### `getPNLSummary(startDate, endDate)`
Fetches Profit & Loss summary for a date range.

**Parameters:**
- `startDate` (string): Start date (ISO format)
- `endDate` (string): End date (ISO format)

**Returns:** P&L summary data

### `computeVAT(periodStart, periodEnd)`
Computes VAT summary for a period.

**Parameters:**
- `periodStart` (string): Period start date (ISO format)
- `periodEnd` (string): Period end date (ISO format)

**Returns:** VAT summary data

## Database Requirements

The module expects the following Supabase tables:
- `customers`: Customer information
- `invoices`: Invoice headers
- `invoice_lines`: Invoice line items
- `payments`: Payment records

And the following RPC functions:
- `pnl_summary(start_date, end_date)`: P&L calculation
- `vat_summary(start_date, end_date)`: VAT calculation

## Usage Example

```typescript
import { createCustomer, createInvoice, recordPayment } from './modules/accounting';

// Create customer
const customer = await createCustomer({
  name: "John Doe Ltd",
  email: "billing@johndoe.com",
  address: "123 Business Street, London, UK"
});

// Create invoice
const invoice = await createInvoice({
  customer_id: customer.id,
  date: "2024-01-15",
  total: 1250.00,
  lines: [
    {
      description: "Gas Safety Certificate",
      qty: 1,
      unit_price: 850.00
    }
  ]
});

// Record payment
const payment = await recordPayment({
  invoice_id: invoice.id,
  amount: 1250.00,
  date: "2024-01-20"
});
```