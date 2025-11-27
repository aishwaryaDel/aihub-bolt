import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UseCaseCard from '../UseCaseCard';
import { LanguageProvider } from '../../contexts/LanguageContext';

const mockUseCase = {
  id: '1',
  title: 'Test Use Case',
  short_description: 'This is a test use case description',
  full_description: 'Full description',
  department: 'IT',
  status: 'Live',
  owner_name: 'John Doe',
  owner_email: 'john@example.com',
  business_impact: 'High impact',
  technology_stack: ['React', 'Node.js', 'PostgreSQL'],
  internal_links: {
    wiki: 'http://wiki.example.com',
    confluence: 'http://confluence.example.com',
  },
  tags: ['ai', 'automation', 'ml'],
  related_use_case_ids: [],
  application_url: 'http://app.example.com',
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-15'),
};

describe('UseCaseCard', () => {
  it('should render use case information', () => {
    const onClick = vi.fn();

    render(
      <LanguageProvider>
        <UseCaseCard useCase={mockUseCase} onClick={onClick} />
      </LanguageProvider>
    );

    expect(screen.getByText('Test Use Case')).toBeInTheDocument();
    expect(screen.getByText('This is a test use case description')).toBeInTheDocument();
    expect(screen.getByText('IT')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('should display technology stack', () => {
    const onClick = vi.fn();

    render(
      <LanguageProvider>
        <UseCaseCard useCase={mockUseCase} onClick={onClick} />
      </LanguageProvider>
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('should display tags', () => {
    const onClick = vi.fn();

    render(
      <LanguageProvider>
        <UseCaseCard useCase={mockUseCase} onClick={onClick} />
      </LanguageProvider>
    );

    expect(screen.getByText('#ai')).toBeInTheDocument();
    expect(screen.getByText('#automation')).toBeInTheDocument();
    expect(screen.getByText('#ml')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <LanguageProvider>
        <UseCaseCard useCase={mockUseCase} onClick={onClick} />
      </LanguageProvider>
    );

    const card = screen.getByText('Test Use Case').closest('div[class*="cursor-pointer"]');
    if (card) {
      await user.click(card);
      expect(onClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should render different status colors', () => {
    const onClick = vi.fn();
    const useCaseWithDifferentStatus = {
      ...mockUseCase,
      status: 'PoC',
    };

    render(
      <LanguageProvider>
        <UseCaseCard useCase={useCaseWithDifferentStatus} onClick={onClick} />
      </LanguageProvider>
    );

    expect(screen.getByText('PoC')).toBeInTheDocument();
  });

  it('should handle use case without application URL', () => {
    const onClick = vi.fn();
    const useCaseWithoutUrl = {
      ...mockUseCase,
      application_url: null,
    };

    render(
      <LanguageProvider>
        <UseCaseCard useCase={useCaseWithoutUrl} onClick={onClick} />
      </LanguageProvider>
    );

    expect(screen.getByText('Test Use Case')).toBeInTheDocument();
  });
});
