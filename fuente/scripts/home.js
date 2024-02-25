//variables
let apiURL = 'https://fakestoreapi.com/products';
let productos = [];
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
productos.forEach(producto => {
    producto.likes = 0;
    producto.dislikes = 0;
});
let page = 1;
let productosCargados = false;
let visionActual = 'table';
let carrito = [];
let usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado")) || null;

if (usuarioLogeado && !usuarioLogeado.carrito) {
    usuarioLogeado.carrito = [];
}


//funciones

function fetchProducts(page) {
    fetch(`${apiURL}?page=${page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            productos = productos.concat(data);
            productos.forEach(producto => {
                producto.likes = localStorage.getItem(`likes_${producto.id}`) || 0;
                producto.dislikes = localStorage.getItem(`dislikes_${producto.id}`) || 0;
                producto.isFavorite = favoritos.includes(producto.id);
            });
            updateView();
        })
        .catch(error => console.error('Error:', error));
}

function updateView() {
    if (visionActual === 'table') {
        document.getElementById('contenido').innerHTML = generateTable(productos);
    } else if (visionActual === 'list') {
        document.getElementById('contenido').innerHTML = generateList(productos);
    }
}

function generateList(productos) {
    return productos.map(product => `
        <li class="product-card" onclick="showProductDetails(${product.id})">
            <img src="${product.image}" alt="${product.title}";">
            ${product.title} - ${product.price}
            <p>Me gusta: ${product.likes} <button id="likeButton_${product.id}" onclick="event.stopPropagation(); likeProduct(${product.id})"><i class="fa fa-thumbs-up"></i></button></p>
            <p>No me gusta: ${product.dislikes} <button id="dislikeButton_${product.id}" onclick="event.stopPropagation(); dislikeProduct(${product.id})"><i class="fa fa-thumbs-down"></i></button></p>
            <button class="addToCartButton" onclick="event.stopPropagation(); addToCart(${product.id})">Agregar al carrito</button>
            <button id="favoriteButton_${product.id}" onclick="event.stopPropagation(); toggleFavorite(${product.id})"><i class="fa fa-heart"></i></button>
        </li>
    `).join('');
}

function generateTable(productos) {
    return `
        <table>
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Me gusta</th>
                    <th>No me gusta</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${productos.map(producto => `
                     <tr class="product-card" onclick="showProductDetails(${producto.id})">
                        <td><img src="${producto.image}" alt="${producto.title}";"></td>
                        <td>${producto.title}</td>
                        <td>${producto.price}</td>
                        <td>${producto.likes} <button id="likeButton_${producto.id}" onclick="event.stopPropagation(); likeProduct(${producto.id})"><i class="fa fa-thumbs-up"></i></button></td>
                        <td>${producto.dislikes} <button id="dislikeButton_${producto.id}" onclick="event.stopPropagation(); dislikeProduct(${producto.id})"><i class="fa fa-thumbs-down"></i></button></td>
                        <td><button class="addToCartButton" onclick="event.stopPropagation(); addToCart(${producto.id})">Agregar al carrito</button>
                        <button id="favoriteButton_${producto.id}" onclick="event.stopPropagation(); toggleFavorite(${producto.id})"><i class="fa fa-heart"></i></button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function sortProductsByCategory(order) {
    if (order === 'asc') {
        productos.sort((a, b) => a.category.localeCompare(b.category));
    } else if (order === 'desc') {
        productos.sort((a, b) => b.category.localeCompare(a.category));
    }
}

function showProductDetails(productId) {
    const producto = productos.find(product => product.id === productId);
    if (producto) {
        const contenido = document.getElementById('contenido');
        document.getElementById("titulo").innerHTML = "Detalles del producto";
        contenido.innerHTML = `
            <div class="product-details">
                <h2>${producto.title}</h2>
                <img src="${producto.image}" alt="${producto.title}">
                <p>${producto.description}</p>
                <p>${producto.price}</p>
                <p>${producto.category}</p>
                <button id="backToHome">Volver al inicio</button>
                <button class="addToCartButton" onclick="addToCart(${productId})">Agregar al carrito</button> 
            </div>
        `;
        contenido.classList.add('product-page');
        document.getElementById("buttonContainer").style.display = "none";
        document.getElementById('backToHome').addEventListener('click', function() {
            contenido.classList.remove('product-page');
            document.getElementById("buttonContainer").style.display = "flex";
            updateView();
        });
    }
}

function addToCart(productId) {
    const producto = productos.find(product => product.id === productId);
    if(producto) {
        if(usuarioLogeado) {
            usuarioLogeado.carrito.push(producto);
            localStorage.setItem(usuarioLogeado.username, JSON.stringify(usuarioLogeado.carrito));
            console.log('Producto agregado al carrito', producto);
        } else {
            carrito.push(producto);
            console.log('Producto agregado al carrito', producto);
        }
        document.querySelector('.carrito').classList.add('animate');
        setTimeout(() => {
            document.querySelector('.carrito').classList.remove('animate');
        },1000);

    }
}

function likeProduct(productId) {
    const producto = productos.find(product => product.id === productId);
    if (producto) {
        producto.likes++;
        localStorage.setItem(`likes_${producto.id}`, producto.likes);
        document.querySelector(`#likeButton_${productId} i`).classList.add('liked');
    }
}

function dislikeProduct(productId) {
    const producto = productos.find(product => product.id === productId);
    if (producto) {
        producto.dislikes++;
        localStorage.setItem(`dislikes_${producto.id}`, producto.dislikes);
        document.querySelector(`#dislikeButton_${productId} i`).classList.add('disliked');
    }
}

function toggleFavorite(productId) {
    const index = favoritos.indexOf(productId);
    if (index === -1) {
        favoritos.push(productId);
        document.querySelector(`#favoriteButton_${productId} i`).classList.add('favorited');
    } else {
        favoritos.splice(index, 1);
        document.querySelector(`#favoriteButton_${productId} i`).classList.remove('favorited');
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}


//eventos
document.getElementById('listViewBtn').addEventListener('click', function() {
    visionActual = 'list';
    updateView();
});

document.getElementById('tableViewBtn').addEventListener('click', function() {
    visionActual = 'table';
    updateView();
});

document.getElementById('sortAscBtn').addEventListener('click', function() {
    sortProductsByCategory('asc');
    updateView();
});

document.getElementById('sortDescBtn').addEventListener('click', function() {
    sortProductsByCategory('desc');
    updateView();
});
document.getElementById('logoutButton').addEventListener('click', function(event) {
    event.preventDefault();
    if (usuarioLogeado) {
        localStorage.setItem(usuarioLogeado.username, JSON.stringify(usuarioLogeado.carrito)); // Modificado aquí
    }
    localStorage.removeItem('usuarioLogeado');
    actualizarHeader();
    window.location.href = "../fuente/html/login.html";
});

window.addEventListener('scroll', function() {
    if (contenido.classList.contains('product-page')) {
        return;
    }
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // hemos llegado al final de la página
        if (!productosCargados) {
            page++;
            fetchProducts(page);
        }
    }
});

// Iniciar la carga de productos
fetchProducts(page);
actualizarHeader();