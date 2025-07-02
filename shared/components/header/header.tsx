import { Loader2Icon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/primitives/button";
import { icons } from "@/primitives/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/primitives/navigation-menu";
import { cn } from "@/utils/utils";

import type { HeaderProps } from "./header.types";

import { LinkAsButtonWithIcon } from "../button-wrapper";
import { SettingsDrawer } from "../settings-drawer";

const defaultActionButtons: NonNullable<HeaderProps["actionButtons"]> = [];
const defaultMenuItems: NonNullable<HeaderProps["menuItems"]> = [];

export function Header({
  actionButtons = defaultActionButtons,
  className,
  languageSwitcher,
  logoHref = "/",
  logoText = "Relbox",
  menuItems = defaultMenuItems,
}: HeaderProps) {
  return (
    <header
      className={cn(
        `
          border-border/30 bg-foreground sticky top-0 z-50 w-full rounded-full
          border-b
        `,
        className,
      )}
    >
      <div
        className={`
          container mx-auto flex h-20 max-w-(--breakpoint-2xl) items-center
          justify-between px-6
        `}
      >
        {/* Logo */}
        <div className="flex items-center">
          {logoText && logoText !== "" && (
            <LinkAsButtonWithIcon
              className={`
                text-background h-auto rounded-full p-0 text-2xl font-bold
                transition-colors
                hover:bg-background/20 hover:text-background
              `}
              href={logoHref}
              icon="none"
              size="lg"
              variant="ghost"
            >
              {logoText}
            </LinkAsButtonWithIcon>
          )}
        </div>

        {/* Navigation Menu */}
        {menuItems.length > 0 && (
          <NavigationMenu
            className={`
              hidden
              md:flex
            `}
          >
            <NavigationMenuList className="gap-8">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.subItems && item.subItems.length > 0 ? (
                    <>
                      <NavigationMenuTrigger
                        className={`
                          text-background bg-transparent text-lg font-semibold
                          hover:bg-background/20 hover:text-background
                          data-active:bg-background/20
                          data-[state=open]:bg-background/20
                        `}
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div
                          className={`
                            grid w-[450px] gap-3 p-6
                            lg:w-[550px] lg:grid-cols-[.75fr_1fr]
                          `}
                        >
                          <div className="row-span-3">
                            <NavigationMenuLink asChild>
                              <Link
                                className={`
                                  from-muted/50 to-muted flex h-full w-full
                                  flex-col justify-end rounded-full
                                  bg-linear-to-b p-6 no-underline
                                  transition-colors outline-none select-none
                                  hover:bg-accent/50
                                  focus:shadow-md
                                `}
                                href={item.href || "#"}
                              >
                                <div
                                  className={`
                                    text-foreground mt-4 mb-2 text-xl font-bold
                                  `}
                                >
                                  {item.label}
                                </div>
                                <p
                                  className={`
                                    text-muted-foreground text-base
                                    leading-tight
                                  `}
                                >
                                  Explore {item.label.toLowerCase()} options
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </div>
                          <div className="grid gap-2">
                            {item.subItems.map((subItem) => (
                              <NavigationMenuLink asChild key={subItem.label}>
                                <Link
                                  className={`
                                    hover:bg-accent hover:text-accent-foreground
                                    focus:bg-accent focus:text-accent-foreground
                                    block space-y-1 rounded-full p-4
                                    leading-none no-underline transition-colors
                                    outline-none select-none
                                  `}
                                  href={subItem.href}
                                >
                                  <div
                                    className={`
                                      text-foreground text-base leading-none
                                      font-semibold
                                    `}
                                  >
                                    {subItem.label}
                                  </div>
                                  {subItem.description && (
                                    <p
                                      className={`
                                        text-muted-foreground mt-1 line-clamp-2
                                        text-sm leading-snug
                                      `}
                                    >
                                      {subItem.description}
                                    </p>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        className={`
                          group text-background inline-flex h-12 w-max
                          items-center justify-center rounded-full
                          bg-transparent px-6 py-3 text-lg font-semibold
                          transition-colors
                          hover:bg-background/20 hover:text-background
                          focus:bg-background/20 focus:text-background
                          focus:outline-none
                          disabled:pointer-events-none disabled:opacity-50
                        `}
                        href={item.href || "#"}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {languageSwitcher && (
            <SettingsDrawer languageSwitcher={languageSwitcher} />
          )}
          {actionButtons.length > 0 &&
            actionButtons.map((button) => {
              const IconComponent = button.icon ? icons[button.icon] : null;

              const buttonContent = (
                <>
                  {button.loading && <Loader2Icon className="animate-spin" />}
                  {IconComponent && button.iconPosition !== "right" && (
                    <IconComponent />
                  )}
                  <span className="font-semibold">{button.label}</span>
                  {IconComponent && button.iconPosition === "right" && (
                    <IconComponent />
                  )}
                </>
              );

              const buttonProps = {
                className: cn(
                  "h-12 px-6 py-3 text-base font-semibold",
                  button.icon && "gap-2",
                  button.loading && "gap-2",
                ),
                disabled: button.disabled || button.loading,
                effect: button.effect,
                size: button.size || ("lg" as const),
                variant: button.variant || ("default" as const),
              };

              if (button.href) {
                return (
                  <Button key={button.label} {...buttonProps} asChild>
                    <Link href={button.href}>{buttonContent}</Link>
                  </Button>
                );
              }

              return (
                <Button
                  key={button.label}
                  {...buttonProps}
                  onClick={button.onClick}
                >
                  {buttonContent}
                </Button>
              );
            })}
        </div>
      </div>
    </header>
  );
}
