import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const categories = [
  "Income",
  "Rent",
  "Groceries",
  "Entertainment",
  "Utilities",
  "Other",
];

function InputCard({ addTransaction }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && category && date) {
      addTransaction({ amount: parseFloat(amount), category, date });
      setAmount("");
      setCategory("");
      setDate("");
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Button type="submit">Add Transaction</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SummaryCard({ transactions }) {
  const summary = transactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  const totalIncome = summary.Income || 0;
  const totalExpenses = Object.entries(summary)
    .filter(([category]) => category !== "Income")
    .reduce((total, [, amount]) => total + amount, 0);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Budget Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Total Income: ${totalIncome.toFixed(2)}</p>
          <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
          <p>Balance: ${(totalIncome - totalExpenses).toFixed(2)}</p>
          <h3 className="font-semibold mt-4">Category Breakdown:</h3>
          <ul className="list-disc pl-5">
            {Object.entries(summary).map(([category, amount]) => (
              <li key={category}>
                {category}: ${amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionsTable({ transactions, deleteTransaction }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortedTransactions = React.useMemo(() => {
    let sortableTransactions = [...transactions];
    if (sortConfig.key) {
      sortableTransactions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTransactions;
  }, [transactions, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => requestSort("date")}
                className="cursor-pointer"
              >
                Date
              </TableHead>
              <TableHead
                onClick={() => requestSort("amount")}
                className="cursor-pointer"
              >
                Amount
              </TableHead>
              <TableHead
                onClick={() => requestSort("category")}
                className="cursor-pointer"
              >
                Category
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => deleteTransaction(index)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const deleteTransaction = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Personal Budget Tracker</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <InputCard addTransaction={addTransaction} />
          <SummaryCard transactions={transactions} />
        </div>
        <div>
          <TransactionsTable
            transactions={transactions}
            deleteTransaction={deleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}
