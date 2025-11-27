import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitcher from '../LanguageSwitcher';
import { LanguageProvider } from '../../contexts/LanguageContext';

describe('LanguageSwitcher', () => {
  it('should render language switcher buttons', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('DE')).toBeInTheDocument();
  });

  it('should highlight active language', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const enButton = screen.getByText('EN');
    expect(enButton.className).toContain('bg-blue-600');
  });

  it('should switch to German when DE is clicked', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const deButton = screen.getByText('DE');
    await user.click(deButton);

    expect(deButton.className).toContain('bg-blue-600');
  });

  it('should switch between languages', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const deButton = screen.getByText('DE');
    const enButton = screen.getByText('EN');

    await user.click(deButton);
    expect(deButton.className).toContain('bg-blue-600');

    await user.click(enButton);
    expect(enButton.className).toContain('bg-blue-600');
  });
});
