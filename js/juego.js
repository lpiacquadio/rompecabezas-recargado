var Juego = function(cantidadDePiezasPorLado) {
    this.cantidadDePiezasPorLado = cantidadDePiezasPorLado;
    this.posicionVacia = {
        fila: this.cantidadDePiezasPorLado - 1,
        columna: this.cantidadDePiezasPorLado - 1
    };
    this.grilla = [];

    Juego.prototype.crearGrilla = function() {
        var grilla = new Array(this.cantidadDePiezasPorLado);
        var count = 1;
        for (var fila = 0; fila < this.cantidadDePiezasPorLado; fila++) {
            grilla[fila] = new Array(this.cantidadDePiezasPorLado);
            for (var columna = 0; columna < grilla[fila].length; columna++) {
                grilla[fila][columna] = count;
                count++;
            }
        }
        this.grilla = grilla;
    }

    Juego.prototype.posicionValida = function(fila, columna) {
        return fila >= 0 && columna >= 0 && fila < this.cantidadDePiezasPorLado && columna < this.cantidadDePiezasPorLado;
    }

    Juego.prototype.chequearSiGano = function() {
        var count = 0;
        for (var fila = 0; fila < this.grilla.length; fila++) {
            for (var columna = 0; columna < this.grilla[fila].length; columna++) {
                count++
                if (this.grilla[fila][columna] !== count) {
                    return false;
                }
            }
        }
        return true;
    }

    Juego.prototype.mostrarCartelGanador = function() {
        alert('Ganaste!');
        this.iniciar();
    }

    Juego.prototype.intercambiarPosiciones = function(fila1, columna1, fila2, columna2) {
        var posicionActual = this.grilla[fila1][columna1];
        var posicionACambiar = this.grilla[fila2][columna2];
        this.grilla[fila1][columna1] = posicionACambiar;
        this.grilla[fila2][columna2] = posicionActual;

        var piezaActual = document.getElementById('pieza' + posicionActual);
        var piezaACambiar = document.getElementById('pieza' + posicionACambiar);
        var padre =  piezaActual.parentNode;
        padre.replaceChild(piezaActual.cloneNode(true), piezaACambiar);
        padre.replaceChild(piezaACambiar.cloneNode(true), piezaActual);
    }

    Juego.prototype.actualizarPosicionVacia = function(nuevaFila, nuevaColumna) {
        this.posicionVacia = {
            fila: nuevaFila,
            columna: nuevaColumna
        };
    }

    Juego.prototype.moverEnDireccion = function(direccion) {
        var nuevaFilaPiezaVacia;
        var nuevaColumnaPiezaVacia;

        if (direccion == 40) {
            nuevaFilaPiezaVacia = this.posicionVacia.fila + 1;
            nuevaColumnaPiezaVacia = this.posicionVacia.columna;
        } else if (direccion == 38) {
            nuevaFilaPiezaVacia = this.posicionVacia.fila - 1;
            nuevaColumnaPiezaVacia = this.posicionVacia.columna;
        } else if (direccion == 39) {
            nuevaFilaPiezaVacia = this.posicionVacia.fila;
            nuevaColumnaPiezaVacia = this.posicionVacia.columna + 1;
        } else if (direccion == 37) {
            nuevaFilaPiezaVacia = this.posicionVacia.fila;
            nuevaColumnaPiezaVacia = this.posicionVacia.columna - 1;
        }

        if (this.posicionValida(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia)) {
            this.intercambiarPosiciones(this.posicionVacia.fila, this.posicionVacia.columna, nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
            this.actualizarPosicionVacia(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
        }
    }

    Juego.prototype.mezclarPiezas = function(veces) {
        if (veces <= 0) {
            return;
        }
        for (var vez = 0; vez < veces; vez++) {
            var direcciones = [40, 38, 39, 37];
            var direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
            this.moverEnDireccion(direccion);
        }
    }

    Juego.prototype.iniciar = function() {
        this.mezclarPiezas(60);
    }   
}

function capturarTeclas(juego) {
    document.body.onkeydown = (function(evento) {
        if (evento.which == 40 || evento.which == 38 || evento.which == 39 || evento.which == 37) {
            juego.moverEnDireccion(evento.which);
            var gano = juego.chequearSiGano();
            if (gano) {
                setTimeout(function() {
                    juego.mostrarCartelGanador();
                }, 500);
            }
            evento.preventDefault();
        }
    });
}

var juego = new Juego(3);
juego.crearGrilla();
juego.iniciar();
capturarTeclas(juego);
