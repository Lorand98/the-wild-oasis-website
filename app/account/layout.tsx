import { ReactNode } from "react";
import SideNavigation from "../_components/SideNavigation";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap12">
      <SideNavigation />
      <div className="py-1">{children}</div>
    </div>
  );
}
