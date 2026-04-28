"use client";

/**
 * STUB — K-REFACTOR-001 Fase D1.
 * Mock-auth for å bevare prototype-oppførsel under refactor.
 * Skal erstattes av ekte Supabase + roller i K-AUTH-002.
 * Ikke bygg videre på dette mønsteret.
 */

import { useCallback, useEffect, useState } from "react";

interface MockAdminUser {
  id: string;
  email: string;
  navn: string;
}

const MOCK_USER: MockAdminUser = {
  id: "mock-admin-1",
  email: "lise@eiranova.no",
  navn: "Lise Andersen",
};

let mockState: { user: MockAdminUser | null } = { user: null };
const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

export function useAuth() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const signInMock = useCallback(() => {
    mockState = { user: MOCK_USER };
    notifyListeners();
  }, []);

  const signOutMock = useCallback(() => {
    mockState = { user: null };
    notifyListeners();
  }, []);

  return {
    user: mockState.user,
    signInMock,
    signOutMock,
    isAuthenticated: mockState.user !== null,
  };
}
