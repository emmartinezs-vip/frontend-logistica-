checkAuth();

cargarVehiculos();

async function cargarVehiculos() {
    try {
        const resp = await fetch(API_VEHICULOS + '/vehiculos', { headers: authHeaders() });
        const vehiculos = await resp.json();
        const tbody = document.getElementById('tablaVehiculos');
        tbody.innerHTML = '';

        if (!Array.isArray(vehiculos) || vehiculos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999">Sin vehículos registrados</td></tr>';
            return;
        }

        vehiculos.forEach(v => {
            tbody.innerHTML += `
            <tr>
                <td>${v.id}</td><td>${v.placa}</td><td>${v.marca}</td><td>${v.modelo}</td>
                <td>${v.tipo_vehiculo}</td><td>${v.capacidad_carga}</td>
                <td><span class="badge badge-${v.estado}">${v.estado}</span></td>
                <td class="td-acciones">
                    <button class="btn btn-warning btn-sm" onclick="editarVehiculo(${v.id})">Editar</button>
                    <select class="estado-select" id="estado-${v.id}">
                        <option value="disponible" ${v.estado==='disponible'?'selected':''}>Disponible</option>
                        <option value="en_ruta" ${v.estado==='en_ruta'?'selected':''}>En ruta</option>
                        <option value="mantenimiento" ${v.estado==='mantenimiento'?'selected':''}>Mantenimiento</option>
                        <option value="inactivo" ${v.estado==='inactivo'?'selected':''}>Inactivo</option>
                    </select>
                    <button class="btn btn-primary btn-sm" onclick="cambiarEstado(${v.id})">Cambiar</button>
                </td>
            </tr>`;
        });
    } catch (e) {
        mostrarMensaje('msg', 'Error al cargar vehículos', 'error');
    }
}

async function guardarVehiculo() {
    const id = document.getElementById('vehiculoId').value;
    const data = {
        placa: document.getElementById('placa').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        tipo_vehiculo: document.getElementById('tipo_vehiculo').value,
        capacidad_carga: parseFloat(document.getElementById('capacidad_carga').value)
    };
    if (id) data.estado = 'disponible';

    const url = id ? `${API_VEHICULOS}/vehiculos/${id}` : `${API_VEHICULOS}/vehiculos`;

    try {
        const resp = await fetch(url, {
            method: id ? 'PUT' : 'POST',
            headers: authHeaders(),
            body: JSON.stringify(data)
        });
        const res = await resp.json();
        if (resp.ok) {
            mostrarMensaje('msg', id ? 'Vehículo actualizado' : 'Vehículo registrado', 'exito');
            cancelarEdicion();
            cargarVehiculos();
        } else {
            mostrarMensaje('msg', res.mensaje || 'Error', 'error');
        }
    } catch (e) {
        mostrarMensaje('msg', 'Error de conexión', 'error');
    }
}

async function editarVehiculo(id) {
    try {
        const resp = await fetch(`${API_VEHICULOS}/vehiculos/${id}`, { headers: authHeaders() });
        const v = await resp.json();
        document.getElementById('vehiculoId').value = v.id;
        document.getElementById('placa').value = v.placa;
        document.getElementById('marca').value = v.marca;
        document.getElementById('modelo').value = v.modelo;
        document.getElementById('tipo_vehiculo').value = v.tipo_vehiculo;
        document.getElementById('capacidad_carga').value = v.capacidad_carga;
        document.getElementById('tituloForm').textContent = 'Editar Vehículo';
        document.getElementById('btnCancelar').style.display = 'inline-block';
        window.scrollTo(0, 0);
    } catch (e) {
        mostrarMensaje('msg', 'Error al cargar vehículo', 'error');
    }
}

function cancelarEdicion() {
    document.getElementById('vehiculoId').value = '';
    ['placa','marca','modelo','tipo_vehiculo','capacidad_carga']
        .forEach(id => document.getElementById(id).value = '');
    document.getElementById('tituloForm').textContent = 'Registrar Vehículo';
    document.getElementById('btnCancelar').style.display = 'none';
}

async function cambiarEstado(id) {
    const estado = document.getElementById('estado-' + id).value;
    try {
        const resp = await fetch(`${API_VEHICULOS}/vehiculos/${id}/estado`, {
            method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ estado })
        });
        const res = await resp.json();
        if (resp.ok) { mostrarMensaje('msg', 'Estado actualizado', 'exito'); cargarVehiculos(); }
        else mostrarMensaje('msg', res.mensaje || 'Error', 'error');
    } catch (e) { mostrarMensaje('msg', 'Error de conexión', 'error'); }
}