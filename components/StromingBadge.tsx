interface StromingBadgeProps {
  stroming: {
    name: string;
    color: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

export default function StromingBadge({ stroming, size = 'md' }: StromingBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${stroming.color} ${sizeClasses[size]}`}>
      {stroming.name}
    </span>
  );
} 