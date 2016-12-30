var statsUpdate = ()=>{};

function statsInit() {
  'use strict';

  let stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.getElementById("Stats-output")
    .appendChild( stats.domElement );

  statsUpdate = function update() {
    stats.update();
  }
}

