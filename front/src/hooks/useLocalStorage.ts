import { useCallback, useEffect, useState } from 'react'

import type { Dispatch, SetStateAction } from 'react'

type Options<T> = {
    serializer?:(obj:T) => string,
    deserializer?:(str:string) => T
}
export function useLocalStorage<T>(key: string, initialValue: T | (() => T),{ serializer, deserializer}:Options<T>): [T, Dispatch<SetStateAction<T>>] {

  const readValue = useCallback((): T => {
    const initialValueToUse = initialValue instanceof Function ? initialValue() : initialValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? deserializer ? deserializer(raw): raw as T : initialValueToUse
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error)
      return initialValueToUse
    }
  }, [initialValue, key])

  const [storedValue, setStoredValue] = useState(initialValue)

  const setValue: Dispatch<SetStateAction<T>> = useCallback(value => {
    try {
      const newValue = value instanceof Function ? value(readValue()) : value
      window.localStorage.setItem(key, serializer ? serializer(newValue) : newValue as string)
      setStoredValue(newValue)
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error)
    }
  }, [setStoredValue])

  useEffect(() => {
    setStoredValue(readValue())
  }, [key])

  return [storedValue, setValue]
}