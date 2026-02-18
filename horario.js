// Datos base tomados del archivo legacy y normalizados
const clases = [
  { codigo: '0413', asignatura: 'Programación Web', grupo: 'Gpo1', dia: 'MARTES',   inicio: '10:00', fin: '11:40', aula: 'E201' },
  { codigo: '0413', asignatura: 'Programación Web', grupo: 'Gpo1', dia: 'JUEVES',   inicio: '15:00', fin: '16:40', aula: 'E201' },
  { codigo: '0402', asignatura: 'Intro. ING',       grupo: 'Gpo3', dia: 'LUNES',    inicio: '08:00', fin: '09:40', aula: 'D104' },
  { codigo: '0402', asignatura: 'Intro. ING',       grupo: 'Gpo3', dia: 'MIERCOLES',inicio: '08:00', fin: '09:40', aula: 'D104' },
  { codigo: '0402', asignatura: 'Intro. ING',       grupo: 'Gpo4', dia: 'LUNES',    inicio: '10:00', fin: '11:40', aula: 'E201' },
  { codigo: '0402', asignatura: 'Intro. ING',       grupo: 'Gpo4', dia: 'JUEVES',   inicio: '08:00', fin: '09:40', aula: 'E201' },
  { codigo: '0402', asignatura: 'Intro. ING',       grupo: 'Gpo7', dia: 'LUNES',    inicio: '15:00', fin: '16:40', aula: 'D104' },
  { codigo: '0402', asignatura: 'Intro. ING',       grupo: 'Gpo7', dia: 'JUEVES',   inicio: '13:00', fin: '14:40', aula: 'D104' },
  { codigo: '0402', asignatura: 'Intro. ING',       grupo: 'Gpo8', dia: 'MARTES',   inicio: '15:00', fin: '16:40', aula: 'D104' },
  { codigo: '0402', asignatura: 'Intro. ING',       grupo: 'Gpo8', dia: 'MIERCOLES',inicio: '13:00', fin: '14:40', aula: 'D104' },
];

// Utilidades
const diasOrden = ['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];
function horaToInt(hhmm){ return parseInt(hhmm.split(':')[0],10); }

// Render Lista
function renderLista(){
  const tbody = document.getElementById('tbodyLista');
  tbody.innerHTML = '';
  for(const c of clases){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-center">${c.codigo}</td>
      <td class="fw-bold">${c.asignatura}</td>
      <td class="text-center"><span class="badge bg-info text-dark">${c.grupo}</span></td>
      <td class="text-center">${c.dia}</td>
      <td class="text-center">${c.inicio} - ${c.fin}</td>
      <td class="text-center"><span class="badge bg-secondary">${c.aula}</span></td>
    `;
    tbody.appendChild(tr);
  }
}

// Render Calendario con Eje Y generado en bucle y celdas vacías
function renderCalendario(){
  const tbody = document.getElementById('tbodyCalendario');
  tbody.innerHTML = '';

  // Rango de horas (EDITABLE): 8:00 a 18:00
  const startHour = 8, endHour = 18;

  for(let h=startHour; h<endHour; h++){
    const tr = document.createElement('tr');

    // Primera columna (Eje Y): generada por bucle
    const tdHora = document.createElement('td');
    tdHora.className = 'hourcell text-center';
    tdHora.textContent = `${String(h).padStart(2,'0')}:00`;
    tr.appendChild(tdHora);

    // Crear celdas de días; SIEMPRE generar la celda aunque esté vacía
    for(const d of diasOrden){
      const td = document.createElement('td');
      // Buscar si hay clase que inicie exactamente a la hora h
      const match = clases.find(c => c.dia === d && horaToInt(c.inicio) === h);
      if(match){
        const div = document.createElement('div');
        div.className = 'event';
        div.innerHTML = `<div class="fw-bold">${match.asignatura} <span class="badge bg-light text-dark ms-1">${match.grupo}</span></div>
                         <div>${match.inicio} - ${match.fin} • <span class="room">${match.aula}</span></div>`;
        td.appendChild(div);
      }
      // Importante: si no hay clase, NO se omite la celda; queda vacía respetando el layout
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
}

// Toggle botones y vistas
function activarVista(vista){
  const btnLista = document.getElementById('btnLista');
  const btnCalendario = document.getElementById('btnCalendario');
  const seccionLista = document.getElementById('vistaLista');
  const seccionCalendario = document.getElementById('vistaCalendario');

  if(vista === 'lista'){
    btnLista.classList.remove('btn-outline-secondary');
    btnLista.classList.add('btn-primary');
    btnCalendario.classList.remove('btn-primary');
    btnCalendario.classList.add('btn-outline-secondary');
    seccionLista.classList.remove('hidden');
    seccionCalendario.classList.add('hidden');
  } else {
    btnCalendario.classList.remove('btn-outline-secondary');
    btnCalendario.classList.add('btn-primary');
    btnLista.classList.remove('btn-primary');
    btnLista.classList.add('btn-outline-secondary');
    seccionCalendario.classList.remove('hidden');
    seccionLista.classList.add('hidden');
  }
}

// Eventos UI
document.getElementById('btnLista').addEventListener('click', () => activarVista('lista'));
document.getElementById('btnCalendario').addEventListener('click', () => activarVista('calendario'));

// Exportar (generación rápida de CSV)
document.getElementById('btnExport').addEventListener('click', () => {
  const encabezados = ['Código','Asignatura','Grupo','Día','Inicio','Fin','Aula'];
  const filas = clases.map(c => [c.codigo, c.asignatura, c.grupo, c.dia, c.inicio, c.fin, c.aula]);
  const csv = [encabezados, ...filas].map(r => r.map(v => '"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'horario.csv';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
});

// Render inicial
renderLista();
renderCalendario();
activarVista('lista');
