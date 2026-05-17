import Link from "next/link";
import { Range } from "@/components/Range/Range";
import { RangeMode } from "@/types/range";
import styles from "../../styles/common.module.css";
import { fetchRangeData } from "@/lib/api";
import { NormalRangeType } from "@/utils/models";

export default async function Exercise1() {
  const data = await fetchRangeData(RangeMode.Normal) as NormalRangeType;

  const normalValues = [data.min, data.max] as [number, number];
  if(!data || !data.min || !data.max) {
    return (
      <main>
        <div>
          <h1>Error fetching data</h1>
          <p>Hubo un error al obtener los datos para el rango normal. Por favor, intenta recargar la página.</p>
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
        <h1>Exercise 1 — Normal Range</h1>
        <div className={styles.description}>
          <p>
            <strong>Modo Normal:</strong> Rango continuo de 1 a 100.
          </p>
          <ul className={styles.descriptionList}>
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
