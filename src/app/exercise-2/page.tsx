import { Range } from "@/components/Range/Range";
import { RangeMode } from "@/types/range";

export default function Exercise2() {
  const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

  return (
    <main>
      <Range mode={RangeMode.Fixed} values={fixedValues} />
    </main>
  );
}
