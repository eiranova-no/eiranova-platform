import type { HTMLAttributes, ReactElement } from "react";

import { cn } from "../lib/cn";

export interface UiCardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

/** Prototype .card with optional .cp padding. */
export function UiCard({
  padded,
  className,
  ...rest
}: UiCardProps): ReactElement {
  return <div className={cn("card", padded && "cp", className)} {...rest} />;
}
