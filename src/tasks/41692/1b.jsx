import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/card";

const categories = [
  "Rent",
  "Groceries",
  "Entertainment",
  "Utilities",
  "Transport",
  "Other",
];

function BudgetTracker() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    type: "expense",
  });

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return { income, expenses };
  }, [transactions]);

  const categoryTotals = useMemo(() => {
    return categories.map((cat) => ({
      category: cat,
      total: transactions
        .filter((t) => t.category === cat)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    }));
  }, [transactions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addTransaction = () => {
    if (!form.amount || !form.category || !form.date) {
      alert("Please fill all fields.");
      return;
    }
    setTransactions((prev) => [
      ...prev,
      { ...form, amount: parseFloat(form.amount), id: Date.now() },
    ]);
    setForm({ amount: "", category: "", date: "", type: "expense" });
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="p-4 space-y-4 sm:space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Personal Budget Tracker
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
            />
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
          <Select name="category" value={form.category} onChange={handleChange}>
            <SelectItem value="">Choose Category</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </Select>
          <Select name="type" value={form.type} onChange={handleChange}>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={addTransaction}>Add</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryTotals.map(
            (cat) =>
              cat.total > 0 && (
                <div key={cat.category} className="mb-2">
                  {cat.category}: ${cat.total.toFixed(2)}
                </div>
              )
          )}
          <div className="font-bold">
            Total Income: ${totals.income.toFixed(2)}
            <br />
            Total Expenses: ${totals.expenses.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.date}</TableCell>
                <TableCell
                  className={
                    t.type === "income" ? "text-green-500" : "text-red-500"
                  }
                >
                  {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                </TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => deleteTransaction(t.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default function App() {
  return <BudgetTracker />;
}
