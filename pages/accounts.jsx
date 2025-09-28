// pages/accounts.jsx
export default function AccountsOffice() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💼 Accounts Office</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Upload Invoice / Statement</h2>
        <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center bg-gray-50">
          <p>Drop CSV, PDF, or ZIP files here or</p>
          <input type="file" className="mt-2" />
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Banking Summary</h2>
        <div className="bg-white border rounded-xl p-4">
          <p><strong>Total In:</strong> £42,000</p>
          <p><strong>Total Out:</strong> £26,000</p>
          <p><strong>Balance:</strong> £16,000</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Recent Transactions</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between border-b py-2">
            <span>01 Sep 2025 – Client Payment</span>
            <span>+£3,000</span>
          </li>
          <li className="flex justify-between border-b py-2">
            <span>30 Aug 2025 – Web Hosting</span>
            <span>-£50</span>
          </li>
        </ul>
      </section>
    </div>
  );
}