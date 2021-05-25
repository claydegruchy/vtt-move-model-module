Hooks.once('ready', async function() {
  console.log('worker started')


  var last = 0
  setInterval(async function() {

    if (!window.modelMove.tick) window.modelMove.tick = 0
    window.modelMove.tick = window.modelMove.tick += 1


    window.modelMove.locations = await fetch("http://localhost:5000/api/update.json")
      .then(r => r.json())

    await window.modelMove.update()

  }, window.modelMove.frequency || 1000);

});
