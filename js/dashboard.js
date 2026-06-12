const btnLogout =
    document.getElementById(
        "btnLogout"
    );

btnLogout.addEventListener(
    "click",
    cerrarSesion
);

async function cerrarSesion()
{
    const token =
        localStorage.getItem(
            "token"
        );

    try {

        await fetch(
            "http://localhost:8000/logout",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    token: token
                })
            }
        );

        localStorage.removeItem(
            "token"
        );

        window.location.href =
            "../index.html";

    } catch(error) {

        console.error(error);

    }
}