document.addEventListener('DOMContentLoaded', function () {
  console.log('app.js cargado ✅');

  construirNavbar();
  prepararLogin();
  prepararRegistro();
  cargarProductosSegunPagina();
  prepararCarrito();
  protegerPaginasPrivadas();
});

// SESIÓN DE USUARIO (sessionStorage)
function usuarioEstaLogueado() {
  return sessionStorage.getItem('usuarioActual') !== null;
}

//NAVBAR (array de páginas)
const paginas = [
  { titulo: 'Inicio', archivo: 'index.html', tipo: 'home' },
  { titulo: 'Rolls', archivo: 'categoria-rolls.html', tipo: 'categoria' },
  { titulo: 'Combos', archivo: 'categoria-combos.html', tipo: 'categoria' },
  { titulo: 'Bebidas', archivo: 'categoria-bebidas.html', tipo: 'categoria' },
  { titulo: '🛒', archivo: 'carrito.html', tipo: 'categoria' } // carrito con icono corroborar si funciona
];

function obtenerHref(pagina, estoyEnSubcarpeta) {
  if (pagina.tipo === 'home') {
    return estoyEnSubcarpeta ? '../index.html' : 'index.html';
  } else {
  
    return estoyEnSubcarpeta
      ? `./${pagina.archivo}`          // si ya estoy en /pages
      : `./pages/${pagina.archivo}`;  // si estoy en index
  }
}

function construirNavbar() {
  const lista = document.querySelector('.lista-enlaces');
  if (!lista) return;

  const ruta = window.location.pathname;
  const estoyEnSubcarpeta = ruta.includes('/pages/');
  const esLogin = ruta.includes('login.html');
  const esRegistro = ruta.includes('register.html');
  const logueado = usuarioEstaLogueado();

  lista.innerHTML = '';

  // Si estoy en LOGIN o REGISTRO → mostrar solo "Inicio"
  if (esLogin || esRegistro) {
    const liInicio = document.createElement('li');
    const aInicio = document.createElement('a');
    aInicio.textContent = 'Inicio';
    aInicio.href = estoyEnSubcarpeta ? '../index.html' : 'index.html';
    liInicio.appendChild(aInicio);
    lista.appendChild(liInicio);
    return;
  }

  // USUARIO NO LOGUEADO → SOLO Inicio y tambien iniciar sesion
  if (!logueado) {
    // Inicio
    const liInicio = document.createElement('li');
    const aInicio = document.createElement('a');
    aInicio.textContent = 'Inicio';
    aInicio.href = estoyEnSubcarpeta ? '../index.html' : 'index.html';
    liInicio.appendChild(aInicio);
    lista.appendChild(liInicio);

    // Iniciar sesión
    const liLogin = document.createElement('li');
    const aLogin = document.createElement('a');
    aLogin.textContent = 'Iniciar sesión';
    aLogin.href = estoyEnSubcarpeta ? './login.html' : './pages/login.html';
    liLogin.appendChild(aLogin);
    lista.appendChild(liLogin);

    return;
  }

  // USUARIO LOGUEADO → menú completo ACA MUESTRO TODO LO QUE HYA 
  paginas.forEach(pagina => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = pagina.titulo;
    a.href = obtenerHref(pagina, estoyEnSubcarpeta);
    li.appendChild(a);
    lista.appendChild(li);
  });

  // Botón "Salir"
  const liLogout = document.createElement('li');
  const btnLogout = document.createElement('a');
  btnLogout.textContent = 'Salir';
  btnLogout.href = '#';
  btnLogout.classList.add('boton-salir');

  btnLogout.addEventListener('click', function (e) {
    e.preventDefault();

  
    sessionStorage.removeItem('usuarioActual');

    // Redirigimos 
    if (estoyEnSubcarpeta) {
      window.location.href = './login.html';
    } else {
      window.location.href = './pages/login.html';
    }
  });

  liLogout.appendChild(btnLogout);
  lista.appendChild(liLogout);
}

// LOGIN
function prepararLogin() {
  const loginSection = document.getElementById('login');
  if (!loginSection) return; // si no estoy en login, no hago nada

  const form = loginSection.querySelector('form');
  if (!form) return;

  let mensaje = document.getElementById('mensaje-login');
  if (!mensaje) {
    mensaje = document.createElement('p');
    mensaje.id = 'mensaje-login';
    mensaje.style.color = 'red';
    mensaje.style.marginTop = '10px';
    loginSection.appendChild(mensaje);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const emailInput = loginSection.querySelector('#email');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
      mensaje.textContent = 'Ingresá un email válido.';
      return;
    }

    // Guardamos la info básica del usuario en la sesión
    const usuario = { email: email };
    sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));

    // Redirigimos a la home
    window.location.href = '../index.html';
  });
}

