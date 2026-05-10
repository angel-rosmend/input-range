import { Range } from "@/components/Range/Range";
import { RangeMode } from "@/types/range";

export default function Exercise1() {
  const normalValues = [0, 100] as [number, number];

  return (
    <main>
      <Range mode={RangeMode.Fixed} values={normalValues} />
    </main>
  );
}
