import { ChevronRightIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button, type ButtonProps } from "@/primitives/button";
import { type IconName, icons } from "@/primitives/icons";

interface BaseButtonProps
  extends Omit<ButtonProps, "asChild" | "icon" | "size" | "variant"> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  effect?: ButtonEffect;
  icon?: IconName;
  iconPosition?: "left" | "right";
  size?: ButtonSize;
  variant?: ButtonVariant;
}

/* ──────────────────────────────────────
 * Shared types
 * ──────────────────────────────────── */
type ButtonEffect =
  | "expandIcon"
  | "gooeyLeft"
  | "gooeyRight"
  | "gradientSlideShow"
  | "hoverUnderline"
  | "ringHover"
  | "shine"
  | "shineHover"
  | "underline";

type ButtonSize = "default" | "icon" | "lg" | "sm";

type ButtonVariant =
  | "default"
  | "destructive"
  | "ghost"
  | "link"
  | "outline"
  | "secondary";

/* ──────────────────────────────────────
 * Factory
 * ──────────────────────────────────── */
function createButton(
  defaults: Partial<BaseButtonProps> & { children?: React.ReactNode } = {},
) {
  const VariantButton = React.memo(
    ({
      children = defaults.children ?? "Button",
      icon,
      iconPosition = "left",
      ref,
      ...props
    }: BaseButtonProps & {
      ref?: React.RefObject<HTMLButtonElement | null>;
    }) => {
      const IconComponent = icon ? icons[icon] : undefined;
      const iconProps = IconComponent
        ? { icon: IconComponent, iconPlacement: iconPosition }
        : {};

      return (
        <Button
          ref={ref}
          {...Object.fromEntries(
            Object.entries(defaults).filter(([key]) => key !== "icon"),
          )}
          {...(props as any)}
          {...iconProps}
        >
          {children}
        </Button>
      );
    },
  );

  VariantButton.displayName =
    defaults.variant && defaults.variant !== "default"
      ? `Button${defaults.variant[0].toUpperCase()}${defaults.variant.slice(1)}`
      : "Button";

  return VariantButton;
}

/* ──────────────────────────────────────
 * Public variants
 * ──────────────────────────────────── */
export const ButtonDemo = createButton();

export const ButtonDestructive = createButton({
  children: "Destructive",
  variant: "destructive",
});

export const ButtonGhost = createButton({
  children: "Ghost",
  variant: "ghost",
});

export const ButtonIcon = createButton({
  children: <ChevronRightIcon />,
  size: "icon",
  variant: "secondary",
});

export const ButtonLink = createButton({
  children: "Link",
  variant: "link",
});

export const ButtonLoading = createButton({
  children: (
    <>
      <Loader2Icon className="animate-spin" /> Please wait
    </>
  ),
  disabled: true,
  size: "sm",
});

export const ButtonOutline = createButton({
  children: "Outline",
  variant: "outline",
});

export const ButtonSecondary = createButton({
  children: "Secondary",
  variant: "secondary",
});

/* generic icon-aware button */
export const ButtonWithIcon = createButton();

/* ──────────────────────────────────────
 * Link helpers
 * ──────────────────────────────────── */
interface LinkButtonProps extends Omit<BaseButtonProps, "icon"> {
  href: string;
  icon?: IconName;
  iconPosition?: "left" | "right";
}

/* plain link-as-button */
export const LinkAsButton = ({
  children = "Login",
  href,
  icon,
  iconPosition = "left",
  ref,
  ...props
}: LinkButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const IconComponent = icon ? icons[icon] : undefined;
  const iconProps = IconComponent
    ? { icon: IconComponent, iconPlacement: iconPosition }
    : {};

  return (
    <Button asChild ref={ref} {...iconProps} {...(props as any)}>
      <Link href={href}>{children}</Link>
    </Button>
  );
};
LinkAsButton.displayName = "LinkAsButton";

/* link-as-button that requires an icon */
export const LinkAsButtonWithIcon = ({
  ref,
  ...props
}: LinkButtonProps & { icon: IconName } & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) => <LinkAsButton ref={ref} {...(props as any)} />;
LinkAsButtonWithIcon.displayName = "LinkAsButtonWithIcon";
