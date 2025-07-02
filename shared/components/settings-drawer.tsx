"use client";

import Link from "next/link";
import { useState } from "react";
import { useMediaQuery } from "~next/lib/hooks";

import { Button } from "@/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/primitives/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/primitives/drawer";
import { icons } from "@/primitives/icons";

import type { HeaderActionButton } from "./header/header.types";

import { ThemeSwitcher } from "./theme-switcher";

interface SettingsDrawerProps {
  languageSwitcher: HeaderActionButton;
}

export function SettingsDrawer({ languageSwitcher }: SettingsDrawerProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <icons.settings className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Settings</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <SettingsContent
            className="px-0"
            languageSwitcher={languageSwitcher}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="outline">
          <icons.settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Settings</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
          </DrawerHeader>
          <SettingsContent
            className="px-4"
            languageSwitcher={languageSwitcher}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function LanguageSwitcherButton({
  languageSwitcher,
}: {
  languageSwitcher: HeaderActionButton;
}) {
  const IconComponent = languageSwitcher.icon
    ? icons[languageSwitcher.icon]
    : null;

  return (
    <Button
      asChild
      className={`
        h-12 px-6 py-3 text-base font-semibold
        ${languageSwitcher.icon ? "gap-2" : ""}
      `}
      disabled={languageSwitcher.disabled}
      effect={languageSwitcher.effect}
      size={languageSwitcher.size || "lg"}
      variant={languageSwitcher.variant || "default"}
    >
      <Link href={languageSwitcher.href || "/"}>
        {IconComponent && languageSwitcher.iconPosition !== "right" && (
          <IconComponent />
        )}
        <span className="font-semibold">{languageSwitcher.label}</span>
        {IconComponent && languageSwitcher.iconPosition === "right" && (
          <IconComponent />
        )}
      </Link>
    </Button>
  );
}

function SettingsContent({
  className,
  languageSwitcher,
}: {
  className?: string;
  languageSwitcher: HeaderActionButton;
}) {
  return (
    <div
      className={`
        flex flex-col gap-6
        ${className}
      `}
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Theme</h3>
        <ThemeSwitcher />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Language</h3>
        <LanguageSwitcherButton languageSwitcher={languageSwitcher} />
      </div>
    </div>
  );
}
