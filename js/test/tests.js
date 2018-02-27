var expect = chai.expect;

describe('Creación', function() {
    'use strict';

  describe('Juego', function() {
    it('El Objeto Juego está definido', function(done) {
      if (!window.juego){
        done(err);
      } else {
        done();
      }
    });
  });

  describe('Tamaño de la grilla', function() {
    it('La grilla tiene el tamaño correcto', function() {
      //se crea la grilla con un valor de cantidad de piezas por lado
      juego.cantidadDePiezasPorLado = 5;
      juego.crearGrilla();
      //se evalua si el tamaño de la grilla creada es correcto
      expect(juego.grilla.length).to.equal(juego.cantidadDePiezasPorLado);
      juego.grilla.forEach(columna => {
        expect(columna.length).to.equal(juego.cantidadDePiezasPorLado);
      })
    });
  });

  describe('Posicion', function() {
    it('La posicion es valida', function() {
      juego.cantidadDePiezasPorLado = 5;
      juego.crearGrilla();

      expect(juego.posicionValida(0, 0)).to.be.true;
      expect(juego.posicionValida(4, 4)).to.be.true;
    })

    it('La posicion es invalida', function() {
      juego.cantidadDePiezasPorLado = 5;
      juego.crearGrilla();

      expect(juego.posicionValida(-1, 6)).to.be.false;
      expect(juego.posicionValida(6, 0)).to.be.false;
    })

    it('La posicion vacia es la ultima cuando incia', function() {
      juego.cantidadDePiezasPorLado = 5;
      juego.crearGrilla();

      expect(juego.filaPosicionVacia).to.be.equal(juego.cantidadDePiezasPorLado -1);
      expect(juego.columnaPosicionVacia).to.be.equal(juego.cantidadDePiezasPorLado -1);
    })
  });
});
