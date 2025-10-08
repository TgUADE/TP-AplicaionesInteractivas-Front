const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'gray',
  text = '',
  className = '' 
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colors = {
    gray: 'border-gray-300 border-t-gray-800',
    blue: 'border-blue-300 border-t-blue-600',
    white: 'border-gray-200 border-t-white'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`
          ${sizes[size]} 
          border-2 
          ${colors[color]} 
          rounded-full 
          animate-spin
        `}
      />
      {text && (
        <p className={`mt-3 text-gray-600 ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;