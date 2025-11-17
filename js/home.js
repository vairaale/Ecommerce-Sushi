// esto es para Productos destacados en HOME

// Traigo los productos desde el JSON
async function cargarProductosDestacados() {
  try {
    const respuesta = await fetch('./data/productos.json');
    const data = await respuesta.json();

    mostrarProductosHome(data.rolls, 'rolls-home');
    mostrarProductosHome(data.combos, 'combos-home');
    mostrarProductosHome(data.bebidas, 'bebidas-home');
  } catch (error) {
    console.error('Error cargando productos del JSON:', error);
  }
}

// Agrego solo 2 productos de cada categoría nada mas
function mostrarProductosHome(lista, idContenedor) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // 2 productos
  const seleccion = lista.slice(0, 2);

  seleccion.forEach(producto => {
    const card = crearTarjetaHome(producto);
    contenedor.appendChild(card);
  });
}

// Card igual a categorías pero 
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

  const spanPrecio = document.createElement('span');
  spanPrecio.textContent = `$ ${producto.precio}`;

  // Control de cantidad
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

  // Botón agregar
  const btnAgregar = document.createElement('button');
  btnAgregar.textContent = 'Agregar';
  btnAgregar.classList.add('boton-agregar');
  btnAgregar.type = 'button';

  btnAgregar.addEventListener('click', function () {
    agregarAlCarrito(producto, cantidad);
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

//Inicializar HOME
document.addEventListener('DOMContentLoaded', cargarProductosDestacados);