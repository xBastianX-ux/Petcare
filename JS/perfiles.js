document.addEventListener('DOMContentLoaded', () => {
    // Variable global para controlar qué mascota está activa en la pantalla
    let mascotaSeleccionadaId = null;

    console.log("🐾 PetCare Ecosistema: Módulo de alertas inteligentes por fecha activado.");

    // ==========================================
    // 1. CAPTURA DE COMPONENTES E INTERFACES
    // ==========================================
    const btnUnirme = document.querySelector('.btn-unir');
    const btnNuevaMascota = document.querySelector('.btn-nueva-mascota');
    const contenedorMascotas = document.getElementById('lista-mascotas-principal');
    const formMascota = document.getElementById('form-nueva-mascota');

    // Módulo de Citas Médicas
    const formCita = document.getElementById('form-cita-registro');
    const contenedorCitas = document.getElementById('citas-lista-dinamica');
    const btnAbrirCita = document.getElementById('abrir-modal-cita');

    // Módulo de Vacunas
    const formVacuna = document.getElementById('form-nueva-vacuna');
    const contenedorVacunas = document.getElementById('vacunas-container');
    const btnAbrirVacuna = document.querySelector('[data-tipo="vacuna"]');

    // Módulo de Paseos
    const formPaseo = document.getElementById('form-nuevo-paseo');
    const contenedorPaseos = document.getElementById('lista-paseos');
    const btnAbrirPaseo = document.querySelector('[data-tipo="paseo"]');

    // ==========================================
    // FUNCIÓN AUXILIAR: CALCULAR DÍAS RESTANTES
    // ==========================================
    function calcularDiasRestantes(fechaDestino) {
        if (!fechaDestino) return null;
        
        const hoy = new Date();
        const destino = new Date(fechaDestino);
        
        // Normalizar a medianoche para evitar desfases de horas
        hoy.setHours(0, 0, 0, 0);
        destino.setHours(0, 0, 0, 0);
        
        const diferenciaMs = destino - hoy;
        // Convierte milisegundos a días exactos
        return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
    }

    // ==========================================
    // 2. SISTEMA DE AUTENTICACIÓN INTEGRADO
    // ==========================================
    const modalAuthHTML = `
    <div id="modalAuth" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:9999; justify-content:center; align-items:center; font-family:sans-serif;">
        <div style="background:white; padding:30px; border-radius:12px; width:320px; color:black; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            <div style="display:flex; justify-content:space-around; margin-bottom:20px;">
                <button id="tab-login" type="button" style="border:none; background:none; font-weight:bold; cursor:pointer; font-size:16px; border-bottom:2px solid #f1c40f; padding-bottom:5px;">Iniciar Sesión</button>
                <button id="tab-registro" type="button" style="border:none; background:none; font-weight:bold; cursor:pointer; font-size:16px; color:gray; padding-bottom:5px;">Registrarse</button>
            </div>
            <form id="form-login-api">
                <input type="email" id="login-email" placeholder="Correo Electrónico" required style="width:92%; margin-bottom:12px; padding:10px; border:1px solid #ccc; border-radius:5px;">
                <input type="password" id="login-pass" placeholder="Contraseña" required style="width:92%; margin-bottom:18px; padding:10px; border:1px solid #ccc; border-radius:5px;">
                <button type="submit" style="background:#f1c40f; width:100%; border:none; padding:12px; font-weight:bold; cursor:pointer; border-radius:5px; color:white;">INGRESAR</button>
            </form>
            <form id="form-registro-api" style="display:none;">
                <input type="text" id="reg-nombre" placeholder="Nombre completo" required style="width:92%; margin-bottom:12px; padding:10px; border:1px solid #ccc; border-radius:5px;">
                <input type="email" id="reg-email" placeholder="Correo Electrónico" required style="width:92%; margin-bottom:12px; padding:10px; border:1px solid #ccc; border-radius:5px;">
                <input type="password" id="reg-pass" placeholder="Contraseña" required style="width:92%; margin-bottom:18px; padding:10px; border:1px solid #ccc; border-radius:5px;">
                <button type="submit" style="background:#28a745; color:white; width:100%; border:none; padding:12px; font-weight:bold; cursor:pointer; border-radius:5px;">REGISTRARME</button>
            </form>
            <button type="button" onclick="document.getElementById('modalAuth').style.display='none'" style="margin-top:15px; background:none; border:none; color:gray; width:100%; cursor:pointer; text-align:center;">Volver</button>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalAuthHTML);

    const modalAuth = document.getElementById('modalAuth');
    const tabLogin = document.getElementById('tab-login');
    const tabRegistro = document.getElementById('tab-registro');
    const formLoginApi = document.getElementById('form-login-api');
    const formRegistroApi = document.getElementById('form-registro-api');

    tabLogin.addEventListener('click', () => {
        formLoginApi.style.display = 'block';
        formRegistroApi.style.display = 'none';
        tabLogin.style.borderBottom = '2px solid #f1c40f';
        tabRegistro.style.borderBottom = 'none';
    });
    tabRegistro.addEventListener('click', () => {
        formLoginApi.style.display = 'none';
        formRegistroApi.style.display = 'block';
        tabRegistro.style.borderBottom = '2px solid #28a745';
        tabLogin.style.borderBottom = 'none';
    });

    function gestionarBotonesSesion() {
        if (btnUnirme) {
            btnUnirme.removeAttribute('onclick'); 
            const nombreUsuario = localStorage.getItem('usuarioNombre');
            
            if (localStorage.getItem('usuarioId') && nombreUsuario) {
                btnUnirme.innerText = `Cerrar Sesión (${nombreUsuario}) 🐾`;
                btnUnirme.style.background = "#d9534f";
            } else {
                btnUnirme.innerText = "¡Quiero unirme!";
                btnUnirme.style.background = "";
            }
        }

        if (btnNuevaMascota) {
            btnNuevaMascota.removeAttribute('onclick');
        }
    }

    if (btnUnirme) {
        btnUnirme.addEventListener('click', (e) => {
            e.preventDefault();
            const nombreUsuario = localStorage.getItem('usuarioNombre') || 'Usuario';
            if (localStorage.getItem('usuarioId')) {
                if (confirm(`¿Adiós ${nombreUsuario}, deseas cerrar tu sesión activa de PetCare?`)) {
                    localStorage.clear();
                    window.location.reload();
                }
            } else {
                modalAuth.style.display = 'flex';
            }
        });
    }

    if (btnNuevaMascota) {
        btnNuevaMascota.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (!localStorage.getItem('usuarioId')) {
                modalAuth.style.display = 'flex';
            } else {
                document.getElementById('modalMascota').style.display = 'flex';
            }
        });
    }

    gestionarBotonesSesion();
    if (localStorage.getItem('usuarioId')) {
        cargarMascotas(localStorage.getItem('usuarioId'));
    }

    formRegistroApi.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = {
            nombre: document.getElementById('reg-nombre').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-pass').value
        };
        const res = await fetch('/api/auth/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        if (res.ok) {
            alert('Cuenta creada. Ya puedes iniciar sesión.');
            tabLogin.click();
        } else {
            alert((await res.json()).error);
        }
    });

    formLoginApi.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-pass').value
        };
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const resultado = await res.json();
        if (res.ok) {
            localStorage.setItem('usuarioId', resultado.usuario.id);
            localStorage.setItem('usuarioNombre', resultado.usuario.nombre);
            modalAuth.style.display = 'none';
            gestionarBotonesSesion();
            cargarMascotas(resultado.usuario.id);
            alert(`Bienvenido de nuevo, ${resultado.usuario.nombre}.`);
        } else {
            alert(resultado.error);
        }
    });

    // ==========================================
    // 3. APERTURA SEGURA DE MODALES INTERNOS
    // ==========================================
    const configurarBotonModal = (btn, modalId) => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!localStorage.getItem('usuarioId')) {
                    modalAuth.style.display = 'flex';
                } else if (!mascotaSeleccionadaId) {
                    alert('Selecciona una mascota en la lista superior antes de agregar un registro.');
                } else {
                    document.getElementById(modalId).style.display = 'flex';
                }
            });
        }
    };

    configurarBotonModal(btnAbrirCita, 'modalCita');
    configurarBotonModal(btnAbrirVacuna, 'modalVacuna');
    configurarBotonModal(btnAbrirPaseo, 'modalPaseo');

    // ==========================================
    // 4. ENVÍO Y PERSISTENCIA DE FORMULARIOS
    // ==========================================

    if (formMascota) {
        formMascota.addEventListener('submit', async (e) => {
            e.preventDefault();
            const datos = {
                usuario_id: localStorage.getItem('usuarioId'),
                nombre: document.getElementById('nombre-m').value,
                raza: document.getElementById('raza-m').value,
                edad: document.getElementById('edad-m').value,
                peso: document.getElementById('peso-m').value
            };
            const res = await fetch('/api/mascotas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            if (res.ok) {
                formMascota.reset();
                document.getElementById('modalMascota').style.display = 'none';
                cargarMascotas(localStorage.getItem('usuarioId'));
                alert('🐾 Mascota añadida.');
            }
        });
    }

    if (formCita) {
        formCita.addEventListener('submit', async (e) => {
            e.preventDefault();
            const datos = {
                mascota_id: mascotaSeleccionadaId,
                titulo: document.getElementById('c-titulo').value,
                fecha: document.getElementById('c-fecha').value,
                hora: document.getElementById('c-hora').value,
                veterinario: document.getElementById('c-vet').value || 'No asignado',
                motivo: document.getElementById('c-motivo').value || 'Sin notas'
            };
            const res = await fetch('/api/citas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            if (res.ok) {
                formCita.reset();
                document.getElementById('modalCita').style.display = 'none';
                cargarCitas(mascotaSeleccionadaId);
            }
        });
    }

    if (formVacuna) {
        formVacuna.addEventListener('submit', async (e) => {
            e.preventDefault();
            const datos = {
                mascota_id: mascotaSeleccionadaId,
                nombre: document.getElementById('nombre-v').value,
                estado: document.getElementById('estado-v').value,
                fecha_aplicacion: document.getElementById('aplicacion-v').value || null,
                proxima_dosis: document.getElementById('proxima-v').value
            };
            const res = await fetch('/api/vacunas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            if (res.ok) {
                formVacuna.reset();
                document.getElementById('modalVacuna').style.display = 'none';
                cargarVacunas(mascotaSeleccionadaId);
            }
        });
    }

    if (formPaseo) {
        formPaseo.addEventListener('submit', async (e) => {
            e.preventDefault();
            const datos = {
                mascota_id: mascotaSeleccionadaId,
                fecha: document.getElementById('fecha-p').value,
                hora: document.getElementById('hora-p').value,
                duracion: document.getElementById('duracion-p').value,
                detalles: document.getElementById('ruta-p').value
            };
            const res = await fetch('/api/paseos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            if (res.ok) {
                formPaseo.reset();
                document.getElementById('modalPaseo').style.display = 'none';
                cargarPaseos(mascotaSeleccionadaId);
            }
        });
    }

    // ==========================================
    // 5. CARGA DINÁMICA CON ALERTAS INTELIGENTES
    // ==========================================
    async function cargarMascotas(usuarioId) {
        const res = await fetch(`/api/mascotas/${usuarioId}`);
        if (res.ok) {
            const mascotas = await res.json();
            if (contenedorMascotas) {
                contenedorMascotas.innerHTML = '';
                mascotas.forEach(m => {
                    const card = document.createElement('div');
                    card.className = 'perfil-card-item';
                    card.style = "background:#fff; padding:15px; margin:10px 0; border-radius:8px; cursor:pointer; border:1px solid #ddd; display:flex; gap:15px; align-items:center; color: black;";
                    card.innerHTML = `<strong>🐕 ${m.nombre}</strong> <small>(${m.raza}) - ${m.edad || 'N/A'}</small>`;
                    
                    card.addEventListener('click', () => {
                        mascotaSeleccionadaId = m.id;
                        document.querySelectorAll('.perfil-card-item').forEach(c => c.style.borderColor = '#ddd');
                        card.style.borderColor = '#28a745';
                        
                        cargarCitas(m.id);
                        cargarVacunas(m.id);
                        cargarPaseos(m.id);
                    });
                    contenedorMascotas.appendChild(card);
                });

                if (mascotas.length > 0 && !mascotaSeleccionadaId) {
                    contenedorMascotas.firstChild.click();
                }
            }
        }
    }

    // MODIFICADO: Sistema de Alertas para CITAS MEDICAS (Menos de 2 días)
    async function cargarCitas(mascotaId) {
        if (!contenedorCitas) return;
        contenedorCitas.innerHTML = '';
        const res = await fetch(`/api/citas/${mascotaId}`);
        if (res.ok) {
            const data = await res.json();
            if(data.length === 0) { contenedorCitas.innerHTML = '<p style="color:gray; font-size:13px;">Sin citas asignadas.</p>'; return; }
            
            data.forEach(c => {
                const diasRestantes = calcularDiasRestantes(c.fecha);
                let estiloAlerta = "background:#f4f4f4; border-left: 5px solid #ccc;";
                let textoAlerta = "";

                if (diasRestantes === 0) {
                    estiloAlerta = "background:#ebf5fb; border-left: 5px solid #2980b9;"; // Azul
                    textoAlerta = "<br><span style='color:#2980b9; font-weight:bold;'>🚨 ¡LA CITA ES HOY! Revisa el horario.</span>";
                } else if (diasRestantes > 0 && diasRestantes <= 2) {
                    estiloAlerta = "background:#fcf8e3; border-left: 5px solid #f0ad4e;"; // Amarillo
                    textoAlerta = `<br><span style='color:#f0ad4e; font-weight:bold;'>⏳ Falta(n) ${diasRestantes} día(s) para la consulta.</span>`;
                }

                contenedorCitas.innerHTML += `
                    <div style="${estiloAlerta} padding:10px; margin-bottom:5px; border-radius:5px; color: black;">
                        <strong>📅 ${c.titulo}</strong>${textoAlerta}<br>
                        <small>Fecha: ${c.fecha.split('T')[0]} a las ${c.hora}<br>Vet: ${c.veterinario}</small>
                    </div>`;
            });
        }
    }

    // MODIFICADO: Sistema de Alertas para VACUNAS (Menos de 7 días o Expirada)
    async function cargarVacunas(mascotaId) {
        if (!contenedorVacunas) return;
        contenedorVacunas.innerHTML = '';
        const res = await fetch(`/api/vacunas/${mascotaId}`);
        if (res.ok) {
            const data = await res.json();
            if(data.length === 0) { contenedorVacunas.innerHTML = '<p style="color:gray; font-size:13px;">Sin vacunas registradas.</p>'; return; }
            
            data.forEach(v => {
                const diasRestantes = calcularDiasRestantes(v.proxima_dosis);
                let estiloAlerta = "background:#f4f4f4; border-left: 5px solid #ccc;";
                let textoAlerta = "";

                if (diasRestantes !== null) {
                    if (diasRestantes < 0) {
                        estiloAlerta = "background:#f2dede; border-left: 5px solid #d9534f;"; // Rojo
                        textoAlerta = "<br><span style='color:#d9534f; font-weight:bold;'>⚠️ VACUNA PENDIENTE / EXPIRED</span>";
                    } else if (diasRestantes <= 7) {
                        estiloAlerta = "background:#fcf8e3; border-left: 5px solid #f0ad4e;"; // Amarillo
                        textoAlerta = `<br><span style='color:#f0ad4e; font-weight:bold;'>⏳ Dosis próxima en ${diasRestantes} día(s).</span>`;
                    }
                }

                contenedorVacunas.innerHTML += `
                    <div style="${estiloAlerta} padding:10px; margin-bottom:5px; border-radius:5px; color: black;">
                        <strong>💉 ${v.nombre}</strong> (${v.estado})${textoAlerta}<br>
                        <small>Próxima: ${v.proxima_dosis ? v.proxima_dosis.split('T')[0] : 'N/A'}</small>
                    </div>`;
            });
        }
    }

    // MODIFICADO: Sistema de Alertas para PASEOS (Notifica si corresponde al día de hoy)
    async function cargarPaseos(mascotaId) {
        if (!contenedorPaseos) return;
        contenedorPaseos.innerHTML = '';
        const res = await fetch(`/api/paseos/${mascotaId}`);
        if (res.ok) {
            const data = await res.json();
            if(data.length === 0) { contenedorPaseos.innerHTML = '<p style="color:gray; font-size:13px;">Sin paseos programados.</p>'; return; }
            
            data.forEach(p => {
                const diasRestantes = calcularDiasRestantes(p.fecha);
                let estiloAlerta = "background:#f4f4f4; border-left: 5px solid #ccc;";
                let textoAlerta = "";

                if (diasRestantes === 0) {
                    estiloAlerta = "background:#e8f8f5; border-left: 5px solid #2ecc71;"; // Verde
                    textoAlerta = "<br><span style='color:#27ae60; font-weight:bold;'>🚶 ¡Hoy toca esta caminata!</span>";
                }

                const fechaLimpia = p.fecha ? p.fecha.split('T')[0] : 'No asignada';
                
                contenedorPaseos.innerHTML += `
                    <div style="${estiloAlerta} padding:10px; margin-bottom:5px; border-radius:5px; color: black;">
                        <strong>🚶 Ruta: ${p.detalles}</strong>${textoAlerta}<br>
                        <small>📆 Fecha: ${fechaLimpia} | ⏰ Hora: ${p.hora}<br>⏳ Duración: ${p.duracion}</small>
                    </div>`;
            });
        }
    }
});