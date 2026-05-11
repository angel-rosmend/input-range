import { useMemo } from "react";
import styles from "./Range.module.css";
import { RangeMode } from "@/types/range";
import { formatCurrency } from "@/utils/range";

interface RangeLabelProps {
  mode: RangeMode;
  value: number;
  isEditable: boolean;
  isEditing: boolean;
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onEditStart: () => void;
}

export function RangeLabel(props: RangeLabelProps) {
  const formatLabel = useMemo(
    () =>
      props.mode === RangeMode.Fixed
        ? formatCurrency
        : (value: number) => `${value}€`,
    [props.mode],
  );

  if (props.isEditable && props.isEditing) {
    return (
      <input
        className={styles.labelInput}
        type="number"
        value={props.inputValue}
        autoFocus
        onChange={props.onInputChange}
        onBlur={props.onConfirm}
        onKeyDown={(e) => {
          if (e.key === "Enter") props.onConfirm();
          if (e.key === "Escape") props.onCancel();
        }}
      />
    );
  }

  return (
    <span
      className={props.isEditable ? styles.labelEditable : styles.label}
      onClick={props.isEditable ? props.onEditStart : undefined}
    >
      {formatLabel(props.value)}
    </span>
  );
}
