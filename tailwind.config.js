/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './routes/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1600px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1400px',
      '3xl': '1600px',
      '4xl': '1920px',
      '5xl': '2560px',
      '6xl': '3440px',
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      // Custom typography styles for Vapourism blog
      typography: {
        DEFAULT: {
          css: {
            // Base text styling
            color: 'rgb(51 65 85)', // slate-700
            maxWidth: 'none',
            // Headings
            'h1, h2, h3, h4': {
              color: 'rgb(15 23 42)', // slate-900
              fontWeight: '700',
            },
            h1: {
              fontSize: '2.25rem',
              marginBottom: '1.5rem',
              marginTop: '3rem',
              lineHeight: '1.2',
            },
            h2: {
              fontSize: '1.875rem',
              marginBottom: '1.25rem',
              marginTop: '2.5rem',
              lineHeight: '1.3',
            },
            h3: {
              fontSize: '1.5rem',
              marginBottom: '1rem',
              marginTop: '2rem',
              lineHeight: '1.4',
            },
            h4: {
              fontSize: '1.25rem',
              marginBottom: '0.75rem',
              marginTop: '1.5rem',
            },
            // Paragraphs
            p: {
              marginBottom: '1.5rem',
              lineHeight: '1.8',
              fontSize: '1.125rem',
            },
            // Links with Vapourism violet branding
            a: {
              color: 'rgb(124 58 237)', // violet-600
              textDecoration: 'underline',
              textDecorationThickness: '2px',
              textUnderlineOffset: '2px',
              fontWeight: '500',
              transition: 'color 0.15s ease-in-out',
              '&:hover': {
                color: 'rgb(109 40 217)', // violet-700
              },
            },
            // Product links (internal links to collections/products)
            'a[href^="/collections"], a[href^="/products"], a[href^="/search"]': {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'rgb(124 58 237)', // violet-600
              fontWeight: '600',
              '&:hover': {
                color: 'rgb(109 40 217)', // violet-700
              },
            },
            // Strong emphasis
            strong: {
              color: 'rgb(15 23 42)', // slate-900
              fontWeight: '600',
            },
            // Emphasis
            em: {
              color: 'rgb(71 85 105)', // slate-600
              fontStyle: 'italic',
            },
            // Lists
            ul: {
              listStyleType: 'disc',
              marginLeft: '1.5rem',
              marginBottom: '1.5rem',
            },
            ol: {
              listStyleType: 'decimal',
              marginLeft: '1.5rem',
              marginBottom: '1.5rem',
            },
            li: {
              marginBottom: '0.5rem',
              lineHeight: '1.8',
              fontSize: '1.125rem',
            },
            'ul > li::marker': {
              color: 'rgb(124 58 237)', // violet-600
            },
            'ol > li::marker': {
              color: 'rgb(124 58 237)', // violet-600
              fontWeight: '600',
            },
            // Nested lists
            'ul ul, ol ol, ul ol, ol ul': {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            // Blockquotes with Vapourism branding
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: 'rgb(139 92 246)', // violet-500
              paddingLeft: '1.5rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              fontStyle: 'italic',
              color: 'rgb(71 85 105)', // slate-600
              backgroundColor: 'rgb(248 250 252)', // slate-50
              borderRadius: '0 0.5rem 0.5rem 0',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            'blockquote p': {
              marginBottom: '0',
            },
            // Code blocks
            code: {
              backgroundColor: 'rgb(241 245 249)', // slate-100
              paddingLeft: '0.375rem',
              paddingRight: '0.375rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              color: 'rgb(30 41 59)', // slate-800
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'rgb(15 23 42)', // slate-900
              color: 'rgb(241 245 249)', // slate-100
              borderRadius: '0.75rem',
              padding: '1rem',
              overflowX: 'auto',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              color: 'inherit',
            },
            // Tables with branded styling
            table: {
              width: '100%',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              borderCollapse: 'collapse',
              fontSize: '0.9375rem',
            },
            thead: {
              borderBottomWidth: '2px',
              borderBottomColor: 'rgb(203 213 225)', // slate-300
            },
            'thead th': {
              backgroundColor: 'rgb(248 250 252)', // slate-50
              padding: '0.75rem 1rem',
              textAlign: 'left',
              fontWeight: '600',
              color: 'rgb(15 23 42)', // slate-900
              borderWidth: '1px',
              borderColor: 'rgb(226 232 240)', // slate-200
            },
            'thead th:first-child': {
              borderTopLeftRadius: '0.5rem',
            },
            'thead th:last-child': {
              borderTopRightRadius: '0.5rem',
            },
            'tbody td': {
              padding: '0.75rem 1rem',
              borderWidth: '1px',
              borderColor: 'rgb(226 232 240)', // slate-200
              color: 'rgb(51 65 85)', // slate-700
            },
            'tbody tr': {
              transition: 'background-color 0.15s ease-in-out',
            },
            'tbody tr:hover': {
              backgroundColor: 'rgb(248 250 252)', // slate-50
            },
            'tbody tr:nth-child(even)': {
              backgroundColor: 'rgb(249 250 251)', // gray-50
            },
            'tbody tr:nth-child(even):hover': {
              backgroundColor: 'rgb(243 244 246)', // gray-100
            },
            'tbody tr:last-child td:first-child': {
              borderBottomLeftRadius: '0.5rem',
            },
            'tbody tr:last-child td:last-child': {
              borderBottomRightRadius: '0.5rem',
            },
            // Images
            img: {
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
              marginTop: '2rem',
              marginBottom: '2rem',
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
            },
            // Figure and figcaption for image captions
            figure: {
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            figcaption: {
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'rgb(100 116 139)', // slate-500
              marginTop: '0.75rem',
            },
            // Horizontal rules
            hr: {
              borderColor: 'rgb(203 213 225)', // slate-300
              marginTop: '2.5rem',
              marginBottom: '2.5rem',
            },
            // Video embeds
            video: {
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
              marginTop: '2rem',
              marginBottom: '2rem',
              width: '100%',
            },
            // Iframe embeds (YouTube, etc.)
            iframe: {
              borderRadius: '0.75rem',
              marginTop: '2rem',
              marginBottom: '2rem',
              width: '100%',
              aspectRatio: '16 / 9',
            },
          },
        },
        // Large variant for article pages
        lg: {
          css: {
            fontSize: '1.125rem',
            h1: {
              fontSize: '2.5rem',
            },
            h2: {
              fontSize: '2rem',
            },
            h3: {
              fontSize: '1.625rem',
            },
            p: {
              fontSize: '1.125rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    import('@tailwindcss/typography').then((mod) => mod.default ?? mod),
    import('tailwindcss-animate').then((mod) => mod.default ?? mod),
  ],
};
