export enum RangeMode {
  Normal = "normal",
  Fixed = "fixed",
}

export type RangeProps = { onChange?: (min: number, max: number) => void } & (
  | {
      mode: RangeMode.Normal;
      values: [number, number];
    }
  | {
      mode: RangeMode.Fixed;
      values: number[];
    }
);