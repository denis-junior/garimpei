import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      {action && <div className="mt-4 md:mt-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
