let carrito;
let usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
let productos = JSON.parse(localStorage.getItem('productos'));
let contenedorCarrito = document.getElementById('contenedorCarrito');

function renderCart() {
    if (!usuarioLogeado) {
        contenedorCarrito.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    } else {
        carrito = JSON.parse(localStorage.getItem(usuarioLogeado.username)) || [];
    }
    contenedorCarrito.innerHTML = '';
    let tabla = document.createElement('table');
    tabla.innerHTML = `
        <tr>
            <th>Foto</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Unidades</th>
            <th>Acciones</th>
        </tr>
    `;

    let total = 0;
    if (carrito && carrito.length > 0) {
        carrito = carrito.filter(producto => producto !== null);

        let productCounts = carrito.reduce((counts, producto) => {
            counts[producto.id] = (counts[producto.id] || 0) + 1;
            return counts;
        }, {});

        let uniqueProducts = carrito.filter((producto, index, self) =>
            index === self.findIndex((p) => p.id === producto.id)
        );

        uniqueProducts.forEach((producto) => {
            let fila = document.createElement('tr');
            fila.innerHTML = `
                <td><img src="${producto.image}" alt="${producto.title}" width="50" height="50"></td>
                <td>${producto.title}</td>
                <td>${producto.price}</td>
                <td>${productCounts[producto.id]}</td>
                <td>
                    <button onclick="incrementProduct('${producto.id}')">+</button>
                    <button onclick="decrementProduct('${producto.id}')">-</button>
                    <button onclick="removeProduct('${producto.id}')">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
            total += producto.price * productCounts[producto.id];
        });
    } else {
        contenedorCarrito.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    let totalDiv = document.createElement('div');
    totalDiv.innerHTML = `
        <p>Total: $${total}</p>
        <button id="orderButton">Realizar pedido</button>
    `;
    contenedorCarrito.appendChild(tabla);
    contenedorCarrito.appendChild(totalDiv);

    document.getElementById('orderButton').addEventListener('click', function() {
        let mensaje = document.createElement('h1');
        mensaje.textContent = '¡Gracias por tu compra!';
        contenedorCarrito.innerHTML = '';
        contenedorCarrito.appendChild(mensaje);

        setTimeout(() => {
            if(usuarioLogeado) {
                localStorage.removeItem(usuarioLogeado.username);
                window.location.href = "../index.html";
            }


        }, 2000);
    });
}

function incrementProduct(productId) {
    let usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    let carrito = JSON.parse(localStorage.getItem(usuarioLogeado.username)) || [];
    for (const carritoElement of carrito) {
        if (carritoElement.id === parseInt(productId)) {
            carrito.push(carritoElement);
            localStorage.setItem(usuarioLogeado.username, JSON.stringify(carrito));
            renderCart();
            break;
        }
    }
}

function decrementProduct(productId) {
    let usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    let carrito = JSON.parse(localStorage.getItem(usuarioLogeado.username)) || [];
    let index = carrito.findIndex(carritoElement => carritoElement.id === parseInt(productId));
    if (index !== -1) {
        carrito.splice(index, 1);
    }
    localStorage.setItem(usuarioLogeado.username, JSON.stringify(carrito));
    renderCart();
}

function removeProduct(productId) {
    let usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
    let carrito = JSON.parse(localStorage.getItem(usuarioLogeado.username)) || [];
    let nuevoCarrito = carrito.filter(carritoElement => carritoElement.id !== parseInt(productId));
    localStorage.setItem(usuarioLogeado.username, JSON.stringify(nuevoCarrito));
    renderCart();
}

document.getElementById('logoutButton').addEventListener('click', function(event) {
    event.preventDefault();
    if (usuarioLogeado) {
        localStorage.setItem(usuarioLogeado.username + '_carrito', JSON.stringify(usuarioLogeado.carrito));
        localStorage.setItem(usuarioLogeado.username + '_favoritos', JSON.stringify(usuarioLogeado.favoritos));
    }
    localStorage.removeItem('usuarioLogeado');
    actualizarHeader();
    window.location.href = "../fuente/html/login.html";
});

renderCart();
actualizarHeader();