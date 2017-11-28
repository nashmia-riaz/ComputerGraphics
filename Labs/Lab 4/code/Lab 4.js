var endTriangle=0;
function main() {
  	var canvas = document.getElementById('webgl');
	var gl = getWebGLContext(canvas);
	if (!gl){
		console.log('Failed to find context');
	}

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram (program);
	gl.program = program;

	vertices=[];

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//drawing first triangle
	vertices =[-0.2, 0.2, -0.8, 0.2, -0.5, 0.8];
	numberOfVertices = initVertices(program, gl, vertices);
	noTransformation(gl);
	render(gl, numberOfVertices);


	//drawing second triangle
	vertices =[0.2, 0.2, 0.8, 0.2, 0.5, 0.8];
	numberOfVertices = initVertices(program, gl, vertices);
	rotateFirst(gl, 45);
	render(gl, numberOfVertices);

	//drawing third triangle
	vertices =[-0.2, -0.8, -0.8, -0.8, -0.5, -0.2];
	numberOfVertices = initVertices(program, gl, vertices);
	rotateSecond(gl, -45);
	render(gl, numberOfVertices);

	//drawing fourth triangle
	vertices =[0.2, -0.8, 0.8, -0.8, 0.5, -0.2];
	numberOfVertices = initVertices(program, gl, vertices);
	shearFourth(gl);
	render(gl, numberOfVertices);

	//showing quadrants
	vertices=[0, -1, 0, 1];
	var numberOfVertices = initVertices(program, gl, vertices);
	noTransformation(gl);
	renderLine(gl, numberOfVertices);

	//showing quadrants
	vertices=[-1, 0, 1, 0];
	numberOfVertices = initVertices(program, gl, vertices);
	noTransformation(gl);
	renderLine(gl, numberOfVertices);
}

function renderLine(gl, numberOfVertices){
	gl.drawArrays(gl.LINES, numberOfVertices-2, numberOfVertices);
}

function render (gl, numberOfVertices){
	console.log(numberOfVertices);
	gl.drawArrays(gl.TRIANGLES, numberOfVertices-3, numberOfVertices);
}

function initVertices(program, gl, vertices){
	var noOfDim = 2;
	var numberOfVertices = vertices.length / noOfDim;

	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer){ console.log('Failed to create the buffer object ');	return -1;}

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	var a_Position = gl.getAttribLocation(program, 'a_Position');
	if (a_Position < 0) { console.log ("Failed to Get Position"); return;	}

	gl.vertexAttribPointer(a_Position, noOfDim, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);

	return numberOfVertices;
}
function noTransformation(gl){
		angle=0;
		var radians = Math.PI * angle / 180.0;
		var cosB = Math.cos(radians);
		var sinB = Math.sin(radians);
		var trMatrix = [
						cosB, sinB, 0.0, 0.0,
						-sinB, cosB, 0.0, 0.0,
						0.0, 0.0, 1.0, 0.0,
						0.0, 0.0, 0.0, 1.0
						];

		var transformationMatrix = gl.getUniformLocation(gl.program, 'transformationMatrix');
		gl.uniformMatrix4fv(transformationMatrix, false, flatten(trMatrix));
}
function scale(gl, factor){

}
function rotateFirst(gl, angle){
		// console.log(angle);
		var radians = Math.PI * angle / 180.0;
		var cosB = Math.cos(radians);
		var sinB = Math.sin(radians);
		var trMatrix = [
						cosB, sinB, 0.0, 0.0,
						-sinB, cosB, 0.0, 0.0,
						0.0, 0.0, 1.0, 0.0,
						0.5, 0.0, 0.0, 1.0
						];

		var transformationMatrix = gl.getUniformLocation(gl.program, 'transformationMatrix');
		gl.uniformMatrix4fv(transformationMatrix, false, flatten(trMatrix));
}
function rotateSecond(gl, angle){
		var scaleFactor = 2;
		var radians = Math.PI * angle / 180.0;
		var cosB = Math.cos(radians);
		var sinB = Math.sin(radians);
		var trMatrix = [
						cosB*scaleFactor, sinB, 0.0, 0.0,
						-sinB, cosB*scaleFactor, 0.0, 0.0,
						0.0, 0.0, 1.0, 0.0,
						0.7, -0.0, 0.0, 1.0
						];

		var transformationMatrix = gl.getUniformLocation(gl.program, 'transformationMatrix');
		gl.uniformMatrix4fv(transformationMatrix, false, flatten(trMatrix));
}

function shearFourth(gl){
		angle=0;
		var scaleFactor = 2;
		var radians = Math.PI * angle / 180.0
		radians = 0.5;
		var cosB = Math.cos(radians);
		var sinB = Math.sin(radians);
		var tanB = sinB/cosB;
		var trMatrix = [
				-1, 	tanB, 0.0, 0.0,
				0, 1, 0.0, 0.0,
				0.0, 0.0, 1.0, 0.0,
				1, -0.2, 0.0, 1.0
		];

		var transformationMatrix = gl.getUniformLocation(gl.program, 'transformationMatrix');
		gl.uniformMatrix4fv(transformationMatrix, false, flatten(trMatrix));
}

function translate(gl, tr){
	var tr = [-0.5, 0.5, 0.0];
	var trMatrix = [
					1.0, 0.0, 0.0, 0.0,
					0.0, 1.0, 0.0, 0.0,
					0.0, 0.0, 1.0, 0.0,
					tr[0], tr[1], tr[2], 1.0
					];


	var transformationMatrix = gl.getUniformLocation(gl.program, 'transformationMatrix');
	gl.uniformMatrix4fv(transformationMatrix, false, flatten(trMatrix));
}
