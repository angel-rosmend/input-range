import styles from "./Range.module.css";

interface RangeHandleProps {
  percent: number;
  onDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
  ariaLabel: string;
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueNow: number;
}

export default function RangeHandle(props: RangeHandleProps) {
  return (
    <div
      className={styles.handle}
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
