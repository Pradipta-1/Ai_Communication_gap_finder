/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chassis: '#e0e5ec',             // Level 0 Base plastic
        background: '#e0e5ec',          // Level 0
        panel: '#f0f2f5',               // Level +1 Raised panel
        card: '#e0e5ec',                // Level +1 Card surface
        recessed: '#d1d9e6',            // Level -1 Sunken/recessed areas
        muted: '#4a5568',
        'muted-foreground': '#4a5568',  // WCAG AA compliant labels
        'text-primary': '#2d3436',      // Dark charcoal ink
        foreground: '#2d3436',
        accent: '#ff4757',              // Safety Orange / Braun Red
        'accent-hover': '#e03646',
        'accent-foreground': '#ffffff',
        'border-shadow': '#babecc',     // Darker neumorphic shadow
        'border-light': '#ffffff',      // Light neumorphic highlight
        'border-dark': '#a3b1c6',       // Deep divider/groove
        border: '#a3b1c6',
        input: '#d1d9e6',
        ring: '#ff4757',
        destructive: '#ff4757',
        warning: '#f59e0b',
        success: '#22c55e',
        info: '#0984e3',
        // Dark technical panels
        'tech-panel': '#2d3436',
        'tech-slate': '#2c3e50',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
        tech: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'card': '8px 8px 16px #babecc, -8px -8px 16px #ffffff',
        'floating': '12px 12px 24px #babecc, -12px -12px 24px #ffffff, inset 1px 1px 0 rgba(255,255,255,0.5)',
        'pressed': 'inset 6px 6px 12px #babecc, inset -6px -6px 12px #ffffff',
        'recessed': 'inset 4px 4px 8px #babecc, inset -4px -4px 8px #ffffff',
        'sharp': '4px 4px 8px rgba(0,0,0,0.15), -1px -1px 1px rgba(255,255,255,0.8)',
        'glow': '0 0 10px 2px rgba(255, 71, 87, 0.6)',
        'glow-green': '0 0 10px 2px rgba(34, 197, 94, 0.7)',
        'btn-accent': '4px 4px 8px rgba(166,50,60,0.4), -4px -4px 8px rgba(255,100,110,0.4)',
        'btn-accent-pressed': 'inset 4px 4px 8px rgba(130,30,40,0.5), inset -4px -4px 8px rgba(255,120,130,0.3)',
        // Backward-compatible fallback aliases
        'neon': '8px 8px 16px #babecc, -8px -8px 16px #ffffff',
        'neon-sm': '4px 4px 8px #babecc, -4px -4px 8px #ffffff',
        'soft': '8px 8px 16px #babecc, -8px -8px 16px #ffffff',
        'soft-lg': '12px 12px 24px #babecc, -12px -12px 24px #ffffff',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '30px',
      },
      transitionTimingFunction: {
        'mechanical': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}
