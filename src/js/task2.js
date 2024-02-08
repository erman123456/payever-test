import * as THREE from 'three';
import earthImg from "../img/earth.jpg";
import netherlands from "../img/countries/netherlands.png";
import belgium from "../img/countries/belgium.png";
import germany from "../img/countries/germany.png";
import austria from "../img/countries/austria.webp";
import sweden from "../img/countries/sweden.png";
import finland from "../img/countries/finland.png";
import norway from "../img/countries/norway.png";
import denmark from "../img/countries/denmark.png";
import uk from "../img/countries/uk.png";

const
    countries = [
        {
            "name": "image1",
            "asset": netherlands,
            "title": "Netherlands",
            "x": 0.2,
            "y": 0.5
        },
        {
            "name": "image2",
            "asset": belgium,
            "title": "Belgium",
            "x": -0.2,
            "y": 0.3
        },
        {
            "name": "image3",
            "asset": germany,
            "title": "Germany",
            "x": 0.1,
            "y": -0.2
        },
        {
            "name": "image4",
            "asset": austria,
            "title": "Austria",
            "x": -0.5,
            "y": 0.3
        },
        {
            "name": "image5",
            "asset": sweden,
            "title": "Sweden",
            "x": 0.6,
            "y": 0.2
        },
        {
            "name": "image6",
            "asset": finland,
            "title": "Finland",
            "x": 0.8,
            "y": -0.7
        },
        {
            "name": "image7",
            "asset": norway,
            "title": "Norway",
            "x": -0.9,
            "y": 0.5
        },
        {
            "name": "image8",
            "asset": denmark,
            "title": "Denmark",
            "x": -0.1,
            "y": 1.5
        },
        {
            "name": "image9",
            "asset": uk,
            "title": "UK",
            "x": -0.5,
            "y": -0.5
        },
    ]

// textUreLoader
const textureLoader = new THREE.TextureLoader();

// Option
const option = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(option.width, option.height);
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(80, option.width / option.height, 0.1, 1000);
camera.position.z = 6;


// Lights
const directionalLight = new THREE.DirectionalLight()
directionalLight.position.z = Math.PI
scene.add(directionalLight)

function createImageCountry(size, texture, titleText) {
    const card = rectangleCard(0, 0, 1.4, 0.5, 0.2, '#0d0d0d')
    const geo = new THREE.CircleGeometry(size);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mash = new THREE.Mesh(geo, mat);
    const textMesh = textTure(titleText, 15)
    textMesh.position.x = 0.5
    const group = new THREE.Group()
    group.add(mash)
    group.add(textMesh)
    group.position.set(0.3, 0.25, 0)
    const obj = new THREE.Object3D()
    obj.add(card)
    obj.add(group)
    return obj
}

function textTure(titleText, fontSize, opacity, color) {
    const font = fontSize ?? 18
    const canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    ctx.font = `${font}pt Arial`
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(titleText, canvas.width / 2, canvas.height / 2)

    const text = new THREE.Texture(canvas)
    text.needsUpdate = true
    const planeGeometry = new THREE.PlaneGeometry(2);
    const material = new THREE.MeshBasicMaterial({map: text, transparent: true, color: color, opacity: opacity})
    return new THREE.Mesh(planeGeometry, material)
}

// Rectangle Card
function rectangleCard(positionX, positionY, width, height, radius, color, titleText) {
    let x = positionX
    let y = positionY

    let shape = new THREE.Shape();
    shape.moveTo(x, y);
    shape.lineTo(x, y + height - radius);
    shape.quadraticCurveTo(x, y + height, x + radius, y + height);
    shape.lineTo(x + width - radius, y + height);
    shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    shape.lineTo(x + width, y + radius);
    shape.quadraticCurveTo(x + width, y, x + width - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);

    const shapeGeometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({color: color});
    return new THREE.Mesh(shapeGeometry, material)
}


function createImageGeometry(size, texture, position) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Group();
    obj.add(mesh);
    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj}
}

// Create Marker
function createMarker(size, position) {
    const layerCircle = new THREE.CircleGeometry(size);
    const layerMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const layerMesh = new THREE.Mesh(layerCircle, layerMaterial);
    layerMesh.position.x = position;
    return layerMesh
}


const earth = createImageGeometry(3.2, earthImg, 0);

earth.mesh.position.z = -Math.PI - 0.1
scene.add(earth.obj)


const tooltipEnabledObjects = []
countries.map((val, index) => {
    const odd = index % 2
    const marker = createMarker(0.05, 0);
    marker.position.set(val.x, val.y)
    scene.add(marker)
    const showCountry = createImageCountry(0.15, val.asset, val.title);
    showCountry.position.x = val.x
    showCountry.position.y = val.y + 0.1
    marker.userData.tooltipText = showCountry
    tooltipEnabledObjects.push(marker)
})


var mouse = new THREE.Vector2();

var latestMouseProjection;
var hoveredObj; // this objects is hovered at the moment
var tooltipDisplayTimeout;
var raycaster = new THREE.Raycaster();

function updateMouseCoords(event, coordsObj) {
    coordsObj.x = ((event.clientX - renderer.domElement.offsetLeft + 0.5) / window.innerWidth) * 2 - 1;
    coordsObj.y = -((event.clientY - renderer.domElement.offsetTop + 0.5) / window.innerHeight) * 2 + 1;
}

// This will immediately hide tooltip.
function hideTooltip() {
    const object = scene.getObjectByName('objectShow')
    scene.remove(object)
}

let a = 0

function showTooltip() {
    const object = hoveredObj.userData.tooltipText
    object.name = 'objectShow'
    scene.add(hoveredObj.userData.tooltipText)
}


function handleManipulationUpdate() {
    raycaster.setFromCamera(mouse, camera);
    {
        var intersects = raycaster.intersectObjects(tooltipEnabledObjects);
        if (intersects.length > 0) {
            latestMouseProjection = intersects[0].point;
            hoveredObj = intersects[0].object;
        }
    }

    if (tooltipDisplayTimeout || !latestMouseProjection) {
        clearTimeout(tooltipDisplayTimeout);
        tooltipDisplayTimeout = undefined;
        hideTooltip();
    }

    if (!tooltipDisplayTimeout && latestMouseProjection) {
        tooltipDisplayTimeout = setTimeout(function () {
            tooltipDisplayTimeout = undefined;
            showTooltip();
        }, 100);
    }
}

function onMouseMove(event) {
    updateMouseCoords(event, mouse);

    latestMouseProjection = undefined;
    hoveredObj = undefined;
    handleManipulationUpdate();
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseMove, false);

function animateLoop() {
    // onmouseover()
    earth.mesh.rotateY(0.004)
    renderer.render(scene, camera);
}

// animateLoop()
renderer.setAnimationLoop(animateLoop)
