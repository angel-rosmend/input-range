import Link from "next/link";
import { Range } from "@/components/Range/Range";
import { RangeMode } from "@/types/range";
import styles from "../../styles/common.module.css";

export default function Exercise1() {
  const normalValues = [1, 100] as [number, number];

  return (
    <main>
      <div>
        <h1>Exercise 1 — Normal Range</h1>
        <div className={styles.description}>
          <p>
            <strong>Modo Normal:</strong> Rango continuo de 1 a 100.
          </p>
          <ul style={{ marginTop: "12px", marginLeft: "20px" }}>
            <li>Arrastra los manejadores para seleccionar un rango</li>
            <li>Haz clic en los valores para editarlos directamente</li>
            <li>Los valores no pueden cruzarse ni exceder los límites</li>
          </ul>
        </div>
      </div>

      <Range mode={RangeMode.Normal} values={normalValues} />

      <div className={styles.navButtons}>
        <Link href="/">
          <button>← Volver a Home</button>
        </Link>
        <Link href="/exercise-2">
          <button>Ir a Ejercicio 2 →</button>
        </Link>
      </div>
    </main>
  );
}
