import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box3, PerspectiveCamera, Scene, HemisphereLight, DirectionalLight, Color, Sphere, sRGBEncoding, Vector3, WebGLRenderer } from 'three';

export default class Viewer {
  renderer = null;
  scene = null;
  camera = null;
  orbit = null;
  model = null;

  prevTime = 0;
  autoRender = true;
  renderNextFrame = true;

  gltfLoader = null;

  constructor(options) {
    // Create the renderer
    const renderer = new WebGLRenderer(options);
    const canvas = renderer.domElement;
    const container = canvas.parentNode;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = sRGBEncoding;
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    this.renderer = renderer;

    // Create the scene
    const scene = new Scene();
    scene.background = new Color(0x000000);
    this.scene = scene;

    // Create the camera
    const camera = new PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.01, 1000);
    camera.position.set(-1, 0, 3);
    scene.add(camera);
    this.camera = camera;

    // Create the light
    const hemisphere = new HemisphereLight(0xC9C9C9, 0x000000, 1);
    this.scene.add(hemisphere);
    const directional = new DirectionalLight(0xFFFFFF, 1);
    directional.position.set(-5, 10, 7.5);
    this.scene.add(directional);

    // Create the orbit controls
    const orbit = new OrbitControls(camera, canvas);
    orbit.addEventListener('change', () => this.renderNextFrame = true);
    orbit.minPolarAngle = 0;
    orbit.maxPolarAngle = Math.PI / 2;;
    this.orbit = orbit;

    // Create the glb loader
    const gltfLoader = new GLTFLoader();
    this.gltfLoader = gltfLoader;

    window.addEventListener('resize', this.resize);
  }

  load = async (url) => {
    const { scene, camera, gltfLoader } = this;
    const gltf = await gltfLoader.loadAsync(url);
    const model = gltf.scene;
    this.disposeModel(this.model);
    scene.add(model);
    if (!camera.userData.isInitialized) {
      this.focus(model);
      camera.userData.isInitialized = true;
    }
    this.model = model;
    this.renderNextFrame = true;

    return gltf;
  }

  resize = () => {
    const { camera, renderer } = this;
    camera.aspect = renderer.domElement.parentNode.offsetWidth / renderer.domElement.parentNode.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(renderer.domElement.parentNode.offsetWidth, renderer.domElement.parentNode.offsetHeight);
    this.renderNextFrame = true;
  }

  focus = (target) => {
    const { orbit } = this;
    const box = new Box3();
    const delta = new Vector3();
    const sphere = new Sphere();

    let distance;
    box.setFromObject(target);

    if (box.isEmpty() === false) {
      box.getCenter(orbit.target);
      distance = box.getBoundingSphere(sphere).radius * 0.7;
    } else {
      // Focusing on an Group, AmbientLight, etc
      orbit.target.setFromMatrixPosition(target.matrixWorld);
      distance = 0.1;
    }

    delta.set(0, 0, 1);
    delta.applyQuaternion(orbit.object.quaternion);
    delta.multiplyScalar(distance * 4);

    orbit.object.position.copy(orbit.target).add(delta);
  }

  disposeModel = (model) => {
    const { scene } = this;
    if (model) {
      scene.remove(model);
      model.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      });
    }
  }

  render = (dt) => {
    const { orbit, renderer, scene, camera, autoRender, renderNextFrame } = this;
    if (autoRender || renderNextFrame) {
      orbit.update();
      renderer.render(scene, camera);
      this.renderNextFrame = false;
    }
  }

  animate = (time) => {
    const dt = (time - this.prevTime) / 1000;

    this.render(dt);

    requestAnimationFrame(this.animate);

    this.prevTime = time;
  }

  run = () => {
    const { renderer } = this;
    renderer.setAnimationLoop(this.animate);
  }

  dispose = () => {
    const { renderer, orbit } = this;
    window.removeEventListener('resize', this.resize);
    renderer.setAnimationLoop(null);
    renderer.dispose();
    this.disposeModel(this.model);
    orbit.dispose();
  }
}
