import styles from "./Range.module.css";

export interface RangeHandleProps {
  percent: number;
  handleType: "min" | "max";
  onDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
  onKeyDown: (handleType: "min" | "max", e: React.KeyboardEvent) => void;
  ariaLabel: string;
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueNow: number;
}

export function RangeHandle(props: RangeHandleProps) {
  return (
    <div
      className={styles.dragHandle}
      style={{ left: `${props.percent}%` }}
      onMouseDown={props.onDragStart}
      onTouchStart={props.onDragStart}
      onKeyDown={(e) => props.onKeyDown(props.handleType, e)}
      role="slider"
      aria-label={props.ariaLabel}
      aria-valuenow={props.ariaValueNow}
      aria-valuemin={props.ariaValueMin}
      aria-valuemax={props.ariaValueMax}
      tabIndex={0}
    />
  );
}
