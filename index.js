document.addEventListener('DOMContentLoaded', () => {
    cargarUsuario();
    actualizarContador(); 
    cargarProductos();
});

function cargarUsuario() {
    fetch('api.php?action=get_usuario')
        .then(response => response.json())
        .then(data => {
            document.getElementById('nombreUsuario').textContent = data.usuario;
        });
}

function actualizarContador() {
    fetch('api.php?action=get_cart_count')
        .then(response => response.json())
        .then(data => {
            document.getElementById('contadorCarrito').textContent = data.count;
        });
}

function cargarProductos() {
    fetch('api.php?action=get_productos')
        .then(response => response.json())
        .then(productos => {
            const contenedor = document.getElementById('listaProductos');
            contenedor.innerHTML = '';

            productos.forEach(prod => {
                const divProducto = document.createElement('div');
                divProducto.className = 'producto';
                
                divProducto.innerHTML = `
                    <h3>${prod.nombre}</h3>
                    <p>Precio: $${prod.precio}</p>
                    <p>Stock: ${prod.stock}</p>
                    <button class="btn-agregar" 
                            data-id="${prod.id}" 
                            data-nombre="${prod.nombre}" 
                            data-precio="${prod.precio}">
                        Añadir al carrito
                    </button>
                `;
                contenedor.appendChild(divProducto);
            });

            document.querySelectorAll('.btn-agregar').forEach(boton => {
                boton.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const nombre = this.getAttribute('data-nombre');
                    const precio = this.getAttribute('data-precio');
                    agregarAlCarrito(id, nombre, precio);
                });
            });
        });
}

function agregarAlCarrito(id, nombre, precio) {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('nombre', nombre);
    formData.append('precio', precio);

    fetch('api.php?action=add_carrito', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            document.getElementById('contadorCarrito').textContent = data.total_items;
        }
    });
}

function cambiarUsuario() {
    const nuevoUsuario = document.getElementById('nuevoUsuarioInput').value.trim();
    if(nuevoUsuario === "") {
        alert("Escribe un nombre de usuario");
        return;
    }

    const formData = new FormData();
    formData.append('username', nuevoUsuario);

    fetch('api.php?action=switch_user', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            document.getElementById('nombreUsuario').textContent = data.usuario;
            document.getElementById('nuevoUsuarioInput').value = '';
            actualizarContador(); 
        }
    });
}