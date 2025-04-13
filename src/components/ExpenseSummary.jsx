import React, { useMemo } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function ExpenseSummary({ expenses }) {
  const summary = useMemo(() => {
    const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    
    // Get highest expense
    const highestExpense = expenses.length > 0 
      ? expenses.reduce((prev, current) => 
          parseFloat(prev.amount) > parseFloat(current.amount) ? prev : current
        ) 
      : null;
    
    // Get most recent expense
    const mostRecentExpense = expenses.length > 0 
      ? expenses.reduce((prev, current) => 
          new Date(current.date) > new Date(prev.date) ? current : prev
        ) 
      : null;
    
    // Calculate category totals
    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category;
      acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
      return acc;
    }, {});
    
    // Find top category
    let topCategory = null;
    let topAmount = 0;
    
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      if (amount > topAmount) {
        topAmount = amount;
        topCategory = category;
      }
    });
    
    return {
      totalAmount,
      expenseCount: expenses.length,
      highestExpense,
      mostRecentExpense,
      topCategory,
      topCategoryAmount: topAmount
    };
  }, [expenses]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-info text-white">
        <h3 className="mb-0">Expense Summary</h3>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={3} sm={6} className="mb-3 mb-md-0">
            <Card className="h-100 text-center bg-light">
              <Card.Body>
                <h6 className="text-muted">Total Expenses</h6>
                <h3 className="mb-0">{formatAmount(summary.totalAmount)}</h3>
                <small className="text-muted">{summary.expenseCount} items</small>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-3 mb-md-0">
            <Card className="h-100 text-center bg-light">
              <Card.Body>
                <h6 className="text-muted">Highest Expense</h6>
                <h3 className="mb-0">
                  {summary.highestExpense 
                    ? formatAmount(summary.highestExpense.amount) 
                    : '$0.00'}
                </h3>
                <small className="text-muted">
                  {summary.highestExpense ? summary.highestExpense.description : 'None'}
                </small>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6} className="mb-3 mb-md-0">
            <Card className="h-100 text-center bg-light">
              <Card.Body>
                <h6 className="text-muted">Top Category</h6>
                <h3 className="mb-0">
                  {summary.topCategory ? formatAmount(summary.topCategoryAmount) : '$0.00'}
                </h3>
                <small className="text-muted">{summary.topCategory || 'None'}</small>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} sm={6}>
            <Card className="h-100 text-center bg-light">
              <Card.Body>
                <h6 className="text-muted">Recent Expense</h6>
                <h3 className="mb-0">
                  {summary.mostRecentExpense 
                    ? formatAmount(summary.mostRecentExpense.amount) 
                    : '$0.00'}
                </h3>
                <small className="text-muted">
                  {summary.mostRecentExpense ? summary.mostRecentExpense.description : 'None'}
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default ExpenseSummary;