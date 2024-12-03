import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const categories = ["Groceries", "Rent", "Entertainment", "Income", "Other"];

const TransactionForm = ({ addTransaction }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && amount && date && category) {
      addTransaction({ title, amount: parseFloat(amount), date, category });
      setTitle("");
      setAmount("");
      setDate("");
      setCategory("");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">Add Transaction</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const TransactionList = ({ transactions, filter }) => {
  const filteredTransactions = filter
    ? transactions.filter((t) => t.category === filter)
    : transactions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {filteredTransactions.map((transaction, index) => (
            <li key={index} className="border-b pb-2">
              <div className="flex justify-between">
                <span>{transaction.title}</span>
                <span
                  className={
                    transaction.amount >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  ${transaction.amount.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {transaction.date} - {transaction.category}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const Dashboard = ({ transactions }) => {
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpenses;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold">Total Income</h3>
            <p className="text-green-500">${totalIncome.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Total Expenses</h3>
            <p className="text-red-500">${totalExpenses.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Balance</h3>
            <p className={balance >= 0 ? "text-green-500" : "text-red-500"}>
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BudgetTracker = ({ transactions, budgets }) => {
  const categoryExpenses = categories.reduce((acc, category) => {
    acc[category] = transactions
      .filter((t) => t.category === category && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return acc;
  }, {});

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.map((category) => (
          <div key={category} className="mb-2">
            <div className="flex justify-between">
              <span>{category}</span>
              <span>
                ${categoryExpenses[category].toFixed(2)} / ${budgets[category]}
              </span>
            </div>
            <Progress
              value={(categoryExpenses[category] / budgets[category]) * 100}
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [budgets, setBudgets] = useState({
    Groceries: 500,
    Rent: 1000,
    Entertainment: 200,
    Income: 5000,
    Other: 300,
  });

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Personal Finance Tracker</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <TransactionForm addTransaction={addTransaction} />
          <Dashboard transactions={transactions} />
          <BudgetTracker transactions={transactions} budgets={budgets} />
        </div>
        <div>
          <div className="mb-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <TransactionList transactions={transactions} filter={filter} />
        </div>
      </div>
    </div>
  );
}
