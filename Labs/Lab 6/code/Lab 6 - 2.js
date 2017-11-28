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


var angle = 0;
var speed = 0.01;
var translateX=1;
var translateX2=-1;
var dir1 = 1;

window.onload = function init() {
    canvas = document.getElementById("webgl");

    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl ) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.clearColor(0.9, 0.9, 0.9, 0.0);

    //
    //  Load shaders and initialize attribute buffers
    //
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
    // render();

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

    Red = 1; Green = 1; Blue = 0;
    vertices = [-0.05, 1.0, 0.05, 1.0, 0.05, 0.9, -0.05, 0.9];
    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    vertices = [-0.05, -1.0, 0.05, -1.0, 0.05, -0.9, -0.05, -0.9];
    for(i =0; i<vertices.length; i+=2)
      addPoints(vertices[i], vertices[i+1]);
    end();

    document.getElementById( "speed" ).onclick = function () {
        speed=parseFloat(document.getElementById( "speed" ).value);
        document.getElementById( "sliderValue" ).textContent = speed;
    };
    draw();
};

function draw(){
    noTransformation();
    renderQuad(0, 0);

    if(dir1 == 1){
        translateX+=speed;
        translateX2-=speed;
        console.log("DIRECTION 1");
    }
    else if(dir1==-1){
        translateX-=speed;
        translateX2+=speed;
    }
    if(translateX>1 || translateX<-1 || translateX2<-1 || translateX2>1){
        dir1*=-1;
    }

    angle++;
    rotate(angle);
    renderQuad(1, 10);
    render(1, 10);

    translate(translateX);
    renderQuad(12, 12);
    render(12, 12);

    translate(translateX2);
    renderQuad(11, 11);
    render(11, 11);
    //
    requestAnimationFrame(draw);
}

function end(){
  totalLines++;
  indi[totalLines] = 0;
  startIndex[totalLines] = index;
}


function addPoints(xd, yd){

  gl.viewport( 0, 0, canvas.width, canvas.height );
  // gl.clearColor( 0.9, 0.9, 0.9, 0.5 );
  // var t = vec2(2 * xd / canvas.width - 1,
  //     2 * (canvas.height - yd) / canvas.height - 1);

  var t = [xd, yd];
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

  colorsArray.push([Red, Green, Blue]);
  indi[totalLines]++; //indices for that line is incremented (so that we can keep drawing)
  index++; //index is incremented as well (so we can get the start if the next line)

  gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
}

function render(strt, end) {
    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
// gl.clear( gl.COLOR_BUFFER_BIT );
    for (var i = strt; i < end + 1; i++) {
        gl.drawArrays(gl.LINE_LOOP, startIndex[i], indi[i]);
    }
}
function renderQuad(strt, end){
  gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
// gl.clear( gl.COLOR_BUFFER_BIT );
  for (var i = strt; i < end + 1; i++) {
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

function rotate(angle){
    // var angle=10;
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
function translate(factor){
    var cosB = Math.cos(0);
    var sinB = Math.sin(0);
    var trMatrix = [
                    1, 0, 0.0, factor,
                    0, 1, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0, 1.0
                    ];

    var transformationMatrix = gl.getUniformLocation(gl.program, 'transformationMatrix');
    gl.uniformMatrix4fv(transformationMatrix, false, flatten(trMatrix));
}
