import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Dummy} from "./dummy";


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
camera.position.z = 8;

// Orbit
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Grid Line
const size = 19;
const divisions = 26;
const gridHelper = new THREE.GridHelper(size, divisions, '#181616', '#181616');
gridHelper.rotation.x = -Math.PI * 0.5;
// gridHelper.rotation.z = 1.571
scene.add(gridHelper);

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
directionalLight.position.z = 10
directionalLight.position.x = 10
directionalLight.position.y = 10
scene.add(directionalLight)

// Image Left
const dummy = new Dummy().image_dummy
let markerMap = []
let positionMap = -8
let heightYMap = 3
let hrSize = 1.7 * dummy.length
dummy.map((val, index) => {
    const image = createImage(0.3, val.asset, val.title, positionMap, heightYMap, hrSize)
    image.obj.position.x = positionMap
    scene.add(image.obj)

    const marker = createMarker(0.1)
    marker.name = val.name
    const x = -1.9
    const y = heightYMap + 0.45
    marker.position.set(x, y, 0)
    markerMap.push({name: val.name, x: x, y: y, posX: x, posY: y, positionMap: positionMap})
    // marker.matrixWorldNeedsUpdate = true
    scene.add(marker)
    positionMap += 1.3
    heightYMap -= 0.2
    hrSize -= 1.3
})

// Image Center
const dummyCenter = new Dummy().image_dummy_center
let markerMapCenter = []
let positionMapCenter = -2.6
let heightYMapCenter = 1
dummyCenter.map((val, index) => {
    const image = createImageCenter(0.3, val.asset, val.title, positionMapCenter, val.posY, val.posX, index)
    image.obj.position.x = positionMapCenter
    scene.add(image.obj)

    const marker = createMarker(0.1)
    marker.name = val.name
    const x = val.posX
    const y = 2
    marker.position.set(val.posX, 2, 0)
    marker.rotation.z = Math.PI
    markerMapCenter.push({name: val.name, x: x, y: y, posX: x, posY: y, positionMap: positionMapCenter})
    // marker.matrixWorldNeedsUpdate = true
    scene.add(marker)
    positionMapCenter += 1.3

    if (index > 2) {
        heightYMapCenter += 0.2
    } else {
        heightYMapCenter -= 0.2
    }
})

// Image Right
const dummyRight = new Dummy().image_dummy_right
let markerMapRight = []
let positionMapRight = 8
let heightYMapRight = 3
let hrSizeRight = -1.7 * dummyRight.length
dummyRight.map((val, index) => {
    const image = createImage(0.3, val.asset, val.title, positionMapRight, heightYMapRight, hrSizeRight)
    image.obj.position.x = positionMapRight
    scene.add(image.obj)

    const marker = createMarker(0.1)
    marker.name = val.name
    const x = 1.6
    const y = heightYMapRight + 0.45
    marker.position.set(x, y, 0)
    marker.rotation.z = Math.PI
    markerMapRight.push({name: val.name, x: x, y: y, posX: x, posY: y, positionMap: positionMapRight})
    // marker.matrixWorldNeedsUpdate = true
    scene.add(marker)
    positionMapRight -= 1.3
    heightYMapRight -= 0.2
    hrSizeRight += 1.3
})

// Card Center
const cardCenter = shopSystemCard()
cardCenter.position.set(-2.5, 1.4, 0)
scene.add(cardCenter)

function markerRun(index) {
    const object = markerMap[index]
    let posX = object.posX
    let posY = object.posY
    const positionMap = object.positionMap
    let positionTailDestination = 0.45
    const marker = scene.getObjectByName(object.name)
    if (posX < positionMap && posY > positionTailDestination) {
        marker.rotation.z = Math.PI / 2
        marker.position.set(posX, posY, 0)
        markerMap[index].posY -= 0.01
        // return true
    } else if (posY < positionTailDestination) {
        object.posX = object.x
        object.posY = object.y
        marker.rotation.z = Math.PI * 2
    } else {
        marker.position.set(posX, posY, 0)
        markerMap[index].posX -= 0.01
    }
}

function markerRunCenterCOpy(index) {
    const object = markerMapCenter[index]
    let posX = object.posX
    let posY = object.posY
    const positionMap = object.positionMap
    let positionTailDestination = 0.45
    const marker = scene.getObjectByName(object.name)
    if (posX > positionMap && posY > positionTailDestination) {
        marker.rotation.z = Math.PI / 2
        marker.position.set(posX, posY, 0)
        markerMapCenter[index].posY -= 0.01
        // return true
    } else if (posY < positionTailDestination) {
        object.posX = object.x
        object.posY = object.y
        marker.rotation.z = Math.PI
    } else {
        marker.position.set(posX, posY, 0)
        markerMapCenter[index].posX += 0.01
    }
}

