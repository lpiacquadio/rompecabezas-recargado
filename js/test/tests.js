var expect = chai.expect;

describe('Creación', function() {
    'use strict';

describe('Juego', function() {
    it('El Objeto Juego está definido', function(done) {
      if (!window.juego){
        done(err);
      }
      else{
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
      expect(juego.grilla[0].length).to.equal(juego.cantidadDePiezasPorLado);
    });
  });
});
