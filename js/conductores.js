checkAuth();

cargarConductores();

async function cargarConductores() {
    try {
        const resp = await fetch(API_CONDUCTORES + '/conductores', {
            headers: authHeaders()
        });
        const conductores = await resp.json();
        const tbody = document.getElementById('tablaConductores');
        tbody.innerHTML = '';

        if (!Array.isArray(conductores) || conductores.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#999">Sin conductores registrados</td></tr>';
            return;
        }

        conductores.forEach(c => {
            tbody.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.nombres}</td>
                <td>${c.apellidos}</td>
                <td>${c.documento}</td>
                <td>${c.telefono}</td>
                <td>${c.numero_licencia} (${c.categoria_licencia})</td>
                <td>${c.fecha_vencimiento_licencia}</td>
                <td><span class="badge badge-${c.estado}">${c.estado}</span></td>
                <td class="td-acciones">
                    <button class="btn btn-warning btn-sm" onclick="editarConductor(${c.id})">Editar</button>
                    <select class="estado-select" id="estado-${c.id}">
                        <option value="disponible" ${c.estado==='disponible'?'selected':''}>Disponible</option>
                        <option value="en_ruta" ${c.estado==='en_ruta'?'selected':''}>En ruta</option>
                        <option value="inactivo" ${c.estado==='inactivo'?'selected':''}>Inactivo</option>
                    </select>
                    <button class="btn btn-primary btn-sm" onclick="cambiarEstado(${c.id})">Cambiar</button>
                </td>
            </tr>`;
        });
    } catch (e) {
        console.error(e);
        mostrarMensaje('msg', 'Error al cargar conductores', 'error');
    }
}

async function guardarConductor() {
    const id = document.getElementById('conductorId').value;
    const data = {
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        documento: document.getElementById('documento').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        numero_licencia: document.getElementById('numero_licencia').value,
        categoria_licencia: document.getElementById('categoria_licencia').value,
        fecha_vencimiento_licencia: document.getElementById('fecha_vencimiento_licencia').value
    };

    const url = id
        ? `${API_CONDUCTORES}/conductores/${id}`
        : `${API_CONDUCTORES}/conductores`;

    if (id) data.estado = 'disponible';

    try {
        const resp = await fetch(url, {
            method: id ? 'PUT' : 'POST',
            headers: authHeaders(),
            body: JSON.stringify(data)
        });
        const res = await resp.json();

        if (resp.ok) {
            mostrarMensaje('msg', id ? 'Conductor actualizado' : 'Conductor registrado', 'exito');
            cancelarEdicion();
            cargarConductores();
        } else {
            mostrarMensaje('msg', res.mensaje || 'Error al guardar', 'error');
        }
    } catch (e) {
        mostrarMensaje('msg', 'Error de conexión', 'error');
    }
}

async function editarConductor(id) {
    try {
        const resp = await fetch(`${API_CONDUCTORES}/conductores/${id}`, {
            headers: authHeaders()
        });
        const c = await resp.json();

        document.getElementById('conductorId').value = c.id;
        document.getElementById('nombres').value = c.nombres;
        document.getElementById('apellidos').value = c.apellidos;
        document.getElementById('documento').value = c.documento;
        document.getElementById('telefono').value = c.telefono;
        document.getElementById('correo').value = c.correo;
        document.getElementById('numero_licencia').value = c.numero_licencia;
        document.getElementById('categoria_licencia').value = c.categoria_licencia;
        document.getElementById('fecha_vencimiento_licencia').value = c.fecha_vencimiento_licencia;

        document.getElementById('tituloForm').textContent = 'Editar Conductor';
        document.getElementById('btnGuardar').textContent = 'Actualizar';
        document.getElementById('btnCancelar').style.display = 'inline-block';
        window.scrollTo(0, 0);
    } catch (e) {
        mostrarMensaje('msg', 'Error al cargar conductor', 'error');
    }
}

function cancelarEdicion() {
    document.getElementById('conductorId').value = '';
    ['nombres','apellidos','documento','telefono','correo',
     'numero_licencia','categoria_licencia','fecha_vencimiento_licencia']
        .forEach(id => document.getElementById(id).value = '');
    document.getElementById('tituloForm').textContent = 'Registrar Conductor';
    document.getElementById('btnGuardar').textContent = 'Registrar';
    document.getElementById('btnCancelar').style.display = 'none';
}

async function cambiarEstado(id) {
    const estado = document.getElementById('estado-' + id).value;
    try {
        const resp = await fetch(`${API_CONDUCTORES}/conductores/${id}/estado`, {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify({ estado })
        });
        const res = await resp.json();
        if (resp.ok) {
            mostrarMensaje('msg', 'Estado actualizado', 'exito');
            cargarConductores();
        } else {
            mostrarMensaje('msg', res.mensaje || 'Error', 'error');
        }
    } catch (e) {
        mostrarMensaje('msg', 'Error de conexión', 'error');
    }
}