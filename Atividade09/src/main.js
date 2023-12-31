import { loadAudio } from "./loadAssets"
import { getKeys, hasKey, keyDownUp } from "./keyboard"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { createSkyBox } from './skybox';

let chao = true
let gravidade = -2
let theme = await loadAudio('audio/theme.mp3')
let quac = await loadAudio('audio/quack.mp3')
let walk = await loadAudio('audio/walk.mp3')
let wolf = await loadAudio('audio/wolf.mp3')
let passaro = await loadAudio('audio/bemtivi.mp3')
let velocidade = 1

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

const camera = new THREE.PerspectiveCamera(
	40, window.innerWidth / window.innerHeight, 0.1, 10000
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

// const plight = new THREE.PointLight('0x111111', 500, 500);
// let x = 200
// let y = 400
// let z = -10;
// plight.position.set(x, y, z);
// scene.add(plight);

// const sphere_geomatry = new THREE.SphereGeometry(1, 50, 32)
// const sphereColor = new THREE.MeshBasicMaterial({ color: 0xffffff })
// const sphere = new THREE.Mesh(sphere_geomatry, sphereColor)
// sphere.position.set(x, y, z)
// scene.add(sphere)

//criacao da floresta
const size = 1600
const florestBox = await createSkyBox('florestBox', size)
florestBox.position.y = size/2
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

patuve.rotation.x = -Math.PI/2
scene.add(patuve)
keyDownUp(window)
animate()

function animate() {

	controls.update();//orbit
	sons()
	move(patuve)//movimentos do pato
	renderer.render(scene, camera)//recria a cena
	requestAnimationFrame(animate)

}

window.addEventListener('click', evento => {
	console.log(evento.clientX)
});

function move(patao) {

	patao.rotation.z += hasKey("KeyD") ? -.1 : 0
	patao.rotation.z += hasKey("KeyA") ? .1 : 0
	

	let pz = patao.rotation.z

	patao.position.z += hasKey('KeyW') ? Math.cos(pz) * velocidade : 0
	patao.position.x += hasKey('KeyW') ? Math.sin(pz) * velocidade : 0
	patao.position.z += hasKey('KeyS') ? -Math.cos(pz) * velocidade : 0
	patao.position.x += hasKey('KeyS') ? -Math.sin(pz) * velocidade : 0

		if (hasKey("Enter")) {
		if (quac.paused) {
			quac.currenttime = 0
			quac.play()
		}
	}

	if (hasKey("Space") && chao && patao.position.y == 0) {
		//espaço começa o pulo, apenas quando esta no chao e na posição do eixo y = 0 
		chao = false
		console.log("apertouuu")
	}
	else {
		if (!chao) {//pulando

			if (patao.position.y <= 25) {
				patao.position.y -= gravidade
			}
			else {
				chao = true // começa a cair
			}
		}
		else {//caindo
			if (patao.position.y > 0)
				patao.position.y += gravidade
			else
				patao.position.y = 0

		}
	}
	console.log("x: " + patao.position.x)
	console.log(patao.position.z)
	if (patao.position.x > -120 && patao.position.x < 800
		&& patao.position.z > 450 && patao.position.z < 800)
		patao.position.y = -10
}

function sons() {
	if (theme && theme.paused) {
		theme.currenttime = 0
		theme.play()
	}

	if (wolf && wolf.paused && Math.random() > 0.9979) {
		wolf.currenttime = 0
		wolf.play()
		velocidade = 5
	}
	if (wolf.paused)
		velocidade = 1

	if (passaro && passaro.paused && Math.random() > 0.999) {
		passaro.currenttime = 0
		passaro.play()
	}

	if (hasKey("KeyD") || hasKey("KeyS") || hasKey("KeyA") || hasKey("KeyW")) {
		walk.play()
	}
	else {
		walk.pause();
		walk.currenttime = 0
	}
}




