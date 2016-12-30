var scene;
var camera;
var renderer;
var cubes = [];

let settings = {
  antialias: true,
  nrCubesXY: 10,
  nrCubesZ: 1
};

function start()
{
  init();
}

function init()
{
  statsInit();
  window.addEventListener('resize', onResize, false);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  setupScene();

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x333377);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.antialias = true;
  document.getElementById("Canvas")
    .appendChild(renderer.domElement);

  render();

  var gui = new dat.GUI();
  gui.add(settings, 'antialias');
  gui.add(settings, 'nrCubesXY', 1, 50).step(1).onChange(()=>{rebuildScene();});
  gui.add(settings, 'nrCubesZ', 1, 10).step(1).onChange(()=>{rebuildScene();});
}

function rebuildScene()
{
  scene = new THREE.Scene();
  cubes = [];
  setupScene();
}

function setupScene()
{
  let material = new THREE.MeshLambertMaterial({color: 0x00ff00});

  for (let x = 0; x < settings.nrCubesXY; x++)
  {
    for (let y = 0; y < settings.nrCubesXY; y++)
    {
      for (let z = 0; z < settings.nrCubesZ; z++)
      {
        let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let cube = new THREE.Mesh( geometry, material);
        cube.position.set(x, y, z);
        cube.scale.set(0.5, 0.5, 0.5);
        cubes.push({cube: cube, dist: Math.sqrt(x * x + y * y + z * z)});
        scene.add(cube);
      }
    }
  }
  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( -40, 120, 90 );
  scene.add( spotLight );
  scene.add(new THREE.AmbientLight( 0x404040 ));
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var squareRotation = 0.0;
var lastSquareUpdateTime = undefined;

var render = function () {
  requestAnimationFrame(render);
  statsUpdate();

  let currentTime = Date.now();
  if (lastSquareUpdateTime) {
    let delta = currentTime - lastSquareUpdateTime;

    squareRotation += (3 * delta) / 10000.0;

    cubes.forEach(function (object) {
      let scaleValue = 0.5 + 0.5 * Math.max(0, Math.sin(-7 * squareRotation + 0.8 * object.dist));
      object.cube.scale.set(scaleValue, scaleValue, scaleValue);
    });
  }

  lastSquareUpdateTime = currentTime;

  let centerXY = 0.5 * (settings.nrCubesXY - 1);
  let centerZ = 0.5 * (settings.nrCubesZ - 1);
  let dist = 2.5 * Math.max(centerXY, 2 * centerZ);

  camera.position.x = centerXY + dist * Math.sin(squareRotation);
  camera.position.y = centerXY + dist * Math.cos(squareRotation);
  camera.position.z = centerZ + 0.23 * dist;
  camera.up = new THREE.Vector3(0.0, 0.0, 1.0);
  camera.lookAt(new THREE.Vector3(centerXY, centerXY, centerZ));

  renderer.antialias = settings.antialias;
  renderer.render(scene, camera);
};

