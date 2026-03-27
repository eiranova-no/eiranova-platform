"use client";

import PrototypeApp from "../../prototype/EiraNova-Prototype-HANDOFF-v17-COMPLETE.jsx";

export default function Page() {
  return (
    <PrototypeApp
      forcedTab="admin"
      forcedScreen="admin-panel"
      showPrototypeToolbar={false}
    />
  );
}
