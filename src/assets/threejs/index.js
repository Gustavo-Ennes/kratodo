import * as THREE from 'three';
import Ball from './Ball.js';
import Collision from './Collision.js';

const TWEEN = require('@tweenjs/tween.js')

let scene = null,
    camera = null,
    renderer = null,
    light = null



const rayEventListener = () => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const getObjects = () => {
    return scene.children.filter(c => c.name !== 'dome')
  }

  const onMouseMove = ( event ) =>{

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( getObjects() );
    let obj

    for ( let i = 0; i < intersects.length; i ++ ) {

      obj = intersects[i].object

      if(Object.keys(intersects[i].object).includes('ball')){
        obj.ball.collisionHandler(scene)
      }
      if(Object.keys(intersects[i].object).includes('worm')){
        obj.ball.collisionHandler(scene)
      }

    }

  }

  window.addEventListener( 'mousemove', onMouseMove, false );
}


const tweenCamera = () => {

  new TWEEN.Tween(camera.position)
  .to({x: [5, 0, -5, 0]}, 18000)
  .onUpdate(() => {
    camera.lookAt(new THREE.Vector3())
    camera.updateProjectionMatrix()
  })
  .repeat(Infinity)
  .start()
}

const addLight = () => {
  light = new THREE.SpotLight( 0xeeeeee, 1.4, 1000, 1.1, 0.8, 2)
  light.position.set(0, 30, 140)
  light.target = new THREE.Object3D()
  light.target.position.set(0, 0, 0)
  light.castShadow = true
  light.shadow.mapSize.width = 2000;
  light.shadow.mapSize.height = 2000;

  light.shadow.camera.near = 1;
  light.shadow.camera.far = 1000;
  light.shadow.camera.fov = 75;
  scene.add( light );
  scene.add( light.target)
  
}
export const onWindowResize = () => {
  camera.aspect = document.body.offsetWidth / document.body.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( document.body.offsetWidth, document.body.offsetHeight);

}

export const init = (canvas) => {
  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xd2d2d2)
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / document.body.offsetHeight, 1, 10000 );
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  camera.position.set(0, 0, 85)

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth , document.body.offsetHeight );
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.enabled = true;
  canvas.appendChild(renderer.domElement)

  // await loadModels()
  addBalls(3)
  addLight()
  initEventListeners()
  createDome()
  tweenCamera()

  _animate()

}

const initEventListeners = () => {
  window.addEventListener('resize',() => {onWindowResize()});

  window.addEventListener('keyup', (e) => {
    if(e.code === "KeyI"){
      console.log(`CAMERA:\n${JSON.stringify(camera.position, null, 2)}`)
    }
  })
  rayEventListener()
}

const createDome = () => {
  let g, m, mesh
  g = new THREE.SphereGeometry(500, 55, 55)
  m = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0x006f8d),
    side: THREE.BackSide
  })
  mesh = new THREE.Mesh(g, m)
  mesh.receiveShadow = true
  scene.add(mesh)
}


const addBalls = (qtd=10) => {
  for(let i = 0; i < qtd; i++){
    Ball.born(new Ball(), scene)
  }
}

const _animate = () => {
	requestAnimationFrame( _animate );

  TWEEN.update()
  Ball.update(scene)
  Collision.update(scene)

	renderer.render( scene, camera );
}


