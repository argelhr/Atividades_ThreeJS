import { loadAudio } from "../loadAssets"
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

let music = await loadAudio('./assets/music.mp3')
    
const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

let aspecto = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(
	75, //campo de visao vertical
	aspecto, //aspecto da imagem (Largura/Altura)
	0.1, //Plano proximo
	100//Plano distante
);
camera.position.z = 1.5

//Luz
let light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

let patuve
const modelPath = './assets/'
const mtlFile = '12249_Bird_v1_L2.mtl'
const objFile = '12249_Bird_v1_L2.obj'

const manager = new THREE.LoadingManager()
const mtlLoader = new MTLLoader(manager)
const objLoader = new OBJLoader()

manager.onProgress = (item, loaded, total) => {
	let percentLoaded = Number(loaded / total * 100).toFixed()
	console.log(item, percentLoaded + '%')
};

mtlLoader.setPath(modelPath)
	.load(mtlFile, handleMaterialLoaded)

function handleMaterialLoaded(materials) {
	materials.preload()
	objLoader.setMaterials(materials)
	objLoader.setPath(modelPath)
		.load(objFile, handleObjectLoaded)
}

function handleObjectLoaded(object) {
	patuve = object
	patuve.position.x = -15
	patuve.position.y = -12
	patuve.position.z = -20
	patuve.rotateY(0)
	patuve.rotateX(5)
	patuve.scale.setScalar(.15)
	scene.add(patuve)
	animate()
}
let aux = 0.15
function animate() {
	renderer.render(scene, camera)
	
	if(music.paused){
		music.currentTime = 0
		music.play();
	}


	if (patuve.position.x > 33)
		aux = -0.15
	else if(patuve.position.x < -33)
		aux = 1
	patuve.rotation.z += .08
	// patuve.rotation.y += .08
	patuve.position.x += aux
	requestAnimationFrame(animate)
}