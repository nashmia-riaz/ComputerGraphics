var centre=[0.0,0.0,0.0];
var theta = [ 0, 0, 0 ];
var radius=0.1;
var numTimesToSubdivide=0;
var height=0.15;
var vertices=[];
var points = [];
var bufferId;
var col=[1.0,0.0,0.0];
var thetaLoc;
var NumVertices = 0;
var colorsCube=[];
var rotation =45;
var solid = 2;
var thetaX=0, thetaY=0, thetaZ=0;
var prevtx=thetaX,prevty=thetaY,prevtz=thetaZ;
var cbuffer;
var vPosition1;

function drawCube(x, y){
    x=2 * x / canvas.width - 1;
    y=2 * (canvas.height - y) / canvas.height - 1;
    centre = [x,y,0];
    // gl3d.viewport( 0, 0, canvas.width, canvas.height );
    // gl3d.clearColor( 0.9, 0.9, 0.9, 1.0 );
    checkVertices();
    gl3d.enable(gl3d.DEPTH_TEST);
    gl3d.depthFunc(gl3d.LEQUAL);
    gl3d.enable(gl3d.POLYGON_OFFSET_FILL);
    gl3d.polygonOffset(1.0, 2.0);


    //
    //  Load shaders and initialize attribute buffers
    //
    // program = initShaders( gl3d, "vertex-shader-cube", "fragment-shader-cube" );
    // gl3d.useProgram( program3d );

    // cBuffer = gl3d.createBuffer();
    bufferId = gl3d.createBuffer();

    // vColor = gl3d.getAttribLocation( program, "vColor" );
    vPosition1 = gl3d.getAttribLocation( program3d, "vPosition1" );
    gl.vertexAttribPointer(vPosition1, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition1);

    cbuffer = gl3d.createBuffer();
    vColor1 = gl3d.getAttribLocation( program3d, "vColor1" );


    thetaLoc = gl3d.getUniformLocation(program3d, "theta");

    drawShape();
    render3D();
}

function render3D(){
    // colorsCube=[1,0,0];
    gl3d.uniform3fv(thetaLoc, theta);
    // gl3d.clear( gl3d.COLOR_BUFFER_BIT | gl3d.DEPTH_BUFFER_BIT);

    gl3d.bindBuffer( gl3d.ARRAY_BUFFER, bufferId );
    gl3d.bufferData( gl3d.ARRAY_BUFFER, flatten(points), gl3d.STATIC_DRAW );

    gl3d.vertexAttribPointer( vPosition1, 4, gl3d.FLOAT, false, 0, 0 );
    gl3d.enableVertexAttribArray( vPosition1 );

    // gl3d.uniform4f(u_FragColor,1,1,0,1);

    gl3d.bindBuffer( gl3d.ARRAY_BUFFER, cbuffer );
    gl3d.bufferData( gl3d.ARRAY_BUFFER, flatten(colorsCube), gl3d.STATIC_DRAW );
    gl3d.vertexAttribPointer( vColor1, 3, gl3d.FLOAT, false, 0, 0 );
    gl3d.enableVertexAttribArray( vColor1 );

    gl3d.drawArrays( gl3d.TRIANGLES, 0, points.length );
    // requestAnimFrame(render3D);
}

function checkVertices()
{
    NumVertices = 36;
}

function drawShape()
{
    vertices = [
        vec4(         centre[0],  centre[1]+0.05, radius+centre[2], 1.0 ),
        vec4( -radius+centre[0],  centre[1],        centre[2], 1.0 ),
        vec4(         centre[0],  centre[1]-0.05,-radius+centre[2], 1.0 ),
        vec4(  radius+centre[0],  centre[1],        centre[2], 1.0 ),

        vec4(         centre[0],  centre[1]+height+0.05, radius+centre[2], 1.0 ),
        vec4( -radius+centre[0],  centre[1]+height,        centre[2], 1.0 ),
        vec4(         centre[0],  centre[1]+height-0.05,-radius+centre[2], 1.0 ),
        vec4(  radius+centre[0],  centre[1]+height,        centre[2], 1.0 )
    ];
    col = [R, G, B];
    // quad(0,1,2,3);
    // col = [R+0.1, G+0.1, B+0.1];
    // col = [R+0.2, G+0.2, B+0.2];
    // quad(0,3,7,4);
    col = [R+0.3, G+0.3, B+0.3];
    quad(4,5,6,7);
    // quad(0,1,5,4);
    col = [R+0.4, G+0.4, B+0.4];
    quad(3,2,6,7);
    col = [R+0.5, G+0.5, B+0.5];
    quad(1,2,6,5);
}

function quad(a, b, c, d)
{
    colorsCube.push(col,col,col,col,col,col);
    points.push(vertices[a], vertices[b], vertices[c]);
    points.push(vertices[c], vertices[d], vertices[a]);
}
