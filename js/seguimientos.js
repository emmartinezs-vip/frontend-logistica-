checkAuth();

cargarTodo();

document.getElementById('programacion_id').addEventListener('change', function() {
    const id = this.value;
    if (id) cargarHistorial(id);
    else document.getElementById('seccionHistorial').style.display = 'none';
});

async function cargarTodo() {
    await Promise.all([cargarProgramacionesSelect(), cargarSeguimientos()]);
}

async function cargarProgramacionesSelect() {
    try {
        const resp = await fetch(API_RUTAS + '/programaciones', { headers: authHeaders() });
        const prog = await resp.json();
        const sel = document.getElementById('programacion_id');
        sel.innerHTML = '<option value="">Seleccionar...</option>';
        if (Array.isArray(prog)) {
            prog.forEach(p => {
                sel.innerHTML += `<option value="${p.id}">Prog. #${p.id} — Conductor ${p.conductor_id} / Vehículo ${p.vehiculo_id} (${p.estado})</option>`;
            });
        }
    } catch (e) {}
}

async function cargarSeguimientos() {
    try {
        const resp = await fetch(API_VIAJES + '/seguimientos', { headers: authHeaders() });
        const segs = await resp.json();
        const tbody = document.getElementById('tablaSeguimientos');
        tbody.innerHTML = '';

        if (!Array.isArray(segs) || segs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999">Sin seguimientos registrados</td></tr>';
            return;
        }

        segs.forEach(s => {
            tbody.innerHTML += `
            <tr>
                <td>${s.id}</td><td>#${s.programacion_viaje_id}</td>
                <td>${s.fecha}</td><td>${s.hora}</td>
                <td><span class="badge badge-${s.estado}">${s.estado}</span></td>
                <td>${s.novedad || '-'}</td>
            </tr>`;
        });
    } catch (e) {
        mostrarMensaje('msg', 'Error al cargar seguimientos', 'error');
    }
}

async function cargarHistorial(programacion_id) {
    try {
        const resp = await fetch(`${API_VIAJES}/seguimientos/programacion/${programacion_id}`, {
            headers: authHeaders()
        });
        const hist = await resp.json();
        const tbody = document.getElementById('tablaHistorial');
        tbody.innerHTML = '';
        document.getElementById('seccionHistorial').style.display = 'block';

        if (!Array.isArray(hist) || hist.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999">Sin historial para esta programación</td></tr>';
            return;
        }

        hist.forEach(h => {
            tbody.innerHTML += `
            <tr>
                <td>${h.id}</td><td>${h.fecha}</td><td>${h.hora}</td>
                <td><span class="badge badge-${h.estado}">${h.estado}</span></td>
                <td>${h.novedad || '-'}</td>
            </tr>`;
        });
    } catch (e) {}
}

async function iniciarViaje() {
    const id = document.getElementById('programacion_id').value;
    if (!id) { mostrarMensaje('msg', 'Selecciona una programación', 'error'); return; }
    try {
        const resp = await fetch(API_VIAJES + '/seguimientos/iniciar', {
            method: 'POST', headers: authHeaders(),
            body: JSON.stringify({ programacion_viaje_id: parseInt(id) })
        });
        const res = await resp.json();
        if (resp.ok) { mostrarMensaje('msg', 'Viaje iniciado correctamente', 'exito'); cargarTodo(); cargarHistorial(id); }
        else mostrarMensaje('msg', res.mensaje || 'Error', 'error');
    } catch (e) { mostrarMensaje('msg', 'Error de conexión', 'error'); }
}

async function registrarNovedad() {
    const id = document.getElementById('programacion_id').value;
    const novedad = document.getElementById('novedad').value;
    const estado = document.getElementById('estado_novedad').value;
    if (!id) { mostrarMensaje('msg', 'Selecciona una programación', 'error'); return; }
    if (!novedad) { mostrarMensaje('msg', 'Escribe una novedad', 'error'); return; }
    try {
        const resp = await fetch(API_VIAJES + '/seguimientos/novedad', {
            method: 'POST', headers: authHeaders(),
            body: JSON.stringify({ programacion_viaje_id: parseInt(id), estado, novedad })
        });
        const res = await resp.json();
        if (resp.ok) {
            mostrarMensaje('msg', 'Novedad registrada', 'exito');
            document.getElementById('novedad').value = '';
            cargarTodo(); cargarHistorial(id);
        } else mostrarMensaje('msg', res.mensaje || 'Error', 'error');
    } catch (e) { mostrarMensaje('msg', 'Error de conexión', 'error'); }
}

async function finalizarViaje() {
    const id = document.getElementById('programacion_id').value;
    if (!id) { mostrarMensaje('msg', 'Selecciona una programación', 'error'); return; }
    try {
        const resp = await fetch(API_VIAJES + '/seguimientos/finalizar', {
            method: 'PATCH', headers: authHeaders(),
            body: JSON.stringify({ programacion_viaje_id: parseInt(id) })
        });
        const res = await resp.json();
        if (resp.ok) { mostrarMensaje('msg', 'Viaje finalizado', 'exito'); cargarTodo(); cargarHistorial(id); }
        else mostrarMensaje('msg', res.mensaje || 'Error', 'error');
    } catch (e) { mostrarMensaje('msg', 'Error de conexión', 'error'); }
}