"use client";

import type * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/utils/utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...(props as any)} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...(props as any)} />;
}

function DialogContent({
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          `
            bg-background fixed top-[50%] left-[50%] z-50 grid w-full
            max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4
            rounded-lg border p-6 shadow-lg duration-200
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:animate-in data-[state=open]:fade-in-0
            data-[state=open]:zoom-in-95
            sm:max-w-lg
          `,
          className,
        )}
        data-slot="dialog-content"
        {...(props as any)}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className={`
              ring-offset-background absolute top-4 right-4 rounded-xs
              opacity-70 transition-opacity
              focus:ring-ring focus:ring-2 focus:ring-offset-2
              focus:outline-hidden
              data-[state=open]:bg-accent
              data-[state=open]:text-muted-foreground
              hover:opacity-100
              disabled:pointer-events-none
              [&_svg]:pointer-events-none [&_svg]:shrink-0
              [&_svg:not([class*='size-'])]:size-4
            `}
            data-slot="dialog-close"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="dialog-description"
      {...(props as any)}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        `
          flex flex-col-reverse gap-2
          sm:flex-row sm:justify-end
        `,
        className,
      )}
      data-slot="dialog-footer"
      {...(props as any)}
    />
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        `
          flex flex-col gap-2 text-center
          sm:text-left
        `,
        className,
      )}
      data-slot="dialog-header"
      {...(props as any)}
    />
  );
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        `
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0
          data-[state=open]:animate-in data-[state=open]:fade-in-0
          fixed inset-0 z-50 bg-black/50
        `,
        className,
      )}
      data-slot="dialog-overlay"
      {...(props as any)}
    />
  );
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal" {...(props as any)} />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg leading-none font-semibold", className)}
      data-slot="dialog-title"
      {...(props as any)}
    />
  );
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger data-slot="dialog-trigger" {...(props as any)} />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
