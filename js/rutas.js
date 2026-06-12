checkAuth();

cargarRutas();

async function cargarRutas() {
    try {
        const resp = await fetch(API_RUTAS + '/rutas', { headers: authHeaders() });
        const rutas = await resp.json();
        const tbody = document.getElementById('tablaRutas');
        tbody.innerHTML = '';

        if (!Array.isArray(rutas) || rutas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999">Sin rutas registradas</td></tr>';
            return;
        }

        rutas.forEach(r => {
            tbody.innerHTML += `
            <tr>
                <td>${r.id}</td><td>${r.ciudad_origen}</td><td>${r.ciudad_destino}</td>
                <td>${r.distancia}</td><td>${r.tiempo_estimado}</td>
                <td>${r.observaciones || '-'}</td>
                <td><button class="btn btn-warning btn-sm" onclick="editarRuta(${r.id})">Editar</button></td>
            </tr>`;
        });
    } catch (e) {
        mostrarMensaje('msg', 'Error al cargar rutas', 'error');
    }
}

async function guardarRuta() {
    const id = document.getElementById('rutaId').value;
    const data = {
        ciudad_origen: document.getElementById('ciudad_origen').value,
        ciudad_destino: document.getElementById('ciudad_destino').value,
        distancia: parseFloat(document.getElementById('distancia').value),
        tiempo_estimado: document.getElementById('tiempo_estimado').value,
        observaciones: document.getElementById('observaciones').value
    };

    const url = id ? `${API_RUTAS}/rutas/${id}` : `${API_RUTAS}/rutas`;

    try {
        const resp = await fetch(url, {
            method: id ? 'PUT' : 'POST',
            headers: authHeaders(),
            body: JSON.stringify(data)
        });
        const res = await resp.json();
        if (resp.ok) {
            mostrarMensaje('msg', id ? 'Ruta actualizada' : 'Ruta registrada', 'exito');
            cancelarEdicion();
            cargarRutas();
        } else {
            mostrarMensaje('msg', res.mensaje || 'Error', 'error');
        }
    } catch (e) {
        mostrarMensaje('msg', 'Error de conexión', 'error');
    }
}

async function editarRuta(id) {
    try {
        const resp = await fetch(`${API_RUTAS}/rutas/${id}`, { headers: authHeaders() });
        const r = await resp.json();
        document.getElementById('rutaId').value = r.id;
        document.getElementById('ciudad_origen').value = r.ciudad_origen;
        document.getElementById('ciudad_destino').value = r.ciudad_destino;
        document.getElementById('distancia').value = r.distancia;
        document.getElementById('tiempo_estimado').value = r.tiempo_estimado;
        document.getElementById('observaciones').value = r.observaciones || '';
        document.getElementById('tituloForm').textContent = 'Editar Ruta';
        document.getElementById('btnCancelar').style.display = 'inline-block';
        window.scrollTo(0, 0);
    } catch (e) {
        mostrarMensaje('msg', 'Error al cargar ruta', 'error');
    }
}

function cancelarEdicion() {
    document.getElementById('rutaId').value = '';
    ['ciudad_origen','ciudad_destino','distancia','tiempo_estimado','observaciones']
        .forEach(id => document.getElementById(id).value = '');
    document.getElementById('tituloForm').textContent = 'Registrar Ruta';
    document.getElementById('btnCancelar').style.display = 'none';
}