export const manifest = {
  screens: {
    scr_0t3eyg: { name: "Iniciar sesión", route: "/", state: { "vista": "login" }, position: { "x": 160, "y": 220 } },
    scr_x9lzic: { name: "Agenda — Día", route: "/", state: { "vista": "agenda", "vistaAgenda": "dia" }, position: { "x": 160, "y": 2200 } },
    scr_dywuta: { name: "Agenda — Semana", route: "/", state: { "vista": "agenda", "vistaAgenda": "semana" }, position: { "x": 1560, "y": 2200 } },
    scr_s2hrkg: { name: "Agenda — Mes", route: "/", state: { "vista": "agenda", "vistaAgenda": "mes" }, position: { "x": 2960, "y": 2200 } },
    scr_h5x1iw: { name: "Nueva cita", route: "/", state: { "vista": "agenda", "vistaAgenda": "semana", "dialogo": "nuevo" }, position: { "x": -3650.74, "y": 2137.79 } },
    scr_q413pz: { name: "Editar cita", route: "/", state: { "vista": "agenda", "vistaAgenda": "dia", "dialogo": "editar" }, position: { "x": -2250.74, "y": 2137.79 } }
  },
  sections: {
    sec_oq8toj: { name: "Authentication", x: 0, y: 0, width: 1520, height: 1180 },
    sec_e12q91: { name: "Calendar Views", x: 0, y: 1980, width: 4320, height: 1180 },
    sec_468txd: { name: "Appointment Management", x: -3810.74, y: 1917.79, width: 2920, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_oq8toj", children: [
    { kind: "screen", id: "scr_0t3eyg" }]
  },
  { kind: "section", id: "sec_e12q91", children: [
    { kind: "screen", id: "scr_x9lzic" },
    { kind: "screen", id: "scr_dywuta" },
    { kind: "screen", id: "scr_s2hrkg" }]
  },
  { kind: "section", id: "sec_468txd", children: [
    { kind: "screen", id: "scr_h5x1iw" },
    { kind: "screen", id: "scr_q413pz" }]
  }]

};