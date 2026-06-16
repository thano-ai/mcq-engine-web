import { useCallback, useState } from "react";

interface UseFileDropOptions {
  onFile: (file: File) => void;
  accept?: string;
}

export function useFileDrop({ onFile, accept }: UseFileDropOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFile(file);
        e.target.value = "";
      }
    },
    [onFile]
  );

  return {
    isDragging,
    dropProps: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    inputProps: {
      type: "file" as const,
      accept: accept ?? ".pdf,.docx,.doc,.txt",
      onChange: handleInputChange,
      className: "hidden",
    },
  };
}
