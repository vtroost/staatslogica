import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string; // Optional for last item (current page)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: 'light' | 'dark' | 'compact' | 'yellow'; // Added yellow variant for yellow backgrounds
}

export default function Breadcrumb({ items, className = '', variant = 'light' }: BreadcrumbProps) {
  if (variant === 'compact' || variant === 'yellow') {
    const isYellow = variant === 'yellow';
    const textColor = isYellow ? 'text-black text-opacity-80 hover:text-black' : 'text-gray-600 hover:text-gray-900';
    const currentPageColor = isYellow ? 'text-black font-medium' : 'text-gray-900 font-medium';
    const separatorColor = isYellow ? 'text-black text-opacity-50' : 'text-gray-400';
    
    return (
      <nav className={`flex items-center space-x-2 text-sm py-3 px-4 ${className}`} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {/* Add separator before each item except the first */}
              {index > 0 && (
                <svg 
                  className={`w-4 h-4 mx-2 ${separatorColor}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              
              {item.href ? (
                <Link 
                  href={item.href}
                  className={`${textColor} transition-colors hover:underline`}
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className={index === items.length - 1 
                    ? currentPageColor
                    : textColor.split(' hover:')[0]
                  }
                  aria-current={index === items.length - 1 ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Original light/dark variants for yellow header sections
  const textColors = variant === 'light' 
    ? "text-white hover:text-white" 
    : "text-gray-700 hover:text-gray-900";
    
  const currentPageColor = variant === 'light' 
    ? "text-white font-medium" 
    : "text-gray-900 font-medium";
    
  const separatorColor = variant === 'light' 
    ? "text-white text-opacity-80" 
    : "text-gray-400";

  const containerStyles = variant === 'light'
    ? "bg-black bg-opacity-25 backdrop-blur-sm rounded-lg px-4 py-2"
    : "";

  return (
    <nav className={`flex items-center space-x-2 text-sm ${containerStyles} ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {/* Add separator before each item except the first */}
            {index > 0 && (
              <svg 
                className={`w-4 h-4 mx-2 ${separatorColor}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            
            {/* If href exists and it's not the last item, make it a link */}
            {item.href ? (
              <Link 
                href={item.href}
                className={`${textColors} transition-colors hover:underline`}
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className={index === items.length - 1 
                  ? currentPageColor
                  : textColors.split(' hover:')[0] // Remove hover states for non-links
                }
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 