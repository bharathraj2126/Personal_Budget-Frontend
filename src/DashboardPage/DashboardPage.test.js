// Dashboard.test.js
import { calculateDifferenceForCategoryAndMonth } from './DashboardPage';

const dataSource = {
  datasets: [
    {
      data: [100, 200, 300],
      backgroundColor: ['red', 'green', 'blue'],
      expense: [10, 20, 30],
      month: ['jan', 'feb', 'mar'], 
    },
  ],
  labels: ['category1', 'category2', 'category3'],
};

test('calculates difference correctly', () => {
  const categoryName = 'category2';
  const month = 'feb';
  const result = calculateDifferenceForCategoryAndMonth(categoryName, month, dataSource);

  // Assuming data for 'category2' in 'feb' is 200 - 20 = 180
  expect(result).toEqual(180);
});

test('handles category not found', () => {
  const categoryName = 'unknownCategory';
  const month = 'feb';
  const result = calculateDifferenceForCategoryAndMonth(categoryName, month, dataSource);

  // Expecting null for an unknown category
  expect(result).toBeNull();
});

test('handles month not found for the given category', () => {
  const categoryName = 'category1';
  const month = 'dec';
  const result = calculateDifferenceForCategoryAndMonth(categoryName, month, dataSource);

  // Expecting null if the month is not found for the given category
  expect(result).toBeNull();
});

test('handles category and month not matching', () => {
  const categoryName = 'category1';
  const month = 'feb';
  const result = calculateDifferenceForCategoryAndMonth(categoryName, month, dataSource);

  // Expecting null if the category and month don't match
  expect(result).toBeNull();
});