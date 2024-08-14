import { Package } from "lucide-react";
import React from "react";

const EmptyBox = () => {
  return (
    <div className="flex flex-col items-center">
      <Package className="w-32 h-32" color="#B43E8F" />
      <div className="font-space-grotesk ">No results found.</div>
    </div>
  );
};

export default EmptyBox;
