import React, { useState, useEffect, useId, useMemo } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

function ExpenseForm({ addExpense, editingExpense, updateExpense, categories }) {
  const initialFormState = {
    description: '',
    amount: '',
    date: new Date().toISOString().substr(0, 10),
    category: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [newCategory, setNewCategory] = useState('');
  
  // Generate unique IDs for form fields
  const descriptionId = useId();
  const amountId = useId();
  const dateId = useId();
  const categoryId = useId();
  
  // Reset form when editing state changes
  useEffect(() => {
    if (editingExpense) {
      setFormData(editingExpense);
    } else {
      setFormData(initialFormState);
    }
  }, [editingExpense]);
  
  // Memoize category options to prevent unnecessary re-renders
  const categoryOptions = useMemo(() => {
    return [...new Set(categories)].sort();
  }, [categories]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || value : value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (editingExpense) {
      updateExpense(editingExpense.id, formData);
    } else {
      addExpense(formData);
    }
    
    setFormData(initialFormState);
  };
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !categoryOptions.includes(newCategory)) {
      setFormData({
        ...formData,
        category: newCategory
      });
      setNewCategory('');
    }
  };
  
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h3 className="mb-0">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor={descriptionId}>Description</Form.Label>
            <Form.Control
              id={descriptionId}
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
              placeholder="What did you spend on?"
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label htmlFor={amountId}>Amount ($)</Form.Label>
            <Form.Control
              id={amountId}
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              isInvalid={!!errors.amount}
              placeholder="0.00"
              step="0.01"
              min="0.01"
            />
            <Form.Control.Feedback type="invalid">
              {errors.amount}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label htmlFor={dateId}>Date</Form.Label>
            <Form.Control
              id={dateId}
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              isInvalid={!!errors.date}
            />
            <Form.Control.Feedback type="invalid">
              {errors.date}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label htmlFor={categoryId}>Category</Form.Label>
            <div className="d-flex">
              <Form.Select
                id={categoryId}
                name="category"
                value={formData.category}
                onChange={handleChange}
                isInvalid={!!errors.category}
                className="me-2"
              >
                <option value="">Select Category</option>
                {categoryOptions.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </div>
            <Form.Control.Feedback type="invalid">
              {errors.category}
            </Form.Control.Feedback>
          </Form.Group>
          
          <div className="mb-3">
            <Form.Label>Add New Category</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
                className="me-2"
              />
              <Button 
                variant="outline-secondary" 
                onClick={handleAddCategory}
                disabled={!newCategory.trim()}
              >
                Add
              </Button>
            </div>
          </div>
          
          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit">
              {editingExpense ? 'Update Expense' : 'Add Expense'}
            </Button>
            {editingExpense && (
              <Button 
                variant="outline-secondary" 
                onClick={() => updateExpense(null)}
              >
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ExpenseForm;