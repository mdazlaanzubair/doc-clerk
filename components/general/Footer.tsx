import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggler";

const Footer = () => {
  const navigation = [
    {
      title: "Terms & Privacy",
      url: "#",
    },
    {
      title: "Blog",
      url: "#",
    },
  ];

  return (
    <footer className="w-full border-t border-black/10 p-3">
      <div className="max-w-4xl flex items-center justify-between mx-auto">
        <p>&copy; 2025 DocClerk. All rights reserved.</p>
        <div className="flex items-center gap-2">
          {navigation.map((link) => (
            <Link key={link.title} href={link.url}>
              <Button
                className="text-primary-foreground"
                variant="link"
                size="sm"
              >
                {link.title}
              </Button>
            </Link>
          ))}
          <ModeToggle />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
