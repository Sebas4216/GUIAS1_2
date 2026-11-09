// Semana 4: manipulación del DOM y eventos
const pedido = [];
const lista = document.getElementById('lista-pedido');
const totalTexto = document.getElementById('total');
const mensajeVacio = document.getElementById('pedido-vacio');
const aviso = document.getElementById('aviso');
const tituloPedido = document.getElementById('titulo-pedido');
const sugerencia = document.getElementById('sugerencia');
const botonVaciar = document.getElementById('btn-vaciar');

function soles(monto) { return 'S/ ' + monto.toFixed(2); }
function calcularTotal() { return pedido.reduce((suma, item) => suma + item.precio * item.cantidad, 0); }
function anunciar(mensaje) { aviso.textContent = mensaje; }

function render() {
    lista.replaceChildren();
    for (const item of pedido) {
        const li = document.createElement('li');
        const texto = document.createElement('span');
        texto.textContent = `${item.cantidad} × ${item.nombre} · ${soles(item.precio * item.cantidad)}`;
        const controles = document.createElement('div');
        controles.className = 'controles-cantidad';
        for (const [clase, etiqueta, aria] of [
            ['btn-menos', '−', 'Restar un'],
            ['btn-mas', '+', 'Sumar un'],
            ['btn-quitar', 'Quitar', 'Quitar']
        ]) {
            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = clase;
            boton.dataset.nombre = item.nombre;
            boton.textContent = etiqueta;
            boton.setAttribute('aria-label', `${aria} ${item.nombre}`);
            controles.append(boton);
        }
        li.append(texto, controles);
        lista.append(li);
    }
    totalTexto.textContent = soles(calcularTotal());
    mensajeVacio.hidden = pedido.length > 0;
    botonVaciar.disabled = pedido.length === 0;
    sugerencia.hidden = !pedido.some(item => item.nombre.toLowerCase().startsWith('pan'));
}

function agregar(nombre, precio) {
    const existente = pedido.find(item => item.nombre === nombre);
    if (existente) existente.cantidad++;
    else pedido.push({ nombre, precio, cantidad: 1 });
    render();
    anunciar(`Se añadió ${nombre}. Total: ${soles(calcularTotal())}.`);
}

function quitar(nombre) {
    const posicion = pedido.findIndex(item => item.nombre === nombre);
    if (posicion === -1) return;
    pedido.splice(posicion, 1);
    render();
    anunciar(`Se quitó ${nombre}. Total: ${soles(calcularTotal())}.`);
    tituloPedido.focus();
}

function cambiarCantidad(nombre, cambio) {
    const item = pedido.find(item => item.nombre === nombre);
    if (!item) return;
    item.cantidad += cambio;
    if (item.cantidad <= 0) { quitar(nombre); return; }
    render();
    anunciar(`Cantidad de ${nombre}: ${item.cantidad}. Total: ${soles(calcularTotal())}.`);
    const clase = cambio > 0 ? '.btn-mas' : '.btn-menos';
    const boton = Array.from(lista.querySelectorAll(clase)).find(b => b.dataset.nombre === nombre);
    if (boton) boton.focus();
}

document.querySelector('.catalogo').addEventListener('click', evento => {
    const boton = evento.target.closest('.btn-anadir');
    if (!boton) return;
    const producto = boton.closest('.producto');
    agregar(producto.dataset.nombre, Number(producto.dataset.precio));
});

lista.addEventListener('click', evento => {
    const boton = evento.target.closest('button');
    if (!boton) return;
    const nombre = boton.dataset.nombre;
    if (boton.classList.contains('btn-quitar')) quitar(nombre);
    else if (boton.classList.contains('btn-mas')) cambiarCantidad(nombre, 1);
    else if (boton.classList.contains('btn-menos')) cambiarCantidad(nombre, -1);
});

botonVaciar.addEventListener('click', () => {
    if (!pedido.length) return;
    if (confirm('¿Estás seguro de vaciar tu pedido?')) {
        pedido.length = 0;
        render();
        anunciar('Se vació el pedido correctamente.');
        tituloPedido.focus();
    } else anunciar('Se canceló el vaciado del pedido.');
});

document.getElementById('btn-mantequilla').addEventListener('click', () => agregar('Mantequilla', 2.50));
render();
