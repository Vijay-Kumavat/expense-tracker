import React, { useState } from 'react';
import { Form, Row, Col, Button, InputGroup, Card } from 'react-bootstrap';

function FilterBar({ filter, onFilterChange, categories, isPending }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleTextChange = (e) => {
    onFilterChange({
      ...filter,
      text: e.target.value
    });
  };
  
  const handleCategoryChange = (e) => {
    onFilterChange({
      ...filter,
      category: e.target.value
    });
  };
  
  const handleDateChange = (field, value) => {
    onFilterChange({
      ...filter,
      dateRange: {
        ...filter.dateRange,
        [field]: value
      }
    });
  };
  
  const clearFilters = () => {
    onFilterChange({
      text: '',
      category: '',
      dateRange: { start: '', end: '' }
    });
  };
  
  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Filter Expenses</h3>
          <Button 
            variant="link" 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-decoration-none"
          >
            {isExpanded ? 'Simple Filter' : 'Advanced Filter'}
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={isExpanded ? 12 : 8}>
            <InputGroup>
              <Form.Control
                placeholder="Search expenses..."
                value={filter.text}
                onChange={handleTextChange}
                disabled={isPending}
              />
              {filter.text && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => onFilterChange({ ...filter, text: '' })}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </Col>
          
          {!isExpanded && (
            <Col md={4}>
              <Form.Select
                value={filter.category}
                onChange={handleCategoryChange}
                disabled={isPending}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Col>
          )}
        </Row>
        
        {isExpanded && (
          <>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={filter.category}
                    onChange={handleCategoryChange}
                    disabled={isPending}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filter.dateRange.start}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    disabled={isPending}
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filter.dateRange.end}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    disabled={isPending || !filter.dateRange.start}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end">
              <Button 
                variant="outline-secondary" 
                onClick={clearFilters}
                disabled={isPending}
              >
                Clear All Filters
              </Button>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default FilterBar;