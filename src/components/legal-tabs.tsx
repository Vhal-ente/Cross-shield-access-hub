import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";


interface LegalTabsProps {
  className?: string;
}

const LegalTabs: React.FC<LegalTabsProps> = ({ className }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="w-full bg-white">
      <Separator className="w-full" />
      <div className="flex items-center space-x-6 bg-transparent border-none px-4 py-4 max-w-7xl md:px-6">
        <Link
          to="/terms"
          className={`text-sm md:text-base font-medium ${
            currentPath === "/terms-of-use"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
          }`}
        >
          Terms & Conditions
        </Link>
        <Link
          to="/privacy-policy"
          className={`text-sm md:text-base font-medium ${
            currentPath === "/privacy-policy"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
          }`}
        >
          Privacy Policy
        </Link>
      </div>
      <Separator className="w-full" />
    </div>
  );
};

export default LegalTabs;
