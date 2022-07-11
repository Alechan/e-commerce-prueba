//JAVASCRIPT

// Constantes
const nombreCarritoEnLocalStorage = 'carrito'

// Variables globales
let carrito = {}


//Alert inicio de pagina
swal("Bienvenido a nuestro E-Commerce")


//Sweet Alert funcion
const mostrarAlert = () => {
    swal ("Agregaste un producto al carrito!", "", "success")
}

const advertenciaVaciar = () => {
    swal ("Esta seguro que desea eliminar producto/os del carrito?",{
        buttons: ["Si", "No, seguir comprando"]
    });
}


document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    // Ale: leer del localStorage a ver si hay algo guardado del carrito
    var carritoGuardadoEnLocalStorage = localStorage.getItem(nombreCarritoEnLocalStorage);
    if (carritoGuardadoEnLocalStorage != null) {
        // Ale: Si había algo guardado en el local storage, leerlo
        // 1) Pasar de "json serializado en String" a "objeto JavaScript"
        carrito = JSON.parse(carritoGuardadoEnLocalStorage)
    }
    // Ale: modificamos al objeto carrito entonces tenemos que volver a "pintar el carrito" en html
    pintarCarrito()
})

const fetchData = async () => {
    try {
        const data = [
            {
              "precio": 1500,
              "id": 1,
              "title": "Iphone 12",
              "thumbnailUrl": "assests/iphone-12.jpg"
            },
            {
              "precio": 1300,
              "id": 2,
              "title": "Iphone 11",
              "thumbnailUrl": "assests/iphone-11.jpg"
            },
            {
              "precio": 1100,
              "id": 3,
              "title": "Iphone X",
              "thumbnailUrl": "assests/iphone-X.jpg"
            },
            {
              "precio": 1400,
              "id": 4,
              "title": "Galaxy S22",
              "thumbnailUrl": "assests/Galaxy-s22.jpg"
            },
            {
              "precio": 1200,
              "id": 5,
              "title": "Galaxy S21",
              "thumbnailUrl": "assests/galaxy-s21.jpg"
            },
            {
              "precio": 1100,
              "id": 6,
              "title": "Galaxy S20",
              "thumbnailUrl": "assests/galaxy-s20.jpg"
            },
            {
              "precio": 1100,
              "id": 7,
              "title": "Galaxy Note20",
              "thumbnailUrl": "assests/galaxy-note-20.jpg"
            },
            {
              "precio": 650,
              "id": 8,
              "title": "Galaxy A53",
              "thumbnailUrl": "assests/galaxy-a53.jpg"
            }
          ]
        // const data = await res.json()
        // console.log(data)
        pintarProductos(data)
        detectarBotones(data)
    } catch (error) {
        console.log(error)
    }
}

const contendorProductos = document.querySelector('#contenedor-productos')
const pintarProductos = (data) => {
    const template = document.querySelector('#template-productos').content
    const fragment = document.createDocumentFragment()
    // console.log(template)
    data.forEach(producto => {
        // console.log(producto)
        template.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        template.querySelector('h5').textContent = producto.title
        template.querySelector('p span').textContent = producto.precio
        template.querySelector('button').dataset.id = producto.id
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    contendorProductos.appendChild(fragment)
}


const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button')

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log(btn.dataset.id)
            const producto = data.find(item => item.id === parseInt(btn.dataset.id))
            producto.cantidad = 1
            if (carrito.hasOwnProperty(producto.id)) {
                producto.cantidad = carrito[producto.id].cantidad + 1
            }
            carrito[producto.id] = { ...producto }
            // console.log('carrito', carrito)

            // Ale: Guardar carrito en el localStorage
            guardarCarritoEnLocalStorage()

            pintarCarrito()
            mostrarAlert();
        })
    })
}

const items = document.querySelector('#items')

const pintarCarrito = () => {

    //carrito innerHTML
    items.innerHTML = ''

    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()

    Object.values(carrito).forEach(producto => {
        // console.log('producto', producto)
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.title
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        template.querySelector('.btn-info').dataset.id = producto.id
        template.querySelector('.btn-danger').dataset.id = producto.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()
    accionBotones()

}

const footer = document.querySelector('#footer-carrito')
const pintarFooter = () => {

    footer.innerHTML = ''

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío con innerHTML</th>
        `
        return
    }

    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    // console.log(nPrecio)

    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    //vaciar el carrito
    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
        advertenciaVaciar()
    })

}

const accionBotones = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-info')
    const botonesEliminar = document.querySelectorAll('#items .btn-danger')

    // console.log(botonesAgregar)
    //Agregar cantidad(1) del carrito
    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log(btn.dataset.id)
            const producto = carrito[btn.dataset.id]
            producto.cantidad ++
            carrito[btn.dataset.id] = { ...producto }
            pintarCarrito();
            
        })
    })
    //Eliminar cantidad (1) del carrito
    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = carrito[btn.dataset.id]
            producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[btn.dataset.id]
            } else {
                carrito[btn.dataset.id] = { ...producto }
            }
            pintarCarrito()
        })
    })
}

function guardarCarritoEnLocalStorage() {
    // Ale: 1) Pasar de "objeto JavaScript" a "string serializado como JSON"
    const carritoComoJSONString = JSON.stringify(carrito)
    // Ale: 2) Guardar el string en localStorage en la clave (key) "carrito" (donde vamos a ir a buscarla)
    localStorage.setItem(nombreCarritoEnLocalStorage, carritoComoJSONString)
}

