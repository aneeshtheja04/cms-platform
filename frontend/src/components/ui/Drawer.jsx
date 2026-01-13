export default function Drawer({ isOpen, onClose, title, children, width = 'lg', widthPercent }) {
  if (!isOpen) return null;

  const widths = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // If widthPercent is provided, use inline style for percentage-based width
  const drawerStyle = widthPercent ? { width: `${widthPercent}%` } : {};
  const drawerClassName = widthPercent
    ? 'relative bg-white shadow-xl h-full transform transition-transform duration-300 ease-in-out'
    : `relative bg-white shadow-xl ${widths[width]} w-full h-full transform transition-transform duration-300 ease-in-out`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full flex justify-end" style={{ width: widthPercent ? `${widthPercent}%` : 'auto' }}>
        <div
          className={drawerClassName}
          style={drawerStyle}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="h-full overflow-y-auto pb-24">
            <div className="p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
