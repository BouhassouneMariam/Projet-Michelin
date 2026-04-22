"use client";

import { ChangeEvent, useState } from "react";

export function useAuthForm<TValues extends Record<string, string>>(
  initialValues: TValues
) {
  const [values, setValues] = useState(initialValues);

  function register(name: keyof TValues & string) {
    return {
      name,
      value: values[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        setValues((current) => ({
          ...current,
          [name]: event.target.value
        }));
      }
    };
  }

  return {
    values,
    register
  };
}
