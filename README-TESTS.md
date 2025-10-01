# 🧪 Unit Tests for Ecom 2024

This document describes the comprehensive unit test suite for the Ecom 2024 project.

## 📋 Test Coverage

### Frontend Tests (`/client/src/tests/`)

#### 1. **CheckoutForm.test.js**
- ✅ Payment method selection (QR Code vs Cash on Delivery)
- ✅ QR Code image display
- ✅ Payment slip upload validation
- ✅ Form submission handling
- ✅ localStorage integration

#### 2. **QRCodeUpload.test.js**
- ✅ Image upload functionality
- ✅ File type validation
- ✅ Upload success/error handling
- ✅ Image preview display
- ✅ Delete functionality
- ✅ Loading states

#### 3. **SummaryCard.test.js**
- ✅ Order summary display
- ✅ Address management
- ✅ Form validation (phone, postal code)
- ✅ Payment button states
- ✅ Address selection
- ✅ Payment method status

#### 4. **TableOrders.test.js**
- ✅ Orders table display
- ✅ Payment slip image display
- ✅ Status filtering
- ✅ Date range filtering
- ✅ Status change functionality
- ✅ Error handling

#### 5. **Checkout.test.js**
- ✅ Page rendering
- ✅ Layout structure
- ✅ Component integration

#### 6. **App.test.js**
- ✅ App component rendering
- ✅ Routing structure

### Backend Tests (`/server/tests/`)

#### 1. **user.test.js**
- ✅ QR Code order creation
- ✅ Address management
- ✅ Validation (phone, postal code)
- ✅ Error handling
- ✅ Database operations

#### 2. **product.test.js**
- ✅ Image upload to Cloudinary
- ✅ File processing
- ✅ Error handling
- ✅ Unique ID generation

#### 3. **admin.test.js**
- ✅ Order retrieval
- ✅ Status updates
- ✅ Error handling
- ✅ Database operations

## 🚀 Running Tests

### Quick Start
```bash
# Run all tests
./run-tests.sh

# Run frontend tests only
cd client && npm test

# Run backend tests only
cd server && npm test
```

### Individual Test Files
```bash
# Frontend
npm test CheckoutForm.test.js
npm test QRCodeUpload.test.js
npm test SummaryCard.test.js

# Backend
npm test user.test.js
npm test product.test.js
npm test admin.test.js
```

## 📊 Test Coverage

### Coverage Thresholds
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## 🔧 Test Configuration

### Frontend Configuration
- **Test Environment**: jsdom
- **Setup**: `src/setupTests.js`
- **Transform**: Babel for JS/JSX
- **Mock**: CSS and asset files

### Backend Configuration
- **Test Environment**: node
- **Mock**: Prisma, Cloudinary
- **Coverage**: Controllers, routes, middlewares

## 🎯 Test Scenarios

### 1. **QR Code Payment Flow**
```
1. Select QR Code payment method
2. Display QR Code image
3. Upload payment slip
4. Validate upload
5. Create order with QR Code data
6. Admin can view payment slip
7. Admin can change status
```

### 2. **Cash on Delivery Flow**
```
1. Select Cash on Delivery
2. Use Stripe payment element
3. Process payment
4. Create order
5. Admin can view order
6. Admin can change status
```

### 3. **Address Management**
```
1. Enter new address
2. Validate phone (10 digits)
3. Validate postal code (5 digits)
4. Save address
5. Select saved address
6. Proceed to payment
```

### 4. **Admin Order Management**
```
1. View all orders
2. Filter by status
3. Filter by date
4. View payment slip images
5. Change order status
6. Handle errors
```

## 🐛 Error Handling Tests

### Frontend Errors
- ✅ Network errors
- ✅ Validation errors
- ✅ Upload errors
- ✅ Navigation errors

### Backend Errors
- ✅ Database errors
- ✅ Validation errors
- ✅ Authentication errors
- ✅ File upload errors

## 📈 Performance Tests

### Frontend Performance
- ✅ Component rendering speed
- ✅ Image upload performance
- ✅ Form validation speed

### Backend Performance
- ✅ API response time
- ✅ Database query performance
- ✅ File upload performance

## 🔍 Debugging Tests

### Debug Mode
```bash
# Run tests in debug mode
npm test -- --verbose

# Run specific test with debug
npm test -- --testNamePattern="QR Code" --verbose
```

### Test Logs
```bash
# View test logs
npm test -- --verbose --no-coverage

# Run tests with detailed output
npm test -- --verbose --detectOpenHandles
```

## 📝 Writing New Tests

### Frontend Test Template
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Component from '../Component';

describe('Component', () => {
  test('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Backend Test Template
```javascript
const { functionName } = require('../controllers/controller');

describe('Controller', () => {
  test('should handle request correctly', async () => {
    const req = { body: {} };
    const res = { json: jest.fn() };
    
    await functionName(req, res);
    
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});
```

## 🎉 Test Results

### Expected Outcomes
- ✅ All tests pass
- ✅ Coverage meets thresholds
- ✅ No console errors
- ✅ Fast execution
- ✅ Reliable results

### Success Criteria
- **Frontend**: 100% component coverage
- **Backend**: 100% controller coverage
- **Integration**: End-to-end flow testing
- **Performance**: Sub-second test execution

## 🚨 Troubleshooting

### Common Issues
1. **Mock not working**: Check mock setup
2. **Async test failing**: Use `waitFor`
3. **Coverage low**: Add more test cases
4. **Slow tests**: Optimize test setup

### Solutions
1. **Clear cache**: `npm test -- --clearCache`
2. **Update mocks**: Check mock implementations
3. **Add timeouts**: Use `testTimeout`
4. **Debug mode**: Use `--verbose` flag

---

**🎯 Goal**: Ensure all functions work as expected with comprehensive test coverage!
