import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        panel: '#101624',
        panelSoft: '#1A2337',
      },
      boxShadow: {
        glow: '0 10px 40px rgba(37, 99, 235, 0.35)',
      },
      backgroundImage: {
        aura:
          'radial-gradient(circle at 15% 20%, rgba(56,189,248,.32), transparent 35%), radial-gradient(circle at 85% 10%, rgba(99,102,241,.32), transparent 30%), radial-gradient(circle at 50% 90%, rgba(34,197,94,.24), transparent 30%)',
      },
    },
  },
  plugins: [],
};
export default config;
