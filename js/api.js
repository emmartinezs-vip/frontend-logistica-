const API_AUTH       = "http://localhost:8000";
const API_CONDUCTORES = "http://localhost:8001";
const API_VEHICULOS  = "http://localhost:8002";
const API_RUTAS      = "http://localhost:8003";
const API_VIAJES     = "http://localhost:8004";

function getToken() {
    return localStorage.getItem("token");
}

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    };
}

function checkAuth() {
    if (!getToken()) {
        window.location.href = "../index.html";
        return false;
    }
    return true;
}

function mostrarMensaje(id, texto, tipo = "exito") {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = "msg msg-" + tipo;
    el.textContent = texto;
    setTimeout(() => {
        el.textContent = "";
        el.className = "";
    }, 3500);
}

async function cerrarSesion() {
    const token = getToken();
    try {
        await fetch(API_AUTH + "/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        });
    } catch (e) {}
    localStorage.clear();
    window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnLogout");
    if (btn) btn.addEventListener("click", cerrarSesion);
});