import React, { memo } from 'react';
import { Table, Button, Card, Badge, Spinner } from 'react-bootstrap';

// Memoized expense row component for better performance
const ExpenseRow = memo(({ expense, onDelete, onEdit }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'Food': 'success',
      'Transportation': 'info',
      'Entertainment': 'warning',
      'Utilities': 'danger',
      'Housing': 'primary',
      'Healthcare': 'secondary'
    };
    
    return categoryColors[category] || 'dark';
  };

  return (
    <tr>
      <td>{expense.description}</td>
      <td>{formatAmount(expense.amount)}</td>
      <td>{formatDate(expense.date)}</td>
      <td>
        <Badge bg={getCategoryColor(expense.category)} pill>
          {expense.category}
        </Badge>
      </td>
      <td>
        <div className="d-flex gap-2">
          <Button 
            size="sm" 
            variant="outline-primary"
            onClick={() => onEdit(expense)}
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="outline-danger"
            onClick={() => onDelete(expense.id)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
});

function ExpenseList({ expenses, deleteExpense, setEditingExpense, isPending }) {
  if (expenses.length === 0) {
    return (
      <Card className="shadow-sm text-center p-4">
        <Card.Body>
          <p className="text-muted mb-0">No expenses found. Add some!</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Expenses</h3>
          {isPending && (
            <Spinner animation="border" role="status" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <ExpenseRow 
                  key={expense.id} 
                  expense={expense} 
                  onDelete={deleteExpense} 
                  onEdit={setEditingExpense} 
                />
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ExpenseList;