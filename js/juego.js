var Juego = function(cantidadDePiezasPorLado) {
    this.cantidadDePiezasPorLado = cantidadDePiezasPorLado;
    this.mouseClicked = {
        x: 0,
        y: 0
    }

    Juego.prototype.crearGrilla = function(cantidadDePiezasPorLado) {
        var grilla = new Array(cantidadDePiezasPorLado);
        var posicion = 1;
        for (var fila = 0; fila < cantidadDePiezasPorLado; fila++) {
            grilla[fila] = new Array(cantidadDePiezasPorLado);
            for (var columna = 0; columna < grilla[fila].length; columna++) {
                grilla[fila][columna] = posicion;
                posicion++;
            }
        }
        this.grilla = grilla;
        this.filaPosicionVacia = cantidadDePiezasPorLado - 1;
        this.columnaPosicionVacia = cantidadDePiezasPorLado - 1;
    }

    Juego.prototype.construirPiezas = function() {
        this.piezas = new Array();
        for(y = 0; y < this.grilla.length; y++) {
            for(x = 0; x < this.grilla[0].length; x++) {
                var posX = x * this.anchoPiezas;
                var posY = y * this.altoPiezas;
                var cropX = posX;
                var cropY = posY;
                var pieza = new Pieza(this.grilla[y][x], posX, posY, this.anchoPiezas, this.altoPiezas);
                pieza.setImageURL(this.imagen.src);
                pieza.setImageCrop(cropX, cropY);
                this.piezas.push(pieza);
            }
        }
    }

    Juego.prototype.posicionValida = function(fila, columna) {
        if (fila < 0 || fila >= this.grilla.length || columna < 0 || columna >= this.grilla[0].length) {
            return false;
        } else {
            if(!this.mezclando){
                this.contadorDeMovimientos -= 1
                this.setContadorDeMovimientos(this.contadorDeMovimientos);
            }
            return true;
        }
    }

    Juego.prototype.chequearSiGano = function() {
        var ganador = true;
        var count = 0;
        for (var fila = 0; fila < this.grilla.length; fila++) {
            for (var columna = 0; columna < this.grilla[fila].length; columna++) {
                count++
                if (this.grilla[fila][columna] !== count) {
                    ganador = false;
                }
            }
        }
        this.ganador = ganador;
        if (this.ganador) {
            let self = this;
            setTimeout("mostrarCartel(true)", 10);
        }
    }

    Juego.prototype.intercambiarPosiciones = function(fila1, columna1, fila2, columna2) {
        var posicionActual = this.grilla[fila1][columna1];
        var posicionACambiar = this.grilla[fila2][columna2];
        this.grilla[fila1][columna1] = posicionACambiar;
        this.grilla[fila2][columna2] = posicionActual;
        this.actualizarPiezas();
    }

    Juego.prototype.actualizarPiezas = function() {
        for (let y = 0; y < this.grilla.length; y++) {
            for (let x = 0; x < this.grilla[y].length; x++) {
                var posX = x * this.anchoPiezas;
                var posY = y * this.altoPiezas;
                this.piezas[this.grilla[y][x] - 1].x = posX;
                this.piezas[this.grilla[y][x] - 1].y = posY;
            }
        }
    }

    Juego.prototype.actualizarPosicionVacia = function(nuevaFila, nuevaColumna) {
        this.filaPosicionVacia = nuevaFila;
        this.columnaPosicionVacia = nuevaColumna;
    }

    Juego.prototype.moverEnDireccion = function(direccion) {
        var nuevaFilaPiezaVacia;
        var nuevaColumnaPiezaVacia;

        if(this.contadorDeMovimientos >= 0 && !this.ganador){
            if (direccion == 40) {
                nuevaFilaPiezaVacia = this.filaPosicionVacia + 1;
                nuevaColumnaPiezaVacia = this.columnaPosicionVacia;
            } else if (direccion == 38) {
                nuevaFilaPiezaVacia = this.filaPosicionVacia - 1;
                nuevaColumnaPiezaVacia = this.columnaPosicionVacia;
            } else if (direccion == 39) {
                nuevaFilaPiezaVacia = this.filaPosicionVacia;
                nuevaColumnaPiezaVacia = this.columnaPosicionVacia + 1;
            } else if (direccion == 37) {
                nuevaFilaPiezaVacia = this.filaPosicionVacia;
                nuevaColumnaPiezaVacia = this.columnaPosicionVacia - 1;
            }
    
            if (this.posicionValida(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia)) {
                this.intercambiarPosiciones(this.filaPosicionVacia, this.columnaPosicionVacia, nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
                this.actualizarPosicionVacia(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
            }
        }
    }

    Juego.prototype.mezclarPiezas = function(veces) {
        if (veces <= 0) {
            this.mezclando = false;
            return;
        }
        let self = this;
        var direcciones = [40, 38, 39, 37];
        var direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
        self.moverEnDireccion(direccion);
        setTimeout(function () {
            self.mezclarPiezas(veces - 1)
        }, 5);
    }

    Juego.prototype.cargarImagen = function (e) {
        //se calcula el ancho y el alto de las piezas de acuerdo al tamaño del canvas (600). 
        this.anchoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
        this.altoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
        //se calcula el ancho y alto del rompecabezas de acuerdo al ancho y alto de cada pieza y la cantidad de piezas por lado
        this.anchoDeRompecabezas = this.anchoPiezas * this.cantidadDePiezasPorLado;
        this.altoDeRompecabezas = this.altoPiezas * this.cantidadDePiezasPorLado;

        this.configurarCanvas();
    }

    Juego.prototype.configurarCanvas = function() {
        var canvas = document.getElementById("miCanvas");
        var contexto = canvas.getContext("2d");
        contexto.fillStyle = "orange";
        contexto.fillRect(0, 0, canvas.width, canvas.height);
        this.canvas = canvas;
        this.contexto = contexto;
    }

    Juego.prototype.iniciarImagen = function (callback) {
        this.imagen = new Image();
        var self = this;
        //se espera a que se termine de cargar la imagen antes de ejecutar la siguiente funcion
        this.imagen.addEventListener('load', function () {
          self.cargarImagen.call(self);
          callback();
        }, false);
        this.imagen.src = "images/imagen.jpg";
    }

    Juego.prototype.iniciar = function (cantMovimientos) {
        this.movimientosTotales = cantMovimientos;
        this.contadorDeMovimientos = cantMovimientos;
        this.mezclando = true;
        this.frameCount = 0;
        this.piezas = [];
        this.grilla = [];

        var nivelDificultad = $("input[type='radio'][name='nivel']:checked").val();
        this.configurarNivel(nivelDificultad);

        //se guarda el contexto en una variable para que no se pierda cuando se ejecute la funcion iniciarImagen (que va a tener otro contexto interno)
        var self = this;

        $("#cantidadPiezasPorLado").val(self.cantidadDePiezasPorLado);

        $("#btnReIniciar").click(function() {
            location.reload();
        });

        $("#btnMezclar").click(function() {
            self.mezclando = true;  
            self.mezclarPiezas(20);
        });
            
        $("#btnInicio").val(1);
        $("#btnInicio").delay(200).animate({value:"0"}, 2500);

        this.crearGrilla(self.cantidadDePiezasPorLado);
        //se instancian los atributos que indican la posicion de las fila y columna vacias de acuerdo a la cantidad de piezas por lado para que sea la ultima del tablero
        this.filaPosicionVacia = this.cantidadDePiezasPorLado - 1;
        this.columnaPosicionVacia = this.cantidadDePiezasPorLado - 1;
        //se espera a que este iniciada la imagen antes de construir las piezas y empezar a mezclarlas
        this.iniciarImagen(function () {
            self.construirPiezas();
            //la cantidad de veces que se mezcla es en funcion a la cantidad de piezas por lado que tenemos, para que sea lo mas razonable posible.
            var cantidadDeMezclas = Math.max(Math.pow(self.cantidadDePiezasPorLado, 3), 100);
            self.capturarTeclas();
            self.capturarMouse();
            self.mezclarPiezas(cantidadDeMezclas);

            setInterval(function() {
                self.contexto.clearRect(0, 0, self.canvas.width, self.canvas.height);
                self.frameCount += 1;

                self.piezas.forEach(function(pieza) {
                    self.contexto.strokeStyle = 'white';
                    self.contexto.drawImage(pieza.image, pieza.xCrop, pieza.yCrop, pieza.width, pieza.height, pieza.x, pieza.y, pieza.width, pieza.height);
                    self.contexto.strokeRect(pieza.xCrop,  pieza.yCrop, pieza.width, pieza.width);
                });

                self.mostrarPiezaMovil();
                self.contexto.save();
                self.contexto.globalAlpha = $("#btnInicio").val();
                self.contexto.drawImage(self.piezas[0].image, 0, 0);
                self.contexto.restore();
            },1000/30);
        });
    }

    Juego.prototype.mostrarPiezaMovil = function () {
        this.contexto.fillStyle = 'rgba(156, 39, 176)'; 
        this.contexto.fillRect(this.piezas[this.piezas.length - 1].x, this.piezas[this.piezas.length - 1].y, this.anchoPiezas, this.altoPiezas);
    }

    Juego.prototype.setContadorDeMovimientos = function (contador) {
       this.contadorDeMovimientos = contador;
       if (!this.mezclando) {
            $("#contadorDeMovimientos").val(this.contadorDeMovimientos);
        } else {
            $("#contadorDeMovimientos").val(0);
        }
    }

    Juego.prototype.chequearMovimientosRestantes = function () {
        if(this.contadorDeMovimientos <= 0) {
            let self = this
            $('#contadorDeMovimientos').val(0);
            setTimeout('mostrarCartel(false)', 10);
        }
     }

    Juego.prototype.configurarNivel = function(nivel) {
        var piezas = 0;
        var movimientos = 0;
        nivel = nivel || 'facil';
        
        if (nivel === 'facil') {
          piezas = 3;
          movimientos = 30;
        } else if(nivel === 'medio') {
          piezas = 4;
          movimientos = 50;
        } else if(nivel === 'dificil') {
          piezas = 5;
          movimientos = 70;
        } else {
          piezas = Math.abs($("#cantidadPiezasPorLado").val());
          movimientos = Math.abs($("#contadorDeMovimientos").val());
        }
        this.cantidadDePiezasPorLado = piezas;
        this.maxMovimientos = movimientos;
        this.contadorDeMovimientos = this.maxMovimientos;
        $("#contadorDeMovimientos").val(this.maxMovimientos);
    }
    
    Juego.prototype.capturarTeclas = function() {
        if(this.contadorDeMovimientos >= 0 && !this.ganador){
            let self = this;
            document.onkeydown = (function (event) {
              if (event.which == 40 || event.which == 38 || event.which == 39 || event.which == 37) {
                self.moverEnDireccion(event.which);
                self.chequearSiGano();
                self.chequearMovimientosRestantes();
                event.preventDefault();
              }
            })
        }
    }

    Juego.prototype.capturarMouse = function() {
        if(this.contadorDeMovimientos >= 0 && !this.ganador){
            let self = this;
            document.onmousedown = (function(event) {
                var canvasBox = self.canvas.getBoundingClientRect();
                self.mouseClicked.x = event.clientX - canvasBox.left;
                self.mouseClicked.y = event.clientY - canvasBox.top;
                var piezaSize = self.piezas[0].width;
                var piezaPos = {
                    x: self.piezas[self.piezas.length - 1].x,
                    y: self.piezas[self.piezas.length - 1].y,
                }
                if(self.mouseClicked.x > 0 && self.mouseClicked.x < self.canvas.width && self.mouseClicked.y > 0 && self.mouseClicked.y < self.canvas.height){
                    if(self.mouseClicked.x < piezaPos.x && self.mouseClicked.x > piezaPos.x - piezaSize && self.mouseClicked.y > piezaPos.y && self.mouseClicked.y < piezaPos.y + piezaSize){
                        self.moverEnDireccion(39);
                    }

                    if(self.mouseClicked.x > piezaPos.x && self.mouseClicked.x < piezaPos.x + piezaSize && self.mouseClicked.y < piezaPos.y && self.mouseClicked.y > piezaPos.y - piezaSize){
                        self.moverEnDireccion(40);
                    }

                    if(self.mouseClicked.x > piezaPos.x + piezaSize && self.mouseClicked.x < piezaPos.x + piezaSize * 2 && self.mouseClicked.y > piezaPos.y && self.mouseClicked.y < piezaPos.y + piezaSize){
                        self.moverEnDireccion(37);
                    }

                    if(self.mouseClicked.x > piezaPos.x && self.mouseClicked.x < piezaPos.x + piezaSize && self.mouseClicked.y > piezaPos.y + piezaSize && self.mouseClicked.y < piezaPos.y + piezaSize * 2){
                        self.moverEnDireccion(38);
                    }

                    self.chequearSiGano();
                    self.chequearMovimientosRestantes();
                }
            });
        }
    }    
}

var Pieza = function(posicion, x, y, width, height) {
    this.id = posicion;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xCrop = 0;
    this.yCrop = 0;
    this.path = '';
    this.image = new Image();

    Pieza.prototype.setImageURL = function (url) {
        this.path = url;
        this.image.src = this.path;
    }

    Pieza.prototype.setImageCrop = function (x, y) {
        this.xCrop = x;
        this.yCrop = y;
    }
}

var mostrarCartel = function(gano) {
    if (gano) {
        swal("Ganaste :)", "Felicitaciones", "success",);
    } else {
        swal('Perdiste :(', 'En la próxima seguro que lo lográs', 'error');
    }
}

var juego = new Juego(3);
juego.iniciar(50);
