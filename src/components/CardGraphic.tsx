import { cn } from "@/lib/utils";
import React from "react";
interface IProps {
  children?: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
  action?: React.ReactNode;
}
const CardGraphic: React.FC<IProps> = ({
  children,
  subtitle,
  title,
  className,
  action,
}) => {
  return (
    <div
      className={cn(
        "p-4 bg-white rounded-lg shadow h-fit flex flex-col",
        className
      )}
    >
      <div>
        <div className="flex flex-col mb-4 justify-between items-center md:flex-row md:items-start  ">
          <div>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <p className="text-gray-600 mb-4">{subtitle}</p>
          </div>
          <div>{action}</div>
        </div>
        <div className="h-[2px] w-full bg-gray-200 mb-2"></div>
      </div>
      {children}
    </div>
  );
};

export default CardGraphic;
