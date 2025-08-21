import { render, screen } from '@testing-library/react';
import App from './App';

test('renders upload link on home', () => {
  render(<App />);
  const linkElement = screen.getByText(/Upload/i);
  expect(linkElement).toBeInTheDocument();
});
