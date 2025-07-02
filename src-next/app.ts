import type {
  HeaderActionButton,
  HeaderMenuItem,
} from "../shared/components/header/header.types";

export const navMenuItems: HeaderMenuItem[] = [
  {
    href: "/how-to-join",
    label: "How to join",
  },
  {
    label: "For users",
    subItems: [
      {
        description: "Tools and resources for music buyers",
        href: "/buyers",
        label: "For buyers",
      },
      {
        description: "Tools and resources for music creators",
        href: "/creators",
        label: "For creators",
      },
      {
        description: "Educational content designed for music learners",
        href: "/students",
        label: "For students",
      },
      {
        description: "Tools and resources for music teachers",
        href: "/teachers",
        label: "For teachers",
      },
    ],
  },
  {
    href: "/partnership",
    label: "Partnership",
  },
  {
    href: "/talent-program",
    label: "Talent Program",
  },
];

export const languageSwitcher: HeaderActionButton = {
  effect: "ringHover",
  href: "/en",
  label: "ENG",
  size: "lg",
  variant: "link",
};

export const navActionButtons: HeaderActionButton[] = [
  {
    effect: "expandIcon",
    href: "/auth/sign-up",
    icon: "userPlus",
    iconPosition: "left",
    label: "Sign up",
    size: "lg",
    variant: "secondary",
  },
  {
    effect: "hoverUnderline",
    href: "/auth/sign-in",
    icon: "logIn",
    iconPosition: "left",
    label: "Sign in",
    size: "lg",
    variant: "outline",
  },
];
