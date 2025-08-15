"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

type SupabaseContext = {
  supabase: SupabaseClient | null;
};

type ProviderProps = {
  children: ReactNode;
};

const Context = createContext<SupabaseContext>({
  supabase: null,
});

const configs = {
  supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  jwt_template: "supabase-jwt-template",
};

export default function SupabaseProvider({ children }: ProviderProps) {
  const { session } = useSession();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  // Function to create supabase-clerk client
  const createClerkSupabaseClient = () => {
    return createClient(configs.supabase_url, configs.supabase_key, {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await session?.getToken({
            template: configs.jwt_template,
          });
          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);
          return fetch(url, { ...options, headers });
        },
      },
    });
  };

  useEffect(() => {
    if (!session) return;
    console.log("Client is loading!");
    const client = createClerkSupabaseClient();
    console.log("Client is loaded!");
    setSupabase(client);
  }, [session]);

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return {
    supabase: context.supabase,
  };
};
