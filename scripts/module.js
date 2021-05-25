let horVisible
let vertVisible
var myWorker

Hooks.once('init', async function() {




});

Hooks.once('ready', async function() {
    let horVisible = screen.width / canvas.scene._viewPosition.scale;
    let vertVisible = screen.height / canvas.scene._viewPosition.scale;

    myWorker = new Worker("./scripts/worker.js", {
        type: "module"
    });

    myWorker.onmessage = function(e) {
        result.textContent = e.data;
        console.log('Message received from worker');
    }


});



Hooks.on('canvasPan', async function(canvas, canvasPan) {
	fetch('./scripts/worker.js')
	.then(console.log)
    console.log(myWorker)
    horVisible = screen.width / canvas.scene._viewPosition.scale;
    vertVisible = screen.height / canvas.scene._viewPosition.scale;
});

