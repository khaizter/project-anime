import React, { Fragment } from "react";
import MainHeader from "@/components/layout/main-header";

import { spaceGrotesk, rajdhani, majorMonoDisplay } from "@/lib/fonts";

const Layout = (props: any) => {
  return (
    <div className={`${spaceGrotesk} ${rajdhani} ${majorMonoDisplay}`}>
      <MainHeader />
      <main className="font-rajdhani text-slate-100 bg-gradient-to-b from-kingfisher-daisy to-black">
        {props.children}
      </main>
    </div>
  );
};

export default Layout;
