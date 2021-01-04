var vertexShaderText = 
[
	'precision mediump float;',
	'',
	'attribute vec3 vertPosition;',
	'attribute vec3 vertColor;',
	'varying vec3 fragColor;',
	'uniform mat4 matWorld;',
	'uniform mat4 matView;',
	'uniform mat4 matProj;',
	'',
	'void main()',
	'{',
	'	gl_Position = matProj * matView * matWorld * vec4(vertPosition, 1.0);',
	'	fragColor = vertColor;',
	'}'
].join('\n');

var fragmentShaderText = 
[
	'precision mediump float;',
	'varying vec3 fragColor;',
	'',
	'void main()',
	'{',
	'	gl_FragColor = vec4(fragColor, 1.0);',
	'}'
].join('\n');

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

	gl.clearColor(0.27, 0.15, 0.2, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK); 

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	gl.compileShader(fragmentShader);

	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
	{
		console.error('ERROR COMPILING VERTEX SHADER!', gl.getShaderInfoLog(vertexShader));
		return;
	}
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
	{
		console.error('ERROR COMPILING FRAGMENT SHADER!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if(!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		console.error('ERROR LINKING PROGRAM!', gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);

	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
	{
		console.error('ERROR VALIDATING PROGRAM!', gl.getProgramInfoLog(program));
		return;
	}
	
	var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

	var boxVertexBufferObj = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObj);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObj = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObj);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

	gl.vertexAttribPointer(
		positionAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT,
		0
	);
	gl.vertexAttribPointer(
		colorAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT,
		3 * Float32Array.BYTES_PER_ELEMENT
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'matWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'matView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'matProj');

	var worldMat = new Float32Array(16);
	var viewMat = new Float32Array(16);
	var projMat = new Float32Array(16);
	glMatrix.mat4.identity(worldMat);
	glMatrix.mat4.lookAt(viewMat, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
	glMatrix.mat4.perspective(projMat, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMat);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMat);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMat);
	
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);

	var angle = 0;
	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);

	var loop = function() 
	{
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;

		glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0 ,1 ,0]);
		glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1 ,0 ,1]);
		glMatrix.mat4.mul(worldMat, xRotationMatrix, yRotationMatrix);

		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMat);
		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		//gl.drawArrays(gl.TRIANGLES, 0, 3);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
}