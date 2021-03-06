var endTriangle=0;
var program, gl, vertices;
var vColor;
var u_FragColor;
var FizzyText = function() {
  this.message = 'dat.gui';
  this.speed = 0.8;
	this.Hexagon = 0;
	this.Pentagon= 0;
  this.displayOutline = false;
  this.explode = function() {  };
  // Define render logic ...
};

var hexagon, pentagon;
var hexagonAngle=0;var pentagonAngle=0;

function main() {
	var text = new FizzyText();
  var gui = new dat.GUI();
  var hexagon = gui.add(text, 'Hexagon', 0, 360);
  var pentagon = gui.add(text, 'Pentagon', 0, 360);


	hexagon.onChange(function(value) {
	  hexagonAngle = value;
		drawBackground();
				drawShapes(hexagonAngle, pentagonAngle);

	});

	pentagon.onChange(function(value) {
	  pentagonAngle = value;
		drawBackground();
				drawShapes(hexagonAngle, pentagonAngle);
	});

  	var canvas = document.getElementById('webgl');
	gl = getWebGLContext(canvas);
	if (!gl){
		console.log('Failed to find context');
	}

	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram (program);gl.uniform4f(u_FragColor,1,0,0,1);
	gl.program = program;
		  u_FragColor=gl.getUniformLocation(program, "u_FragColor");
		    if (!u_FragColor) {
		    console.log('Failed to get u_FragColor variable');
		    }
	// gl.program = program;

		vertices=[];

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		drawShapes(hexagonAngle, pentagonAngle);
	}

	function drawShapes(hexAngle, pentAngle){
		drawBackground();
		drawHexagon(hexAngle);
		drawPentagon(pentAngle);
	}

	function drawHexagon(angle){
		//drawing first triangle
		vertices =[0.3/2, 0.5/2, 0.6/2, 0.0, 0.3/2, -0.5/2, -0.3/2, -0.5/2, -0.6/2, 0.0, -0.3/2, 0.5/2];
		numberOfVertices = initVertices(program, gl, vertices);
		rotateHexagon(gl, angle);
		gl.uniform4f(u_FragColor,1,0,0,1);
		render(gl, numberOfVertices);
	}

	function drawPentagon(angle){
		//drawing first triangle
		vertices =[0.0/2, 0.5/2, 0.5/2, 0.1/2, 0.3/2, -0.5/2, -0.3/2, -0.5/2, -0.5/2, 0.1/2];
		numberOfVertices = initVertices(program, gl, vertices);
		rotatePentagon(gl, angle);
		gl.uniform4f(u_FragColor,1,0,0,1);
		render(gl, numberOfVertices);

		// drawHexagon(hexagonAngle);
	}

	function drawBackground(){
		vertices =[-1,1,1,1,1,-1,-1,-1];
		numberOfVertices = initVertices(program, gl, vertices);

		noTransformation(gl);
		gl.uniform4f(u_FragColor,0,0,0,1);
		render(gl, numberOfVertices);
	}

	function render (gl, numberOfVertices){
		// gl.clearColor(0.0, 0.0, 0.0, 1.0);
		// gl.clear(gl.COLOR_BUFFER_BIT);
		console.log(numberOfVertices);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, numberOfVertices);
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
	function rotatePentagon(gl, angle){
		console.log(angle);
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

	function rotateHexagon(gl, angle){
		console.log(angle);
			// console.log(angle);
			var radians = Math.PI * angle / 180.0;
			var cosB = Math.cos(radians);
			var sinB = Math.sin(radians);
			var trMatrix = [
							cosB, sinB, 0.0, 0.0,
							-sinB, cosB, 0.0, 0.0,
							0.0, 0.0, 1.0, 0.0,
							-0.5, 0.0, 0.0, 1.0
							];

			var transformationMatrix = gl.getUniformLocation(gl.program, 'transformationMatrix');
			gl.uniformMatrix4fv(transformationMatrix, false, flatten(trMatrix));
	}
