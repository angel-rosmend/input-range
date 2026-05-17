import Link from "next/link";
import { Range } from "@/components/Range/Range";
import { RangeMode } from "@/types/range";
import styles from "../../styles/common.module.css";
import { fetchRangeData } from "@/lib/api";
import { FixedRangeType } from "@/utils/models";

export default async function Exercise2() {
  
  const data = await fetchRangeData(RangeMode.Fixed) as FixedRangeType

  const fixedValues = data.rangeValues;

  if(!data || !data.rangeValues) {
    return (
      <main>
        <div>
          <h1>Error fetching data</h1>
          <p>Hubo un error al obtener los datos para el rango fijo. Por favor, intenta recargar la página.</p>
        </div>
        <div className={styles.navButtons}>
          <Link href="/">
            <button>← Volver a Home</button>
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main>
      <div>
        <h1>Exercise 2 — Fixed Range</h1>
        <div className={styles.description}>
          <p>
            <strong>Modo Fijo:</strong> Selección entre 6 valores predefinidos (precios en €).
          </p>
          <ul className={styles.descriptionList}>
            <li>Arrastra los manejadores para hacer snap a los valores disponibles</li>
            <li>Las etiquetas no son editables — son solo para visualizar</li>
            <li>Formatos de moneda (de-DE): 1.99€, 5.99€, 10.99€, 30.99€, 50.99€, 70.99€</li>
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
