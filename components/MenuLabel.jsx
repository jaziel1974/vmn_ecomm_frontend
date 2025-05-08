"use client";

import Icon from "@/src/components/Icon";
import { useState } from "react";

export default function MenuLabel() {
  const [mobileNavActive, setMobileNavActive] = useState(false);

  const handleClick = () => setMobileNavActive(!mobileNavActive);

  return (
    <label
      htmlFor="navi-toggle"
      onClick={handleClick}
      className="fixed top-2 right-2 rounded-full 
        h-12 w-12 cursor-pointer z-1000 shadow-lg 
        text-center bg-background md:hidden"
    >
      <Icon clicked={mobileNavActive}></Icon>
    </label>
  );
}
