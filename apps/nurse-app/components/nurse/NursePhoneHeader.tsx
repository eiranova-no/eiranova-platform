"use client";

import { colors } from "@eiranova/ui";
import type { CSSProperties, ReactNode } from "react";

const C = colors;

export interface NursePhoneHeaderProps {
  title?: string | null;
  onBack?: () => void;
  backLabel?: string | null;
  bg?: string;
  slim?: boolean;
  rightAction?: { fn: () => void; label: string };
  right?: ReactNode;
  centerTitle?: boolean;
}

/**
 * Prototype PH — profil-/dybdeskjerm-header (pil + tittel).
 */
export function NursePhoneHeader({
  title,
  onBack,
  backLabel,
  bg,
  slim,
  rightAction,
  right,
  centerTitle = false,
}: NursePhoneHeaderProps) {
  const titleStr = title == null ? "" : String(title);
  const showTitle = titleStr.trim().length > 0;
  const backLabelTrim = backLabel == null ? "" : String(backLabel).trim();
  const showBackLabel = backLabelTrim.length > 0;
  const titleStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 600,
    color: "white",
    lineHeight: 1.25,
    overflowWrap: "anywhere",
  };
  const rightCell =
    (right || rightAction) && (
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 9, flexShrink: 0, zIndex: 1 }}>
        {right ? <div style={{ flexShrink: 0 }}>{right}</div> : null}
        {rightAction ? (
          <button
            type="button"
            onClick={rightAction.fn}
            style={{
              background: "rgba(255,255,255,.18)",
              border: "none",
              color: "white",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
              flexShrink: 0,
              minHeight: 44,
            }}
          >
            {rightAction.label}
          </button>
        ) : null}
      </div>
    );

  return (
    <div
      style={{
        padding: slim ? "10px 14px" : "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 9,
        background: bg || `linear-gradient(135deg,${C.navy},${C.greenDark})`,
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0, zIndex: 1 }}>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "rgba(255,255,255,.18)",
              border: "none",
              color: "white",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            aria-label="Tilbake"
          >
            ‹
          </button>
        ) : null}
        {showBackLabel ? (
          <span className="fr" style={{ ...titleStyle, flexShrink: 0 }}>
            {backLabelTrim}
          </span>
        ) : null}
      </div>
      {centerTitle && showTitle ? (
        <span
          className="fr"
          style={{
            ...titleStyle,
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            pointerEvents: "none",
            boxSizing: "border-box",
            paddingLeft: showBackLabel ? 200 : onBack ? 52 : 16,
            paddingRight: right || rightAction ? 125 : 52,
          }}
        >
          {titleStr}
        </span>
      ) : showTitle ? (
        <span className="fr" style={{ ...titleStyle, flex: 1, minWidth: 0 }}>
          {titleStr}
        </span>
      ) : (
        <span style={{ flex: 1, minWidth: 0 }} aria-hidden="true" />
      )}
      {rightCell}
    </div>
  );
}
