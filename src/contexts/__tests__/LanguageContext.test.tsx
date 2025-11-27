import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../LanguageContext';

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide language context with default language', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current.language).toBe('en');
    expect(result.current.translations).toBeDefined();
  });

  it('should switch language to German', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.setLanguage('de');
    });

    expect(result.current.language).toBe('de');
    expect(localStorage.getItem('language')).toBe('de');
  });

  it('should switch language to English', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.setLanguage('de');
    });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
    expect(localStorage.getItem('language')).toBe('en');
  });

  it('should restore language from localStorage', () => {
    localStorage.setItem('language', 'de');

    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.language).toBe('de');
  });

  it('should provide correct translations for English', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.translations.welcomeTitle).toBeDefined();
    expect(typeof result.current.translations.welcomeTitle).toBe('string');
  });

  it('should provide correct translations for German', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.setLanguage('de');
    });

    expect(result.current.translations.welcomeTitle).toBeDefined();
    expect(typeof result.current.translations.welcomeTitle).toBe('string');
  });
});
