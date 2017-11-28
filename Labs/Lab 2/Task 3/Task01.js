var mySlider, mySlider2, mySlider3;

function doOnUnload() {
    if (mySlider != null) {
        mySlider.unload();
        mySlider = null;
    }

};

var currentColor = [255,0,0,255];
function main() {

    mySlider = new dhtmlXSlider({
        parent: "sliderObj",
        linkTo: "sliderLink"
    });

    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to find context');
    }

    var tapCoordinates = [];
    var tapColors = [];
    var sizes = [];

    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, a_Position, a_Size, u_FragColor, tapCoordinates, tapColors, sizes);
    };

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    gl.program = program;

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
        console.log("Failed to Get Position");
        return;
    }

    var a_Size = gl.getAttribLocation(program, 'a_Size');
    if (a_Size < 0) {
        console.log("Failed to Get Size");
        return;
    }

    var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');
    if (u_FragColor < 0) {
        console.log("Failed to Get Color");
        return;
    }

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

function click(ev, gl, canvas, a_Position, a_Size, u_FragColor, tapCoordinates, tapColors, sizes) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);

    sizes = [];
    // Store the size of the point
    sizes.push(document.getElementById('sliderLink').value);
    sizes.push(document.getElementById('sliderLink').value);
    sizes.push(document.getElementById('sliderLink').value);
    sizes.push(document.getElementById('sliderLink').value);

    //New functionality where only four points are stored in array
    //clear array as to render one point and clear the rest
    tapCoordinates=[];

    //Store the coordinates of the point
    // tapCoordinates.push([x,y]);
    tapCoordinates.push([x, y+0.1]);
    tapCoordinates.push([x+0.1, y]);
    tapCoordinates.push([x, y-0.1]);
    tapCoordinates.push([x-0.1, y]);

    tapColors=[];
    tapColors.push(currentColor);
    tapColors.push(currentColor);
    tapColors.push(currentColor);
    tapColors.push(currentColor);
	//assign color based on the position in canvas
    //Top Right Quadrant
    // if ((x >= 0) && (y >= 0)) {
    //     console.log("1");
    //     tapColors.push([0.0, 1.0, 0.0, 1.0]);
    //     tapColors.push([0.0, 1.0, 0.0, 1.0]);
    //     tapColors.push([0.0, 1.0, 0.0, 1.0]);
    //     tapColors.push([0.0, 1.0, 0.0, 1.0]);
    // }
    // //Top Left Quadrant
    // else if ((x < 0) && (y >= 0)) {
    //     tapColors.push([0.0, 0.0, 1.0, 1.0]);
    //     tapColors.push([0.0, 0.0, 1.0, 1.0]);
    //     tapColors.push([0.0, 0.0, 1.0, 1.0]);
    //     tapColors.push([0.0, 0.0, 1.0, 1.0]);
    // }
    // //Bottom Right Quadrant
    // else if ((x > 0) && (y < 0)) {
    //     tapColors.push([1.0, 1.0, 0.0, 1.0]);
    //     tapColors.push([1.0, 1.0, 0.0, 1.0]);
    //     tapColors.push([1.0, 1.0, 0.0, 1.0]);
    //     tapColors.push([1.0, 1.0, 0.0, 1.0]);
    // }
    // //Bottom Left Quadrant
    // else if ((x < 0) && (y < 0)) {
    //     tapColors.push([1.0, 0.0, 0.0, 1.0]);
    //     tapColors.push([1.0, 0.0, 0.0, 1.0]);
    //     tapColors.push([1.0, 0.0, 0.0, 1.0]);
    //     tapColors.push([1.0, 0.0, 0.0, 1.0]);
    // } else {
    //     console.log("Error");
    // }

    render(gl, a_Position, a_Size, u_FragColor, tapCoordinates, tapColors, sizes);
}

function render(gl, a_Position, a_Size, u_FragColor, tapCoordinates, tapColors, sizes) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    var len = tapCoordinates.length;
    console.log(len);
    for (var i = 0; i < len; i += 1) {
        var loc = tapCoordinates[i];
        var col = tapColors[i];
        gl.vertexAttrib3f(a_Position, loc[0], loc[1], 1.0);
        gl.vertexAttrib1f(a_Size, sizes[i]);
        gl.uniform4f(u_FragColor, col[0], col[1], col[2], col[3]);
        gl.drawArrays(gl.Points, 0, 1);
    }

}
