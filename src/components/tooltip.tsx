"use client";

import {
  TooltipContent,
  Tooltip as TooltipRoot,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import "../app/globals.css";

export default function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <TooltipRoot delayDuration={100}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className="TooltipContent"
        side="top"
        sideOffset={5}
        align="center">
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
}
