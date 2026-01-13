import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type ViewerOptions = {
  modelUrl?: string;
  containerSelector?: string;
};

type FinGroup = {
  fins: THREE.Object3D[];
  glows: THREE.Object3D[];
  oxides: THREE.Object3D[];
  arrows: THREE.Object3D[];
};

export type FinfetViewerApi = {
  dispose: () => void;
  setFinCount: (count: number) => void;
  setGateOn: (on: boolean) => void;
  getState: () => { finCount: number; gateOn: boolean };
};

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH.replace(/^\/|\/$/g, "")}`
  : "";
const DEFAULT_MODEL_URL = `${BASE_PATH}/models/FinFET.glb`;
const AUTO_ATTACH_KEY = "__finfetViewerAttached";

THREE.ColorManagement.enabled = true;

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("finfet-viewer-style")) return;

  const style = document.createElement("style");
  style.id = "finfet-viewer-style";
  style.textContent = `
    [data-finfet-viewer], .finfet-shell {
      position: relative;
      overflow: hidden;
    }
    .finfet-viewer-canvas {
      position: absolute;
      inset: 0;
    }
    .finfet-viewer-canvas canvas {
      width: 100%;
      height: 100%;
      display: block;
      border-radius: inherit;
    }
    .finfet-controls-panel {
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
    .finfet-controls-panel h4 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.01em;
    }
    .finfet-control {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 0.85rem;
    }
    .finfet-control label {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
      color: var(--muted, #3a4058);
      font-weight: 600;
    }
    .finfet-control input[type="range"] {
      width: 120px;
      accent-color: var(--accent, #32d5ff);
    }
    .finfet-control input[type="checkbox"] {
      accent-color: var(--accent, #32d5ff);
    }
    .finfet-control .value {
      font-variant-numeric: tabular-nums;
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--fg, #0b1021) 90%, transparent 10%);
    }
    .finfet-reset, .finfet-fs-btn {
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
    .finfet-reset:hover, .finfet-fs-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 32px -20px rgba(0,0,0,0.5);
    }
    .finfet-fs-btn {
      position: absolute;
      left: 0.75rem;
      top: 0.75rem;
      z-index: 6;
      border-radius: 999px;
      padding-inline: 0.75rem;
      box-shadow: 0 12px 32px -24px rgba(0,0,0,0.55);
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
  const dataHook = document.querySelector<HTMLElement>("[data-finfet-viewer]");
  if (dataHook) return dataHook;
  const fallback = document.getElementById("finfet-viewer");
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

function getMaterials(mesh: THREE.Mesh) {
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}

function cloneMeshMaterials(obj: THREE.Object3D | null) {
  if (!obj) return;
  if (!("isMesh" in obj)) return;
  const mesh = obj as THREE.Mesh;
  if (Array.isArray(mesh.material)) {
    mesh.material = mesh.material.map((mat) => mat.clone());
  } else {
    mesh.material = mesh.material.clone();
  }
}

function setGlow(obj: THREE.Object3D | null, color: number, intensity: number) {
  if (!obj) return;
  if (!("isMesh" in obj)) return;
  const mesh = obj as THREE.Mesh;
  getMaterials(mesh).forEach((mat) => {
    const anyMat = mat as any;
    if (anyMat.emissive) {
      anyMat.emissive.setHex(color);
      anyMat.emissiveIntensity = intensity;
    }
  });
}

function finSetForCount(n: number) {
  const clamped = Math.min(5, Math.max(1, Math.round(n)));
  const map: Record<number, number[]> = {
    1: [3],
    2: [2, 4],
    3: [2, 3, 4],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 4, 5]
  };
  return map[clamped] ?? map[3];
}

export function initFinfetViewer(options: ViewerOptions = {}): FinfetViewerApi | null {
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  const container = findContainer(options.containerSelector);
  if (!container) {
    console.error("[FinFET Viewer] No container found. Add [data-finfet-viewer] or #finfet-viewer.");
    return null;
  }

  if ((container as any)[AUTO_ATTACH_KEY]) {
    return (container as any)[AUTO_ATTACH_KEY] as FinfetViewerApi;
  }

  injectStyles();
  container.classList.add("finfet-shell");

  const canvasMount = ensureMount(container, "[data-finfet-canvas]", "finfet-viewer-canvas");
  const controlsMount = ensureMount(container, "[data-finfet-controls]", "finfet-controls-panel");
  controlsMount.style.display = "none";

  const fullscreenBtn = document.createElement("button");
  fullscreenBtn.type = "button";
  fullscreenBtn.className = "finfet-fs-btn";
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

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
  camera.position.set(18, 14, 20);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const hemi = new THREE.HemisphereLight(0xffffff, 0x445566, 0.55);
  hemi.position.set(0, 12, 0);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(12, 16, 14);
  scene.add(dir);

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.95, 0.6, 0.2);
  composer.addPass(bloomPass);

  const loader = new GLTFLoader();
  const finGroups: Record<number, FinGroup> = {};
  const initialVisibility = new Map<THREE.Object3D, boolean>();
  let resizeObserver: ResizeObserver | null = null;
  let animationId: number | null = null;
  let boundingBox: THREE.Box3 | null = null;
  let onFullscreenChange: (() => void) | null = null;
  let finSliderEl: HTMLInputElement | null = null;
  let finValueEl: HTMLSpanElement | null = null;

  const state = {
    gateOn: true,
    finCount: 3,
    bloomEnabled: true,
    bloomStrength: 0.95
  };

  function setGate(on: boolean) {
    state.gateOn = on;
    refreshVisibility();
  }

  function setFinCount(count: number) {
    const clamped = Math.min(5, Math.max(1, Math.round(count)));
    state.finCount = clamped;
    if (finSliderEl && finSliderEl.value !== clamped.toString()) {
      finSliderEl.value = clamped.toString();
    }
    if (finValueEl) {
      finValueEl.textContent = describeFinSelection(clamped);
    }
    refreshVisibility();
  }

  function getState() {
    return { gateOn: state.gateOn, finCount: state.finCount };
  }

  function ensureGroup(idx: number): FinGroup {
    if (!finGroups[idx]) {
      finGroups[idx] = {
        fins: [],
        glows: [],
        oxides: [],
        arrows: []
      };
    }
    return finGroups[idx];
  }

  function remember(obj: THREE.Object3D) {
    if (!initialVisibility.has(obj)) {
      initialVisibility.set(obj, obj.visible);
    }
  }

  function registerNodes(root: THREE.Object3D) {
    root.traverse((obj) => {
      if (!obj.name) return;
      remember(obj);
      const finMatch = obj.name.match(/^Fin_(\d+)/i);
      if (finMatch) {
        ensureGroup(Number(finMatch[1])).fins.push(obj);
        return;
      }
      const glowMatch = obj.name.match(/^FinGlow_(\d+)/i);
      if (glowMatch) {
        ensureGroup(Number(glowMatch[1])).glows.push(obj);
        cloneMeshMaterials(obj);
        setGlow(obj, 0x32d5ff, 1.6);
        return;
      }
      const oxideMatch = obj.name.match(/^GateOxide_(\d+)/i);
      if (oxideMatch) {
        ensureGroup(Number(oxideMatch[1])).oxides.push(obj);
        cloneMeshMaterials(obj);
        return;
      }
      const arrowMatch = obj.name.match(/^CurrentArrow_(\d+)/i);
      if (arrowMatch) {
        ensureGroup(Number(arrowMatch[1])).arrows.push(obj);
        cloneMeshMaterials(obj);
        setGlow(obj, 0x32d5ff, 1.4);
      }
    });
  }

  function refreshVisibility() {
    const activeSet = new Set(finSetForCount(state.finCount));
    Object.entries(finGroups).forEach(([key, group]) => {
      const idx = Number(key);
      const isActive = activeSet.has(idx);
      group.fins.forEach((node) => {
        node.visible = isActive;
      });
      const showEffects = isActive && state.gateOn;
      group.glows.forEach((node) => {
        node.visible = showEffects;
      });
      group.arrows.forEach((node) => {
        node.visible = showEffects;
      });
      group.oxides.forEach((node) => {
        node.visible = isActive && state.gateOn;
      });
    });
  }

  function updateBloom() {
    bloomPass.enabled = state.bloomEnabled;
    bloomPass.strength = state.bloomStrength;
  }

  function resetVisibility() {
    initialVisibility.forEach((visible, obj) => {
      obj.visible = visible;
    });
  }

  function resetView() {
    if (!boundingBox) return;
    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)));
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = 1.65 * Math.max(fitHeightDistance, fitWidthDistance);
    const direction = new THREE.Vector3(1.35, 0.9, 1.1).normalize();
    const newPosition = center.clone().add(direction.multiplyScalar(distance));
    camera.position.copy(newPosition);
    controls.target.copy(center);
    camera.near = distance / 60;
    camera.far = distance * 60;
    camera.updateProjectionMatrix();
  }

  function describeFinSelection(n: number) {
    const set = finSetForCount(n);
    return `${set.join(", ")} fin${set.length > 1 ? "s" : ""}`;
  }

  function buildControls() {
    controlsMount.innerHTML = "";
    const title = document.createElement("h4");
    title.textContent = "FinFET Viewer";
    controlsMount.appendChild(title);

    const gateToggle = document.createElement("div");
    gateToggle.className = "finfet-control";
    const gateLabel = document.createElement("label");
    const gateInput = document.createElement("input");
    gateInput.type = "checkbox";
    gateInput.checked = state.gateOn;
    gateLabel.append(gateInput, document.createTextNode("Gate ON"));
    gateToggle.appendChild(gateLabel);
    gateInput.addEventListener("change", () => setGate(gateInput.checked));
    controlsMount.appendChild(gateToggle);

    const finRow = document.createElement("div");
    finRow.className = "finfet-control";
    const finLabel = document.createElement("label");
    finLabel.textContent = "Slider: # of fins";
    const finSlider = document.createElement("input");
    finSlider.type = "range";
    finSlider.min = "1";
    finSlider.max = "5";
    finSlider.step = "1";
    finSlider.value = state.finCount.toString();
    const finValue = document.createElement("span");
    finValue.className = "value";
    finValue.textContent = describeFinSelection(state.finCount);
    finSliderEl = finSlider;
    finValueEl = finValue;
    finSlider.addEventListener("input", () => {
      const val = Number(finSlider.value);
      setFinCount(val);
      finValue.textContent = describeFinSelection(state.finCount);
    });
    finRow.append(finLabel, finSlider, finValue);
    controlsMount.appendChild(finRow);

    const bloomRow = document.createElement("div");
    bloomRow.className = "finfet-control";
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
    bloomStrengthRow.className = "finfet-control";
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

    const resetBtn = document.createElement("button");
    resetBtn.className = "finfet-reset";
    resetBtn.type = "button";
    resetBtn.textContent = "Reset View";
    resetBtn.addEventListener("click", () => {
      resetVisibility();
      refreshVisibility();
      resetView();
    });
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
  }

  function toggleFullscreen() {
    if (document.fullscreenElement === container) {
      document.exitFullscreen?.();
      return;
    }
    container.requestFullscreen?.().catch((err) => {
      console.error("[FinFET Viewer] Fullscreen failed", err);
      controlsMount.style.display = "none";
    });
  }

  loader.load(
    options.modelUrl ?? DEFAULT_MODEL_URL,
    (gltf) => {
      const root = (gltf.scene.getObjectByName("FinFET_Root") as THREE.Group | null) ?? gltf.scene;
      scene.add(root);

      registerNodes(root);

      if (!Object.keys(finGroups).length) {
        console.warn("[FinFET Viewer] No Fin_* nodes found. Check model naming.");
      }

      boundingBox = new THREE.Box3().setFromObject(root);
      resetView();
      refreshVisibility();
      updateBloom();

      buildControls();
      controlsMount.style.display = "none";

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
        animationId = requestAnimationFrame(animate);
      };
      animate();
    },
    undefined,
    (err) => {
      console.error("[FinFET Viewer] Failed to load model", err);
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
    renderer.domElement.remove();
    fullscreenBtn.removeEventListener("click", toggleFullscreen);
    if (onFullscreenChange) document.removeEventListener("fullscreenchange", onFullscreenChange);
    fullscreenBtn.remove();
    (container as any)[AUTO_ATTACH_KEY] = undefined;
  };

  const api: FinfetViewerApi = {
    dispose,
    setFinCount,
    setGateOn: setGate,
    getState
  };

  (container as any)[AUTO_ATTACH_KEY] = api;
  return api;
}
