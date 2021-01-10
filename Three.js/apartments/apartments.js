var scene;
var camera;
var renderer;
var cubes = [];

let settings = {
  antialias: true,
  nrCubesXY: 2,
  nrCubesZ: 1,
  nrApartmentsSide: 3,
  nrApartmentsHeight: 2,
  apartmentCount:{
    nrSide:3,
    nrHeigth:2
  },
  apartment:{
    width: 6.0,
    height: 2.4,
    depth: 10.0,
  }
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
  const apartmentFolder = gui.addFolder("Apartment")
  apartmentFolder.add(settings.apartment, 'width', 1, 10).step(0.1).onChange(()=>{rebuildScene();});
  apartmentFolder.add(settings.apartment, 'height', 1, 10).step(0.1).onChange(()=>{rebuildScene();});
  apartmentFolder.add(settings.apartment, 'depth', 1, 10).step(0.1).onChange(()=>{rebuildScene();});
  const countFolder = gui.addFolder("Count")
  countFolder.add(settings.apartmentCount, 'nrSide', 1, 50).step(1).onChange(()=>{rebuildScene();});
  countFolder.add(settings.apartmentCount, 'nrHeigth', 1, 50).step(1).onChange(()=>{rebuildScene();});
}

function rebuildScene()
{
  scene = new THREE.Scene();
  setupScene();
}

function setupScene()
{
  let material = new THREE.MeshLambertMaterial({color: 0x00ff00});
  let materialSide = new THREE.MeshLambertMaterial({color: 0xcccc77,side: THREE.DoubleSide});
  //let materialFront = new THREE.MeshLambertMaterial({color: 0x33cc33,side: THREE.DoubleSide});
  //let materialout = new THREE.MeshLambertMaterial({color: 0xcccccc,side: THREE.DoubleSide});

  for (let x = 0; x < settings.apartmentCount.nrSide; x++)
  {
      for (let z = 0; z < settings.apartmentCount.nrHeigth; z++)
      {
        let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(x * (settings.apartment.width +0.3) , 0, z* (settings.apartment.height +0.3));
        cube.scale.set(settings.apartment.width, settings.apartment.depth, settings.apartment.height);

        //scene.add(cube);

        let y1 = -0.5 * settings.apartment.depth;
        let y2 = 0.5 * settings.apartment.depth;
        let x1 = x * (settings.apartment.width + 0.3);
        let x2 = x1 + settings.apartment.width;
        let z1 = z * (settings.apartment.height + 0.3);
        let z2 = z1 + settings.apartment.height;

        OpenCube(x1, y1, z1, z2, y2, x2, materialSide);
      }
  }
  let y1 = -0.5 * settings.apartment.depth;
  let y2 = 0.5 * settings.apartment.depth;
  let x1 = -0.3;
  let x2 = x1 + settings.apartmentCount.nrSide * (settings.apartment.width + 0.3) + 0.3;
  let z1 = -0.3;
  let z2 = z1 + settings.apartmentCount.nrHeigth * (settings.apartment.height + 0.3) + 0.3;

  OpenCube(x1, y1, z1, z2, y2, x2, materialSide);

  const s = new THREE.Geometry();

  for (let x = 0; x < settings.apartmentCount.nrSide +1; x++)
  {
    let x1 = x * (settings.apartment.width + 0.3) - 0.3;
    let x2 = x1 +0.3;

    s.vertices.push(
      new THREE.Vector3(x1,y1,z1),
      new THREE.Vector3(x2,y1,z1),
      new THREE.Vector3(x2,y1,z2),
      new THREE.Vector3(x1,y1,z2),
      new THREE.Vector3(x1,y2,z1),
      new THREE.Vector3(x2,y2,z1),
      new THREE.Vector3(x2,y2,z2),
      new THREE.Vector3(x1,y2,z2),
    );
    c = s.vertices.length - 8;

    s.faces.push(new THREE.Face3(c + 0, c + 1, c + 2));
    s.faces.push(new THREE.Face3(c + 0, c + 2, c + 3));
    s.faces.push(new THREE.Face3(c + 4, c + 5, c + 6));
    s.faces.push(new THREE.Face3(c + 4, c + 6, c + 7));
  }

  s.computeBoundingSphere();
  s.computeFaceNormals();
  scene.add(new THREE.Mesh(s, materialSide));    

  x1 = -0.3;
  x2 = x1 + settings.apartmentCount.nrSide * (settings.apartment.width + 0.3) + 0.3;

  const v = new THREE.Geometry();

  for (let z = 0; z < settings.apartmentCount.nrHeigth +1; z++)
  {
    let z1 = z * (settings.apartment.height + 0.3) - 0.3;
    let z2 = z1 + 0.3;

    v.vertices.push(
      new THREE.Vector3(x1,y1,z1),
      new THREE.Vector3(x2,y1,z1),
      new THREE.Vector3(x2,y1,z2),
      new THREE.Vector3(x1,y1,z2),
      new THREE.Vector3(x1,y2,z1),
      new THREE.Vector3(x2,y2,z1),
      new THREE.Vector3(x2,y2,z2),
      new THREE.Vector3(x1,y2,z2),
    );
    c = v.vertices.length - 8;

    v.faces.push(new THREE.Face3(c + 0, c + 1, c + 2));
    v.faces.push(new THREE.Face3(c + 0, c + 2, c + 3));
    v.faces.push(new THREE.Face3(c + 4, c + 5, c + 6));
    v.faces.push(new THREE.Face3(c + 4, c + 6, c + 7));
  }

  v.computeBoundingSphere();
  v.computeFaceNormals();
  scene.add(new THREE.Mesh(v, materialSide));    

  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( -400, 1200, 900 );
  scene.add( spotLight );
  scene.add(new THREE.AmbientLight( 0x404040 ));
}

