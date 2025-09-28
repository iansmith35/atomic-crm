//  pages/accounts.jsx
import { useState, useEffect } from "react";

export default function AccountsOffice() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch("/api/tasks?office=accounts");
      const data = await res.json();
      setTasks(data.tasks || []);
    }
    fetchTasks();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white border rounded-xl p-6 shadow mb-6">
        <h2 className="text-2xl font-bold mb-2">📊 Accounts Office — Ava AI</h2>
        <p className="text-gray-600">All your business finances, tracking, and queries in one place.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-3">💰 Account Snapshot</h3>
          <ul className="space-y-2">
            <li><strong>Bank Balance:</strong> £{'{'}{'{'} BANK_BALANCE {'}'}{'}' }</li>
            <li><strong>Outstanding Invoices:</strong> £{'{'}{'{'} OUTSTANDING_INVOICES {'}'}{'}' }</li>
            <li><strong>Expenses This Month:</strong> £{'{'}{'{'} EXPENSES_THIS_MONTH {'}'}{'}' }</li>
            <li><strong>Net Cash Flow:</strong> £{'{'}{'{'} CASH_FLOW {'}'}{'}' }</li>
          </ul>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-3">📅 Upcoming Payments</h3>
          <ul className="space-y-2">
            <li>VAT Return – Due {'{'}{'{'} VAT_DUE {'}'}{'}' }</li>
            <li>Payroll – Due {'{'}{'{'} PAYROLL_DATE {'}'}{'}' }</li>
            <li>Supplier Invoice – £{'{'}{'{'} SUPPLIER_AMOUNT {'}'}{'}' } ({'{'}{'{'} SUPPLIER_NAME {'}'}{'}' })</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">🔍 Transactions Feed</h3>
        <iframe 
          src={'https://docs.google.com/spreadsheets/d/{{SPREADSHEET_ID}}/edit?usp=sharing'}
          width="100%" 
          height="300px"
          className="border-0"
        ></iframe>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-3">🤖 Chat with Ava – Your Finance AI</h3>
        <script 
          src="https://rube.app/embed/chat?agent=ava-accounts-ai&apikey=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJ1c2VyXzAxSzUyNDJUVllBTlBNTjIxTVdZWUtBVlk1Iiwib3JnSWQiOiJvcmdfMDFLNTI0MzI5TVkxOFo5SlhQQTJKM1kxOVkiLCJpYXQiOjE3NTkwNzMzNjB9.dlelFFUO-TRCVA4Q7d4n5xArhN5sxCBBm4VLFxmaMZM" 
          defer
        ></script>
      </div>
    </div>
  );
}