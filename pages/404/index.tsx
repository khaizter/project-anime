import { Squirrel } from "lucide-react";
import React from "react";

const Page404 = () => {
  return (
    <div className="py-24 md:py-40 flex flex-col items-center">
      <Squirrel className="w-32 h-32" color="#B43E8F" />
      <div className="font-rajdhani text-medium-red-violet">Error 404</div>
      <div className="font-space-grotesk ">Page not found.</div>
    </div>
  );
};

export default Page404;
