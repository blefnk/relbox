import type * as React from "react";

import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/utils/utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectContent({
  children,
  className,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          `
            bg-popover text-popover-foreground relative z-50 max-h-96
            min-w-[8rem] overflow-hidden rounded-md border shadow-md
            data-[state=open]:animate-in data-[state=open]:fade-in-0
            data-[state=open]:zoom-in-95
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0
            data-[state=closed]:zoom-out-95
            data-[side=bottom]:slide-in-from-top-2
            data-[side=left]:slide-in-from-right-2
            data-[side=right]:slide-in-from-left-2
            data-[side=top]:slide-in-from-bottom-2
          `,
          position === "popper" &&
            `
              data-[side=bottom]:translate-y-1
              data-[side=left]:-translate-x-1
              data-[side=right]:translate-x-1
              data-[side=top]:-translate-y-1
            `,
          className,
        )}
        data-slot="select-content"
        position={position}
        {...(props as any)}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              `
                h-[var(--radix-select-trigger-height)] w-full
                min-w-[var(--radix-select-trigger-width)] scroll-my-1
              `,
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...(props as any)} />;
}

function SelectItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        `
          focus:bg-accent focus:text-accent-foreground
          [&_svg:not([class*='text-'])]:text-muted-foreground
          [&_svg:not([class*='size-'])]:size-4
          relative flex w-full cursor-default items-center gap-2 rounded-sm
          py-1.5 pr-8 pl-2 text-sm outline-hidden select-none
          data-[disabled]:pointer-events-none data-[disabled]:opacity-50
          [&_svg]:pointer-events-none [&_svg]:shrink-0
          *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2
        `,
        className,
      )}
      data-slot="select-item"
      {...(props as any)}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      data-slot="select-label"
      {...(props as any)}
    />
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      data-slot="select-scroll-down-button"
      {...(props as any)}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      data-slot="select-scroll-up-button"
      {...(props as any)}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      data-slot="select-separator"
      {...(props as any)}
    />
  );
}

function SelectTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        `
          border-input ring-ring/10 outline-ring/50 flex h-9 w-full items-center
          justify-between rounded-md border bg-transparent px-3 py-2 text-sm
          shadow-xs transition-[color,box-shadow]
          data-[placeholder]:text-muted-foreground
          aria-invalid:border-destructive aria-invalid:focus-visible:ring-0
          dark:ring-ring/20 dark:outline-ring/40
          [&_svg:not([class*='text-'])]:text-muted-foreground
          [&_svg:not([class*='size-'])]:size-4
          focus-visible:ring-4 focus-visible:outline-1
          disabled:cursor-not-allowed disabled:opacity-50
          *:data-[slot=select-value]:flex
          *:data-[slot=select-value]:items-center
          *:data-[slot=select-value]:gap-2
          [&_svg]:pointer-events-none [&_svg]:shrink-0
          [&>span]:line-clamp-1
        `,
        className,
      )}
      data-slot="select-trigger"
      {...(props as any)}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...(props as any)} />;
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
