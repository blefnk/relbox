import type * as React from "react";

import { cn } from "@/utils/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        `
          border-input ring-ring/10 outline-ring/50 flex h-9 w-full min-w-0
          rounded-md border bg-transparent px-3 py-1 text-base shadow-xs
          transition-[color,box-shadow]
          file:text-foreground file:inline-flex file:h-7 file:border-0
          file:bg-transparent file:text-sm file:font-medium
          placeholder:text-muted-foreground
          selection:bg-primary selection:text-primary-foreground
          aria-invalid:outline-destructive/60 aria-invalid:ring-destructive/20
          aria-invalid:border-destructive/60
          aria-invalid:focus-visible:ring-[3px]
          aria-invalid:focus-visible:outline-none
          dark:aria-invalid:outline-destructive
          dark:aria-invalid:ring-destructive/50 dark:ring-ring/20
          dark:outline-ring/40 dark:aria-invalid:border-destructive
          dark:aria-invalid:focus-visible:ring-4
          focus-visible:ring-4 focus-visible:outline-1
          disabled:pointer-events-none disabled:cursor-not-allowed
          disabled:opacity-50
          md:text-sm
        `,
        className,
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
