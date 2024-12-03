import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const categories = [
  "Groceries",
  "Rent",
  "Entertainment",
  "Utilities",
  "Transport",
  "Other",
];

function App() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    title: "",
    amount: "",
    date: "",
    category: categories[0],
  });
  const [filterCategory, setFilterCategory] = useState("All");
  const [budgets, setBudgets] = useState(
    categories.reduce(
      (acc, cat) => ({ ...acc, [cat]: { limit: 0, spent: 0 } }),
      {}
    )
  );

  const addTransaction = () => {
    setTransactions([
      ...transactions,
      {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        date: new Date(newTransaction.date).toISOString().split("T")[0],
      },
    ]);
    setNewTransaction({
      type: "expense",
      title: "",
      amount: "",
      date: "",
      category: categories[0],
    });
  };

  const filteredTransactions = transactions.filter(
    (t) => filterCategory === "All" || t.category === filterCategory
  );

  useEffect(() => {
    const newBudgets = { ...budgets };
    transactions.forEach((t) => {
      newBudgets[t.category].spent += t.type === "expense" ? t.amount : 0;
    });
    setBudgets(newBudgets);
  }, [transactions]);

  const totalIncome = transactions.reduce(
    (sum, t) => (t.type === "income" ? sum + t.amount : sum),
    0
  );
  const totalExpenses = transactions.reduce(
    (sum, t) => (t.type === "expense" ? sum + t.amount : sum),
    0
  );
  const balance = totalIncome - totalExpenses;

  return (
    <div className="container mx-auto p-4 sm:max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Personal Finance Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="text"
                placeholder="Title"
                value={newTransaction.title}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    title: e.target.value,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, date: e.target.value })
                }
              />
              <Select
                value={newTransaction.category}
                onChange={(value) =>
                  setNewTransaction({ ...newTransaction, category: value })
                }
              >
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() =>
                  setNewTransaction({ ...newTransaction, type: "expense" })
                }
              >
                Add Expense
              </Button>
              <Button
                onClick={() =>
                  setNewTransaction({ ...newTransaction, type: "income" })
                }
              >
                Add Income
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addTransaction}>Add Transaction</Button>
        </CardFooter>
      </Card>

      <div className="mt-4">
        <Label>Filter by Category</Label>
        <Select
          value={filterCategory}
          onChange={(value) => setFilterCategory(value)}
        >
          <SelectItem value="All">All</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Finance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Income: ${totalIncome.toFixed(2)}</p>
            <p>Expenses: ${totalExpenses.toFixed(2)}</p>
            <p>Balance: ${balance.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.map((t, idx) => (
              <div key={idx} className="border-b py-2 last:border-b-0">
                <p>
                  {t.title} - {t.type === "expense" ? "-" : "+"}${t.amount} (
                  {t.category})
                </p>
                <small>{t.date}</small>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        {categories.map((cat) => (
          <Card key={cat} className="mb-2">
            <CardHeader>
              <CardTitle>{cat} Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                placeholder="Set Limit"
                value={budgets[cat].limit}
                onChange={(e) =>
                  setBudgets({
                    ...budgets,
                    [cat]: {
                      limit: parseFloat(e.target.value),
                      spent: budgets[cat].spent,
                    },
                  })
                }
              />
              <Progress
                value={(budgets[cat].spent / budgets[cat].limit) * 100 || 0}
                className="mt-2"
              />
              <p>
                Spent: ${budgets[cat].spent.toFixed(2)} / $
                {budgets[cat].limit.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