function markerRunCenter(index) {
    const object = markerMapCenter[index]
    let posX = object.posX
    let posY = object.posY // 2
    const positionMap = object.positionMap // -2.6
    const positionTailDestination = 0.45
    const xFloor = (object.x * 2)
    const xDestination = xFloor > 0 ? xFloor + 0.3 : xFloor - 0.3
    const marker = scene.getObjectByName(object.name)
    if (index === 2 && posY > positionTailDestination) {
        marker.rotation.z = Math.PI / 2
        marker.position.set(posX, posY, 0)
        markerMapCenter[index].posY -= 0.01
    }
    else if (posX > xDestination && index < 2 && posY > positionTailDestination) {
        marker.rotation.z = Math.PI / 2
        marker.position.set(posX, posY, 0)
        markerMapCenter[index].posY -= 0.01
    } else if (posX < xDestination && index > 2 && posY > positionTailDestination) {
        marker.rotation.z = Math.PI / 2
        marker.position.set(posX, posY, 0)
        markerMapCenter[index].posY -= 0.01
    } else if (posY < positionTailDestination) {
        object.posX = object.x
        object.posY = object.y
        marker.rotation.z = Math.PI
    } else {
        if (index === 2) {
            marker.rotation.z = Math.PI / 2
        }
        marker.position.set(posX, posY, 0)
        if (index < 2) {
            marker.rotation.z = Math.PI
            markerMapCenter[index].posX += 0.01
        } else {
            marker.rotation.z = Math.PI * 2
            markerMapCenter[index].posX -= 0.01
        }
    }
}

function markerRunRight(index) {
    const object = markerMapRight[index]
    let posX = object.posX
    let posY = object.posY
    const positionMap = object.positionMap
    let positionTailDestination = 0.45
    const marker = scene.getObjectByName(object.name)
    if (posX > positionMap && posY > positionTailDestination) {
        marker.rotation.z = Math.PI / 2
        marker.position.set(posX, posY, 0)
        markerMapRight[index].posY -= 0.01
        // return true
    } else if (posY < positionTailDestination) {
        object.posX = object.x
        object.posY = object.y
        marker.rotation.z = Math.PI
    } else {
        marker.position.set(posX, posY, 0)
        markerMapRight[index].posX += 0.01
    }
}

// Create Image
function createMarker(size) {
    const layerCircleSize = size
    // Layer
    const layerCircle = new THREE.CircleGeometry(layerCircleSize);
    const layerMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    // layerMaterial.opacity = 1
    const layerMesh = new THREE.Mesh(layerCircle, layerMaterial);

    // Line Path To
    const tailLine = new THREE.Path();
    tailLine.lineTo(0.3, 0);

    const points = tailLine.getPoints();

    const geometryPathTail = new THREE.BufferGeometry().setFromPoints(points);
    const materialPathTail = new THREE.LineBasicMaterial({color: 0xffffff});

    const lineMaterialTail = new THREE.Line(geometryPathTail, materialPathTail);
    lineMaterialTail.position.x = layerCircleSize
    // scene.add( tailLine );

    // Object3D
    const obj = new THREE.Object3D();

    obj.add(layerMesh);
    obj.add(lineMaterialTail);
    return obj
}

// Create Image
function createImage(size, imgAsset, titleText, positionX, heightY, hrSize) {
    const layerCircleSize = size * 1.5
    // Layer
    const layerCircle = new THREE.CircleGeometry(layerCircleSize);
    const layerMaterial = new THREE.MeshBasicMaterial({color: '#3A343E'});
    const layerMesh = new THREE.Mesh(layerCircle, layerMaterial);

    // Image
    const imgCircle = new THREE.CircleGeometry(size);
    const imgMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(imgAsset)
    });
    const imgMesh = new THREE.Mesh(imgCircle, imgMaterial);

    // Line Path To
    const path = new THREE.Path();
    path.lineTo(0, heightY - 0.5);
    path.quadraticCurveTo(0, heightY, hrSize > 0 ? 0.5 : -0.5, heightY);
    path.lineTo(hrSize, heightY);

    const points = path.getPoints();

    const geometryPath = new THREE.BufferGeometry().setFromPoints(points);
    const materialPath = new THREE.LineBasicMaterial({color: '#544E4E'});

    const linePath = new THREE.Line(geometryPath, materialPath);
    linePath.position.y = layerCircleSize
    linePath.position.x = positionX
    scene.add(linePath);

    // Text
    const textMesh = textTure(titleText, 20)
    textMesh.position.y = -0.7

    // const marker = createMarker(0.1)
    // marker.position.set(hrSize - 0.4,  heightY + 0.45, 0)
    // Object3D
    const obj = new THREE.Object3D();

    obj.add(layerMesh);
    obj.add(imgMesh);
    obj.add(textMesh);
    // obj.add(marker);

    return {textMesh, obj}
}

