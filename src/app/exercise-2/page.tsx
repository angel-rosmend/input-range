import Link from "next/link";
import { Range } from "@/components/Range/Range";
import { RangeMode } from "@/types/range";
import styles from "../../styles/exercise.module.css";

export default function Exercise2() {
  const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

  return (
    <main>
      <div>
        <h1>Exercise 2 — Fixed Range</h1>
        <div className={styles.description}>
          <p>
            <strong>Modo Fijo:</strong> Selección entre 6 valores predefinidos (precios en €).
          </p>
          <ul style={{ marginTop: "12px", marginLeft: "20px" }}>
            <li>Arrastra los manejadores para hacer snap a los valores disponibles</li>
            <li>Las etiquetas NO son editables — son solo para visualizar</li>
            <li>Formatos de moneda (de-DE): 1.99€, 5.99€, 10.99€, 30.99€, 50.99€, 70.99€ (con coma decimal)</li>
          </ul>
        </div>
      </div>

      <Range mode={RangeMode.Fixed} values={fixedValues} />

      <div className={styles.navButtons}>
        <Link href="/">
          <button>← Volver a Home</button>
        </Link>
      </div>
    </main>
  );
}
