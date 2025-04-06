/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // New modern color system
        'navy': {
          dark: '#121A29',   // Deep navy background
          DEFAULT: '#1A2332', // Slightly lighter content areas
          light: '#293344',   // Lighter navy for hover states
        },
        'accent': {
          blue: '#2C7EF8',     // Bright blue primary accent
          teal: '#40CBBC',     // Secondary teal accent
          amber: '#FFAA2B',    // Warning color
          red: '#F44A6C',      // Error color
        },
        'text': {
          white: '#FFFFFF',     // Primary text in dark mode
          gray: '#B0B8C4',      // Secondary text in dark mode
          dark: '#121A29',      // Primary text in light mode
          muted: '#6B7280',     // Secondary text in light mode
        },
        // Preserve compatibility with existing styles
        border: "oklch(var(--color-border))",
        input: "oklch(var(--color-input))",
        ring: "oklch(var(--color-ring))",
        background: "oklch(var(--color-background))",
        foreground: "oklch(var(--color-foreground))",
        primary: {
          DEFAULT: "oklch(var(--color-primary))",
          foreground: "oklch(var(--color-primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--color-secondary))",
          foreground: "oklch(var(--color-secondary-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--color-muted))",
          foreground: "oklch(var(--color-muted-foreground))",
        },
        accent: {
          DEFAULT: "oklch(var(--color-accent))",
          foreground: "oklch(var(--color-accent-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--color-destructive))",
          foreground: "oklch(var(--color-destructive-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--color-card))",
          foreground: "oklch(var(--color-card-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--color-popover))",
          foreground: "oklch(var(--color-popover-foreground))",
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--foreground)',
            a: {
              color: 'var(--primary)',
              '&:hover': {
                color: 'color-mix(in oklch, var(--primary), black 10%)',
              },
            },
            h1: {
              color: 'var(--foreground)',
            },
            h2: {
              color: 'var(--foreground)',
            },
            h3: {
              color: 'var(--foreground)',
            },
            h4: {
              color: 'var(--foreground)',
            },
            strong: {
              color: 'var(--foreground)',
            },
            code: {
              color: 'var(--foreground)',
              backgroundColor: 'var(--muted)',
              borderRadius: '0.25rem',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
            },
            pre: {
              backgroundColor: 'var(--muted)',
              color: 'var(--muted-foreground)',
            },
            blockquote: {
              color: 'var(--muted-foreground)',
              borderLeftColor: 'var(--border)',
            },
            hr: {
              borderColor: 'var(--border)',
            },
            ul: {
              li: {
                '&::marker': {
                  color: 'var(--muted-foreground)',
                },
              },
            },
            ol: {
              li: {
                '&::marker': {
                  color: 'var(--muted-foreground)',
                },
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 