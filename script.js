import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

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

  roue1 = gltf.scene.getObjectByName("roue1");
  roue2 = gltf.scene.getObjectByName("roue2");

  console.log("Model loaded");

});


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

  if (roue1 && roue2) {

    const turns =
    parseFloat(slider.value);

    // roue principale
    roue1.rotation.y =
      turns * Math.PI * 2;

    // ratio engrenages
    roue2.rotation.y =
      -roue1.rotation.y * 3;

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
