"use client";

/**
 * STUB — K-REFACTOR-001 Fase C1.
 * Mock-auth for å bevare prototype-oppførsel under refactor.
 * Skal erstattes av ekte Supabase + Google Workspace SSO i K-AUTH-002.
 * Ikke bygg videre på dette mønsteret.
 */

import { useCallback, useEffect, useState } from "react";

interface MockNurseUser {
  id: string;
  email: string;
  navn: string;
}

const MOCK_USER: MockNurseUser = {
  id: "mock-nurse-1",
  email: "test@eiranova.no",
  navn: "Test Sykepleier",
};

let mockState: { user: MockNurseUser | null } = { user: null };
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
