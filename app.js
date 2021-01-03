var InitDemo = function()
{
	//what happen when fully load.
	console.log("ASD?")

	//chrome, firefox is enough at this, but explorer, edge...
	var canvas = document.getElementById('game');
	var gl = canvas.getContext('webgl');

	if(!gl)
	{
		console.log('WebGL not supported zz');
		gl = canvas.getContext('experimental-webgl');
	}

	if(!gl)
	{
		alert('Your browser does not support WebGL')
	}

	gl.clearColor(0.67, 0.55, 0.7, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}