"use client";
import { RangeMode, RangeProps } from "@/types/range";
import { RangeHandle } from "./RangeHandle";
import { RangeLabel } from "./RangeLabel";
import styles from "./Range.module.css";
import { useRange } from "@/hooks/useRange";
import { formatPercentage } from "@/utils/range";

export function Range(props: RangeProps) {
  const {
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
    editActive,
    setEditActive,
    setMinInputValue,
    setMaxInputValue,
    //refs
    trackRef,
  } = useRange(props.values, props.mode, props.onChange);

  const isEditable = props.mode === RangeMode.Normal;

  return (
    <div className={styles.container}>
      <RangeLabel
        mode={props.mode}
        value={currentMin}
        isEditable={isEditable}
        isEditing={editActive === "min"}
        inputValue={minInputValue}
        onInputChange={(e) => setMinInputValue(e.target.value)}
        onConfirm={handleMinLabelConfirm}
        onCancel={() => setEditActive(null)}
        onEditStart={() => setEditActive("min")}
      />

      <div className={styles.track} ref={trackRef}>
        <RangeHandle
          percent={minPercent}
          handleType="min"
          onDragStart={handleMinDragStart}
          onKeyDown={handleKeyDown}
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
          handleType="max"
          onDragStart={handleMaxDragStart}
          onKeyDown={handleKeyDown}
          ariaLabel="Maximum value"
          ariaValueNow={currentMax}
          ariaValueMin={currentMin}
          ariaValueMax={initialMax}
        />
      </div>

      <RangeLabel
        mode={props.mode}
        value={currentMax}
        isEditable={isEditable}
        isEditing={editActive === "max"}
        inputValue={maxInputValue}
        onInputChange={(e) => setMaxInputValue(e.target.value)}
        onConfirm={handleMaxLabelConfirm}
        onCancel={() => setEditActive(null)}
        onEditStart={() => setEditActive("max")}
      />
    </div>
  );
}
