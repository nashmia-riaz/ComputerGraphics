"use strict";

var canvas, canvas3d;
var gl, gl3d;

var click = false;

var maxNumTriangles = 20000;
var maxNumVertices = 3 * maxNumTriangles;
var index = 0;

var R = 0.5,
    G = 0.4,
    B = 0.6;
var colors = [];
var lines = 0;
var indices = [];
indices[0] = 0;
var start = [0];
var u_FragColor;
var cbufferId;
var vColor;
var prevt = 0;
var program, program3d;
var vBuffer;
var vPosition;
var vBuffer2;
var currentMode;
var context;
var totalPoints=[];

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas3d = document.getElementById("gl-3d-canvas");
    canvas3d.width = window.innerWidth;
    canvas3d.height = window.innerHeight;


    gl = WebGLUtils.setupWebGL(canvas);

    gl3d = WebGLUtils.setupWebGL(canvas3d);
    if (!gl || !gl3d) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.clearColor(0.9, 0.9, 0.9, 0.0);

    gl3d.viewport(0, 0, canvas3d.width, canvas3d.height);
    gl3d.clearColor(0.9, 0.9, 0.9, 1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    program3d = initShaders(gl3d, "vertex-shader-cube", "fragment-shader-cube");
    gl3d.useProgram(program3d);

    vBuffer = gl.createBuffer();
    vBuffer2 = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cbufferId = gl.createBuffer();
    vColor = gl.getAttribLocation(program, "vColor");

    $("#draw").click(function(){
        currentMode = "draw";
        // gl.useProgram(program);
    });
    $("#cube").click(function(){
        // gl.clearColor( 0.9, 0.9, 0.9, 1.0 );
        currentMode="cube";
        // gl3d.useProgram(program3d);
    });
    $("#circle").click(function(){
        // gl.clearColor( 0.9, 0.9, 0.9, 1.0 );
        currentMode="circle";
        // gl.useProgram(program);
    });

    $("#draw").click();
    gl.clear(gl.COLOR_BUFFER_BIT);

    canvas.addEventListener("touchstart", function(event){
        switch (currentMode) {
            case "draw":
                startDrawing();
                break;
            default:

        }
    });
    canvas.addEventListener("touchend", function(event){
      var touch = event.touches[0];
      var xd = touch.pageX-touch.target.offsetLeft;
      var yd = touch.pageY-touch.target.offsetTop;
        switch (currentMode) {
            case "draw":
                endDrawing();
                break;

            case "cube":
                drawCube(xd, yd);
                break;

            default:

        }
    });
    canvas.addEventListener("touchmove", function(event){
      event.preventDefault();
      if(click){
        var touch = event.touches[0];
        var xd = touch.pageX-touch.target.offsetLeft;
        var yd = touch.pageY-touch.target.offsetTop;
        switch (currentMode) {
            case "draw":
            whileDrawing(xd, yd);
                break;
            default:

        }
      }
    });
    canvas3d.addEventListener("mousedown", function(event) {
      var xd = event.clientX;
      var yd = event.clientY;
        switch (currentMode) {
            case "draw":
                startDrawing(event);
                break;

            case "circle":
                startCircle(xd, yd);
            default:

        }
    });
    canvas3d.addEventListener("mouseup", function(event) {
      var xd = event.clientX;
      var yd = event.clientY;
        switch (currentMode) {
            case "draw":
                endDrawing();
                break;

                case "cube":
                drawCube(xd, yd);
                break;

                case "circle":
                endCircle();
                break;
            default:

        }

            console.log(index);
            console.log(lines);
            console.log(start);
            console.log(indices);
            console.log(colors.length);
            console.log(totalPoints.length);
    });
    canvas3d.addEventListener("mousemove", function(event) {
        if (click) {
          var xd = event.clientX;
          var yd = event.clientY;
          switch (currentMode) {
              case "draw":
                whileDrawing(xd, yd);
                  break;
              default:

              case "circle":
              whileCircle(xd, yd);
              break;

          }
        }
    });
};


function render() {
// gl.clear( gl.COLOR_BUFFER_BIT );
    for (var i = 0; i < lines + 1; i++) {
        gl.drawArrays(gl.LINE_STRIP, start[i], indices[i]);
    }
}