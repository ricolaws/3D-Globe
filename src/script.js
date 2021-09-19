import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import Stats from "three/examples/jsm/libs/stats.module";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const cone = new THREE.ConeGeometry(0.1, 0.15, 8);
cone.translate(0.2, 0.7, 0.9);

const geometry = new THREE.SphereBufferGeometry(1, 64, 64);
// geometry.rotateZ((-23.4 * Math.PI) / 180);

const geometry2 = new THREE.SphereBufferGeometry(1.05, 16, 16);
geometry2.rotateZ((-23.4 * Math.PI) / 180);

// Materials
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/textures/earthspec1k.jpg");
const earthTexture = textureLoader.load("/textures/8081_earthspec4k.jpg");
const bumpTexture = textureLoader.load("/textures/8081_earthbump4k.jpg");
const waterTexture = textureLoader.load("/textures/waterMap.jpg");
waterTexture.wrapS = THREE.MirroredRepeatWrapping;
waterTexture.wrapT = THREE.MirroredRepeatWrapping;
waterTexture.repeat.set(2, 2);

const material = new THREE.MeshStandardMaterial();
material.color = new THREE.Color(0xca9197);
material.wireframe = false;
material.metalness = 1.39;
material.roughness = 0.68;
material.normalMap = normalTexture;

const material2 = new THREE.MeshToonMaterial();
material2.color = new THREE.Color(0xeeeeff);
material2.wireframe = false;
material2.transparent = true;
material2.opacity = 0.1;
material2.map = waterTexture;

const material3 = new THREE.MeshPhysicalMaterial();
material3.flatShading = true;
material3.bumpMap = bumpTexture;
material3.bumpScale = 0.7;
material3.envMap = normalTexture;
material3.clearcoat = 1;
material3.clearcoatRoughnessMap = earthTexture;
material3.transmission = 0.27;
material3.clearcoatRoughness = 0.5;
material3.reflectivity = 0.7;

gui.add(material3, "reflectivity").min(0).max(3).step(0.01);
gui.add(material3, "clearcoatRoughness").min(0).max(1).step(0.01);
gui.add(material3, "bumpScale").min(0).max(1).step(0.01);
gui.add(material3, "transmission").min(0).max(1).step(0.01);

// Mesh
const sphere = new THREE.Mesh(geometry, material3);
sphere.name = "sphere";

const sphere2 = new THREE.Mesh(geometry2, material2);
sphere.name = "sphere";

const marker = new THREE.Mesh(cone, material3);
marker.name = "marker";

scene.add(sphere);
scene.add(sphere2);

// Lights

const pointLight = new THREE.PointLight(0xff6000, 0.25);
pointLight.position.set(7, 2, 17);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x22fed0);
pointLight2.intensity = 0.15;
pointLight2.position.set(-9.5, 9, -2.52);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0x98d0d8);
pointLight3.intensity = 0.22;
pointLight3.position.set(-1.95, -18.24, -10.53);
scene.add(pointLight3);

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.23);
light.intensity = 0.5;
scene.add(light);

gui.add(pointLight2, "intensity").min(0).max(1).step(0.01);

/**
 * +++++++++++++++++++++++++++++++++++++++     Sizes     +++++++++++++++++++++++++++++++++++++++
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * +++++++++++++++++++++++++++++++++++++++     Camera     +++++++++++++++++++++++++++++++++++++++
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2.25;

scene.add(camera);

/**
 * +++++++++++++++++++++++++++++++++++++++     Renderer     +++++++++++++++++++++++++++++++++++++++
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * +++++++++++++++++++++++++++++++++++++++     Controls     +++++++++++++++++++++++++++++++++++++++
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 1.5;
controls.maxDistance = 3.5;
controls.zoomSpeed = 0.2;
controls.panSpeed = 0.2;
controls.enableDamping = true;
controls.dampingFactor = 0.08;

/**
 * +++++++++++++++++++++++++++++++++++++++    Animate  +++++++++++++++++++++++++++++++++++++++
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.02 * elapsedTime;
  // marker.rotation.y = 0.1 * elapsedTime;
  sphere2.rotation.y = -0.08 * elapsedTime;
  sphere2.rotation.z = 0.04 * elapsedTime;

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// function onDocumentDblClick(event) {
//   event.preventDefault();

//   mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
//   mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);
//   console.log(raycaster);
//   const intersects = raycaster.intersectObjects(scene.children, true);

//   if (intersects.length > 0) {
//     intersects[0].object.callback();
//     console.log(intersects[0].point);
//     console.log(intersects[0].uv);

//     let o = intersects[0];
//     let pIntersect = o.point.clone();
//     sphere.worldToLocal(pIntersect);

//     let sprite = new THREE.Sprite(spriteMat);
//     sprite.scale.set(0.02, 0.02, 1);
//     sprite.position.copy(o.face.normal).multiplyScalar(0.05).add(pIntersect);
//     sphere.add(sprite);

//   }
// }
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
var intersects;
var pointOfIntersection = new THREE.Vector3();
var localPoint = new THREE.Vector3();
var spherical = new THREE.Spherical();
var lat, lon;

function onDocumentDblClick(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects([sphere]);
  if (intersects.length == 0) return;
  pointOfIntersection = intersects[0].point;
  sphere.worldToLocal(localPoint.copy(pointOfIntersection)); // that's how it works with translation from the world coordinate system to the local one
  createPoint(localPoint);
}
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
renderer.domElement.addEventListener("dblclick", onDocumentDblClick, false);

// place marker

function createPoint(position) {
  var point = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 8, 8),
    new THREE.MeshNormalMaterial({
      flatShading: false,
    })
  );
  point.position.copy(position);

  sphere.add(point);

  // three.js already has useful object to get polar coordinates from the given vector - 'position', which is in local coordinates already
  spherical.setFromVector3(position);
  lat = THREE.Math.radToDeg(Math.PI / 2 - spherical.phi);
  lon = THREE.Math.radToDeg(spherical.theta) - 90;
  if (lon < -180) {
    lon += 360;
  }
  console.log(lat, lon);
}

sphere.callback = function () {
  console.log(this.name);
  // placeMarker(marker, 43, 54, 1.1);
};
