//variables
let apiURL = 'https://fakestoreapi.com/products';
let productos = [];
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
//cantiudad de likes y dislikes que se guardan en el local storage de cada producto

let page = 1;
let productosCargados = false;
let visionActual = 'table';
let carrito = [];
let usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
//condicionales de usuario logeado para carrito y favoritos
//aquí se verifica si el usuario logeado tiene carrito y favoritos, si no los tiene se crean
if (usuarioLogeado) {
    if (!usuarioLogeado.carrito) {
        usuarioLogeado.carrito = [];
    }
    if (!usuarioLogeado.favoritos) {
        usuarioLogeado.favoritos = [];
    } else {
        favoritos = usuarioLogeado.favoritos;
    }
} else {
    usuarioLogeado = {
        carrito: [],
        favoritos: []
    };
    favoritos = [];
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
            // Almacenar los productos en localStorage después de que se hayan cargado y procesado
            localStorage.setItem('productos', JSON.stringify(productos));
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
            <button id="likeButton_${product.id}" onclick="event.stopPropagation(); likeProduct(${product.id})"><i class="fa fa-thumbs-up"></i> ${product.likes}</button>
            <button id="dislikeButton_${product.id}" onclick="event.stopPropagation(); dislikeProduct(${product.id})"><i class="fa fa-thumbs-down"></i> ${product.dislikes}</button>
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
                        <td><button id="likeButton_${producto.id}" onclick="event.stopPropagation(); likeProduct(${producto.id})"><i class="fa fa-thumbs-up"></i> ${producto.likes}</button></td>
                        <td><button id="dislikeButton_${producto.id}" onclick="event.stopPropagation(); dislikeProduct(${producto.id})"><i class="fa fa-thumbs-down"></i> ${producto.dislikes}</button></td>
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

function likeProduct(productId) {
    const producto = productos.find(product => product.id === productId);
    if (producto) {
        producto.likes++;
        localStorage.setItem(`likes_${producto.id}`, producto.likes);
        const likeButton = document.querySelector(`#likeButton_${productId}`);
        likeButton.classList.add('liked');
        likeButton.innerHTML = `<i class="fa fa-thumbs-up"></i>${producto.likes}`;
    }
}

function dislikeProduct(productId) {
    const producto = productos.find(product => product.id === productId);
    if (producto) {
        producto.dislikes++;
        localStorage.setItem(`dislikes_${producto.id}`, producto.dislikes);
        const dislikeButton = document.querySelector(`#dislikeButton_${productId}`);
        dislikeButton.classList.add('disliked');
        dislikeButton.innerHTML = `<i class="fa fa-thumbs-down"></i>${producto.dislikes}`;
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
    usuarioLogeado.favoritos = favoritos;
    localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));
    if (usuarioLogeado) {
        localStorage.setItem(usuarioLogeado.username + '_favoritos', JSON.stringify(usuarioLogeado.favoritos));
    }
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
        localStorage.setItem(usuarioLogeado.username + '_carrito', JSON.stringify(usuarioLogeado.carrito));
        localStorage.setItem(usuarioLogeado.username + '_favoritos', JSON.stringify(usuarioLogeado.favoritos));
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