
function startDrawing(){
  click = true;

  R=Math.random();
  G=Math.random();
  B=Math.random();
  // vBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  // gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(vPosition);
}
function endDrawing(){
  click = false;
  lines++; //as new line is made everytime you unclick, lines gets incremented
  indices[lines] = 0; //indices for that line is set to 0 here (when you unclick)
  start[lines] = index; //the start for that line is set to index which was incremented while the mouse was pressed
}


function whileDrawing(xd, yd){

  gl.viewport( 0, 0, canvas.width, canvas.height );
  // gl.clearColor( 0.9, 0.9, 0.9, 0.5 );
  var t = vec2(2 * xd / canvas.width - 1,
      2 * (canvas.height - yd) / canvas.height - 1);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

  colors.push([R, G, B]);
  indices[lines]++; //indices for that line is incremented (so that we can keep drawing)
  index++; //index is incremented as well (so we can get the start if the next line)

  gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
  render();
  prevt = t;
  totalPoints.push(t);
}
