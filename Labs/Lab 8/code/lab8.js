var Rotation = 1.0;

var Rotate_Speed = 1;

var rotatex = 1;
var rotatey = 1;
var rotatez = 1;
var rotatex1 = 1;
var rotatey1 = 1;
var rotatez1 = 1;
var rotatex2 = 1;
var rotatey2 = 1;
var rotatez2 = 1;

var fudgefactor=1;

var angle = 45;
main();

//
// Start here
//'
function setupControllers(rotateController) {

    rotateController.onFinishChange(function(value) {

          Rotate_Speed = value;

  });

}

function createMenu() {
  // this.translate = translatex;
  // this.shape = shape;
  // this.axis = axis;
  this.Rotate_Speed = Rotate_Speed;
  // this.scale = scale;
  this.X_axis=rotatex;
  this.Y_axis=rotatey;
  this.Z_axis=rotatez;
  this.angle=angle;
};

function main() {

  var gui = new dat.GUI({ autoPlace: true ,width: 600 });
  var sl = new createMenu();
  var third = gui.addFolder("Rotate");
  var rotateController = third.add(sl,'Rotate_Speed',0,10).step(0.1);
  var third1 = third.addFolder("Rotate Around:")
  third1.add(sl,'X_axis',0,1).step(1).onFinishChange(function(value){rotatex=value});
   third1.add(sl,'Y_axis',0,1).step(1).onFinishChange(function(value){rotatey=value});
    third1.add(sl,'Z_axis',0,1).step(1).onFinishChange(function(value){rotatez=value});
  gui.add(sl,'angle',35,180).step(1).onFinishChange(function(value){angle=value;});




  setupControllers(rotateController);

  const canvas = document.querySelector('#mygl');
  const gl = canvas.getContext('webgl');


  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }


  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);


  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };


  // Bufferdata of objects
  const buffers = initBuffers(gl);



    var then = 0;

  // Render function (update with time)
  function render(now) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    now *= Rotate_Speed/1000;

    const deltaTime = now - then;

    then = now;

   // if(shape=='Cube')
        drawScene(gl, programInfo, buffers, deltaTime,-5);
        drawScene(gl, programInfo, buffers, deltaTime,5);
    //}
    requestAnimationFrame(render);  //recursive call
  }
  requestAnimationFrame(render);
}

//Buffer initializerz
function initBuffers(gl) {

  //positionbuffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  //facecolors
  const faceColors = [
    [0.0,  1.0,  1.0,  1.0],    // Front face: white
    [0.0,  1.0,  1.0,  1.0],    // Front face: white
    [0.0,  1.0,  1.0,  1.0],    // Front face: white
    [0.0,  1.0,  1.0,  1.0],    // Front face: white
    [0.0,  1.0,  1.0,  1.0],    // Front face: white
    [0.0,  1.0,  1.0,  1.0],    // Front face: white
  ];
  //color coversion
  var colors = [];
  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    colors = colors.concat(c, c, c, c);
  }
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


  //indices buffer
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  //indices of each triangle
  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);
  //returning these values
  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}


//Draw Functions
function drawScene(gl, programInfo, buffers, deltaTime, pos) {
  //Pre Functions


  //PMatrix at angle
  const fieldOfView = angle * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix,fieldOfView,aspect,zNear,zFar);
  //MMatrix

  const modelViewMatrix = mat4.create();

  //Translate,Scale,Rotate Function on Mmatrix
    var vec3 = [pos,0.0,-15.0];
    var vec31 = [1,1,1];



  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 vec3);  // amount to translate
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              Rotation,     // amount to rotate in radians
              [rotatey, rotatex, rotatez]);
  mat4.scale(modelViewMatrix,modelViewMatrix,vec31);
 //position
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  //color
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  //indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = 36; //in case of cube
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.LINE_LOOP, vertexCount, type, offset);
  }

  Rotation += deltaTime;
}

// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
