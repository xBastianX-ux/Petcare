document.addEventListener('DOMContentLoaded', () => {

    const formulario = document.getElementById('formRegistro');

    if (!formulario) return;

    formulario.addEventListener('submit', async (e) => {

        e.preventDefault();

        const nombre = document.getElementById('nombre').value;

        const apellido = document.getElementById('apellido').value;

        const correo = document.getElementById('correo').value;

        const password = document.getElementById('password').value;

        try {

            const respuesta = await fetch('/api/registro', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    nombre,
                    apellido,
                    correo,
                    password
                })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {

                alert(' Usuario registrado correctamente');

                window.location.href = '/login.html';

            } else {

                alert(data.error || 'Error al registrar');
            }

        } catch (error) {

            console.log(error);

            alert('Error de conexión con el servidor');
        }
    });
    
});