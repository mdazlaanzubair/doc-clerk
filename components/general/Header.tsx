"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const Header = () => {
  const currentPath = usePathname();
  const navigation = [
    {
      title: "Invoices",
      url: "/invoices",
    },
    {
      title: "Contracts",
      url: "/contact",
    },
    {
      title: "Guide",
      url: "/guide",
    },
  ];

  return (
    <header className="w-full border-b border-black/10 px-3">
      <div className="max-w-4xl flex items-center justify-between gap-5 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          {/* <Image
              className="text-black"
              src={logo.src}
              width={24}
              height={24}
              alt="logo"
            /> */}
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            DocClerk
          </h1>
        </Link>
        <div className="flex items-center">
          <SignedIn>
            <Link
              href="/dashboard"
              className={`text-sm font-medium border-b-2 py-4 px-5 ${
                currentPath === "/dashboard"
                  ? "text-primary border-primary"
                  : "text-muted-foreground/70 border-transparent"
              } hover:border-muted-foreground/50 hover:text-primary-foreground transition-all ease-in-out duration-300`}
            >
              Dashboard
            </Link>
          </SignedIn>
          {navigation.map((link) => (
            <Link
              key={link.title}
              href={link.url}
              className={`text-sm font-medium border-b-2 py-4 px-5 ${
                currentPath === link.url
                  ? "text-primary border-primary"
                  : "text-muted-foreground/70 border-transparent hover:border-muted-foreground/50 hover:text-primary-foreground"
              } transition-all ease-in-out duration-300`}
            >
              {link.title}
            </Link>
          ))}
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="default" size="default">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
