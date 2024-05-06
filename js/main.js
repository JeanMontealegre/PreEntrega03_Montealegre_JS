// definir las categorias y sus propiedades (stock masimo y % de reposicion)
const categorias = [
    { nombre: 'A', porcentaje: 0.6, productos: [
        { id: '000001', stockMaximo: 1000, stockActual: 0, categoria: 'A' },
        { id: '000002', stockMaximo: 800, stockActual: 0, categoria: 'A' },
        { id: '000003', stockMaximo: 1100, stockActual: 0, categoria: 'A' },
        { id: '000004', stockMaximo: 900, stockActual: 0, categoria: 'A' },
        { id: '000005', stockMaximo: 1300, stockActual: 0, categoria: 'A' }
    ]},
    { nombre: 'B', porcentaje: 0.4, productos: [
        { id: '000006', stockMaximo: 700, stockActual: 0, categoria: 'B' },
        { id: '000007', stockMaximo: 750, stockActual: 0, categoria: 'B' },
        { id: '000008', stockMaximo: 600, stockActual: 0, categoria: 'B' },
        { id: '000009', stockMaximo: 500, stockActual: 0, categoria: 'B' },
        { id: '000010', stockMaximo: 650, stockActual: 0, categoria: 'B' }
    ]},
    { nombre: 'C', porcentaje: 0.25, productos: [
        { id: '000011', stockMaximo: 450, stockActual: 0, categoria: 'C' },
        { id: '000012', stockMaximo: 400, stockActual: 0, categoria: 'C' },
        { id: '000013', stockMaximo: 300, stockActual: 0, categoria: 'C' },
        { id: '000014', stockMaximo: 350, stockActual: 0, categoria: 'C' },
        { id: '000015', stockMaximo: 200, stockActual: 0, categoria: 'C' }
    ]}
];

// funcion para determinar si es necesario reponer el stock para un producto especifico
function verificarStock(producto) {
    let porcentajeCategoria;
    switch (producto.categoria) {
        case 'A':
            porcentajeCategoria = 0.6;
            break;
        case 'B':
            porcentajeCategoria = 0.4;
            break;
        case 'C':
            porcentajeCategoria = 0.25;
            break;
        default:
            porcentajeCategoria = 0;
            break;
    }
    const porcentajeStockActual = producto.stockActual / producto.stockMaximo;
    return porcentajeStockActual <= porcentajeCategoria; // si el stock actual es menor o igual al porcentaje correspondiente de la categoria, devuelve true
}

// funcion para obtener la cantidad a reponer por producto
function cantidadAReponer(producto) {
    const stockDiferencia = producto.stockMaximo - producto.stockActual;
    return stockDiferencia > 0 ? stockDiferencia : 0; // si la diferencia es negativa, no se necesita reponer
}

// obtener referencias a elementos del DOM
const verificarStockBtn = document.getElementById('verificarStockBtn');
const limpiarBtn = document.getElementById('limpiarBtn');
const resultadosDiv = document.getElementById('resultados');

// funcion de respuesta al clic en el botón "verificar stock"
verificarStockBtn.addEventListener('click', function() {
    // limpiar resultados anteriores antes de mostrar los nuevos
    resultadosDiv.innerHTML = '';

    // verificar y mostrar resultados de stock para cada producto de cada categoria
    categorias.forEach(categoria => {
        categoria.productos.forEach(producto => {
            const input = document.querySelector(`#prod_${producto.id}`); // actualizacion del selector
            if (input) {
                producto.stockActual = parseInt(input.value);
                console.log(`Producto ${producto.id}, Stock Actual: ${producto.stockActual}`);
                const cantidad = cantidadAReponer(producto);
                console.log(`Cantidad a reponer para Producto ${producto.id}: ${cantidad}`);
                const mensaje = verificarStock(producto) ?
                    `Es necesario comprar ${cantidad} unidades del producto ${producto.id} de la categoría ${categoria.nombre}.` :
                    `No es necesario comprar stock para el producto ${producto.id} de la categoría ${categoria.nombre}.`;

                // mostrar resultados en el DOM
                const p = document.createElement('p');
                p.innerText = mensaje;
                if (verificarStock(producto)) {
                    p.classList.add('textoComprar');
                }
                resultadosDiv.appendChild(p);
            }
        });
    });

    // guardar datos de stock en localStorage
    const stockActual = categorias.reduce((acc, categoria) => {
        categoria.productos.forEach(producto => {
            acc.push(producto.stockActual);
        });
        return acc;
    }, []);
    localStorage.setItem('stockActual', JSON.stringify(stockActual));
});

// event listener para el boton de limpiar
limpiarBtn.addEventListener('click', function() {
    // restablecer el valor de todos los campos de entrada
    const inputs = document.querySelectorAll('.stockProducto');
    inputs.forEach(input => {
        input.value = '';
    });

    // eliminar los resultados de la verificacion de stock
    resultadosDiv.innerHTML = '';
});