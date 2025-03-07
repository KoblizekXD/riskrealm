"use client";

import { removeAttrFromObject } from "@/lib/util";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import "../app/globals.css";

type DialogProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  description?: string;
} & Dialog.DialogContentProps;

export default function MyDialog({
  trigger,
  children,
  title,
  description,
  ...props
}: DialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 DialogOverlay bg-black/50" />
        <Dialog.Content
          className={twMerge(
            "fixed flex DialogContent flex-col top-1/2 left-1/2 ring-0 focus:outline-0 -translate-x-1/2 -translate-y-1/2 bg-[#151520] p-6 rounded-lg shadow-xl z-50",
            props.className
          )}
          {...removeAttrFromObject(props, "className")}
        >
          <Dialog.Title className="text-xl font-bold mb-2">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-gray-400 mb-4">
            {description}
          </Dialog.Description>
          {children}
          <Dialog.Close className="absolute hover:scale-125 cursor-pointer transition-transform focus:outline-0 right-2 text-gray-500 top-2">
            <X />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
