import { render, screen } from '@testing-library/react';
import { ChatInterface } from '@/components/ChatInterface';

describe('ChatInterface', () => {
  it('renders without crashing', () => {
    render(<ChatInterface />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows send button', () => {
    render(<ChatInterface />);
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
});
