let usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
let favoritos = JSON.parse(localStorage.getItem(usuarioLogeado.username +'_favoritos'));
let productos = JSON.parse(localStorage.getItem('productos'));

function generateTable(productos) {
    return `
        <table>
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${productos.map(producto => `
                     <tr class="product-card">
                        <td><img src="${producto.image}" alt="${producto.title}";"></td>
                        <td>${producto.title}</td>
                        <td>${producto.price}</td>
                        <td><button class="addToCartButton" onclick="addToCart(${producto.id})">Agregar al carrito</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function addToCart(productId) {
    const producto = productos.find(product => product.id === productId);
    if(producto) {
        if(usuarioLogeado) {
            let carrito = JSON.parse(localStorage.getItem(usuarioLogeado.username)) || [];
            carrito.push(producto);
            localStorage.setItem(usuarioLogeado.username, JSON.stringify(carrito));
            console.log('Producto agregado al carrito', producto);
        } else {
            carrito.push(producto);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            console.log('Producto agregado al carrito', producto);
        }
        document.querySelector('.carrito').classList.add('animate');
        setTimeout(() => {
            document.querySelector('.carrito').classList.remove('animate');
        },1000);
    }
}

// Generar la tabla y añadirla al DOM
document.getElementById('favoritos').innerHTML = generateTable(favoritos);

actualizarHeader();