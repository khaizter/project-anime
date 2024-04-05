import React, { ReactNode } from "react";

interface WrapperProps {
  className?: String;
  children: ReactNode;
}

const Wrapper = (props: WrapperProps) => {
  return (
    <div className={`max-w-7xl px-8 mx-auto ` + props.className}>
      {props.children}
    </div>
  );
};

export default Wrapper;
