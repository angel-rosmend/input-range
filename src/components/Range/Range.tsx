"use client";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { RangeMode, RangeProps } from "@/types/range";
import { RangeHandle } from "./RangeHandle";
import styles from "./Range.module.css";
import { formatCurrency, formatPercentage } from "@/utils/range";

export function Range(props: RangeProps) {
  const { mode, onChange } = props;

  const values = [1, 10000];
  const initialMin = values[0];
  const initialMax = values[values.length - 1];

  const [currentMin, setCurrentMin] = useState(initialMin);
  const [currentMax, setCurrentMax] = useState(initialMax);
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const [editActive, setEditActive] = useState<"min" | "max" | null>(null);
  const [minInputValue, setMinInputValue] = useState(String(initialMin));
  const [maxInputValue, setMaxInputValue] = useState(String(initialMax));

  const trackRef = useRef<HTMLDivElement>(null);

  // Keep input values in sync with external drag changes
  useEffect(() => {
    if (editActive !== "min") setMinInputValue(String(currentMin));
  }, [currentMin, editActive]);

  useEffect(() => {
    if (editActive !== "max") setMaxInputValue(String(currentMax));
  }, [currentMax, editActive]);

  const formatLabel = useMemo(
    () => (mode === RangeMode.Fixed ? formatCurrency : (v: number) => `${v}€`),
    [mode],
  );

  const toPercent = useCallback(
    (value: number): number => {
      if (mode === RangeMode.Fixed) {
        const index = values.indexOf(value);
        return (index / (values.length - 1)) * 100;
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

  return (
    <div className={styles.container}>
      <span
        className={styles.label}
        onClick={()=> null /*TODO trigger edit*/ }
      >
        {formatLabel(currentMin)}
      </span>
      <div className={styles.track} ref={trackRef}>
        <RangeHandle
          percent={minPercent}
          onDragStart={handleMinDragStart}
          ariaLabel="Minimum value"
          ariaValueNow={currentMin}
          ariaValueMin={initialMin}
          ariaValueMax={currentMax}
        />
        <div
          className={styles.activeRange}
          style={{
            left: formatPercentage(minPercent),
            width: formatPercentage(maxPercent - minPercent),
          }}
        />
        <RangeHandle
          percent={maxPercent}
          onDragStart={handleMaxDragStart}
          ariaLabel="Maximum value"
          ariaValueNow={currentMax}
          ariaValueMin={currentMin}
          ariaValueMax={initialMax}
        />
      </div>
      <span
        className={styles.label}
        onClick={()=> null /*TODO trigger edit*/ }
      >
        {formatLabel(currentMax)}
      </span>
    </div>
  );
}
