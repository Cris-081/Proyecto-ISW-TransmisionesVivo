import { useCallback, useEffect, useState } from "react";
import { getKits, createKit, updateKit, deleteKit, assignKit, releaseKit } from "../services/kit.service.js";
import { getTeams } from "../services/admin.service.js";
import { TIPOS_ITEM, labelTipoItem } from "../helpers/labels.js";
import { getErrorMessage } from "../helpers/errors.js";
import "../styles/Admin.css";

let rowKey = 0;
const newRow = (tipo = "accesorio") => ({ _k: ++rowKey, tipo, nombre: "", numeroSerie: "" });

// Un kit nuevo si o si tiene una camara y un microfono
const emptyForm = () => ({
  id: null,
  nombre: "",
  descripcion: "",
  items: [newRow("camara"), newRow("microfono")],
});

const FILTROS = [
  { value: "", label: "Todos" },
  { value: "Disponible", label: "Disponibles" },
  { value: "Ocupado", label: "Ocupados" },
];

export default function InventarioPage() {
  const [kits, setKits] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [form, setForm] = useState(null);
  const [selected, setSelected] = useState({}); // el kit id para asignarlo a un equipo
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [kitsData, teamsData] = await Promise.all([getKits(), getTeams()]);
      setKits(kitsData.data || []);
      setTeams(teamsData.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (action) => {
    setError("");
    try {
      await action();
      await load();
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  };


  const openEdit = (kit) =>
    setForm({
      id: kit.id,
      nombre: kit.nombre,
      descripcion: kit.descripcion || "",
      items: kit.items.map((i) => ({ _k: ++rowKey, tipo: i.tipo, nombre: i.nombre, numeroSerie: i.numeroSerie || "" })),
    });

  const setItem = (key, field, value) =>
    setForm((f) => ({ ...f, items: f.items.map((i) => (i._k === key ? { ...i, [field]: value } : i)) }));

  const removeItem = (key) => setForm((f) => ({ ...f, items: f.items.filter((i) => i._k !== key) }));

  const handleSave = async (e) => {
    e.preventDefault();
    const items = form.items.map(({ tipo, nombre, numeroSerie }) => ({ tipo, nombre: nombre.trim(), numeroSerie }));

    if (!items.some((i) => i.tipo === "camara") || !items.some((i) => i.tipo === "microfono")) {
      setError("El kit debe incluir al menos una camara y un microfono.");
      return;
    }
    if (items.some((i) => !i.nombre)) {
      setError("Todos los equipos necesitan un nombre o modelo.");
      return;
    }

    const payload = { nombre: form.nombre.trim(), descripcion: form.descripcion, items };
    const ok = await run(() => (form.id ? updateKit(form.id, payload) : createKit(payload)));
    if (ok) setForm(null);
  };

  
  const handleAssign = async (kit) => {
    const ok = await run(() => assignKit(kit.id, Number(selected[kit.id])));
    if (ok) setSelected((s) => ({ ...s, [kit.id]: "" }));
  };

  const handleRelease = (kit) => run(() => releaseKit(kit.id));

  const handleDelete = (kit) => {
    if (!window.confirm(`Eliminar el kit "${kit.nombre}"? Esta accion no se puede deshacer.`)) return;
    run(() => deleteKit(kit.id));
  };

  const disponibles = kits.filter((k) => k.estado === "Disponible").length;
  const visibles = filtro ? kits.filter((k) => k.estado === filtro) : kits;

  return (
    <main className="content">
      <p className="section-label">Administracion</p>
      <h1 className="page-title">Inventario de kits</h1>
      <p className="welcome-copy">
        {kits.length} kits - {disponibles} disponibles - {kits.length - disponibles} ocupados
      </p>

      {error && (
        <p className="alert-error" role="alert">
          {error}
        </p>
      )}

      <div className="kit-toolbar">
        <div className="filter-group" role="group" aria-label="Filtrar por estado">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`btn-small${filtro === f.value ? " primary" : ""}`}
              aria-pressed={filtro === f.value}
              onClick={() => setFiltro(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {!form && (
          <button type="button" className="btn-small primary" onClick={() => setForm(emptyForm())}>
            Nuevo kit
          </button>
        )}
      </div>

      {form && (
        <form className="kit-form" onSubmit={handleSave}>
          <h2>{form.id ? "Editar kit" : "Nuevo kit"}</h2>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="kit-nombre">Nombre del kit</label>
              <input
                id="kit-nombre"
                placeholder="Ej. Kit 1"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="kit-desc">Descripcion (opcional)</label>
              <input
                id="kit-desc"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>
          </div>

          <p className="kit-form-label">Equipos del kit (minimo una camara y un microfono)</p>
          <ul className="item-rows">
            {form.items.map((item, idx) => (
              <li key={item._k} className="item-row">
                <select
                  aria-label={`Tipo del equipo ${idx + 1}`}
                  value={item.tipo}
                  onChange={(e) => setItem(item._k, "tipo", e.target.value)}
                >
                  {Object.entries(TIPOS_ITEM).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <input
                  aria-label={`Nombre o modelo del equipo ${idx + 1}`}
                  placeholder="Nombre o modelo"
                  value={item.nombre}
                  onChange={(e) => setItem(item._k, "nombre", e.target.value)}
                />
                <input
                  aria-label={`Numero de serie del equipo ${idx + 1}`}
                  placeholder="Numero de serie (opcional)"
                  value={item.numeroSerie}
                  onChange={(e) => setItem(item._k, "numeroSerie", e.target.value)}
                />
                <button type="button" className="btn-small danger" onClick={() => removeItem(item._k)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>

          <div className="row-actions">
            <button type="button" className="btn-small" onClick={() => setForm({ ...form, items: [...form.items, newRow()] })}>
              + Agregar equipo
            </button>
          </div>

          <div className="row-actions form-buttons">
            <button type="submit" className="btn-small primary">
              {form.id ? "Guardar cambios" : "Crear kit"}
            </button>
            <button type="button" className="btn-small" onClick={() => setForm(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {visibles.length ? (
        <ul className="kit-grid">
          {visibles.map((kit) => {
            const ocupado = kit.estado === "Ocupado";
            return (
              <li key={kit.id} className="kit-card">
                <div className="kit-card-head">
                  <h3>{kit.nombre}</h3>
                  <span className={`badge ${ocupado ? "ocupado" : "disponible"}`}>{kit.estado}</span>
                </div>
                {kit.descripcion && <p className="muted">{kit.descripcion}</p>}

                <ul className="kit-items">
                  {kit.items.map((item) => (
                    <li key={item.id}>
                      <span className="item-tipo">{labelTipoItem(item.tipo)}</span>
                      {item.nombre}
                      {item.numeroSerie && <small> - S/N {item.numeroSerie}</small>}
                    </li>
                  ))}
                </ul>

                {ocupado && <p className="kit-team">Asignado a: <strong>{kit.team?.name}</strong></p>}

                <div className="kit-actions">
                  {ocupado ? (
                    <button type="button" className="btn-small" onClick={() => handleRelease(kit)}>
                      Liberar kit
                    </button>
                  ) : (
                    <div className="assign-row">
                      <select
                        aria-label={`Equipo para ${kit.nombre}`}
                        value={selected[kit.id] || ""}
                        onChange={(e) => setSelected((s) => ({ ...s, [kit.id]: e.target.value }))}
                        disabled={!teams.length}
                      >
                        <option value="">{teams.length ? "Asignar a equipo..." : "No hay equipos creados"}</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn-small primary"
                        disabled={!selected[kit.id]}
                        onClick={() => handleAssign(kit)}
                      >
                        Asignar
                      </button>
                    </div>
                  )}
                  <div className="row-actions">
                    <button type="button" className="btn-small" onClick={() => openEdit(kit)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn-small danger"
                      disabled={ocupado}
                      title={ocupado ? "Libera el kit antes de eliminarlo" : undefined}
                      onClick={() => handleDelete(kit)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="muted kit-empty">
          {kits.length ? "No hay kits con ese estado." : "Todavia no hay kits en el inventario."}
        </p>
      )}
    </main>
  );
}
