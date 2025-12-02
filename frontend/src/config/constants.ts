export const UI_CONSTANTS = {
  IMAGES: {
    LOGO_PATH: '/image.png',
    LOGO_ALT: 'Tesa logo',
  },

  LOGO: {
    ALT: 'tesa logo',
  },

  FORM: {
    TYPES: {
      EMAIL: 'email',
      PASSWORD: 'password',
      TEXT: 'text',
    },
    IDS: {
      EMAIL: 'email',
      PASSWORD: 'password',
    },
  },

  ICON_SIZES: {
    SMALL: 20,
    MEDIUM: 24,
  },

  LANGUAGE: {
    CODES: {
      GERMAN: 'de',
      ENGLISH: 'en',
    },
    LABELS: {
      GERMAN: 'DE',
      ENGLISH: 'EN',
    },
  },

  BUTTON_LABELS: {
    AZURE_AD_SIGNIN: 'Sign in with Azure AD',
  },

  TEXT: {
    OR_DIVIDER: 'or',
    TAG_PREFIX: '#',
    BY_PREFIX: 'By',
    DEPARTMENT_SEPARATOR: '–',
  },

  SLICE_LIMITS: {
    MAX_TAGS_DISPLAY: 3,
  },
} as const;

export const STYLE_CONSTANTS = {
  COLORS: {
    PRIMARY_RED: '#E30613',
    PRIMARY_RED_HOVER: '#c00510',
    BACKGROUND_GRAY: '#f5f5f5',
    BACKGROUND_LIGHT_GRAY: '#f2f2f2',
    TEXT_GRAY: 'gray-600',
    TEXT_SLATE: 'slate-400',
    TEXT_BLUE: 'blue-600',
  },

  CLASS_NAMES: {
    MODAL_OVERLAY: 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4',
    MODAL_CONTAINER: 'bg-white rounded-2xl shadow-2xl w-full max-w-md relative',
    CLOSE_BUTTON: 'absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors',
    HEADING: 'text-3xl font-bold text-slate-800 text-center mb-8',
    FORM_LABEL: 'block text-sm font-medium text-slate-700 mb-2',
    INPUT_FIELD: 'w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
    ERROR_BOX: 'bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm',
    PRIMARY_BUTTON: 'w-full bg-[#E30613] hover:bg-[#c00510] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    SECONDARY_BUTTON: 'w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2',
    DIVIDER_LINE: 'w-full border-t border-slate-300',
    DIVIDER_TEXT: 'px-4 bg-white text-slate-500',
    LINK_BUTTON: 'text-blue-600 hover:text-blue-700 text-sm transition-colors',
    PASSWORD_TOGGLE: 'absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors',
  },

  SPACING: {
    FORM: 'space-y-6',
    MODAL_PADDING: 'p-8',
    LOGO_HEIGHT: 'h-16',
    HEADER_LOGO_HEIGHT: 'h-12',
    LOGO_MARGIN: 'mb-6',
  },

  ANIMATION: {
    PULSE_DELAY_HALF: '0.5s',
    PULSE_DELAY_ONE: '1s',
    PULSE_DELAY_ONE_HALF: '1.5s',
    PULSE_DELAY_TWO: '2s',
  },
} as const;

export const EMAIL_CONSTANTS = {
  SUPPORT_EMAIL: 'ai-transformation@tesa.com',
} as const;

export const CONSOLE_MESSAGES = {
  AZURE_AD_CLICKED: 'Azure AD login clicked',
} as const;

export const DEPARTMENTS = ['Marketing', 'R&D', 'Procurement', 'IT', 'HR', 'Operations'] as const;

export const STATUS_SEQUENCE = ['Ideation', 'Pre-Evaluation', 'Evaluation', 'PoC', 'MVP', 'Live', 'Archived'] as const;

export const DEFAULT_VALUES = {
  DEPARTMENT: 'IT' as const,
  STATUS: 'Ideation' as const,
  EMPTY_STRING: '',
  EMPTY_ARRAY: [] as string[],
  EMPTY_OBJECT: {} as Record<string, any>,
  STEP: {
    INITIAL: 1,
    TOTAL: 4,
  },
} as const;

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
} as const;

export const ROLE_ATTRIBUTES = {
  BUTTON: 'button',
} as const;

export const TAB_INDEX = {
  FOCUSABLE: 0,
} as const;
