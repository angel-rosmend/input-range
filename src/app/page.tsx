import { Range } from "@/components/Range/Range";
import { RangeMode } from "@/types/range";

export default function Home() {
   const normalValues = [0, 100] as [number, number];
   const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
  return (
    <main><h1>Input Range Setup</h1>
    <Range mode={RangeMode.Normal} values={normalValues}/>
    <Range mode={RangeMode.Fixed} values={fixedValues}/>
    </main>
   
  );
}
