import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type ViewerOptions = {
  modelUrl?: string;
  containerSelector?: string;
};

type ViewerInstance = {
  dispose: () => void;
};

type MaterialSnapshot = {
  color?: number;
  emissive?: number;
  emissiveIntensity?: number;
  opacity?: number;
  transparent?: boolean;
  depthWrite?: boolean;
  visible?: boolean;
};

type MeshWithMaterial = THREE.Mesh & {
  material: THREE.Material | THREE.Material[];
};

type NodeLookup = Record<string, THREE.Object3D | null>;

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH.replace(/^\/|\/$/g, "")}`
  : "";
const DEFAULT_MODEL_URL = `${BASE_PATH}/models/MOSFET.glb`;
const LONG_HALF_GAP = 7.0;
const SHORT_HALF_GAP = 5.4;
const AUTO_ATTACH_KEY = "__mosfetViewerAttached";

THREE.ColorManagement.enabled = true;

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("mosfet-viewer-style")) return;

  const style = document.createElement("style");
  style.id = "mosfet-viewer-style";
  style.textContent = `
    [data-mosfet-viewer], .mosfet-shell {
      position: relative;
      overflow: hidden;
    }
    .mosfet-viewer-canvas {
      position: absolute;
      inset: 0;
    }
    .mosfet-viewer-canvas canvas {
      width: 100%;
      height: 100%;
      display: block;
      border-radius: inherit;
    }
    .mosfet-controls-panel {
      position: absolute;
      right: 0.75rem;
      top: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding: 0.75rem;
      border-radius: 0.9rem;
      background: color-mix(in srgb, var(--card, rgba(255,255,255,0.9)) 92%, transparent 8%);
      border: 1px solid color-mix(in srgb, var(--line, rgba(15,23,42,0.14)) 80%, transparent 20%);
      box-shadow: 0 18px 48px -30px rgba(0, 0, 0, 0.65);
      max-width: min(360px, 48vw);
      z-index: 5;
      pointer-events: auto;
      color: var(--fg, #0b1021);
    }
    .mosfet-controls-panel h4 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.01em;
    }
    .mosfet-control {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 0.85rem;
    }
    .mosfet-control label {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
      color: var(--muted, #3a4058);
      font-weight: 600;
    }
    .mosfet-control input[type="range"] {
      width: 120px;
      accent-color: var(--accent, #32d5ff);
    }
    .mosfet-control input[type="checkbox"] {
      accent-color: var(--accent, #32d5ff);
    }
    .mosfet-control .value {
      font-variant-numeric: tabular-nums;
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--fg, #0b1021) 90%, transparent 10%);
    }
    .mosfet-reset {
      border: 1px solid color-mix(in srgb, var(--line, rgba(15,23,42,0.14)) 80%, transparent 20%);
      background: color-mix(in srgb, var(--card, rgba(255,255,255,0.9)) 90%, transparent 10%);
      border-radius: 0.65rem;
      padding: 0.45rem 0.65rem;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      color: var(--fg, #0b1021);
      transition: transform 150ms ease, box-shadow 150ms ease;
    }
    .mosfet-reset:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 32px -20px rgba(0,0,0,0.5);
    }
    .mosfet-label-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
      font-size: 12px;
    }
    .mosfet-label {
      padding: 4px 8px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card, rgba(255,255,255,0.9)) 92%, transparent 8%);
      border: 1px solid color-mix(in srgb, var(--line, rgba(15,23,42,0.14)) 80%, transparent 20%);
      color: var(--fg, #0b1021);
      text-shadow: 0 1px 6px rgba(0,0,0,0.25);
      white-space: nowrap;
      backdrop-filter: blur(6px);
    }
    .mosfet-fs-btn {
      position: absolute;
      left: 0.75rem;
      top: 0.75rem;
      z-index: 6;
      border: 1px solid color-mix(in srgb, var(--line, rgba(15,23,42,0.14)) 80%, transparent 20%);
      background: color-mix(in srgb, var(--card, rgba(255,255,255,0.9)) 90%, transparent 10%);
      border-radius: 999px;
      padding: 0.35rem 0.75rem;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      color: var(--fg, #0b1021);
      box-shadow: 0 12px 32px -24px rgba(0,0,0,0.55);
      transition: transform 150ms ease, box-shadow 150ms ease;
    }
    .mosfet-fs-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 36px -24px rgba(0,0,0,0.6);
    }
  `;

  document.head.appendChild(style);
}

function findContainer(selector?: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  if (selector) {
    const explicit = document.querySelector<HTMLElement>(selector);
    if (explicit) return explicit;
  }
  const dataHook = document.querySelector<HTMLElement>("[data-mosfet-viewer]");
  if (dataHook) return dataHook;
  const fallback = document.getElementById("mosfet-viewer");
  return fallback;
}

function ensureMount(container: HTMLElement, attr: string, className: string) {
  const existing = container.querySelector<HTMLElement>(attr);
  if (existing) {
    existing.classList.add(className);
    return existing;
  }
  const el = document.createElement("div");
  el.className = className;
  container.appendChild(el);
  return el;
}

function getMesh(obj?: THREE.Object3D | null): MeshWithMaterial | null {
  if (!obj) return null;
  if ((obj as MeshWithMaterial).isMesh) return obj as MeshWithMaterial;
  return null;
}

function getMaterials(mesh: MeshWithMaterial): THREE.Material[] {
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}

function cloneMeshMaterials(mesh: MeshWithMaterial | null) {
  if (!mesh) return;
  if (Array.isArray(mesh.material)) {
    mesh.material = mesh.material.map((mat) => mat.clone());
  } else {
    mesh.material = mesh.material.clone();
  }
}

function snapshotMesh(key: string, mesh: MeshWithMaterial | null, store: Map<string, MaterialSnapshot[]>) {
  if (!mesh) return;
  const materials = getMaterials(mesh);
  const snaps = materials.map((mat) => {
    const anyMat = mat as any;
    return {
      color: anyMat.color ? anyMat.color.getHex() : undefined,
      emissive: anyMat.emissive ? anyMat.emissive.getHex() : undefined,
      emissiveIntensity: anyMat.emissiveIntensity,
      opacity: anyMat.opacity,
      transparent: anyMat.transparent,
      depthWrite: anyMat.depthWrite,
      visible: mat.visible
    } satisfies MaterialSnapshot;
  });
  store.set(key, snaps);
}

function restoreMesh(key: string, mesh: MeshWithMaterial | null, store: Map<string, MaterialSnapshot[]>) {
  if (!mesh) return;
  const snapshot = store.get(key);
  if (!snapshot) return;
  const materials = getMaterials(mesh);
  materials.forEach((mat, idx) => {
    const snap = snapshot[idx];
    if (!snap) return;
    const anyMat = mat as any;
    if (anyMat.color && snap.color !== undefined) anyMat.color.setHex(snap.color);
    if (anyMat.emissive && snap.emissive !== undefined) anyMat.emissive.setHex(snap.emissive);
    if (snap.emissiveIntensity !== undefined) anyMat.emissiveIntensity = snap.emissiveIntensity;
    if (snap.opacity !== undefined) anyMat.opacity = snap.opacity;
    if (snap.transparent !== undefined) anyMat.transparent = snap.transparent;
    if (snap.depthWrite !== undefined) anyMat.depthWrite = snap.depthWrite;
    if (snap.visible !== undefined) mat.visible = snap.visible;
  });
}

function setGlow(mesh: MeshWithMaterial | null, hexColor: number, intensity: number) {
  if (!mesh) return;
  getMaterials(mesh).forEach((mat) => {
    const anyMat = mat as any;
    if (anyMat.emissive) {
      anyMat.emissive.setHex(hexColor);
      anyMat.emissiveIntensity = intensity;
    } else if (anyMat.color) {
      anyMat.color.setHex(hexColor);
      if (typeof anyMat.opacity === "number") {
        anyMat.transparent = true;
        const derivedOpacity = Math.min(1, Math.max(0.1, intensity / 1.5));
        anyMat.opacity = derivedOpacity;
      }
    }
  });
}

function setTransparency(mesh: MeshWithMaterial | null, opacity: number) {
  if (!mesh) return;
  getMaterials(mesh).forEach((mat) => {
    const anyMat = mat as any;
    anyMat.transparent = true;
    anyMat.opacity = opacity;
    if (anyMat.depthWrite !== undefined) anyMat.depthWrite = false;
  });
}

function attachLabel(target: THREE.Object3D | null, text: string, anchor?: THREE.Object3D | null) {
  if (!target) return null;
  const labelEl = document.createElement("div");
  labelEl.className = "mosfet-label";
  labelEl.textContent = text;
  const label = new CSS2DObject(labelEl);

  if (anchor) {
    anchor.add(label);
    label.position.set(0, 0, 0);
    return label;
  }

  const box = new THREE.Box3().setFromObject(target);
  const center = box.getCenter(new THREE.Vector3());
  const topCenter = new THREE.Vector3(center.x, box.max.y, center.z);
  target.worldToLocal(topCenter);
  target.add(label);
  label.position.copy(topCenter);
  return label;
}

function fitCameraToBox(camera: THREE.PerspectiveCamera, controls: OrbitControls, box: THREE.Box3) {
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance = maxSize / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = 1.6 * Math.max(fitHeightDistance, fitWidthDistance);
  const direction = new THREE.Vector3(1.4, 0.8, 1.0).normalize();

  const newPosition = center.clone().add(direction.multiplyScalar(distance));
  camera.position.copy(newPosition);
  controls.target.copy(center);
  camera.near = distance / 50;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();
}

export function initMosfetViewer(options: ViewerOptions = {}): ViewerInstance["dispose"] | null {
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  const container = findContainer(options.containerSelector);
  if (!container) {
    console.error("[MOSFET Viewer] No container found. Add [data-mosfet-viewer] or #mosfet-viewer.");
    return null;
  }

  if ((container as any)[AUTO_ATTACH_KEY]) {
    return (container as any)[AUTO_ATTACH_KEY] as ViewerInstance["dispose"];
  }

  injectStyles();
  container.classList.add("mosfet-shell");

  const canvasMount = ensureMount(container, "[data-mosfet-canvas]", "mosfet-viewer-canvas");
  const controlsMount = ensureMount(container, "[data-mosfet-controls]", "mosfet-controls-panel");
  controlsMount.style.display = "none";

  const fullscreenBtn = document.createElement("button");
  fullscreenBtn.type = "button";
  fullscreenBtn.className = "mosfet-fs-btn";
  fullscreenBtn.textContent = "Fullscreen";
  container.appendChild(fullscreenBtn);

  const width = container.clientWidth || 640;
  const height = container.clientHeight || 360;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0b1021");

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  canvasMount.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(width, height);
  labelRenderer.domElement.className = "mosfet-label-layer";
  canvasMount.appendChild(labelRenderer.domElement);

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
  camera.position.set(22, 16, 24);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const hemi = new THREE.HemisphereLight(0xffffff, 0x334455, 0.55);
  hemi.position.set(0, 12, 0);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(12, 16, 14);
  scene.add(dir);

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.9, 0.6, 0.15);
  composer.addPass(bloomPass);

  const loader = new GLTFLoader();
  const materialSnapshots = new Map<string, MaterialSnapshot[]>();
  let labels: CSS2DObject[] = [];
  let resizeObserver: ResizeObserver | null = null;
  let animationId: number | null = null;
  let boundingBox: THREE.Box3 | null = null;
  let onFullscreenChange: (() => void) | null = null;

  const state = {
    gateOn: true,
    channelT: 0,
    leakCandidate: false,
    bloomEnabled: true,
    bloomStrength: 0.9,
    showLabels: true,
    xray: false
  };

  const nodes: NodeLookup = {
    Si_Substrate: null,
    Source: null,
    Drain: null,
    Gate_Oxide: null,
    Gate: null,
    Spacer_L: null,
    Spacer_R: null,
    Channel: null,
    CurrentArrow: null,
    LeakArrow: null,
    ILD: null,
    Contact_S: null,
    Contact_D: null,
    Contact_G: null,
    Anchor_Source: null,
    Anchor_Drain: null,
    Anchor_Gate: null,
    PlanarMOSFET_Root: null
  };

  function updateBloom() {
    bloomPass.enabled = state.bloomEnabled;
    bloomPass.strength = state.bloomStrength;
  }

  function applyGateState(on: boolean) {
    state.gateOn = on;
    const channelMesh = getMesh(nodes.Channel);
    const currentArrow = getMesh(nodes.CurrentArrow);
    const leakArrow = getMesh(nodes.LeakArrow);

    restoreMesh("Channel", channelMesh, materialSnapshots);
    restoreMesh("CurrentArrow", currentArrow, materialSnapshots);
    restoreMesh("LeakArrow", leakArrow, materialSnapshots);

    if (channelMesh && on) {
      setGlow(channelMesh, 0x32d5ff, 1.35);
    }
    if (currentArrow) {
      currentArrow.visible = on;
      if (on) setGlow(currentArrow, 0x32d5ff, 1.6);
    }
    if (leakArrow) {
      const showLeak = !on && state.leakCandidate;
      leakArrow.visible = showLeak;
      if (showLeak) setGlow(leakArrow, 0xffb347, 0.45);
    }
  }

  function updateChannelLength(t: number) {
    state.channelT = t;
    const halfGap = LONG_HALF_GAP + (SHORT_HALF_GAP - LONG_HALF_GAP) * t;
    const scaleX = halfGap / LONG_HALF_GAP;
    const source = nodes.Source;
    const drain = nodes.Drain;
    const channelMesh = getMesh(nodes.Channel);
    const currentArrow = getMesh(nodes.CurrentArrow);
    const leakArrow = getMesh(nodes.LeakArrow);

    if (source) source.position.x = -halfGap;
    if (drain) drain.position.x = halfGap;
    if (channelMesh) channelMesh.scale.x = scaleX;
    if (currentArrow) currentArrow.scale.x = scaleX;
    if (leakArrow) leakArrow.scale.x = scaleX;

    state.leakCandidate = t > 0.75;
    applyGateState(state.gateOn);
  }

  function toggleLabels(show: boolean) {
    state.showLabels = show;
    labels.forEach((label) => {
      label.element.style.display = show ? "" : "none";
    });
    labelRenderer.domElement.style.display = show ? "" : "none";
  }

  function toggleXray(enabled: boolean) {
    state.xray = enabled;
    const substrate = getMesh(nodes.Si_Substrate);
    if (!substrate) return;
    if (enabled) {
      setTransparency(substrate, 0.25);
    } else {
      restoreMesh("Si_Substrate", substrate, materialSnapshots);
    }
  }

  function resetView() {
    if (boundingBox) {
      fitCameraToBox(camera, controls, boundingBox);
    }
  }

  function buildControls() {
    controlsMount.innerHTML = "";
    const title = document.createElement("h4");
    title.textContent = "Planar MOSFET Viewer";
    controlsMount.appendChild(title);

    const gateToggle = document.createElement("div");
    gateToggle.className = "mosfet-control";
    const gateLabel = document.createElement("label");
    const gateInput = document.createElement("input");
    gateInput.type = "checkbox";
    gateInput.checked = true;
    gateLabel.append(gateInput, document.createTextNode("Gate ON"));
    gateToggle.appendChild(gateLabel);
    gateInput.addEventListener("change", () => applyGateState(gateInput.checked));
    controlsMount.appendChild(gateToggle);

    const channelRow = document.createElement("div");
    channelRow.className = "mosfet-control";
    const channelLabel = document.createElement("label");
    channelLabel.textContent = "Channel Length";
    const channelSlider = document.createElement("input");
    channelSlider.type = "range";
    channelSlider.min = "0";
    channelSlider.max = "1";
    channelSlider.step = "0.01";
    channelSlider.value = "0";
    const channelValue = document.createElement("span");
    channelValue.className = "value";
    channelValue.textContent = "Long";
    channelSlider.addEventListener("input", () => {
      const val = Number(channelSlider.value);
      channelValue.textContent = val > 0.75 ? "Ultra-short" : val > 0.4 ? "Short" : "Long";
      updateChannelLength(val);
    });
    channelRow.append(channelLabel, channelSlider, channelValue);
    controlsMount.appendChild(channelRow);

    const bloomRow = document.createElement("div");
    bloomRow.className = "mosfet-control";
    const bloomLabel = document.createElement("label");
    const bloomInput = document.createElement("input");
    bloomInput.type = "checkbox";
    bloomInput.checked = state.bloomEnabled;
    bloomLabel.append(bloomInput, document.createTextNode("Bloom"));
    bloomRow.appendChild(bloomLabel);
    bloomInput.addEventListener("change", () => {
      state.bloomEnabled = bloomInput.checked;
      updateBloom();
    });
    controlsMount.appendChild(bloomRow);

    const bloomStrengthRow = document.createElement("div");
    bloomStrengthRow.className = "mosfet-control";
    const bloomStrengthLabel = document.createElement("label");
    bloomStrengthLabel.textContent = "Bloom Strength";
    const bloomStrengthSlider = document.createElement("input");
    bloomStrengthSlider.type = "range";
    bloomStrengthSlider.min = "0";
    bloomStrengthSlider.max = "2";
    bloomStrengthSlider.step = "0.01";
    bloomStrengthSlider.value = state.bloomStrength.toString();
    const bloomStrengthValue = document.createElement("span");
    bloomStrengthValue.className = "value";
    bloomStrengthValue.textContent = state.bloomStrength.toFixed(2);
    bloomStrengthSlider.addEventListener("input", () => {
      const val = Number(bloomStrengthSlider.value);
      state.bloomStrength = val;
      bloomStrengthValue.textContent = val.toFixed(2);
      updateBloom();
    });
    bloomStrengthRow.append(bloomStrengthLabel, bloomStrengthSlider, bloomStrengthValue);
    controlsMount.appendChild(bloomStrengthRow);

    const labelRow = document.createElement("div");
    labelRow.className = "mosfet-control";
    const labelInput = document.createElement("input");
    labelInput.type = "checkbox";
    labelInput.checked = state.showLabels;
    const labelLabel = document.createElement("label");
    labelLabel.append(labelInput, document.createTextNode("Show Labels"));
    labelRow.appendChild(labelLabel);
    labelInput.addEventListener("change", () => toggleLabels(labelInput.checked));
    controlsMount.appendChild(labelRow);

    const xrayRow = document.createElement("div");
    xrayRow.className = "mosfet-control";
    const xrayInput = document.createElement("input");
    xrayInput.type = "checkbox";
    xrayInput.checked = false;
    const xrayLabel = document.createElement("label");
    xrayLabel.append(xrayInput, document.createTextNode("X-Ray Substrate"));
    xrayRow.appendChild(xrayLabel);
    xrayInput.addEventListener("change", () => toggleXray(xrayInput.checked));
    controlsMount.appendChild(xrayRow);

    const resetBtn = document.createElement("button");
    resetBtn.className = "mosfet-reset";
    resetBtn.type = "button";
    resetBtn.textContent = "Reset View";
    resetBtn.addEventListener("click", resetView);
    controlsMount.appendChild(resetBtn);
  }

  function handleResize() {
    const nextWidth = container.clientWidth || width;
    const nextHeight = container.clientHeight || height;
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight, false);
    composer.setSize(nextWidth, nextHeight);
    bloomPass.setSize(nextWidth, nextHeight);
    labelRenderer.setSize(nextWidth, nextHeight);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement === container) {
      document.exitFullscreen?.();
      return;
    }
    container.requestFullscreen?.().catch((err) => {
      console.error("[MOSFET Viewer] Fullscreen failed", err);
      // fallback: still show controls if fullscreen not available
      controlsMount.style.display = "";
    });
  }

  loader.load(
    options.modelUrl ?? DEFAULT_MODEL_URL,
    (gltf) => {
      const root =
        (gltf.scene.getObjectByName("PlanarMOSFET_Root") as THREE.Group | null) ?? gltf.scene;
      scene.add(root);

      Object.keys(nodes).forEach((key) => {
        nodes[key] = root.getObjectByName(key) ?? gltf.scene.getObjectByName(key);
      });

      const required = [
        "Si_Substrate",
        "Source",
        "Drain",
        "Gate_Oxide",
        "Gate",
        "Spacer_L",
        "Spacer_R",
        "Channel",
        "CurrentArrow",
        "LeakArrow"
      ];
      const missing = required.filter((name) => !nodes[name]);
      if (missing.length) {
        console.warn("[MOSFET Viewer] Missing nodes:", missing.join(", "));
      }

      const channelMesh = getMesh(nodes.Channel);
      const currentArrow = getMesh(nodes.CurrentArrow);
      const leakArrow = getMesh(nodes.LeakArrow);
      const substrate = getMesh(nodes.Si_Substrate);
      const gateOxide = getMesh(nodes.Gate_Oxide);
      const ild = getMesh(nodes.ILD);

      [channelMesh, currentArrow, leakArrow, substrate, gateOxide, ild].forEach(cloneMeshMaterials);

      snapshotMesh("Channel", channelMesh, materialSnapshots);
      snapshotMesh("CurrentArrow", currentArrow, materialSnapshots);
      snapshotMesh("LeakArrow", leakArrow, materialSnapshots);
      snapshotMesh("Si_Substrate", substrate, materialSnapshots);
      snapshotMesh("Gate_Oxide", gateOxide, materialSnapshots);
      snapshotMesh("ILD", ild, materialSnapshots);

      if (gateOxide) setTransparency(gateOxide, 0.32);
      if (ild) setTransparency(ild, 0.32);

      updateChannelLength(0);
      applyGateState(true);
      updateBloom();

      labels = [
        attachLabel(nodes.Source, "Source", nodes.Anchor_Source),
        attachLabel(nodes.Drain, "Drain", nodes.Anchor_Drain),
        attachLabel(nodes.Gate, "Gate", nodes.Anchor_Gate)
      ].filter(Boolean) as CSS2DObject[];

      boundingBox = new THREE.Box3().setFromObject(root);
      resetView();

      buildControls();
      fullscreenBtn.addEventListener("click", toggleFullscreen);
      onFullscreenChange = () => {
        const isFull = document.fullscreenElement === container;
        controlsMount.style.display = isFull ? "" : "none";
        fullscreenBtn.textContent = isFull ? "Exit Fullscreen" : "Fullscreen";
      };
      document.addEventListener("fullscreenchange", onFullscreenChange);

      const animate = () => {
        controls.update();
        composer.render();
        labelRenderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };
      animate();
    },
    undefined,
    (err) => {
      console.error("[MOSFET Viewer] Failed to load model", err);
    }
  );

  window.addEventListener("resize", handleResize);
  resizeObserver = new ResizeObserver(() => handleResize());
  resizeObserver.observe(container);

  const dispose = () => {
    if (animationId !== null) cancelAnimationFrame(animationId);
    window.removeEventListener("resize", handleResize);
    resizeObserver?.disconnect();
    controls.dispose();
    renderer.dispose();
    composer.dispose();
    labelRenderer.domElement.remove();
    renderer.domElement.remove();
    fullscreenBtn.removeEventListener("click", toggleFullscreen);
    if (onFullscreenChange) document.removeEventListener("fullscreenchange", onFullscreenChange);
    fullscreenBtn.remove();
    (container as any)[AUTO_ATTACH_KEY] = undefined;
  };

  (container as any)[AUTO_ATTACH_KEY] = dispose;
  return dispose;
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  const autoStart = () => {
    initMosfetViewer();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoStart, { once: true });
  } else {
    autoStart();
  }
}
