'use strict';
import Vue from 'vue';
import * as twgl from 'twgl.js';

import fs from './shaders/main.frag';
import vs from './shaders/main.vert';
import point_vs from './shaders/point.vert';
import point_fs from './shaders/point.frag';
import velocity_vs from './shaders/velocity.vert';
import velocity_fs from './shaders/velocity.frag';

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');

  const vtf_num = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
  if(vtf_num > 0){
    console.log('max_vertex_texture_imaeg_unit: ' + vtf_num);
  }else{
    alert('VTF not supported');
    return;
  }
  var ext;
  ext = gl.getExtension('OES_texture_float') || gl.getExtension('OES_texture_half_float');
  if(ext == null){
    alert('float texture not supported');
    return;
  }
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  const default_program = twgl.createProgramInfo(gl, [vs, fs]);
  const point_program = twgl.createProgramInfo(gl, [point_vs, point_fs]);
  const velocity_program = twgl.createProgramInfo(gl, [velocity_vs, velocity_fs]);

  const width = 2048;
  const height = 2048;

  const attachments = [
    { format: twgl.RGBA, type: twgl.UNSIGNED_BYTE, min: twgl.LINEAR, wrap: twgl.CLAMP_TO_EDGE },
    { format: twgl.DEPTH_STENCIL, },
  ];

  let front_fbo = twgl.createFramebufferInfo(gl, attachments, width, height);
  let back_fbo = twgl.createFramebufferInfo(gl, attachments, width, height);

  const plane_object= { position: { data: [1.0,1.0,1.0,-1.0,-1.0, -1.0,-1.0,1.0], numComponents: 2 } };
  const plane_buffer = twgl.createBufferInfoFromArrays(gl, plane_object);

  let mouse_pos = [0.,0.];
  let velocity = .0;
  let mouse_flag = false;

  var vertices = new Array(width * height);

  // 頂点のインデックスを連番で割り振る
  for(let i = 0, j = vertices.length; i < j; i++){
    vertices[i] = i;
  }
  const points_object = {index: {data: vertices, numComponents: 1}};
  const points_buffer = twgl.createBufferInfoFromArrays(gl, points_object);

  (() => {
    twgl.bindFramebufferInfo(gl, back_fbo);
    gl.viewport(0,0, width, height);

    gl.useProgram(default_program.program);
    twgl.setBuffersAndAttributes(gl, default_program, plane_buffer);
    twgl.setUniforms(default_program, {
      resolution: [width, height]
    });
    twgl.drawBufferInfo(gl, plane_buffer, gl.TRIANGLE_FAN);
  })();

  const render = (time) => {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0,0, width, height);

    gl.useProgram(velocity_program.program);
    twgl.setBuffersAndAttributes(gl, velocity_program, plane_buffer);
    twgl.setUniforms(velocity_program, {
      resolution: [width, height],
      texture: back_fbo.attachments[0],
      mouse: mouse_pos,
      mouseFlag: mouse_flag,
      velocity: velocity
    });
    twgl.bindFramebufferInfo(gl, front_fbo);
    twgl.drawBufferInfo(gl, plane_buffer, gl.TRIANGLE_FAN);


    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(point_program.program);
    twgl.setBuffersAndAttributes(gl, point_program, points_buffer);
    twgl.setUniforms(point_program, {
      resolution: [width, height],
      texture: front_fbo.attachments[0],
      pointScale: 1.0,
      ambient: [0.0, 0.5, 0.5, 1.0],
    });
    twgl.bindFramebufferInfo(gl, null);
    twgl.drawBufferInfo(gl, points_buffer, gl.POINTS);

    if(mouse_flag){
      velocity = 1.0;
    }else{
      velocity *= 0.9;
    }


    let temp = front_fbo;
    front_fbo = back_fbo;
    back_fbo = temp;

    requestAnimationFrame(render);
  };


  render();

  window.addEventListener('mousemove', e => {
    if (!mouse_flag) return;

    mouse_pos = [e.clientX / window.innerWidth * 2. - 1., (1.0 - e.clientY / window.innerHeight) * 2.-1.];
  });

  window.addEventListener('mousedown', e => {
    mouse_flag = true;
  });
  window.addEventListener('mouseup', e => {
    mouse_flag = false;
  });
});