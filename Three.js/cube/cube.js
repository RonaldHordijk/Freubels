var scene;
var camera;
var renderer;
var stats; 

function start()
{
  init()
}

function init()
{
  initStats();
  window.addEventListener('resize', onResize, false);
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  setupScene();
    
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x333377);
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.getElementById("Canvas")
    .appendChild(renderer.domElement);
  
  render();
}  

function initStats() {
  stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.getElementById("Stats-output")
    .appendChild( stats.domElement );
     return stats;
}
  
function setupScene()
{  
  let material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  
  let geometry = new THREE.BoxGeometry( 1, 1, 1 );
  let cube = new THREE.Mesh(geometry, material);
  scene.add(cube);  

  let spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( -40, 120, 90 );
  scene.add(spotLight);  
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
  stats.update();
  
  var currentTime = Date.now();
  if (lastSquareUpdateTime) {
    let delta = currentTime - lastSquareUpdateTime;

    squareRotation += (3 * delta) / 1500.0;
  }
  
  lastSquareUpdateTime = currentTime;  

  camera.position.x = 3 * Math.sin(squareRotation);
  camera.position.y = 3 * Math.cos(squareRotation);
  camera.position.z = 2;
  camera.up = new THREE.Vector3(0.0, 0.0, 1.0);    
  camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));    
  
  renderer.render(scene, camera);
};

