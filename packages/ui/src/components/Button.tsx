"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

import { cn } from "../lib/cn";

export interface UiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghostOnDark" | "unstyled";
  fullWidth?: boolean;
}

/** Maps to prototype .btn + .bp / .bg — class names stay on the element for global.css parity. */
export const UiButton = forwardRef<HTMLButtonElement, UiButtonProps>(
  function UiButton(
    { variant = "primary", fullWidth, className, type = "button", ...rest },
    ref,
  ) {
    const variantClass =
      variant === "primary"
        ? "btn bp"
        : variant === "ghostOnDark"
          ? "btn bg"
          : "";
    return (
      <button
        ref={ref}
        type={type}
        className={cn(variantClass, fullWidth && "bf", className)}
        {...rest}
      />
    );
  },
);
