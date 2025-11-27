import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { LanguageProvider } from '../../contexts/LanguageContext';

describe('Footer', () => {
  it('should render footer content', () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  it('should render footer with proper styling', () => {
    const { container } = render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );

    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });
});
