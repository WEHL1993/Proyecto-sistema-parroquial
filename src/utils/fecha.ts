export function formatoFechaCorta(fechaIso: string): string {
  if (!fechaIso) return '';
  const [y, m, d] = fechaIso.split('-').map(Number);
  if (!y || !m || !d) return fechaIso;
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

export function calcularEdad(fechaIso: string, referencia = new Date()): number | null {
  if (!fechaIso) return null;
  const nacimiento = new Date(`${fechaIso}T00:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return null;
  let edad = referencia.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
  referencia.getMonth() < nacimiento.getMonth() ||
  referencia.getMonth() === nacimiento.getMonth() && referencia.getDate() < nacimiento.getDate();
  if (aunNoCumple) edad -= 1;
  return edad;
}
