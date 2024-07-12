import React, { Fragment, useEffect } from "react";
import MainHeader from "@/components/layout/main-header";

import { spaceGrotesk, rajdhani, majorMonoDisplay } from "@/lib/fonts";

const Layout = (props: any) => {
  useEffect(() => {
    console.log("layout");
  }, []);
  return (
    <div className={`${spaceGrotesk} ${rajdhani} ${majorMonoDisplay}`}>
      <MainHeader />
      <main className="font-rajdhani text-slate-100 bg-gradient-to-b from-jacaranda to-black">
        {props.children}
      </main>
    </div>
  );
};

export default Layout;
