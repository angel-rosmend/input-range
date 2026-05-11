import styles from "./Range.module.css";

export interface RangeHandleProps {
  percent: number;
  onDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
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
      role="slider"
      aria-label={props.ariaLabel}
      aria-valuenow={props.ariaValueNow}
      aria-valuemin={props.ariaValueMin}
      aria-valuemax={props.ariaValueMax}
      tabIndex={0}
    />
  );
}
