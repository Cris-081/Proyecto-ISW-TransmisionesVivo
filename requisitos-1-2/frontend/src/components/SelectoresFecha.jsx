export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const pad = (n) => String(n).padStart(2, "0");
const diasEnMes = (anio, mes) => new Date(anio, mes, 0).getDate();

/* Selector de fecha completa: día / mes / año. value y min con formato "YYYY-MM-DD" */
export function SelectorFecha({ value, onChange, min }) {
  const [anio, mes, dia] = value.split("-").map(Number);
  const anioMin = Number(min.split("-")[0]);
  const anios = [anioMin, anioMin + 1, anioMin + 2];

  const cambiar = (a, m, d) => {
    d = Math.min(d, diasEnMes(a, m));
    let nueva = `${a}-${pad(m)}-${pad(d)}`;
    if (nueva < min) nueva = min; // no permite fechas pasadas
    onChange(nueva);
  };

  return (
    <div className="selector-fecha">
      <select aria-label="Día" value={dia}
              onChange={(e) => cambiar(anio, mes, Number(e.target.value))}>
        {Array.from({ length: diasEnMes(anio, mes) }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select aria-label="Mes" value={mes}
              onChange={(e) => cambiar(anio, Number(e.target.value), dia)}>
        {MESES.map((nombre, i) => (
          <option key={nombre} value={i + 1}>{nombre}</option>
        ))}
      </select>

      <select aria-label="Año" value={anio}
              onChange={(e) => cambiar(Number(e.target.value), mes, dia)}>
        {anios.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  );
}

/* Selector de mes y año. value con formato "YYYY-MM" */
export function SelectorMes({ value, onChange }) {
  const [anio, mes] = value.split("-").map(Number);
  const actual = new Date().getFullYear();
  const anios = [actual - 1, actual, actual + 1, actual + 2];

  return (
    <div className="selector-fecha">
      <select aria-label="Mes" value={mes}
              onChange={(e) => onChange(`${anio}-${pad(e.target.value)}`)}>
        {MESES.map((nombre, i) => (
          <option key={nombre} value={i + 1}>{nombre}</option>
        ))}
      </select>

      <select aria-label="Año" value={anio}
              onChange={(e) => onChange(`${e.target.value}-${pad(mes)}`)}>
        {anios.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  );
}