import type * as React from "react";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/utils";

const buttonVariants = cva(
  `
    ring-offset-background inline-flex items-center justify-center gap-2
    rounded-full text-sm font-medium whitespace-nowrap transition-colors
    focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2
    focus-visible:outline-none
    disabled:pointer-events-none disabled:opacity-50
    [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
  `,
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      effect: {
        expandIcon: "group relative gap-0",
        gooeyLeft: `
          relative z-0 overflow-hidden from-white/40 transition-all duration-500
          after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%]
          after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%]
          after:bg-linear-to-l after:transition-transform after:duration-1000
          hover:after:translate-x-[0%] hover:after:translate-y-[0%]
        `,
        gooeyRight: `
          relative z-0 overflow-hidden from-white/40 transition-all duration-500
          before:absolute before:inset-0 before:-z-10 before:translate-x-[150%]
          before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%]
          before:bg-linear-to-r before:transition-transform before:duration-1000
          hover:before:translate-x-[0%] hover:before:translate-y-[0%]
        `,
        gradientSlideShow: `
          animate-gradient-flow
          bg-[linear-gradient(-45deg,var(--gradient-lime),var(--gradient-ocean),var(--gradient-wine),var(--gradient-rust))]
          bg-size-[400%]
        `,
        hoverUnderline: `
          after:bg-primary after:absolute after:bottom-2 after:h-px after:w-2/3
          after:origin-bottom-right after:scale-x-0 after:transition-transform
          after:duration-300 after:ease-in-out
          relative no-underline!
          hover:after:origin-bottom-left hover:after:scale-x-100
        `,
        ringHover: `
          hover:ring-primary/90 hover:ring-2 hover:ring-offset-2
          transition-all duration-300
        `,
        shine: `
          animate-shine relative overflow-hidden
          before:absolute before:inset-0 before:rounded-[inherit]
          before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)]
          before:bg-size-[250%_250%,100%_100%] before:bg-no-repeat
        `,
        shineHover: `
          relative overflow-hidden
          before:absolute before:inset-0 before:rounded-[inherit]
          before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)]
          before:bg-size-[250%_250%,100%_100%] before:bg-position-[200%_0,0_0]
          before:bg-no-repeat before:transition-[background-position_0s_ease]
          before:duration-1000
          hover:before:bg-position-[-100%_0,0_0]
        `,
        underline: `
          after:bg-primary after:absolute after:bottom-2 after:h-px after:w-2/3
          after:origin-bottom-left after:scale-x-100 after:transition-transform
          after:duration-300 after:ease-in-out
          relative no-underline!
          hover:after:origin-bottom-right hover:after:scale-x-0
        `,
      },
      size: {
        default: `
          h-10 px-5 py-2.5
          has-[>svg]:px-4
        `,
        icon: "size-10",
        lg: `
          h-11 rounded-full px-7
          has-[>svg]:px-5
        `,
        sm: `
          h-9 gap-1.5 rounded-full px-4
          has-[>svg]:px-3
        `,
      },
      variant: {
        default: `
          bg-primary text-primary-foreground shadow-xs
          hover:bg-primary-foreground hover:text-primary
        `,
        destructive: `
          bg-destructive text-white shadow-xs
          hover:text-destructive hover:bg-white
          focus-visible:ring-destructive/20
          dark:bg-destructive/60 dark:hover:bg-destructive-foreground
          dark:hover:text-destructive dark:focus-visible:ring-destructive/40
        `,
        ghost: `
          hover:bg-foreground hover:text-background
          dark:hover:bg-foreground dark:hover:text-background
        `,
        link: `
          text-primary underline-offset-4
          hover:text-primary-foreground hover:underline
        `,
        outline: `
          bg-background border shadow-xs
          hover:bg-foreground hover:text-background
          dark:border-input dark:bg-input/30 dark:hover:bg-foreground
          dark:hover:text-background
        `,
        secondary: `
          bg-secondary text-secondary-foreground shadow-xs
          hover:bg-secondary-foreground hover:text-secondary
        `,
      },
    },
  },
);

export type ButtonIconProps = IconProps | IconRefProps;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

interface IconProps {
  icon: React.ElementType;
  iconPlacement: "left" | "right";
}

interface IconRefProps {
  icon?: never;
  iconPlacement?: undefined;
}

const Button = ({
  asChild = false,
  className,
  effect,
  icon: Icon,
  iconPlacement,
  ref,
  size,
  variant,
  ...props
}: ButtonIconProps &
  ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ className, effect, size, variant }))}
      // @ts-expect-error TODO: fix ts
      ref={ref}
      {...props}
    >
      {Icon &&
        iconPlacement === "left" &&
        (effect === "expandIcon" ? (
          <div
            className={`
              w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200
              group-hover:w-5 group-hover:translate-x-100 group-hover:pr-2
              group-hover:opacity-100
            `}
          >
            <Icon />
          </div>
        ) : (
          <Icon />
        ))}
      <Slottable>{props.children}</Slottable>
      {Icon &&
        iconPlacement === "right" &&
        (effect === "expandIcon" ? (
          <div
            className={`
              w-0 translate-x-full pl-0 opacity-0 transition-all duration-200
              group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2
              group-hover:opacity-100
            `}
          >
            <Icon />
          </div>
        ) : (
          <Icon />
        ))}
    </Comp>
  );
};
Button.displayName = "Button";

export { Button, buttonVariants };
