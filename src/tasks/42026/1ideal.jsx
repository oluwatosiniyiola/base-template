import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categories = ["Groceries", "Rent", "Entertainment", "Utilities", "Other"];

function App() {
  const [transactions, setTransactions] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState({
    Groceries: 300,
    Rent: 1000,
    Entertainment: 200,
    Utilities: 150,
    Other: 100,
  });
  const [filters, setFilters] = useState("");
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    amount: "",
    date: "",
    category: categories[0],
    type: "Income",
  });

  const handleAddTransaction = () => {
    setTransactions([...transactions, { ...newTransaction, id: Date.now() }]);
    setNewTransaction({
      title: "",
      amount: "",
      date: "",
      category: categories[0],
      type: "Income",
    });
  };

  const filteredTransactions = filters
    ? transactions.filter((t) => t.category === filters)
    : transactions;

  const summary = transactions.reduce(
    (acc, t) => {
      if (t.type === "Income") acc.totalIncome += Number(t.amount);
      else acc.totalExpenses += Number(t.amount);
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  summary.remainingBalance = summary.totalIncome - summary.totalExpenses;

  const categorySpending = categories.map((category) => {
    const spending = transactions
      .filter((t) => t.category === category && t.type === "Expense")
      .reduce((acc, t) => acc + Number(t.amount), 0);
    return { category, spending, limit: budgetLimits[category] };
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-center mb-4">
        Personal Finance Tracker
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
            <CardDescription>Log your income or expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border rounded"
                value={newTransaction.title}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    title: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full p-2 border rounded"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
              />
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, date: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded"
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    category: e.target.value,
                  })
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-2 border rounded"
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, type: e.target.value })
                }
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              <button
                className="w-full p-2 bg-blue-500 text-white rounded"
                onClick={handleAddTransaction}
              >
                Add Transaction
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Filter</CardTitle>
            <CardDescription>Filter transactions by category</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              className="w-full p-2 border rounded"
              value={filters}
              onChange={(e) => setFilters(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {filteredTransactions.map((t) => (
              <li
                key={t.id}
                className="p-2 border rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">{t.title}</div>
                  <div className="text-sm text-gray-500">{t.date}</div>
                  <div className="text-sm">{t.category}</div>
                </div>
                <div
                  className={`font-bold ${
                    t.type === "Income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {t.type === "Income" ? "+" : "-"}${t.amount}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Finance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div>Total Income: ${summary.totalIncome}</div>
            <div>Total Expenses: ${summary.totalExpenses}</div>
            <div>Remaining Balance: ${summary.remainingBalance}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          {categorySpending.map(({ category, spending, limit }) => (
            <div key={category} className="mb-2">
              <div className="flex justify-between">
                <span>{category}</span>
                <span>
                  ${spending} / ${limit}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${
                    spending > limit ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min((spending / limit) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
