import { RangeMode } from "@/types/range";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useRange(
  values: number[],
  mode: RangeMode,
  onChange?: (min: number, max: number) => void,
) {
  const initialMin = values[0];
  const initialMax = values[values.length - 1];

  const [currentMin, setCurrentMin] = useState(initialMin);
  const [currentMax, setCurrentMax] = useState(initialMax);
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const [editActive, setEditActive] = useState<"min" | "max" | null>(null);
  const [minInputValue, setMinInputValue] = useState(String(initialMin));
  const [maxInputValue, setMaxInputValue] = useState(String(initialMax));
  const [focusedHandle, setFocusedHandle] = useState<"min" | "max" | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editActive !== "min") setMinInputValue(String(currentMin));
  }, [currentMin, editActive]);

  useEffect(() => {
    if (editActive !== "max") setMaxInputValue(String(currentMax));
  }, [currentMax, editActive]);

  const toPercent = useCallback(
    (value: number): number => {
      if (mode === RangeMode.Fixed) {
        const idx = values.indexOf(value);
        return (idx / (values.length - 1)) * 100;
      }
      return ((value - initialMin) / (initialMax - initialMin)) * 100;
    },
    [mode, values, initialMin, initialMax],
  );

  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return initialMin;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100),
      );

      if (mode === RangeMode.Fixed) {
        const index = Math.round((pct / 100) * (values.length - 1));
        return values[Math.max(0, Math.min(values.length - 1, index))];
      }

      return Math.round(initialMin + (pct / 100) * (initialMax - initialMin));
    },
    [mode, values, initialMin, initialMax],
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;
      const newValue = getValueFromPosition(clientX);

      if (isDragging === "min") {
        const clamped = Math.min(newValue, currentMax);
        setCurrentMin(clamped);
        onChange?.(clamped, currentMax);
      } else {
        const clamped = Math.max(newValue, currentMin);
        setCurrentMax(clamped);
        onChange?.(currentMin, clamped);
      }
    },
    [isDragging, getValueFromPosition, currentMin, currentMax, onChange],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => handleMove(e.clientX),
    [handleMove],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove],
  );

  const handleEnd = useCallback(() => setIsDragging(null), []);

  const handleMinDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDragging("min");
    },
    [],
  );

  const handleMaxDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDragging("max");
    },
    [],
  );

  const handleKeyDown = useCallback(
    (handleType: "min" | "max", e: React.KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();

      if (mode === RangeMode.Normal) {
        // Normal mode: increment/decrement by 1
        const isIncrement = e.key === "ArrowRight";
        const delta = isIncrement ? 1 : -1;

        if (handleType === "min") {
          const newMin = Math.max(
            initialMin,
            Math.min(currentMin + delta, currentMax),
          );
          setCurrentMin(newMin);
          onChange?.(newMin, currentMax);
        } else {
          const newMax = Math.min(
            initialMax,
            Math.max(currentMax + delta, currentMin),
          );
          setCurrentMax(newMax);
          onChange?.(currentMin, newMax);
        }
      } else if (mode === RangeMode.Fixed) {
        // Fixed mode: move to next/prev value
        const isNext = e.key === "ArrowRight";
        const currentIndex =
          handleType === "min"
            ? values.indexOf(currentMin)
            : values.indexOf(currentMax);

        if (currentIndex === -1) return;

        const newIndex = isNext
          ? Math.min(currentIndex + 1, values.length - 1)
          : Math.max(currentIndex - 1, 0);

        const newValue = values[newIndex];

        if (handleType === "min") {
          const clamped = Math.min(newValue, currentMax);
          setCurrentMin(clamped);
          onChange?.(clamped, currentMax);
        } else {
          const clamped = Math.max(newValue, currentMin);
          setCurrentMax(clamped);
          onChange?.(currentMin, clamped);
        }
      }
    },
    [mode, values, initialMin, initialMax, currentMin, currentMax, onChange],
  );

  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleEnd);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  const minPercent = useMemo(
    () => toPercent(currentMin),
    [toPercent, currentMin],
  );
  const maxPercent = useMemo(
    () => toPercent(currentMax),
    [toPercent, currentMax],
  );

  const handleMinLabelConfirm = () => {
    const parsed = parseFloat(minInputValue);
    if (!isNaN(parsed)) {
      setCurrentMin(Math.max(initialMin, Math.min(parsed, currentMax)));
    }
    setEditActive(null);
  };

  const handleMaxLabelConfirm = () => {
    const parsed = parseFloat(maxInputValue);
    if (!isNaN(parsed)) {
      setCurrentMax(Math.min(initialMax, Math.max(parsed, currentMin)));
    }
    setEditActive(null);
  };

  return {
    //values
    initialMax,
    initialMin,
    currentMax,
    currentMin,
    //percentages
    minPercent,
    maxPercent,
    //handlers
    handleMaxLabelConfirm,
    handleMinLabelConfirm,
    handleMaxDragStart,
    handleMinDragStart,
    handleKeyDown,
    //states
    minInputValue,
    maxInputValue,
    isDragging,
    editActive,
    focusedHandle,
    setEditActive,
    setMinInputValue,
    setMaxInputValue,
    setFocusedHandle,
    //refs
    trackRef,
  };
}
