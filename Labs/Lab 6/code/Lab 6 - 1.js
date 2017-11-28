"use strict";

var canvas;
var gl;


var maxNumVertices = 3000;
var index = 0;

var Red = 0.25,
    Green = 0.75,
    Blue = 0.85;

var colorsArray = [];
var totalLines = 0;
var indi = [];
indi[0] = 0;
var startIndex = [0];
var cbufferId;
var vColor;
var program;
var vBuffer;
var vPosition;


window.onload = function init() {
    canvas = document.getElementById("webgl");

    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl ) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    gl.program = program;

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cbufferId = gl.createBuffer();
    vColor = gl.getAttribLocation(program, "vColor");

    gl.clear(gl.COLOR_BUFFER_BIT);

    var vertices = [0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5];

    Red = 0.25; Green = 0.75; Blue = 0.85;

    for(var i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    Red = 0; Green = 0 ; Blue= 1;

    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    Red = 0.25; Green = 0.53; Blue = 0.4;
    vertices = [0.75,0, -0.75, 0];

    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    Red = 0.25; Green = 0.53; Blue = 0.4;
    vertices = [0,0.75, 0, -0.75];

    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    Red = 1.0; Green = 0.0; Blue = 0.0;
    vertices = [0.0, 0.75, 0.1, 0.85, -0.1, 0.85];

    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    vertices = [0.75, 0.4, 0.85, 0.5, 0.85, 0.3];

    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    vertices = [0.75, 0.0, 0.85, 0.1, 0.85, -0.1];

    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    vertices = [0.75, -0.4, 0.85, -0.5, 0.85, -0.3];

    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    vertices = [-0.75, 0.4, -0.85, 0.5, -0.85, 0.3];

    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    vertices = [-0.75, 0.0, -0.85, 0.1, -0.85, -0.1];

    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    vertices = [-0.75, -0.4, -0.85, -0.5, -0.85, -0.3];

    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();
    vertices = [0.0, -0.75, -0.1, -0.85, 0.1, -0.85];

    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    renderQuad();
    render();
};

function end(){
  totalLines++;
  indi[totalLines] = 0;
  startIndex[totalLines] = index;
}


function addPoints(xd, yd){

  gl.viewport( 0, 0, canvas.width, canvas.height );

  var t = [xd, yd];
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

  colorsArray.push([Red, Green, Blue]);
  indi[totalLines]++;
  index++;

  gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
}

function render() {
    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
// gl.clear( gl.COLOR_BUFFER_BIT );
    for (var i = 0; i < totalLines + 1; i++) {
        gl.drawArrays(gl.LINE_LOOP, startIndex[i], indi[i]);
    }
}
function renderQuad(){
  gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
// gl.clear( gl.COLOR_BUFFER_BIT );
  for (var i = 0; i < totalLines + 1; i++) {
      gl.drawArrays(gl.TRIANGLE_FAN, startIndex[i], indi[i]);
  }
}

function noTransformation(){
    var angle=0;
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
