
import { useState } from "react";
import "./App.css";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("Salary");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState<number | null>(null);

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Add or update transaction
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !amount || Number(amount) <= 0 || !date) {
      alert("Please enter valid transaction details");
      return;
    }

    const transaction: Transaction = {
      id: editId ?? Date.now(),
      title,
      amount: Number(amount),
      type,
      category,
      date,
    };

    if (editId !== null) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === editId ? transaction : t))
      );
      setEditId(null);
    } else {
      setTransactions((prev) => [...prev, transaction]);
    }

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setAmount("");
    setType("income");
    setCategory("Salary");
    setDate(new Date().toISOString().split("T")[0]);
  };

  // Edit transaction
  const handleEdit = (transaction: Transaction) => {
    setTitle(transaction.title);
    setAmount(String(transaction.amount));
    setType(transaction.type);
    setCategory(transaction.category);
    setDate(transaction.date);
    setEditId(transaction.id);
  };

  // Delete transaction
  const handleDelete = (id: number) => {
    if (window.confirm("Delete this transaction?")) {
      setTransactions((prev) =>
        prev.filter((t) => t.id !== id)
      );

      if (editId === id) {
        setEditId(null);
        resetForm();
      }
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    return filter === "all" || t.type === filter;
  });

  return (
    <div className="container">
      <h1>Expense Tracker</h1>
      <p className="subtitle">
        Manage your income and expenses easily
      </p>

      {/* Summary cards */}
      <div className="summary">
        <div className="card income">
          <h3>Total Income</h3>
          <h2>₹{totalIncome.toFixed(2)}</h2>
        </div>

        <div className="card expense">
          <h3>Total Expense</h3>
          <h2>₹{totalExpense.toFixed(2)}</h2>
        </div>

        <div className="card balance">
          <h3>Balance</h3>
          <h2>₹{balance.toFixed(2)}</h2>
        </div>
      </div>

      {/* Transaction form */}
      <div className="form-section">
        <h2>
          {editId !== null ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Transaction title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <select
            value={type}
            onChange={(e) => {
              const newType = e.target.value as "income" | "expense";
              setType(newType);
              setCategory(newType === "income" ? "Salary" : "Food");
            }}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {(type === "income"
              ? ["Salary", "Business", "Gift", "Other"]
              : ["Food", "Shopping", "Travel", "Bills", "Education", "Other"]
            ).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <button type="submit">
            {editId !== null ? "Update Transaction" : "Add Transaction"}
          </button>

          {editId !== null && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditId(null);
                resetForm();
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Transaction history */}
      <div className="history">
        <h2>Transaction History</h2>

        <select
          className="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Transactions</option>
          <option value="income">Income Only</option>
          <option value="expense">Expenses Only</option>
        </select>

        {filteredTransactions.length === 0 ? (
          <p className="empty">No transactions found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td>₹{t.amount.toFixed(2)}</td>
                    <td className={t.type}>
                      {t.type}
                    </td>
                    <td>{t.category}</td>
                    <td>{t.date}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(t)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(t.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
