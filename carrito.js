document.addEventListener('DOMContentLoaded', () => {
    cargarUsuario();
    cargarCarrito();
});

function cargarUsuario() {
    fetch('api.php?action=get_usuario')
        .then(res => res.json())
        .then(data => document.getElementById('nombreUsuario').textContent = data.usuario);
}

function cargarCarrito() {
    fetch('api.php?action=get_carrito')
        .then(res => res.json())
        .then(carrito => {
            const contenedor = document.getElementById('contenedorCarrito');
            
            if (Object.keys(carrito).length === 0) {
                contenedor.innerHTML = '<p>Tu carrito está vacío.</p>';
                return;
            }

            let html = `
                <table>
                    <tr>
                        <th>Producto</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
            `;
            
            let total = 0;
            for (const id in carrito) {
                const prod = carrito[id];
                const subtotal = prod.precio * prod.cantidad;
                total += subtotal;

                html += `
                    <tr>
                        <td>${prod.nombre}</td>
                        <td>$${parseFloat(prod.precio).toFixed(2)}</td>
                        <td>
                            <input type="number" id="input-${id}" value="${prod.cantidad}" min="1" style="width: 60px; padding:5px;">
                            <button onclick="modificarCantidad('${id}')" class="btn-primary">Actualizar</button>
                        </td>
                        <td>$${subtotal.toFixed(2)}</td>
                        <td>
                            <button class="btn-danger" onclick="eliminarProducto('${id}')">Eliminar</button>
                        </td>
                    </tr>
                `;
            }

            html += `
                    <tr>
                        <td colspan="3" style="text-align: right;"><strong>Total a Pagar:</strong></td>
                        <td colspan="2"><strong>$${total.toFixed(2)}</strong></td>
                    </tr>
                </table>
            `;
            contenedor.innerHTML = html;
        });
}

function modificarCantidad(id) {
    const nuevaCantidad = document.getElementById(`input-${id}`).value;
    const formData = new FormData();
    formData.append('id', id);
    formData.append('cantidad', nuevaCantidad);

    fetch('api.php?action=update_carrito', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(() => cargarCarrito());
}

function eliminarProducto(id) {
    if(confirm('¿Seguro que deseas eliminar este producto?')) {
        const formData = new FormData();
        formData.append('id', id);

        fetch('api.php?action=delete_carrito', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(() => cargarCarrito());
    }
}