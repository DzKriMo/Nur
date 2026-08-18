'use client';

import { useCallback, useSyncExternalStore } from 'react';

export function getStored<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = window.localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export function setStored<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // storage full or unavailable — ignore
    }
}

/**
 * Resets a localStorage-backed state store back to its initial value,
 * removing the persisted value and notifying all subscribed components.
 */
export function resetStored(key: string): void {
    const store = stores.get(key) as Store<unknown> | undefined;
    if (store) {
        store.reset();
    } else if (typeof window !== 'undefined') {
        try {
            window.localStorage.removeItem(key);
        } catch {
            // ignore
        }
    }
}

interface Store<T> {
    value: T;
    initial: T;
    listeners: Set<() => void>;
    subscribe: (cb: () => void) => () => void;
    getSnapshot: () => T;
    set: (next: T | ((prev: T) => T)) => void;
    reset: () => void;
}

const stores = new Map<string, Store<unknown>>();

function getStore<T>(key: string, initial: T): Store<T> {
    const existing = stores.get(key) as Store<T> | undefined;
    if (existing) return existing;

    let value: T = typeof window === 'undefined' ? initial : getStored(key, initial);
    const listeners = new Set<() => void>();

    const store: Store<T> = {
        get value() {
            return value;
        },
        initial,
        listeners,
        subscribe(cb: () => void) {
            listeners.add(cb);
            return () => {
                listeners.delete(cb);
            };
        },
        getSnapshot: () => value,
        set(next: T | ((prev: T) => T)) {
            const prev = value;
            const computed = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
            if (Object.is(computed, prev)) return;
            value = computed;
            setStored(key, computed);
            listeners.forEach(l => l());
        },
        reset() {
            value = initial;
            if (typeof window !== 'undefined') {
                try {
                    window.localStorage.removeItem(key);
                } catch {
                    // ignore
                }
            }
            listeners.forEach(l => l());
        },
    };

    stores.set(key, store as Store<unknown>);
    return store;
}

/**
 * Hydration-safe localStorage-backed state.
 * Reads the persisted value on the client (server snapshot = `initial`,
 * so SSR output and hydration output match), and updates localStorage on change.
 */
export function useStoredState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
    const store = getStore(key, initial);
    const value = useSyncExternalStore(store.subscribe, store.getSnapshot, () => initial);
    const set = useCallback((v: T | ((prev: T) => T)) => store.set(v), [store]);
    return [value, set];
}

function noopSubscribe(): () => void {
    return () => {};
}

/** Returns false during SSR/hydration and true once mounted on the client. */
export function useMounted(): boolean {
    return useSyncExternalStore(noopSubscribe, () => true, () => false);
}