//variables
let apiURL = 'https://fakestoreapi.com/products';
let productos = [];
let productosGlobal = [];
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
            if (data.length === 0) {
                productosCargados = true;
                return;
            }
            // Filtrar los productos que ya están en el array de productos
            const newProducts = data.filter(product => !productos.some(p => p.id === product.id));
            productos = productos.concat(newProducts);
            productos.forEach(producto => {
                producto.likes = localStorage.getItem(`likes_${producto.id}`) || 0;
                producto.dislikes = localStorage.getItem(`dislikes_${producto.id}`) || 0;
                producto.isFavorite = favoritos.includes(producto.id);
            });
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
        let likes = parseInt(localStorage.getItem(`likes_${producto.id}`)) || 0;
        likes++;
        localStorage.setItem(`likes_${producto.id}`, likes);
        const likeButton = document.querySelector(`#likeButton_${productId}`);
        likeButton.classList.add('liked');
        likeButton.innerHTML = `<i class="fa fa-thumbs-up"></i>${likes}`;

        // Actualizar el producto en el localStorage de productos
        let productosLocalStorage = JSON.parse(localStorage.getItem('productos')) || [];
        const productoIndex = productosLocalStorage.findIndex(product => product.id === productId);
        if (productoIndex !== -1) {
            productosLocalStorage[productoIndex].likes = likes;
            localStorage.setItem('productos', JSON.stringify(productosLocalStorage));
        }

    }
}

function dislikeProduct(productId) {
    const producto = productos.find(product => product.id === productId);
    if (producto) {
        let dislikes = parseInt(localStorage.getItem(`dislikes_${producto.id}`)) || 0;
        dislikes++;
        localStorage.setItem(`dislikes_${producto.id}`, dislikes);
        const dislikeButton = document.querySelector(`#dislikeButton_${productId}`);
        dislikeButton.classList.add('disliked');
        dislikeButton.innerHTML = `<i class="fa fa-thumbs-down"></i>${dislikes}`;

        // Actualizar el producto en el localStorage de productos
        let productosLocalStorage = JSON.parse(localStorage.getItem('productos')) || [];
        const productoIndex = productosLocalStorage.findIndex(product => product.id === productId);
        if (productoIndex !== -1) {
            productosLocalStorage[productoIndex].dislikes = dislikes;
            localStorage.setItem('productos', JSON.stringify(productosLocalStorage));
        }

    }
}

function toggleFavorite(productId) {
    const producto = productos.find(product => product.id === productId);
    if (producto) {
        const index = usuarioLogeado.favoritos.findIndex(fav => fav.id === productId);
        if (index === -1) {
            usuarioLogeado.favoritos.push(producto);
            document.querySelector(`#favoriteButton_${productId} i`).classList.add('favorited');
        } else {
            usuarioLogeado.favoritos.splice(index, 1);
            document.querySelector(`#favoriteButton_${productId} i`).classList.remove('favorited');
        }
        localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));
        if (usuarioLogeado) {
            localStorage.setItem(usuarioLogeado.username + '_favoritos', JSON.stringify(usuarioLogeado.favoritos));
        }
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
    if (!productosCargados && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // hemos llegado al final de la página
        page++;
        fetchProducts(page);
    }
});

// Iniciar la carga de productos
fetchProducts(page);
actualizarHeader();