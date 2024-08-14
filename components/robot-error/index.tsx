import { Bot } from "lucide-react";
import React from "react";

const RobotError = () => {
  return (
    <div className="flex flex-col items-center">
      <Bot className="w-32 h-32" color="#B43E8F" />
      <div className="font-rajdhani text-medium-red-violet">Error 500</div>
      <div className="font-space-grotesk ">Oops! Something went wrong.</div>
    </div>
  );
};

export default RobotError;
