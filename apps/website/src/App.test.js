import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const nameElement = screen.getByText(/Loot 3D Characters/i);
  expect(nameElement).toBeInTheDocument();
});
