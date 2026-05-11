import Link from "next/link";
import styles from "../styles/common.module.css"

export default function Home() {
  return (
    <main>
      <div>
        <h1>Prueba Técnica — Mango Range Component</h1>
        <div className={styles.description}>
          <p>
            Un componente de rango (Range Slider) personalizado con dos modos de operación:
          </p>
          <ul style={{ marginTop: "12px", marginLeft: "20px" }}>
            <li><strong>Modo Normal:</strong> Rango continuo con valores editables</li>
            <li><strong>Modo Fijo:</strong> Selección de valores predefinidos con snap automático</li>
          </ul>
          <p style={{ marginTop: "12px" }}>
            El componente incluye arrastre de manejadores (handles), etiquetas editables, retroalimentación visual y cumple con estándares de accesibilidad ARIA.
          </p>
        </div>
      </div>

      <div className={styles.navButtons}>
        <Link href="/exercise-1">
          <button>Ir a Ejercicio 1</button>
        </Link>
      </div>
    </main>
  );
}
