var initialClick;
var triangleAmount = 50; //# of triangles used to draw circle
var radiusCircle = 0;
var centreCircle=[];
var t=[];

function startCircle(xd, yd){
  t=[];
  click = true;
  initialClick = vec2(2 * xd / canvas.width - 1,
  2 * (canvas.height - yd) / canvas.height - 1);
  indices[lines]+=triangleAmount+1; //indices for that line is incremented (so that we can keep drawing)
  index+=triangleAmount+1;
  for(var i=0; i<=triangleAmount;i++)
    colors.push([R,G,B]);
}

function endCircle(){
  click = false;
  lines++; //as new line is made everytime you unclick, lines gets incremented
  indices[lines] = 0; //indices for that line is set to 0 here (when you unclick)
  start[lines] = index; //the start for that line is set to index which was incremented while the mouse was pressed

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  index-=51;
  for(var i=0; i<t.length; i++){
    gl.bufferSubData(gl.ARRAY_BUFFER, index*8, flatten(t[i]));
    index++;
    totalPoints.push(t[i]);
  }
  render();
}


function whileCircle(xd, yd){
    t=[];
    finalClick = vec2(2 * xd / canvas.width - 1,
        2 * (canvas.height - yd) / canvas.height - 1);
  	var twicePi = 2.0 * Math.PI;
    var r = vec2(finalClick[0]-initialClick[0],finalClick[1]-initialClick[1]);
    radiusCircle = Math.sqrt(r[0]*r[0]+r[1]*r[1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    var vPosition3 = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition3, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition3);

    for(var i = 0; i <= triangleAmount;i++) {
      t.push([
          initialClick[0] + (radiusCircle * Math.cos(i *  twicePi / triangleAmount)),
          initialClick[1] + (radiusCircle * Math.sin(i * twicePi / triangleAmount))]);
    }
    // gl.bufferSubData(gl.ARRAY_BUFFER, index*8, flatten(t));

    gl.bufferData(gl.ARRAY_BUFFER, flatten(t), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    render();
}