// REGISTRO
function prepararRegistro() {
  const registroSection = document.getElementById('registro');
  if (!registroSection) return; // si no estoy en registro, no hago nada

  const form = registroSection.querySelector('form');
  if (!form) return;

  let mensaje = document.getElementById('mensaje-registro');
  if (!mensaje) {
    mensaje = document.createElement('p');
    mensaje.id = 'mensaje-registro';
    mensaje.style.marginTop = '10px';
    registroSection.appendChild(mensaje);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = registroSection.querySelector('#nombre')?.value.trim() || '';
    const apellido = registroSection.querySelector('#apellido')?.value.trim() || '';
    const email = registroSection.querySelector('#email')?.value.trim() || '';

    if (!email) {
      mensaje.style.color = 'red';
      mensaje.textContent = 'Ingresá un email válido.';
      return;
    }

    const usuario = { nombre, apellido, email };
    sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));

    mensaje.style.color = 'green';
    mensaje.textContent = 'Registro exitoso. Redirigiendo a la tienda...';

    setTimeout(function () {
      window.location.href = '../index.html';
    }, 1000);
  });
}

// PROTEGER PÁGINAS PRIVADAS
function protegerPaginasPrivadas() {
  const ruta = window.location.pathname;
  const esPaginaPrivada =
    ruta.includes('categoria-rolls.html') ||
    ruta.includes('categoria-combos.html') ||
    ruta.includes('categoria-bebidas.html') ||
    ruta.includes('carrito.html');

  if (esPaginaPrivada && !usuarioEstaLogueado()) {
    // Todas las páginas privadas están en /pages
    window.location.href = './login.html';
  }
}

// CARRITO (localStorage)
function obtenerCarrito() {
  const guardado = localStorage.getItem('carrito');
  if (!guardado) {
    return [];
  }
  return JSON.parse(guardado);
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(producto, cantidad) {
  // Si no está logueado → lo mando al login
  if (!usuarioEstaLogueado()) {
    alert('Para comprar tenés que iniciar sesión.');
    const estoyEnSubcarpeta = window.location.pathname.includes('/pages/');
    if (estoyEnSubcarpeta) {
      window.location.href = './login.html';
    } else {
      window.location.href = './pages/login.html';
    }
    return;
  }

  if (cantidad <= 0) {
    alert('Seleccioná al menos 1 unidad.');
    return;
  }

  const carrito = obtenerCarrito();

  const itemExistente = carrito.find(function (item) {
    return item.id === producto.id;
  });

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);
  alert(`Agregaste ${cantidad} unidad/es de ${producto.nombre} al carrito.`);
}

// Mostrar carrito en carrito.html
function prepararCarrito() {
  const carritoMain = document.getElementById('carrito');
  if (!carritoMain) return; // si no estoy en carrito.html, no hago nada

  const carrito = obtenerCarrito();
  const mensajeVacio = document.getElementById('carrito-vacio');
  const tabla = document.getElementById('tabla-carrito');
  const tbody = tabla.querySelector('tbody');
  const totalTexto = document.getElementById('total-carrito');

  if (!carrito.length) {
    mensajeVacio.style.display = 'block';
    tabla.style.display = 'none';
    totalTexto.style.display = 'none';
    return;
  }

  mensajeVacio.style.display = 'none';
  tabla.style.display = 'table';
  totalTexto.style.display = 'block';

  tbody.innerHTML = '';
  let total = 0;

  carrito.forEach(function (item) {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const tr = document.createElement('tr');

    const tdNombre = document.createElement('td');
    tdNombre.textContent = item.nombre;
    tdNombre.style.padding = '.5rem';

    const tdPrecio = document.createElement('td');
    tdPrecio.textContent = `$ ${item.precio}`;
    tdPrecio.style.textAlign = 'right';
    tdPrecio.style.padding = '.5rem';

    const tdCantidad = document.createElement('td');
    tdCantidad.textContent = item.cantidad;
    tdCantidad.style.textAlign = 'center';
    tdCantidad.style.padding = '.5rem';

    const tdSubtotal = document.createElement('td');
    tdSubtotal.textContent = `$ ${subtotal}`;
    tdSubtotal.style.textAlign = 'right';
    tdSubtotal.style.padding = '.5rem';

    const tdAcciones = document.createElement('td');
    tdAcciones.style.textAlign = 'center';
    tdAcciones.style.padding = '.5rem';

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.type = 'button';
    btnEliminar.style.padding = '.3rem .6rem';
    btnEliminar.style.borderRadius = '8px';
    btnEliminar.style.border = '1px solid #ccc';
    btnEliminar.style.cursor = 'pointer';

   totalTexto.textContent = `Total: $ ${total}`;

  // botón finalizar compra
  const btnFinalizar = document.getElementById('btn-finalizar');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', function () {
      window.location.href = './finalizar.html';
    });
  }

    btnEliminar.addEventListener('click', function () {
      eliminarDelCarrito(item.id);
    });

    tdAcciones.appendChild(btnEliminar);

    tr.appendChild(tdNombre);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdSubtotal);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });

  totalTexto.textContent = `Total: $ ${total}`;
}

