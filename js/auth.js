const formulario =
document.getElementById("loginForm");

formulario.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        const usuario =
        document.getElementById("usuario").value;

        const contrasena =
        document.getElementById("contrasena").value;

        try{

            const respuesta =
            await fetch(
                API_AUTH + "/login",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":
                        "application/json"
                    },
                    body:JSON.stringify({
                        usuario,
                        contrasena
                    })
                }
            );

            const data =
            await respuesta.json();

            if(data.success){

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(
                        data.usuario
                    )
                );


                window.location.href =
                "pages/dashboard.html";

            }else{

                document.getElementById(
                    "mensaje"
                ).innerText =
                data.mensaje;
            }

        }catch(error){

            document.getElementById(
                "mensaje"
            ).innerText =
            "Error de conexión";
        }
    }
);