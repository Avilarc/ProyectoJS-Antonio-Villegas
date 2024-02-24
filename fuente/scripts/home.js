//variables
let apiURL = 'https://fakestoreapi.com/products';
let productos = [];
let page = 1;
let productosCargados = false;
let visionActual = 'table';

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
            //en este si la longitud de data es 0, o que data es igual a productos
            //si queremosque haya scroll infinito, debemos comentar  a partir de ||
            if (data.length === 0 /*|| JSON.stringify(data) === JSON.stringify(productos)*/) {
                productosCargados = true;
            } else {
                productos = productos.concat(data);
                updateView();
            }
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
    return productos.map(product => `<li><img src="${product.image}" alt="${product.title}";"> ${product.title} - ${product.price}</li>`).join('');
}

function generateTable(productos) {
    return `
        <table>
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                ${productos.map(producto => `<tr><td><img src="${producto.image}" alt="${producto.title}";"></td><td>${producto.title}</td><td>${producto.price}</td></tr>`).join('')}
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

window.addEventListener('scroll', function() {
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