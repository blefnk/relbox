import type { IconName } from "@/primitives/icons";

export interface HeaderActionButton {
  disabled?: boolean;
  effect?:
    | "expandIcon"
    | "gooeyLeft"
    | "gooeyRight"
    | "gradientSlideShow"
    | "hoverUnderline"
    | "ringHover"
    | "shine"
    | "shineHover"
    | "underline";
  href?: string;
  icon?: IconName;
  iconPosition?: "left" | "right";
  label: string;
  loading?: boolean;
  onClick?: () => void;
  size?: "default" | "icon" | "lg" | "sm";
  variant?:
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
}

export interface HeaderMenuItem {
  href?: string;
  label: string;
  subItems?: {
    description?: string;
    href: string;
    label: string;
  }[];
}

export interface HeaderProps {
  actionButtons?: HeaderActionButton[];
  className?: string;
  languageSwitcher?: HeaderActionButton;
  logoHref?: string;
  logoText?: string;
  menuItems?: HeaderMenuItem[];
}
