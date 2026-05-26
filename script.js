import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement); 
controls.enableDamping = true;
controls.dampingFactor = 0.05;


// -----------------------------------
// LIGHTS
// -----------------------------------

const light = new THREE.DirectionalLight(0xffffff, 3);

light.position.set(5, 10, 5);

scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 1);

scene.add(ambient);


// -----------------------------------
// MODEL
// -----------------------------------

const loader = new GLTFLoader();

let roue1;
let roue2;

loader.load('animation_diff7.glb', (gltf) => {

  scene.add(gltf.scene);

  const box = new THREE.Box3().setFromObject(gltf.scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Centre la caméra sur le modèle
  const maxDim = Math.max(size.x, size.y, size.z);
  camera.position.set(center.x, center.y, center.z + maxDim * 2);
  camera.lookAt(center);
  controls.target.copy(center);

  roue1 = gltf.scene.getObjectByName("roue1");
  roue2 = gltf.scene.getObjectByName("roue2");

  console.log("Model loaded");

});

const axesHelper1 = new THREE.AxesHelper(2); // rouge=X, vert=Y, bleu=Z
roue1.add(axesHelper1);
const axesHelper2 = new THREE.AxesHelper(2);
roue2.add(axesHelper2);


// -----------------------------------
// UI
// -----------------------------------

const slider = document.getElementById("turnSlider");

const counter1 =
document.getElementById("counter1");

const counter2 =
document.getElementById("counter2");


// -----------------------------------
// ANIMATION
// -----------------------------------

function animate() {

  requestAnimationFrame(animate);
  controls.update();

  if (roue1 && roue2) {

    const turns =
    parseFloat(slider.value);

    // roue principale
    roue1.rotation.z =
      turns * Math.PI * 2;

    // ratio engrenages
    roue2.rotation.z =
      -roue1.rotation.z * 3;

    // compteurs
    counter1.innerText =
      "Première roue : " +
      turns.toFixed(2);

    counter2.innerText =
      "Dernière roue : " +
      (-turns * 3).toFixed(2);

  }

  renderer.render(scene, camera);

}

animate();


// -----------------------------------
// RESIZE
// -----------------------------------

window.addEventListener('resize', () => {

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

});
