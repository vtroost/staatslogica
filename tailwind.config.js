/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Adjusted to include mdx
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom typography theme extensions
      typography: {
        DEFAULT: {
          css: {
            'h2, h3, h4, h5, h6': {
              color: '#111827', // Default heading color (gray-900)
              fontWeight: '600',
            },
            h2: {
              marginTop: '2.5rem',
              marginBottom: '1rem',
              fontSize: '1.5rem', // Equivalent to text-2xl
            },
            h3: {
              marginTop: '2rem',
              marginBottom: '0.75rem',
              fontSize: '1.25rem', // Equivalent to text-xl
              fontWeight: '500', // Slightly less bold than h2
              color: '#1f2937', // gray-800
            },
            p: {
              marginTop: '1.25rem', // Add top margin for spacing
              marginBottom: '1.25rem',
              lineHeight: '1.7', // Improve readability
            },
            blockquote: {
              borderLeftWidth: '0.25rem', // Equivalent to border-l-4
              borderLeftColor: '#d1d5db', // gray-300
              color: '#4b5563', // gray-600
              fontStyle: 'italic',
              paddingLeft: '1rem',
              marginTop: '1.6rem', // Adjust spacing
              marginBottom: '1.6rem',
            },
            code: {
              backgroundColor: '#f3f4f6', // gray-100
              color: '#dd1144', // Example accent color for code
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
              fontWeight: '400',
            },
            'code::before': {
              content: '""', // Remove default backticks
            },
            'code::after': {
              content: '""', // Remove default backticks
            },
            a: {
              color: '#000000', // Black links in prose
              textDecoration: 'underline',
              '&:hover': {
                color: '#555555', // Dark gray hover
              },
            },
            // Add other element styles as needed (ul, ol, li, etc.)
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 