var defaults = {
  frequency: 2000,
}


var points = [{
    x: 384,
    y: 216
  }, {
    x: 484,
    y: 116
  }, {
    x: 284,
    y: 216
  },


]


var last = 0


Hooks.once('init', async function() {

  window.modelMove = window.modelMove || {
    ...defaults
  }

  window.modelMove.update = async function() {
    var newCoord = points[last]
    last += 1
    if (last > 2) last = 0

    // console.log(this.locations);
    // console.log(this.horVisible);
    // console.log(this.vertVisible);

    for (let [name, location] of Object.entries(this.locations)) {
      console.log(name, location);
    }


    var token = this.findToken("test")
    this.moveToken(token, {
      x: 0,
      y: 0
    })
  }

  window.modelMove.findToken = function(name) {
    return canvas.tokens.children[0].children.find(t => t.name == name)
  }

  window.modelMove.moveToken = function(token, coords) {
    //Compensate for the difference between the center of the token and the top-left of the token, and compensate for token size
    // coords.x -= token.hitArea.width / 2 + (token.data.width - 1) * canvas.scene.data.grid / 2;
    // coords.y -= token.hitArea.height / 2 - (token.data.height - 1) * canvas.scene.data.grid / 2;

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
});


Hooks.on('canvasPan', async function(canvas, canvasPan) {
  window.modelMove.horVisible = screen.width / canvas.scene._viewPosition.scale;
  window.modelMove.vertVisible = screen.height / canvas.scene._viewPosition.scale;
});
