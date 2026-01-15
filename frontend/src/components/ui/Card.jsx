export default function Card({ children, className = '', title, actions }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export function StatCard({ label, value, icon, color = 'blue', to }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-teal-50 text-teal-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const cardContent = (
    <Card className={`group ${to ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {value}
          </p>
        </div>

        <div
          className={`
            ${colors[color]}
            p-3 rounded-lg
            group-hover:scale-105 transition-transform
          `}
        >
          {icon}
        </div>
      </div>
    </Card>
  );

  if (to) {
    return <Link to={to}>{cardContent}</Link>;
  }

  return cardContent;
}
