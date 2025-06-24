import { cn } from "@/lib/utils";
import React from "react";
interface IProps {
  children?: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}
const CardGraphic: React.FC<IProps> = ({
  children,
  subtitle,
  title,
  className,
}) => {
  return (
    <div className={cn("p-4 bg-white rounded-lg shadow", className)}>
      <div>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-4">{subtitle}</p>
        <div className="h-[2px] w-full bg-gray-200 mb-2"></div>
      </div>
      {children}
    </div>
  );
};

export default CardGraphic;
