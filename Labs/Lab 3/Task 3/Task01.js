var currentColor = [255,0,0];
var bufferId, cbufferId, vColor, vPosition;
var currentShape = "triangle";
var size = 0.5;
var R, G, B;

document.getElementById( "triangle" ).onclick = function () {
    currentShape="triangle";
};

document.getElementById( "quad" ).onclick = function () {
    currentShape="quad";
};

document.getElementById( "color" ).onclick = function () {
    R = Math.random();
    G = Math.random();
    B= Math.random();
    currentColor = [R, G, B];
};

document.getElementById( "sliderObj" ).onchange = function () {
    size = parseFloat(document.getElementById("sliderObj").value);
};

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to find context');
    }

    var tapCoordinates = [];
    var tapColors = [];
    var sizes = [];

    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, tapCoordinates, tapColors, sizes);
    };

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    // gl.program = program;

    bufferId = gl.createBuffer();
    cbufferId = gl.createBuffer();

    vColor = gl.getAttribLocation( program, "vColor" );
    vPosition = gl.getAttribLocation( program, "vPosition" );

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function clear(){
    tapColors=[];
    tapCoordinates=[];
    sizes=[];

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev, gl, canvas, tapCoordinates, tapColors, sizes) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);

    //New functionality where only four points are stored in array
    //clear array as to render one point and clear the rest
    tapCoordinates=[];
        tapColors=[];

    switch (currentShape){
        case "triangle":
            console.log(size);
        tapCoordinates.push([x+size, y+size],
        [x-size, y+size],
        [x, y-size]);
        tapColors.push(currentColor, currentColor, currentColor);
        break;

        case "quad":
        tapCoordinates.push([x+size, y+size],
        [x+size, y-size],
        [x-size, y-size],
        [x-size, y+size]);
        tapColors.push(currentColor, currentColor, currentColor, currentColor);
        break;
    }

    render(gl, tapCoordinates, tapColors, sizes);
}

function render(gl, tapCoordinates, tapColors, sizes) {
    gl.clearColor(1.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(tapCoordinates), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    console.log(tapColors);
    gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(tapColors), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    gl.drawArrays(gl.TRIANGLE_FAN, 0, tapCoordinates.length);
}
