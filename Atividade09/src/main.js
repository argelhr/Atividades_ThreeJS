import { loadAudio } from "./loadAssets"
import { getKeys, hasKey, keyDownUp } from "./keyboard"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { createSkyBox } from './skybox';

let chao = true
let gravidade = -2
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

const camera = new THREE.PerspectiveCamera(
	40, window.innerWidth / window.innerHeight, 0.1, 2000
);

camera.position.z = -300
camera.position.y = 300

//Resimensionamento da camera ao redimensionar a tela
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	// console.log(`Resize: ${camera.aspect}`)
	renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.AmbientLight(0x999999, 1);
scene.add(light);

const plight = new THREE.PointLight('0xffff00', 500, 500);
let x = 200
let y = 400
let z = -10;
plight.position.set(x, y, z);
scene.add(plight);

const sphere_geomatry = new THREE.SphereGeometry(1, 50, 32)
const sphereColor = new THREE.MeshBasicMaterial({ color: 0xffffff })
const sphere = new THREE.Mesh(sphere_geomatry, sphereColor)
sphere.position.set(x, y, z)
scene.add(sphere)

//criacao do skybox
const florestBox = await createSkyBox('florestBox', 400)
florestBox.position.y = 200
scene.add(florestBox)

const PatoPath = './assets/pato/'
const mtlFile = '12249_Bird_v1_L2.mtl'
const objFile = '12249_Bird_v1_L2.obj'

const manager = new THREE.LoadingManager();
manager.onProgress = (item, loaded, total) => {
	console.log(item, loaded, total);
};

const mtlLoader = new MTLLoader(manager);
const objLoader = new OBJLoader();

mtlLoader.setPath(PatoPath)
objLoader.setPath(PatoPath)

objLoader.setMaterials(await mtlLoader.loadAsync(mtlFile))
let patuve = await objLoader.loadAsync(objFile)
const patuveJoystick = { x: null, y: null }
patuve.scale.setScalar(1)//redimensiona o objeto
patuve.position.y = 0

patuve.rotation.x = 4.725
scene.add(patuve)
keyDownUp(window)
animate()

function animate() {
	controls.update();
	renderer.render(scene, camera)
	move(patuve)
	requestAnimationFrame(animate)
}

window.addEventListener('click', evento => {
	console.log(evento.clientX)
});

function move(patao) {


	let pz = patao.rotation.z

	patao.rotation.z += hasKey("KeyD") ? -.1 : 0
	patao.rotation.z += hasKey("KeyA") ? .1 : 0
	console.log("x: " + patao.position.x)
	console.log("y: " + patao.position.y)
	console.log("z: " + patao.position.z)

	let moveX = 0
	let moveY = 0

	// if (hasKey('KeyW')) {
	// 	moveX = Math.cos(pz)
	// 	moveY = Math.sin(pz)
	// }
	if (hasKey('KeyS')) {
		moveX = -Math.cos(pz)
		moveY = -Math.sin(pz)
	}

	patao.position.z += hasKey('KeyW') ? Math.cos(pz) : 0
	patao.position.x += hasKey('KeyW') ? Math.sin(pz) : 0
	patao.position.z += hasKey('KeyS') ? -Math.cos(pz) : 0
	patao.position.x += hasKey('KeyS') ? -Math.sin(pz) : 0



	// if (hasKey("Enter")) {
	// 	if (Math.cos(pz) > 0) {
	// 		if (Math.sin(patao.rotation.x > 0))
	// 			patao.rotation.x += Math.cos(pz) * 0.1
	// 		patao.rotation.y += Math.sin(pz) * 0.01
	// 	}
	// 	else {
	// 		patao.rotation.x += - Math.cos(pz) * 0.1
	// 		patao.rotation.y += - Math.sin(pz) * 0.1
	// 	}
	// }

	if (hasKey("Space") && chao && patao.position.y == 0) {//quando clica no espaço começa o pulo
		chao = false
		console.log("apertouuu")
	}
	else {
		if (!chao) {

			if (patao.position.y <= 25) {
				patao.position.y -= gravidade
			}
			else {
				chao = true
			}
		}
		else {
			if (patao.position.y > 0)
				patao.position.y += gravidade
			else
				patao.position.y = 0

		} //gravidade do jogo
	}
	if(patao.position.x > -50 && patao.position.x<250
		&& patao.position.z > 120 && patao.position.z < 250)
		patao.position.y = -10
}




