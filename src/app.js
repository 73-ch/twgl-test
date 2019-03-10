'use strict';
import Vue from 'vue';
import * as twgl from 'twgl.js';
import fs  from './shaders/frag.frag';
import vs  from './shaders/vert.vert';

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');

  const program_info = twgl.createProgramInfo = twgl.createProgramInfo(gl, [vs, fs]);

  const arrays = {
    position: [-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0]
  };

  const buffer_info = twgl.createBufferInfoFromArrays(gl, arrays);

  const render = (time) => {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
      time: time * 0.001,
      resolution: [gl.canvas.width, gl.canvas.height]
    };

    gl.useProgram(program_info.program);
    twgl.setBuffersAndAttributes(gl, program_info, buffer_info);
    twgl.setUniforms(program_info, uniforms);
    twgl.drawBufferInfo(gl, buffer_info);

    requestAnimationFrame(render);
  };

  render();
});