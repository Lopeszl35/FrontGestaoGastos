import { useState, useEffect } from "react";

type FormField = {
  value: any;
  required?: boolean;
};

export function useFormProgress(fields: Record<string, FormField>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fieldEntries = Object.entries(fields);
    const totalFields = fieldEntries.length;
    
    const filledFields = fieldEntries.filter(([_, field]) => {
      if (typeof field.value === "string") {
        return field.value.trim().length > 0;
      }
      if (typeof field.value === "number") {
        return field.value > 0;
      }
      return !!field.value;
    }).length;

    const newProgress = (filledFields / totalFields) * 100;
    setProgress(newProgress);
  }, [fields]);

  return {
    progress,
    percentage: Math.round(progress),
    isComplete: progress === 100,
  };
}