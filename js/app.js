document.addEventListener('DOMContentLoaded', function () {
  console.log('app.js cargado ✅');

  construirNavbar();
  prepararLogin();
  prepararRegistro();
  cargarProductosSegunPagina();
});


// NAVBAR (array de páginas)

const paginas = [
  { titulo: 'Inicio', archivo: 'index.html', tipo: 'home' },
  { titulo: 'Rolls', archivo: 'categoria-rolls.html', tipo: 'categoria' },
  { titulo: 'Combos', archivo: 'categoria-combos.html', tipo: 'categoria' },
  { titulo: 'Bebidas', archivo: 'categoria-bebidas.html', tipo: 'categoria' }
];

function obtenerHref(pagina, estoyEnSubcarpeta) {
  if (pagina.tipo === 'home') {
    return estoyEnSubcarpeta ? '../index.html' : 'index.html';
  } else {
    return estoyEnSubcarpeta
      ? `./${pagina.archivo}`          // si estoy en /pages
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
  const esHome = ruta.endsWith('index.html') || ruta.endsWith('/');

  lista.innerHTML = '';

  // Si estoy en LOGIN o REGISTRO → menú simple
  if (esLogin || esRegistro) {
    const liInicio = document.createElement('li');
    const aInicio = document.createElement('a');
    aInicio.textContent = 'Inicio';
    aInicio.href = estoyEnSubcarpeta ? '../index.html' : 'index.html';
    liInicio.appendChild(aInicio);
    lista.appendChild(liInicio);
    return;
  }

  // Menú normal con páginas
  paginas.forEach(pagina => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = pagina.titulo;
    a.href = obtenerHref(pagina, estoyEnSubcarpeta);
    li.appendChild(a);
    lista.appendChild(li);
  });

  // mostrar "Iniciar sesión" (NO logout)
  if (esHome) {
    const liLogin = document.createElement('li');
    const aLogin = document.createElement('a');
    aLogin.textContent = 'Iniciar sesión';
    aLogin.href = './pages/login.html';
    liLogin.appendChild(aLogin);
    lista.appendChild(liLogin);
    return;
  }

  //En páginas internas → agregar botón "Salir"
  const liLogout = document.createElement('li');
  const btnLogout = document.createElement('a');
  btnLogout.textContent = 'Salir';
  btnLogout.href = '#';
  btnLogout.classList.add('boton-salir');

  btnLogout.addEventListener('click', function (e) {
    e.preventDefault();

    // volver al login según ubicación
    if (estoyEnSubcarpeta) {
      window.location.href = './login.html';
    } else {
      window.location.href = './pages/login.html';
    }
  });

  liLogout.appendChild(btnLogout);
  lista.appendChild(liLogout);
}

// LOGIN → REDIRECCIONAR AL INICIO

function prepararLogin() {
  const loginSection = document.getElementById('login');
  if (!loginSection) return; // si no estoy en login, no hago nada

  const form = loginSection.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Formulario de login enviado, redirigiendo...');
    window.location.href = '../index.html';
  });
}


// REGISTRO → REDIRECCIONAR AL INICIO

function prepararRegistro() {
  const registroSection = document.getElementById('registro');
  if (!registroSection) return; // si no estoy en registro, no hago nada

  const form = registroSection.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Formulario de registro enviado, redirigiendo...');
    window.location.href = '../index.html';
  });
}


//PRODUCTOS (arrays con descripción corta)


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

// 5) COMPONENTE DE CARD DE PRODUCTO


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

  // BOTÓN AGREGAR (rojo) PROBAR SI FUNCIONA
  const btnAgregar = document.createElement('button');
  btnAgregar.textContent = 'Agregar';
  btnAgregar.classList.add('boton-agregar');
  btnAgregar.type = 'button';

  btnAgregar.addEventListener('click', function () {
    console.log(`Se agregó ${cantidad} unidad(es) de ${producto.nombre}`);
    alert(`Agregaste ${cantidad} unidad/es de ${producto.nombre}`);
  });

  // Contenedor derecha (cantidad + botón agregar)
  const divPieDerecha = document.createElement('div');
  divPieDerecha.style.display = 'flex';
  divPieDerecha.style.flexDirection = 'column';
  divPieDerecha.style.justifyContent = 'center';
  divPieDerecha.style.alignItems = 'flex-end';
  divPieDerecha.style.gap = '6px';

  divPieDerecha.appendChild(divCantidad);
  divPieDerecha.appendChild(btnAgregar);

  pie.appendChild(spanPrecio);
  pie.appendChild(divPieDerecha);

  // Armado final de la card
  article.appendChild(img);
  article.appendChild(h3);
  article.appendChild(p);
  article.appendChild(pie);

  return article;
}

// 6) CARGAR PRODUCTOS SEGÚN PÁGINA
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
  lista.forEach(prod => {
    const card = crearTarjetaProducto(prod);
    contenedor.appendChild(card);
  });
}