"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      title="Toggle Dark Mode"
      variant="ghost"
      size="icon"
      className="overflow-hidden"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun
        className={` ${
          theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"
        } transition-all duration-300 ease-in-out`}
      />
      <Moon
        className={`absolute ${
          theme === "dark" ? "scale-0 rotate-90" : "scale-100 rotate-0"
        } transition-all duration-300 ease-in-out`}
      />
    </Button>
  );
}
