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

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// LIGHTS
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 10, 5);
scene.add(light);
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

// MODEL
const loader = new GLTFLoader();
let roue1, roue2;

loader.load('animation_diff7.glb', (gltf) => {
  scene.add(gltf.scene);

  const box = new THREE.Box3().setFromObject(gltf.scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  camera.position.set(center.x, center.y, center.z + maxDim * 2);
  camera.lookAt(center);
  controls.target.copy(center);

  roue1 = gltf.scene.getObjectByName("roue1");
  roue2 = gltf.scene.getObjectByName("roue2");
});

// UI
const turnInput = document.getElementById("turnInput");
const startBtn = document.getElementById("startBtn");
const counter1 = document.getElementById("counter1");
const counter2 = document.getElementById("counter2");

// État animation
let currentTurns = 0;
let targetTurns = 0;
let lastTurns = 0;
const speed = 0.01;
const axeRoue = new THREE.Vector3(0, 0, 1);

startBtn.addEventListener("click", () => {
  currentTurns = 0;
  lastTurns = 0;
  targetTurns = parseFloat(turnInput.value);
});

// ANIMATION
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (roue1 && roue2) {
    if (currentTurns < targetTurns) {
      currentTurns = Math.min(currentTurns + speed, targetTurns);
    }

    const delta = currentTurns - lastTurns;
    lastTurns = currentTurns;

    roue1.rotateOnWorldAxis(axeRoue, delta * Math.PI * 2);
    roue2.rotateOnWorldAxis(axeRoue, -delta * Math.PI * 2 * 3);

    counter1.innerText = "Première roue : " + currentTurns.toFixed(2);
    counter2.innerText = "Dernière roue : " + (-currentTurns * 3).toFixed(2);
  }

  renderer.render(scene, camera);
}
animate();

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
