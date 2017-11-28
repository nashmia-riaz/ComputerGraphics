"use strict";

var canvas;
var gl;


var maxNumVertices = 3000;
var index = 0;

var Red = 0.25,
    Green = 0.75,
    Blue = 0.85;
var rnew=0, gnew=0, bnew=0;
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

    render();

    canvas.addEventListener("mouseup", function(event){
      var xd = event.clientX;
      var yd = event.clientY;

      var xy = [2 * xd / canvas.width - 1,
          2 * (canvas.height - yd) / canvas.height - 1];
      console.log(xy[0], xy[1]);

      rnew = BilinearInterpolation(0, 0, 255, 255, -1, 1, -1, 1, xy[1], xy[0])/255;
      bnew = BilinearInterpolation(255, 0, 0, 0, -1, 1, -1, 1, xy[1], xy[0])/255;
      gnew = BilinearInterpolation(0, 255, 255, 0, -1, 1, -1, 1, xy[1], xy[0])/255;
      //
      // console.log(rnew*255, gnew*255, bnew*255);
      document.getElementById("color").innerHTML = "R: "+rnew+" | G: "+bnew+" | B: "+gnew;
      render();
    });
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
    var vertices = [1, 1, 1, -1, -1, -1, -1, 1];

    Red = 1; Green = 0; Blue = 0;
    addPoints(vertices[0], vertices[1]);
    Red = 0; Green = 1; Blue = 0;
    addPoints(vertices[2], vertices[3]);
    Red = 0; Green = 0; Blue = 1;
    addPoints(vertices[4], vertices[5]);
    Red = 1; Green = 1; Blue = 0;
    addPoints(vertices[6], vertices[7]);
    end();

    Red = rnew; Green = gnew; Blue = bnew;
    vertices = [1, -0.8, 0.8, -0.8, 0.8, -1, 1, -1];
    for(var i =0; i<vertices.length; i+=2)
    addPoints(vertices[i], vertices[i+1]);
    end();

    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
// gl.clear( gl.COLOR_BUFFER_BIT );
    for (var i = 0; i < totalLines + 1; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, startIndex[i], indi[i]);
    }
}

function BilinearInterpolation(q11, q12, q21, q22, x1, x2, y1, y2, x, y)
{
    var xdist, ydist, x2x, y2y, yy1, xx1;
    xdist = x2 - x1;
    ydist = y2 - y1;
    x2x = x2 - x;
    y2y = y2 - y;
    yy1 = y - y1;
    xx1 = x - x1;

    var r1 = (x2x/xdist)*q11 + (xx1/xdist)*q21;
    var r2 = (x2x/xdist)*q12 + (xx1/xdist)*q22;
    var p = y2y/ydist*r1 + yy1/ydist*r2;
    return p;

    // return 1.0 / (xdist * ydist) * (
    //     q11 * x2x * y2y +
    //     q21 * xx1 * y2y +
    //
    //     q12 * x2x * yy1 +
    //     q22 * xx1 * yy1
    // );
}
