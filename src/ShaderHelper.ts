import particleFragmentShader from "./shaders/particleFragmentShader.frag";
import particleVertexShader from "./shaders/particleVertexShader.vert";

export function createShader(gl: WebGLRenderingContext, type: any, source: any) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  export function resizeCanvasToDisplaySize(canvas:any) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
   
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                       canvas.height !== displayHeight;
   
    if (needResize) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
   
    return needResize;

  }


  export function initParticleShader(){


// var width = gl.canvas.width;
// var height = gl.canvas.height;
// var centerX = 200 / width;
// var centerY = 200 / height;
// console.log(width);
// console.log(height);
// console.log(centerX);
// console.log(centerY);
// var radius = Math.min(200, 200) / 2;
// var normCenterX = centerX/2;
// var normCenterY = centerY;
// var normRadius = radius / width;
// console.log(normRadius);
// console.log(normCenterX);
// console.log(normCenterY);



// resizeCanvasToDisplaySize(gl.canvas);









//setting the resolution
// gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
// gl.uniform2f(gl.getUniformLocation(program, "u_center"), normCenterX, normCenterY);
// gl.uniform1f(gl.getUniformLocation(program, "u_radius"), normRadius);



  }