/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
              fontWeight: '700',
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
              color: '#374151', // text-gray-700 (was black)
              textDecoration: 'underline',
              fontWeight: '500', // Add slightly more weight
              '&:hover': {
                color: '#000000', // black hover (was dark gray)
              },
            },
            strong: {
              color: 'inherit', // Ensure bold text uses parent color
              fontWeight: '600', // Default is often 700, 600 is slightly softer
            },
            ul: {
              listStyleType: 'disc',
              marginTop: '1.25em',
              marginBottom: '1.25em',
              paddingLeft: '1.625em',
            },
            ol: {
              listStyleType: 'decimal',
              marginTop: '1.25em',
              marginBottom: '1.25em',
              paddingLeft: '1.625em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'ul > li::marker': { // Style list markers
              color: '#6b7280', // gray-500
            },
            'ol > li::marker': { // Style list markers
              color: '#6b7280', // gray-500
            },
            // Add other element styles as needed (ul, ol, li, etc.)
          },
        },
        lg: { // Target the prose-lg variant
          css: {
            h2: {
              fontWeight: 'bold', // Ensure h2 is bold
              // You can add other h2 styles here if needed
            },
            // You could add customizations for other elements here too
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 