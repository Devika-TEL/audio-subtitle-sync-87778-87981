import { render, screen } from '@testing-library/react';
import App from './App';

test('renders subtitle repositioning title', () => {
  render(<App />);
  const title = screen.getByText(/Subtitle Repositioning/i);
  expect(title).toBeInTheDocument();
});
