checkAuth();

cargarTodo();

async function cargarTodo() {
    await Promise.all([
        cargarConductoresSelect(),
        cargarVehiculosSelect(),
        cargarRutasSelect(),
        cargarProgramaciones()
    ]);
}

async function cargarConductoresSelect() {
    try {
        const resp = await fetch(API_CONDUCTORES + '/conductores', { headers: authHeaders() });
        const data = await resp.json();
        const sel = document.getElementById('conductor_id');
        sel.innerHTML = '<option value="">Seleccionar...</option>';
        if (Array.isArray(data)) {
            data.filter(c => c.estado !== 'inactivo').forEach(c => {
                sel.innerHTML += `<option value="${c.id}">${c.nombres} ${c.apellidos} — ${c.estado}</option>`;
            });
        }
    } catch (e) {}
}

async function cargarVehiculosSelect() {
    try {
        const resp = await fetch(API_VEHICULOS + '/vehiculos', { headers: authHeaders() });
        const data = await resp.json();
        const sel = document.getElementById('vehiculo_id');
        sel.innerHTML = '<option value="">Seleccionar...</option>';
        if (Array.isArray(data)) {
            data.filter(v => v.estado !== 'mantenimiento' && v.estado !== 'inactivo').forEach(v => {
                sel.innerHTML += `<option value="${v.id}">${v.placa} — ${v.marca} ${v.modelo} (${v.estado})</option>`;
            });
        }
    } catch (e) {}
}

async function cargarRutasSelect() {
    try {
        const resp = await fetch(API_RUTAS + '/rutas', { headers: authHeaders() });
        const data = await resp.json();
        const sel = document.getElementById('ruta_id');
        sel.innerHTML = '<option value="">Seleccionar...</option>';
        if (Array.isArray(data)) {
            data.forEach(r => {
                sel.innerHTML += `<option value="${r.id}">${r.ciudad_origen} → ${r.ciudad_destino} (${r.tiempo_estimado})</option>`;
            });
        }
    } catch (e) {}
}

async function cargarProgramaciones() {
    try {
        const resp = await fetch(API_RUTAS + '/programaciones', { headers: authHeaders() });
        const prog = await resp.json();
        const tbody = document.getElementById('tablaProgramaciones');
        tbody.innerHTML = '';

        if (!Array.isArray(prog) || prog.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999">Sin programaciones</td></tr>';
            return;
        }

        prog.forEach(p => {
            tbody.innerHTML += `
            <tr>
                <td>${p.id}</td><td>${p.conductor_id}</td><td>${p.vehiculo_id}</td>
                <td>${p.ruta_id}</td><td>${p.fecha_salida} ${p.hora_salida}</td>
                <td>${p.fecha_estimada_llegada}</td>
                <td><span class="badge badge-${p.estado}">${p.estado}</span></td>
                <td><button class="btn btn-warning btn-sm" onclick="editarProgramacion(${p.id})">Reprogramar</button></td>
            </tr>`;
        });
    } catch (e) {
        mostrarMensaje('msg', 'Error al cargar programaciones', 'error');
    }
}

async function guardarProgramacion() {
    const id = document.getElementById('programacionId').value;
    const data = {
        conductor_id: parseInt(document.getElementById('conductor_id').value),
        vehiculo_id: parseInt(document.getElementById('vehiculo_id').value),
        ruta_id: parseInt(document.getElementById('ruta_id').value),
        fecha_salida: document.getElementById('fecha_salida').value,
        hora_salida: document.getElementById('hora_salida').value,
        fecha_estimada_llegada: document.getElementById('fecha_estimada_llegada').value,
        observaciones: document.getElementById('observaciones').value,
        estado: 'programado'
    };

    const url = id ? `${API_RUTAS}/programaciones/${id}` : `${API_RUTAS}/programaciones`;

    try {
        const resp = await fetch(url, {
            method: id ? 'PUT' : 'POST',
            headers: authHeaders(),
            body: JSON.stringify(data)
        });
        const res = await resp.json();
        if (resp.ok) {
            mostrarMensaje('msg', id ? 'Programación actualizada' : 'Viaje programado', 'exito');
            cancelarEdicion();
            cargarProgramaciones();
        } else {
            mostrarMensaje('msg', res.mensaje || 'Error', 'error');
        }
    } catch (e) {
        mostrarMensaje('msg', 'Error de conexión', 'error');
    }
}

async function editarProgramacion(id) {
    try {
        const resp = await fetch(`${API_RUTAS}/programaciones/${id}`, { headers: authHeaders() });
        const p = await resp.json();
        document.getElementById('programacionId').value = p.id;
        document.getElementById('conductor_id').value = p.conductor_id;
        document.getElementById('vehiculo_id').value = p.vehiculo_id;
        document.getElementById('ruta_id').value = p.ruta_id;
        document.getElementById('fecha_salida').value = p.fecha_salida;
        document.getElementById('hora_salida').value = p.hora_salida;
        document.getElementById('fecha_estimada_llegada').value = p.fecha_estimada_llegada;
        document.getElementById('observaciones').value = p.observaciones || '';
        document.getElementById('tituloForm').textContent = 'Reprogramar Viaje';
        document.getElementById('btnCancelar').style.display = 'inline-block';
        window.scrollTo(0, 0);
    } catch (e) {
        mostrarMensaje('msg', 'Error al cargar programación', 'error');
    }
}

function cancelarEdicion() {
    document.getElementById('programacionId').value = '';
    ['conductor_id','vehiculo_id','ruta_id','fecha_salida','hora_salida','fecha_estimada_llegada','observaciones']
        .forEach(id => document.getElementById(id).value = '');
    document.getElementById('tituloForm').textContent = 'Programar Viaje';
    document.getElementById('btnCancelar').style.display = 'none';
}