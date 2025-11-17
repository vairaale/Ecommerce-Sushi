document.addEventListener('DOMContentLoaded', function () {
  console.log('home.js cargado ✅');

  // Solo corre en la home
  const contenedoresHome = document.querySelectorAll('.grilla-productos-home');
  if (!contenedoresHome.length) return;

  // Traemos el JSON (estando en index.html, la ruta es ./data/...)
  fetch('./data/productos.json')
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (datos) {
      console.log('Productos desde JSON:', datos);
      // Rellenar cada bloque de la home
      contenedoresHome.forEach(function (contenedor) {
        const categoria = contenedor.dataset.categoria; // "rolls", "combos" o "bebidas"
        const lista = datos[categoria];
        if (!lista) return;

        // dejamos máximo 3 productos
        const seleccion = lista.slice(0, 2);

        contenedor.innerHTML = '';

        seleccion.forEach(function (producto) {
          const card = crearTarjetaHome(producto);
          contenedor.appendChild(card);
        });
      });
    })
    .catch(function (error) {
      console.error('Error al cargar productos.json', error);
    });
});

// Versión sencilla de card para la home
function crearTarjetaHome(producto) {
  const article = document.createElement('article');
  article.classList.add('tarjeta-producto');

  const img = document.createElement('img');
  img.src = producto.imagen;
  img.alt = producto.nombre;

  const h3 = document.createElement('h3');
  h3.textContent = producto.nombre;

  const p = document.createElement('p');
  p.textContent = producto.descripcion;

  const pie = document.createElement('div');
  pie.classList.add('pie-tarjeta');

  // PRECIO
  const spanPrecio = document.createElement('span');
  spanPrecio.textContent = `$ ${producto.precio}`;

  // CANTIDAD (+ / -)
  const divCantidad = document.createElement('div');
  divCantidad.classList.add('cantidad-producto');

  const btnMenos = document.createElement('button');
  btnMenos.type = 'button';
  btnMenos.textContent = '-';
  btnMenos.classList.add('btn-cantidad');

  const spanCantidad = document.createElement('span');
  spanCantidad.classList.add('cantidad-valor');
  spanCantidad.textContent = '0';

  const btnMas = document.createElement('button');
  btnMas.type = 'button';
  btnMas.textContent = '+';
  btnMas.classList.add('btn-cantidad');

  let cantidad = 0;

  btnMas.addEventListener('click', function () {
    cantidad++;
    spanCantidad.textContent = cantidad;
  });

  btnMenos.addEventListener('click', function () {
    if (cantidad > 0) {
      cantidad--;
      spanCantidad.textContent = cantidad;
    }
  });

  divCantidad.appendChild(btnMenos);
  divCantidad.appendChild(spanCantidad);
  divCantidad.appendChild(btnMas);

  // BOTÓN AGREGAR
  const btnAgregar = document.createElement('button');
  btnAgregar.textContent = 'Agregar';
  btnAgregar.classList.add('boton-agregar');
  btnAgregar.type = 'button';

  btnAgregar.addEventListener('click', function () {
    if (cantidad === 0) {
      alert('Seleccioná al menos 1 unidad.');
      return;
    }
    alert(`Agregaste ${cantidad} unidad/es de ${producto.nombre}`);
  });

  const divPieDerecha = document.createElement('div');
  divPieDerecha.style.display = 'flex';
  divPieDerecha.style.flexDirection = 'column';
  divPieDerecha.style.alignItems = 'flex-end';
  divPieDerecha.style.gap = '6px';

  divPieDerecha.appendChild(divCantidad);
  divPieDerecha.appendChild(btnAgregar);

  pie.appendChild(spanPrecio);
  pie.appendChild(divPieDerecha);

  article.appendChild(img);
  article.appendChild(h3);
  article.appendChild(p);
  article.appendChild(pie);

  return article;
}