function eliminarDelCarrito(idProducto) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(function (item) {
    return item.id !== idProducto;
  });
  guardarCarrito(carrito);
  prepararCarrito(); // vuelvo a dibujar la tabla
}

// PRODUCTOS DE CATEGORÍA

const productosRolls = [
  {
    id: 1,
    nombre: 'California Roll',
    descripcion: 'Clásico roll con palta, pepino y kanikama. Fresco y suave.',
    precio: 350,
    imagen: '../assets/sushi-de-cerca.jpg'
  },
  {
    id: 2,
    nombre: 'Futomaki',
    descripcion: 'Roll grande relleno de vegetales y pescado. Ideal para compartir.',
    precio: 380,
    imagen: '../assets/vista-frontal-maki-sushi-rolls-con-semillas-de-sesamo.jpg'
  },
  {
    id: 3,
    nombre: 'Salmón Roll',
    descripcion: 'Roll de salmón fresco con palta, suave y delicioso.',
    precio: 750,
    imagen: '../assets/maki-de-sushi-de-aguacate-unico-aislado-sobre-fondo-blanco.jpg'
  }
];

const productosCombos = [
  {
    id: 1,
    nombre: 'Combo Sunset',
    descripcion: 'Variado mix de rolls clásicos y especiales. Perfecto para dos personas.',
    precio: 2200,
    imagen: '../assets/vista-de-la-deliciosa-comida-asiatica-con-efecto-3d.jpg'
  },
  {
    id: 2,
    nombre: 'Combo Salchi',
    descripcion: 'Selección económica de rolls surtidos. Ideal para una comida rápida.',
    precio: 1990,
    imagen: '../assets/maki-sushi-aislado-en-blanco.jpg'
  },
  {
    id: 3,
    nombre: 'Combo Pop',
    descripcion: 'Combo liviano y fresco con piezas variadas para cualquier ocasión.',
    precio: 2100,
    imagen: '../assets/composicion-flat-lay-de-sushi.jpg'
  }
];

const productosBebidas = [
  {
    id: 1,
    nombre: 'Gaseosa',
    descripcion: 'Bebida refrescante ideal para acompañar tus rolls.',
    precio: 900,
    imagen: '../assets/Unknown.jpeg'
  },
  {
    id: 2,
    nombre: 'Agua mineral',
    descripcion: 'Agua natural purificada. La opción más liviana.',
    precio: 800,
    imagen: '../assets/botella-de-agua-fotorrealista.jpg'
  },
  {
    id: 3,
    nombre: 'Jugo de frutas',
    descripcion: 'Jugo natural exprimido, dulce y refrescante.',
    precio: 950,
    imagen: '../assets/vista-del-vaso-de-agua.jpg'
  }
];

// Crear card de producto para categorías
function crearTarjetaProducto(producto) {
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

// Cargar productos según página de categoría
function cargarProductosSegunPagina() {
  const contenedor = document.querySelector('.grilla-productos');
  if (!contenedor) return;

  const ruta = window.location.pathname;
  let lista = null;

  if (ruta.includes('categoria-rolls.html')) {
    lista = productosRolls;
  } else if (ruta.includes('categoria-combos.html')) {
    lista = productosCombos;
  } else if (ruta.includes('categoria-bebidas.html')) {
    lista = productosBebidas;
  }

  if (!lista) return;

  contenedor.innerHTML = '';
  lista.forEach(function (prod) {
    const card = crearTarjetaProducto(prod);
    contenedor.appendChild(card);
  });
}