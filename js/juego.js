var movimientos = [];
var resolviendo = false;

function resolver() {
    resolviendo = true;
    movimientos = movimientos.reverse();
    movimientos.forEach(movimiento => {
        moverEnDireccion(movimiento);
    })
    resolviendo = false;
    movimientos = [];
}

// Representación de la grilla. Cada nro representa a una pieza.
// El 9 es la posición vacía
var grilla = [
    [
        1, 2, 3
    ],
    [
        4, 5, 6
    ],
    [
        7, 8, 9
    ]
];

// Ac&aacute; vamos a ir guardando la posición vacía
var posicionVacia = {
    fila: 2,
    columna: 2
};

// Esta función va a chequear si el Rompecabezas est&aacute; en la posición ganadora
function chequearSiGano() {
    var item = 0;
    for (var fila = 0; fila < grilla.length; fila++) {
        for (var columna = 0; columna < grilla[fila].length; columna++) {
            item++
            if (grilla[fila][columna] !== item) {
                return false;
            }
        }
    }
    return true;
}

// la hacen los alumnos, pueden mostrar el cartel como prefieran. Pero es importante que usen
// esta función
function mostrarCartelGanador() {
    alert('Ganaste!');
    iniciar();
}

// Intercambia posiciones grilla y en el DOM
function intercambiarPosiciones(fila1, columna1, fila2, columna2) {
    // Intercambio la posicion en la grilla
    var posicionActual = grilla[fila1][columna1];
    var posicionACambiar = grilla[fila2][columna2];
    grilla[fila1][columna1] = posicionACambiar;
    grilla[fila2][columna2] = posicionActual;

    // Intercambio la posicion en el DOM
    var piezaActual = document.getElementById('pieza' + posicionActual);
    var piezaACambiar = document.getElementById('pieza' + posicionACambiar);
    var padre =  piezaActual.parentNode;
    padre.replaceChild(piezaActual.cloneNode(true), piezaACambiar);
    padre.replaceChild(piezaACambiar.cloneNode(true), piezaActual);
}

// Actualiza la posición de la pieza vacía
function actualizarPosicionVacia(nuevaFila, nuevaColumna) {
    posicionVacia = {
        fila: nuevaFila,
        columna: nuevaColumna
    };
}

// Para chequear si la posicón está dentro de la grilla.
function posicionValida(fila, columna) {
    return fila >= 0 && columna >= 0 && fila < 3 && columna < 3;
}

// Movimiento de fichas, en este caso la que se mueve es la blanca intercambiando
// su posición con otro elemento
function moverEnDireccion(direccion) {

    var nuevaFilaPiezaVacia;
    var nuevaColumnaPiezaVacia;

    if (direccion == 40) {
        nuevaFilaPiezaVacia = posicionVacia.fila + 1;
        nuevaColumnaPiezaVacia = posicionVacia.columna; // Intercambia pieza blanca con la pieza que está abajo suyo
    } else if (direccion == 38) {
        nuevaFilaPiezaVacia = posicionVacia.fila - 1;
        nuevaColumnaPiezaVacia = posicionVacia.columna; // Intercambia pieza blanca con la pieza que está arriba suyo
    } else if (direccion == 39) {
        nuevaFilaPiezaVacia = posicionVacia.fila;
        nuevaColumnaPiezaVacia = posicionVacia.columna + 1; // Intercambia pieza blanca con la pieza que está a su der
    } else if (direccion == 37) {
        nuevaFilaPiezaVacia = posicionVacia.fila;
        nuevaColumnaPiezaVacia = posicionVacia.columna - 1; // Intercambia pieza blanca con la pieza que está a su izq
    }

    // Se chequea si la nueva posición es válida, si lo es, se intercambia
    if (posicionValida(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia)) {
        if (!resolviendo) {
            if (direccion == 40) {
                movimientos.push(38);
            }
            if (direccion == 38) {
                movimientos.push(40);
            }
            if (direccion == 39) {
                movimientos.push(37);
            }
            if (direccion == 37) {
                movimientos.push(39);
            }
        }
        intercambiarPosiciones(posicionVacia.fila, posicionVacia.columna, nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
        actualizarPosicionVacia(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
    }

}

// Extras, ya vienen dadas

function mezclarPiezas(veces) {
    if (veces <= 0) {
        return;
    }
    var direcciones = [40, 38, 39, 37];
    var direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
    moverEnDireccion(direccion);

    setTimeout(function() {
        mezclarPiezas(veces - 1);
    }, 100);
}

function capturarTeclas() {
    document.body.onkeydown = (function(evento) {
        if (evento.which == 40 || evento.which == 38 || evento.which == 39 || evento.which == 37) {
            moverEnDireccion(evento.which);

            var gano = chequearSiGano();
            if (gano) {
                setTimeout(function() {
                    mostrarCartelGanador();
                }, 500);
            }
            evento.preventDefault();
        }
    })
}

function iniciar() {
    mezclarPiezas(60);
    capturarTeclas();
}

iniciar();