function OpenCube(x1, y1, z1, z2, y2, x2, materialSide) {
  const sides = new THREE.Geometry();
  sides.vertices.push(
    new THREE.Vector3(x1, y1, z1),
    new THREE.Vector3(x1, y1, z2),
    new THREE.Vector3(x1, y2, z2),
    new THREE.Vector3(x1, y2, z1),
    new THREE.Vector3(x2, y1, z1),
    new THREE.Vector3(x2, y1, z2),
    new THREE.Vector3(x2, y2, z2),
    new THREE.Vector3(x2, y2, z1)
  );

  sides.faces.push(new THREE.Face3(0, 1, 2));
  sides.faces.push(new THREE.Face3(0, 2, 3));
  sides.faces.push(new THREE.Face3(4, 5, 6));
  sides.faces.push(new THREE.Face3(4, 6, 7));

  sides.faces.push(new THREE.Face3(0, 3, 4));
  sides.faces.push(new THREE.Face3(4, 3, 7));
  sides.faces.push(new THREE.Face3(1, 2, 5));
  sides.faces.push(new THREE.Face3(5, 2, 6));
  sides.computeBoundingSphere();
  sides.computeFaceNormals();
  scene.add(new THREE.Mesh(sides, materialSide));
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
  }

  lastSquareUpdateTime = currentTime;

  let centerX = 0.5 * (settings.apartment.width * settings.apartmentCount.nrSide);
  let centerY = 0.5 * settings.apartment.depth;
  let centerZ = 0.5 * (settings.apartment.height * settings.apartmentCount.nrHeigth);
  let dist = 1.2 * Math.max(settings.apartment.height * settings.apartmentCount.nrHeigth, settings.apartment.width * settings.apartmentCount.nrSide);

  camera.position.x = centerX + dist * Math.sin(squareRotation);
  camera.position.y = centerY + dist * Math.cos(squareRotation);
  camera.position.z = centerZ + 0.53 * dist;
  camera.up = new THREE.Vector3(0.0, 0.0, 1.0);
  camera.lookAt(new THREE.Vector3(centerX, centerY, centerZ));
  
  renderer.antialias = settings.antialias;
  renderer.render(scene, camera);
};

