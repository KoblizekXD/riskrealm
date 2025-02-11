"use client";

import * as Pop from "@radix-ui/react-popover";
import "../app/globals.css"

export interface PopoverProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export default function Popover({ children, trigger }: PopoverProps) {
  return (
    <Pop.Root>
      <Pop.Trigger asChild>
        {trigger}
      </Pop.Trigger>
      <Pop.Portal>
        <Pop.Content side="bottom" className="PopoverContent duration-300" sideOffset={4}>
          {children}
        </Pop.Content>
      </Pop.Portal>
    </Pop.Root>
  )
}