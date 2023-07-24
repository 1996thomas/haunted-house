import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Import

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const textureDoorColor = textureLoader.load('/textures/door/color.jpg')

/**
 * House
 */
// Temporary sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
sphere.position.y = 1

const houseGroup = new THREE.Group()
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        color:'grey'
    })
)

houseGroup.add(walls)
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#a9c388' })
    )
    floor.rotation.x = - Math.PI * 0.5
    floor.position.y = 0
    scene.add(floor)
    walls.position.y = walls.geometry.parameters.height / 2

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 2, 4),
    new THREE.MeshStandardMaterial({
        color: "grey"
    })
)

const door = new THREE.Mesh(
    new THREE.BoxGeometry(1,2,0.1),
    new THREE.MeshBasicMaterial({
        color:'brown'
    })
)

door.position.z = 2
door.position.y = 1

houseGroup.add(roof, door)
roof.rotation.y = Math.PI * 0.25
roof.position.y = walls.geometry.parameters.height + roof.geometry.parameters.height / 2 
    /**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight, houseGroup)

const bushes1 = new THREE.Group()
const bushes2 = new THREE.Group()

const bushGeometry = new THREE.SphereGeometry(1, 16,16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color:'green'
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.x = 1.2
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.position.x = 1.45
bush2.scale.set(0.6,0.6,0.6)
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.5,0.5,0.5)
bush3.position.x = 1
bush3.position.z = 0.3

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.x = 0.5
const bush5 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush6 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush7 = new THREE.Mesh(bushGeometry, bushMaterial)

bush4.scale.set(0.3,0.3,0.3)
bush4.position.set(-1.4,0,0.3)

bush5.scale.set(0.5,0.5,0.5)
bush5.position.set(-1.3,0,-0.2)
bush6.scale.set(0.7,0.7,0.7)
bush6.position.set(-0.8, 0, -0.1)
bush7.position.set(0.2,0, -0.3)



bushes1.add(bush1, bush2, bush3)
bushes2.add(bush4, bush5, bush6, bush7)
scene.add(bushes1, bushes2)
bushes1.scale.set(0.5,0.5,0.5)
bushes1.position.set(-1.5, 0, 2.3)
bushes2.position.set(1.5, 0, 2.3 )
bushes2.scale.set(0.5, 0.5,0.5)
// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const poteau = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.01, 2, 32, ), 
    new THREE.MeshStandardMaterial()
)

const letterBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.2, 0.5),
    new THREE.MeshStandardMaterial()
)

letterBox.position.set(0,.6,0)
const barriere = new THREE.Group()
barriere.add(poteau, letterBox)
barriere.position.set(0,0,2.5)
scene.add(barriere)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()