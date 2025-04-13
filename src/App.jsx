import React, { useState, useTransition } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import FilterBar from './components/FilterBar';
import CategoryDistribution from './components/CategoryDistribution';
import { useDeferredValue } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Groceries', amount: 125.65, date: '2025-04-10', category: 'Food' },
    { id: 2, description: 'Electricity Bill', amount: 85.43, date: '2025-04-05', category: 'Utilities' },
    { id: 3, description: 'Movie Tickets', amount: 48.50, date: '2025-04-08', category: 'Entertainment' },
    { id: 4, description: 'Fuel', amount: 60.00, date: '2025-04-12', category: 'Transportation' }
  ]);
  
  const [filter, setFilter] = useState({ text: '', category: '', dateRange: { start: '', end: '' } });
  const [isPending, startTransition] = useTransition();
  const deferredFilter = useDeferredValue(filter);
  
  const [editingExpense, setEditingExpense] = useState(null);

  // Add expense
  const addExpense = (newExpense) => {
    setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
  };

  // Update expense
  const updateExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...updatedExpense, id } : expense
    ));
    setEditingExpense(null);
  };

  // Delete expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Handle filter changes with transition
  const handleFilterChange = (newFilter) => {
    startTransition(() => {
      setFilter(newFilter);
    });
  };

  // Filter expenses based on criteria
  const filteredExpenses = expenses.filter(expense => {
    const matchesText = expense.description.toLowerCase().includes(deferredFilter.text.toLowerCase());
    const matchesCategory = deferredFilter.category === '' || expense.category === deferredFilter.category;
    
    let matchesDate = true;
    if (deferredFilter.dateRange.start && deferredFilter.dateRange.end) {
      const expenseDate = new Date(expense.date);
      const startDate = new Date(deferredFilter.dateRange.start);
      const endDate = new Date(deferredFilter.dateRange.end);
      matchesDate = expenseDate >= startDate && expenseDate <= endDate;
    }
    
    return matchesText && matchesCategory && matchesDate;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(expenses.map(expense => expense.category))];

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Expense Tracker</h1>
      
      <Row className="m-auto mb-4 row w-50">
        <Col>
          <ExpenseForm 
            addExpense={addExpense} 
            editingExpense={editingExpense}
            updateExpense={updateExpense}
            categories={categories}
          />
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <ExpenseSummary expenses={filteredExpenses} />
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={8}>
          <FilterBar 
            filter={filter} 
            onFilterChange={handleFilterChange}
            categories={categories}
            isPending={isPending}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={8}>
          <ExpenseList 
            expenses={filteredExpenses} 
            deleteExpense={deleteExpense}
            setEditingExpense={setEditingExpense}
            isPending={isPending}
          />
        </Col>
        <Col md={4}>
          <CategoryDistribution expenses={expenses} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;