"use client";

import type * as React from "react";

import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/utils/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        `
          text-sm leading-none font-medium select-none
          group-data-[disabled=true]:pointer-events-none
          group-data-[disabled=true]:opacity-50
          peer-disabled:cursor-not-allowed peer-disabled:opacity-50
        `,
        className,
      )}
      data-slot="label"
      {...(props as any)}
    />
  );
}

export { Label };
