//variables
let ropaMujer = getRopaMujer();
let visionActual = 'table';

//funciones

function updateView() {
    if (visionActual === 'table') {
        document.getElementById('contenido').innerHTML = generateTable(ropaMujer);
    } else if (visionActual === 'list') {
        document.getElementById('contenido').innerHTML = generateList(ropaMujer);
    }
}
function generateList(ropaMujer) {
    return ropaMujer.map(product => `
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

function generateTable(ropaMujer) {
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
                ${ropaMujer.map(producto => `
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
function showProductDetails(productId) {
    const producto = ropaMujer.find(product => product.id === productId);
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
    const producto = ropaMujer.find(product => product.id === productId);
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
    const producto = ropaMujer.find(product => product.id === productId);
    if (producto) {
        // Obtén el número actual de likes del localStorage, o usa 0 si no existe
        let likes = parseInt(localStorage.getItem(`likes_${producto.id}`)) || 0;
        likes++; // Incrementa el número de likes
        localStorage.setItem(`likes_${producto.id}`, likes); // Almacena el nuevo número de likes en el localStorage
        const likeButton = document.querySelector(`#likeButton_${productId}`);
        likeButton.classList.add('liked');
        likeButton.innerHTML = `<i class="fa fa-thumbs-up"></i>${likes}`; // Actualiza el botón de like con el nuevo número de likes
    }
}
function dislikeProduct(productId) {
    const producto = ropaMujer.find(product => product.id === productId);
    if (producto) {
        // Obtén el número actual de dislikes del localStorage, o usa 0 si no existe
        let dislikes = parseInt(localStorage.getItem(`dislikes_${producto.id}`)) || 0;
        dislikes++; // Incrementa el número de dislikes
        localStorage.setItem(`dislikes_${producto.id}`, dislikes); // Almacena el nuevo número de dislikes en el localStorage
        const dislikeButton = document.querySelector(`#dislikeButton_${productId}`);
        dislikeButton.classList.add('disliked');
        dislikeButton.innerHTML = `<i class="fa fa-thumbs-down"></i>${dislikes}`; // Actualiza el botón de dislike con el nuevo número de dislikes
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

document.getElementById('listViewBtn').addEventListener('click', function() {
    visionActual = 'list';
    updateView();
});

document.getElementById('tableViewBtn').addEventListener('click', function() {
    visionActual = 'table';
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

updateView(); // Esto actualiza la vista cuando se carga la página
actualizarHeader();