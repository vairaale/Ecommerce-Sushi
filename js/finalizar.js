document.addEventListener('DOMContentLoaded', function () {
  cargarResumenCompra();
});

function cargarResumenCompra() {
  const mensaje = document.getElementById('mensaje-resumen');
  const tabla = document.getElementById('tabla-resumen');
  const tbody = tabla.querySelector('tbody');
  const totalFinal = document.getElementById('total-final');
  const btnConfirmar = document.getElementById('btn-confirmar');
  const btnVolver = document.getElementById('btn-volver-carrito');

  const carrito = obtenerCarrito();

  if (!carrito.length) {
    mensaje.textContent = "Tu carrito está vacío. Volvé a la tienda para agregar productos.";
    tabla.style.display = 'none';
    totalFinal.style.display = 'none';
    btnConfirmar.style.display = 'none';
    return;
  }

  mensaje.style.display = 'none';
  tabla.style.display = 'table';
  totalFinal.style.display = 'block';

  let total = 0;
  tbody.innerHTML = '';

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.nombre}</td>
      <td class="col-precio">$ ${item.precio}</td>
      <td class="col-cantidad">${item.cantidad}</td>
      <td class="col-subtotal">$ ${subtotal}</td>
    `;

    tbody.appendChild(tr);
  });

  totalFinal.textContent = `Total a pagar: $ ${total}`;

  btnConfirmar.addEventListener('click', function () {
    alert("¡Gracias por tu compra! Tu pedido está en camino 🍣");
    localStorage.removeItem('carrito');
    window.location.href = '../index.html';
  });

  btnVolver.addEventListener('click', function () {
    window.location.href = './carrito.html';
  });
}