// Create Image
function createImageCenter(size, imgAsset, titleText, positionX, heightY, posX, index) {
    const layerCircleSize = size * 1.5
    // Layer
    const layerCircle = new THREE.CircleGeometry(layerCircleSize);
    const layerMaterial = new THREE.MeshBasicMaterial({color: '#3A343E'});
    const layerMesh = new THREE.Mesh(layerCircle, layerMaterial);

    // Image
    const imgCircle = new THREE.CircleGeometry(size);
    const imgMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(imgAsset)
    });
    const imgMesh = new THREE.Mesh(imgCircle, imgMaterial);

    // Line Path To
    const path = new THREE.Path();
    if (index === 2) {
        path.lineTo(0, 2);
    } else {
        path.lineTo(0, heightY - 0.5);
        path.quadraticCurveTo(0, heightY, index < 2 ? 0.5 : -0.5, heightY);
        path.lineTo(posX, heightY);
        path.quadraticCurveTo(posX + (index < 2 ? 0.5 : -0.5), heightY, posX + (index < 2 ? 0.5 : -0.5), heightY + 0.5);
        path.lineTo(posX + (index < 2 ? 0.5 : -0.5), 2);
    }
    const points = path.getPoints();

    const geometryPath = new THREE.BufferGeometry().setFromPoints(points);
    const materialPath = new THREE.LineBasicMaterial({color: '#544E4E'});

    const linePath = new THREE.Line(geometryPath, materialPath);
    linePath.position.y = layerCircleSize
    linePath.position.x = positionX
    scene.add(linePath);

    // Text
    const textMesh = textTure(titleText, 20)
    textMesh.position.y = -0.7

    // const marker = createMarker(0.1)
    // marker.position.set(hrSize - 0.4,  heightY + 0.45, 0)
    // Object3D
    const obj = new THREE.Object3D();

    obj.add(layerMesh);
    obj.add(imgMesh);
    obj.add(textMesh);
    // obj.add(marker);

    return {textMesh, obj}
}

// Shop System Card
function shopSystemCard() {

    const card1 = rectangleCard(1, 1, 2.7, 1.55, 0.2, '#C7843F')
    const card2 = rectangleCard(1.027, 1.027, 2.65, 1.5, 0.2, '#09030D')
    const card3 = rectangleCard(1.65, 1.2, 1.25, 0.3, 0.15, '#3A343E', 'Plugins')
    const text1 = textTure('Ausgewahit', 18, 0.5)
    text1.position.set(1.8, 2.2, 0)
    const text2 = textTure('13 Shopsysteme', 22)
    text2.position.set(2.1, 1.9, 0)

    // Line Path To
    const path = new THREE.Path();
    path.lineTo(2.1, 0);

    const points = path.getPoints();

    const geometryPath = new THREE.BufferGeometry().setFromPoints(points);
    const materialPath = new THREE.LineBasicMaterial({color: '#544E4E'});

    const linePath = new THREE.Line(geometryPath, materialPath);
    linePath.position.set(-1.15, 3.05)
    scene.add(linePath);


    // Object3D
    const obj = new THREE.Object3D();

    obj.add(card1.mesh);
    obj.add(card2.mesh);
    obj.add(card3.group);
    obj.add(text1);
    obj.add(text2);
    return obj
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

    if (titleText) {
        const shapeGeometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({color: color})
        const mesh = new THREE.Mesh(shapeGeometry, material)
        const textMesh = textTure(titleText)
        const group = new THREE.Group()
        group.add(mesh)
        textMesh.position.set(x + 0.65, y + 0.15)
        group.add(textMesh)
        return {group}
    } else {
        const shapeGeometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({color: color});
        const mesh = new THREE.Mesh(shapeGeometry, material)
        return {mesh}
    }
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

// Loop animationLoop
function animateLoop() {
    if (markerMap.length === dummy.length) {
        markerMap.map((val, index) => {
            markerRun(index)
        })
        markerMapCenter.map((val, index) => {
            markerRunCenter(index)
        })
        markerMapRight.map((val, index) => {
            markerRunRight(index)
        })
    }
    renderer.render(scene, camera);
}

// animateLoop()
renderer.setAnimationLoop(animateLoop)
