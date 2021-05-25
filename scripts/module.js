var defaults = {
  frequency: 2000,
}





Hooks.once('init', async function() {

  window.modelMove = window.modelMove || {
    ...defaults
  }


  window.modelMove.translate = function(location, params = {}) {

    var [y, x] = location
    var inv = n => ((n * 100) - 100) * -1 / 100

    location = {
      x: inv(x) * Math.abs(this.top.x - this.bottom.x) + (canvas.scene._viewPosition.x - this.horVisible/2),
      y: inv(y) * Math.abs(this.bottom.y - this.top.y) + (canvas.scene._viewPosition.y - this.vertVisible/2),

    }




    return location

  }

  window.modelMove.update = async function() {

    this.bottom = {
      x: canvas.scene._viewPosition.x + (this.horVisible / 2),
      y: canvas.scene._viewPosition.y - (this.vertVisible / 2),
    }

    this.top = {
      x: canvas.scene._viewPosition.x - (this.horVisible / 2),
      y: canvas.scene._viewPosition.y + (this.vertVisible / 2),
    }


    // this.moveToken(this.findToken("player1"), canvas.scene._viewPosition)
    this.moveToken(this.findToken("bottom"), this.bottom)
    this.moveToken(this.findToken("top"), this.top)




    for (let [name, location] of Object.entries(this.locations)) {
      if (["top", "bottom"].includes(name)) continue

      var token = this.findToken(name)
      this.moveToken(token, this.translate(location))

    }




  }

  window.modelMove.findToken = function(name) {
    return canvas.tokens.children[0].children.find(t => t.name == name)
  }

  window.modelMove.moveToken = function(token, coords) {
    if (!token) return
    //Compensate for the difference between the center of the token and the top-left of the token, and compensate for token size
    // coords.x -=  (token.data.width - 1) * canvas.scene.data.grid / 2;
    // coords.y -=  (token.data.height - 1) * canvas.scene.data.grid / 2;

    let gridCoords = canvas.grid.getCenter(coords.x - canvas.scene.data.grid / 2, coords.y - canvas.scene.data.grid / 2)

    let newCoords = {
      x: (gridCoords[0] + canvas.scene.data.grid / 2),
      y: (gridCoords[1] + canvas.scene.data.grid / 2)
    }
    let newCoords2 = {
      x: (newCoords.x + canvas.scene.data.grid / 2),
      y: (newCoords.y + canvas.scene.data.grid / 2)
    }

    if (this.storedPosition != newCoords && (token.checkCollision(newCoords2, true) == false || game.user.isGM)) {
      token.update(newCoords);
      this.storedPosition = newCoords;
      this.currentPosition = newCoords;
    }

  }



});

Hooks.once('ready', async function() {
  window.modelMove.horVisible = screen.width / canvas.scene._viewPosition.scale;
  window.modelMove.vertVisible = screen.height / canvas.scene._viewPosition.scale;
  canvas.scene._viewPosition
});


Hooks.on('canvasPan', async function(canvas, canvasPan) {
  window.modelMove.horVisible = screen.width / canvas.scene._viewPosition.scale;
  window.modelMove.vertVisible = screen.height / canvas.scene._viewPosition.scale;

});
