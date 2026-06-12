const tabla =
    document.getElementById(
        "tablaConductores"
    );

const formConductor =
    document.getElementById(
        "formConductor"
    );

formConductor.addEventListener(
    "submit",
    crearConductor
);

const btnCargar =
    document.getElementById(
        "btnCargar"
    );

btnCargar.addEventListener(
    "click",
    cargarConductores
);

cargarConductores();

async function cargarConductores()
{
    try {

        const respuesta =
            await fetch(
                "http://localhost:8001/conductores"
            );

        const conductores =
            await respuesta.json();

        tabla.innerHTML = "";

        conductores.forEach(
            conductor =>
        {

            tabla.innerHTML += `
                <tr>
                    <td>${conductor.id}</td>
                    <td>${conductor.nombres}</td>
                    <td>${conductor.apellidos}</td>
                    <td>${conductor.documento}</td>
                    <td>${conductor.telefono}</td>
                    <td>${conductor.correo}</td>
                    <td>${conductor.numero_licencia}</td>
                    <td>${conductor.categoria_licencia}</td>
                    <td>${conductor.fecha_vencimiento_licencia}</td>
                    <td>${conductor.estado}</td>
                </tr>
            `;

        });

    }
    catch(error)
    {
        console.error(error);
    }
}

async function crearConductor(event)
{
    event.preventDefault();

    const conductor = {

        nombres:
            document.getElementById(
                "nombres"
            ).value,

        apellidos:
            document.getElementById(
                "apellidos"
            ).value,

        documento:
            document.getElementById(
                "documento"
            ).value,

        telefono:
            document.getElementById(
                "telefono"
            ).value,

        correo:
            document.getElementById(
                "correo"
            ).value,

        numero_licencia:
            document.getElementById(
                "numero_licencia"
            ).value,

        categoria_licencia:
            document.getElementById(
                "categoria_licencia"
            ).value,

        fecha_vencimiento_licencia:
            document.getElementById(
                "fecha_vencimiento_licencia"
            ).value
    };

    try {

        const respuesta =
            await fetch(
                "http://localhost:8001/conductores",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(
                        conductor
                    )
                }
            );

        const data =
            await respuesta.json();

        alert(
            data.mensaje ??
            "Conductor creado correctamente"
        );

        if (
            respuesta.ok
        ) {
            formConductor.reset();
            cargarConductores();
        }

    }
    catch(error)
    {
        console.error(error);

        alert(
            "Error al conectar con el servidor"
        );
    }
}