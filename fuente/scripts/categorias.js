let productos = JSON.parse(localStorage.getItem('productos'));
let usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
function getProductosPorCategoria(categoria) {
    return productos.filter(producto => producto.category === categoria);
}

function getJoyeria() {
    let joyeria = [];
    return joyeria = getProductosPorCategoria('jewelery');
}

function getElectronica() {
    let electronica = [];
    return electronica = getProductosPorCategoria('electronics');
}

function getRopaHombre() {
    let ropaHombre = [];
    return ropaHombre = getProductosPorCategoria('men\'s clothing');
}

function getRopaMujer() {
    let ropaMujer = [];
    return ropaMujer = getProductosPorCategoria('women\'s clothing');
}