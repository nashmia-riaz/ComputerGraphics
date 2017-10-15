var initialClick;
var t=[];
var initialIndex;

function startLine(xd, yd){
  t=[];
  click = true;
  initialClick = vec2(2 * xd / canvas.width - 1,
  2 * (canvas.height - yd) / canvas.height - 1);
  indices[lines]+=2; //indices for that line is incremented (so that we can keep drawing)
  initialIndex = index;
  index+=2;
  colors.push([R,G,B],[R,G,B]);
}

function endLine(){
  click = false;
  lines++; //as new line is made everytime you unclick, lines gets incremented
  indices[lines] = 0; //indices for that line is set to 0 here (when you unclick)
  start[lines] = index; //the start for that line is set to index which was incremented while the mouse was pressed

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  index-=2;
  for(var i=0; i<t.length; i++){
    gl.bufferSubData(gl.ARRAY_BUFFER, index*8, flatten(t[i]));
    index++;
    totalPoints.push(t[i]);
  }
  
  render();

  console.log(colors);
  console.log(totalPoints);
}


function whileLine(xd, yd){
    t=[];
    finalClick = vec2(2 * xd / canvas.width - 1,
        2 * (canvas.height - yd) / canvas.height - 1);

    if(t.length>2+initialIndex){
      for(var i = 2;i>=initialIndex; i--){
        t.pop();
      }
    }

    t.push(initialClick, finalClick);

    gl.bufferSubData(gl.ARRAY_BUFFER, initialIndex*8, flatten(t));

    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    render();
}
