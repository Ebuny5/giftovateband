import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HOTSPOTS_DATA } from '../data/bandConstants';
import { HotspotData, BiometricReading } from '../types/biometrics';
import { Eye, Layers, RotateCcw, Sparkles, Tag, ShieldAlert, ZoomIn, ZoomOut } from 'lucide-react';

interface BandViewer3DProps {
  reading: BiometricReading;
  selectedHotspotId: number | null;
  onSelectHotspot: (hotspot: HotspotData | null) => void;
  isExploded: boolean;
  onToggleExplode: () => void;
  isXRay: boolean;
  onToggleXRay: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  isSpinning: boolean;
  onToggleSpin: () => void;
}

export const BandViewer3D: React.FC<BandViewer3DProps> = ({
  reading,
  selectedHotspotId,
  onSelectHotspot,
  isExploded,
  onToggleExplode,
  isXRay,
  onToggleXRay,
  showLabels,
  onToggleLabels,
  isSpinning,
  onToggleSpin,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const oledCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const oledTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // References for scene & animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Group references for exploded view
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const topHousingGroupRef = useRef<THREE.Group | null>(null);
  const pcbGroupRef = useRef<THREE.Group | null>(null);
  const batteryGroupRef = useRef<THREE.Group | null>(null);
  const gasketGroupRef = useRef<THREE.Group | null>(null);
  const ventralPodGroupRef = useRef<THREE.Group | null>(null);
  const strapGroupRef = useRef<THREE.Group | null>(null);

  // Materials to toggle X-ray
  const chassisMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const strapMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  // Hotspot projected screen positions
  const [projectedHotspots, setProjectedHotspots] = useState<
    { id: number; x: number; y: number; visible: boolean; title: string }[]
  >([]);

  // Live state tracking refs (avoids re-mounting the WebGL canvas on state updates)
  const isSpinningRef = useRef(isSpinning);
  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  const isExplodedRef = useRef(isExploded);
  useEffect(() => {
    isExplodedRef.current = isExploded;
  }, [isExploded]);

  const showLabelsRef = useRef(showLabels);
  useEffect(() => {
    showLabelsRef.current = showLabels;
  }, [showLabels]);

  // Target camera position for view presets
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Explode animation progress (0 = assembled, 1 = fully exploded)
  const explodeProgressRef = useRef(0);

  // Update offscreen OLED canvas when reading changes (lightweight 2D draw, zero WebGL context re-creation)
  const updateOledCanvas = useCallback((currentReading: BiometricReading) => {
    if (!oledCanvasRef.current) {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 256;
      oledCanvasRef.current = c;
    }
    const canvas = oledCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Deep black OLED background
    ctx.fillStyle = '#05070B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle OLED scanline grid
    ctx.fillStyle = 'rgba(14, 165, 233, 0.05)';
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillRect(0, y, canvas.width, 1);
    }

    // Top status line
    ctx.font = '600 22px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#0EA5E9';
    ctx.fillText('GIFTOVATE', 28, 42);

    // Battery & BLE Indicator
    ctx.font = '500 18px monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('BLE 5.3  98%', 360, 42);

    // Divider line
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(28, 56);
    ctx.lineTo(484, 56);
    ctx.stroke();

    // Primary Heart Rate
    ctx.font = '700 74px monospace';
    ctx.fillStyle = currentReading.surgeLevel === 'critical' ? '#EF4444' : '#F8FAFC';
    ctx.fillText(`${currentReading.heartRate}`, 28, 145);

    ctx.font = '600 20px monospace';
    ctx.fillStyle = '#0EA5E9';
    ctx.fillText('BPM', 155, 115);

    // Secondary EDA
    ctx.font = '700 74px monospace';
    ctx.fillStyle = currentReading.edaConductance > 6.0 ? '#F59E0B' : '#14B8A6';
    ctx.fillText(currentReading.edaConductance.toFixed(1), 260, 145);

    ctx.font = '600 20px monospace';
    ctx.fillStyle = '#14B8A6';
    ctx.fillText('μS (EDA)', 415, 115);

    // Bottom surge status alert banner
    const isAlert = currentReading.surgeLevel === 'critical' || currentReading.edaConductance > 6.0;
    if (isAlert) {
      ctx.fillStyle = currentReading.surgeLevel === 'critical' ? '#EF4444' : '#F59E0B';
      ctx.fillRect(28, 175, 456, 52);
      ctx.font = '700 24px monospace';
      ctx.fillStyle = '#000000';
      ctx.fillText('⚠️ ALERT: EDA SPIKE', 95, 210);
    } else {
      ctx.fillStyle = 'rgba(20, 184, 166, 0.15)';
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.fillRect(28, 175, 456, 52);
      ctx.strokeRect(28, 175, 456, 52);

      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillStyle = '#2DD4BF';
      ctx.fillText('STATUS: BASELINE NOMINAL', 95, 209);
    }

    if (oledTextureRef.current) {
      oledTextureRef.current.needsUpdate = true;
    }
  }, []);

  // Update OLED texture whenever reading changes
  useEffect(() => {
    updateOledCanvas(reading);
  }, [reading, updateOledCanvas]);

  // Build the 3D Procedural Scene ONCE on mount
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080c14);
    scene.fog = new THREE.FogExp2(0x080c14, 0.06);

    // 2. Camera (Isometric baseline)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(4.2, 2.8, 4.5);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls with full 360° rotation and wide zoom range
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;
    controls.minDistance = 1.2;
    controls.maxDistance = 16.0;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.85;
    controls.maxPolarAngle = Math.PI; // Full 360° vertical view from top, bottom, and all sides!
    controls.minPolarAngle = 0;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Key light (Warm neutral)
    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.6);
    keyLight.position.set(5, 7, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Fill light (Cool surgical cyan)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);

    // Underside Rim light (Surgical Teal) - lights up the sensor pod from below
    const undersideRimLight = new THREE.DirectionalLight(0x14b8a6, 2.5);
    undersideRimLight.position.set(0, -6, 2);
    scene.add(undersideRimLight);

    // Top spotlight
    const topSpot = new THREE.SpotLight(0xffffff, 1.8, 15, Math.PI / 4, 0.4);
    topSpot.position.set(0, 6, 0);
    scene.add(topSpot);

    // Soft Circular Floor Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0,0,0,0.8)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.2;
    scene.add(shadowMesh);

    // -------------------------------------------------------------
    // Build Procedural Giftovate Band
    // -------------------------------------------------------------
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // Initialize OLED texture
    if (!oledCanvasRef.current) {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 256;
      oledCanvasRef.current = c;
    }
    const oledTex = new THREE.CanvasTexture(oledCanvasRef.current);
    oledTextureRef.current = oledTex;
    oledTex.colorSpace = THREE.SRGBColorSpace;

    // Materials
    const matteGraphiteMat = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      roughness: 0.35,
      metalness: 0.25,
    });
    chassisMaterialsRef.current = [matteGraphiteMat];

    const tealAccentMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.25,
      metalness: 0.85,
    });

    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      roughness: 0.75,
      metalness: 0.05,
    });
    strapMaterialsRef.current = [strapMat];

    const goldPlatedMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.15,
      metalness: 0.95,
    });

    const silverElectrodeMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.2,
      metalness: 0.9,
    });

    const pcbGreenMat = new THREE.MeshStandardMaterial({
      color: 0x0f5132,
      roughness: 0.4,
      metalness: 0.3,
    });

    const lithiumCellMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.8,
    });

    const siliconeGasketMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.65,
    });

    // -------------------------------------------------------------
    // Group 1: Top Housing & OLED HUD
    // -------------------------------------------------------------
    const topHousingGroup = new THREE.Group();
    topHousingGroupRef.current = topHousingGroup;
    rootGroup.add(topHousingGroup);

    // Bezel enclosure
    const topBezelGeo = new THREE.CylinderGeometry(1.05, 1.15, 0.3, 36);
    const topBezelMesh = new THREE.Mesh(topBezelGeo, matteGraphiteMat);
    topBezelMesh.position.y = 1.05;
    topBezelMesh.castShadow = true;
    topHousingGroup.add(topBezelMesh);

    // Surgical teal accent ring
    const tealRingGeo = new THREE.TorusGeometry(1.1, 0.035, 16, 48);
    const tealRingMesh = new THREE.Mesh(tealRingGeo, tealAccentMat);
    tealRingMesh.rotation.x = Math.PI / 2;
    tealRingMesh.position.y = 1.12;
    topHousingGroup.add(tealRingMesh);

    // OLED Screen Surface
    const oledScreenGeo = new THREE.PlaneGeometry(1.4, 0.85);
    const oledScreenMat = new THREE.MeshBasicMaterial({
      map: oledTex,
      transparent: true,
    });
    const oledScreenMesh = new THREE.Mesh(oledScreenGeo, oledScreenMat);
    oledScreenMesh.rotation.x = -Math.PI / 2;
    oledScreenMesh.position.y = 1.21;
    topHousingGroup.add(oledScreenMesh);

    // 2.5D Curved Cover Glass
    const glassGeo = new THREE.CylinderGeometry(1.02, 1.02, 0.05, 36);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = 1.23;
    topHousingGroup.add(glassMesh);

    // -------------------------------------------------------------
    // Group 2: Rigid-Flex PCB & MCU Subsystem
    // -------------------------------------------------------------
    const pcbGroup = new THREE.Group();
    pcbGroupRef.current = pcbGroup;
    rootGroup.add(pcbGroup);

    const pcbGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.06, 32);
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbGreenMat);
    pcbMesh.position.y = 0.55;
    pcbGroup.add(pcbMesh);

    // MCU Chip (Nordic nRF52840)
    const mcuGeo = new THREE.BoxGeometry(0.35, 0.05, 0.35);
    const mcuMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.3,
      metalness: 0.6,
    });
    const mcuMesh = new THREE.Mesh(mcuGeo, mcuMat);
    mcuMesh.position.set(0, 0.6, 0);
    pcbGroup.add(mcuMesh);

    // Golden circuit traces & test pads
    for (let i = 0; i < 6; i++) {
      const padGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 12);
      const padMesh = new THREE.Mesh(padGeo, goldPlatedMat);
      const angle = (i * Math.PI) / 3;
      padMesh.position.set(Math.cos(angle) * 0.65, 0.59, Math.sin(angle) * 0.65);
      pcbGroup.add(padMesh);
    }

    // -------------------------------------------------------------
    // Group 3: 180mAh Li-Po Battery Cell
    // -------------------------------------------------------------
    const batteryGroup = new THREE.Group();
    batteryGroupRef.current = batteryGroup;
    rootGroup.add(batteryGroup);

    const batteryGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.18, 28);
    const batteryMesh = new THREE.Mesh(batteryGeo, lithiumCellMat);
    batteryMesh.position.y = 0.2;
    batteryGroup.add(batteryMesh);

    // -------------------------------------------------------------
    // Group 4: Silicone Hermetic Gasket (IP68)
    // -------------------------------------------------------------
    const gasketGroup = new THREE.Group();
    gasketGroupRef.current = gasketGroup;
    rootGroup.add(gasketGroup);

    const gasketGeo = new THREE.TorusGeometry(1.0, 0.06, 16, 36);
    const gasketMesh = new THREE.Mesh(gasketGeo, siliconeGasketMat);
    gasketMesh.rotation.x = Math.PI / 2;
    gasketMesh.position.y = -0.35;
    gasketGroup.add(gasketMesh);

    // -------------------------------------------------------------
    // Group 5: Ventral Pod (Skin Interface) & Electrodes
    // -------------------------------------------------------------
    const ventralPodGroup = new THREE.Group();
    ventralPodGroupRef.current = ventralPodGroup;
    rootGroup.add(ventralPodGroup);

    // Ventral Pod main housing (anatomical curvature)
    const ventralPodGeo = new THREE.CylinderGeometry(1.15, 1.05, 0.38, 36);
    const ventralPodMesh = new THREE.Mesh(ventralPodGeo, matteGraphiteMat);
    ventralPodMesh.position.y = -1.0;
    ventralPodMesh.castShadow = true;
    ventralPodGroup.add(ventralPodMesh);

    // Central Optical PPG Window (Sapphire)
    const ppgWindowGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 24);
    const ppgWindowMat = new THREE.MeshPhysicalMaterial({
      color: 0x111827,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const ppgWindowMesh = new THREE.Mesh(ppgWindowGeo, ppgWindowMat);
    ppgWindowMesh.position.set(0, -1.2, 0);
    ventralPodGroup.add(ppgWindowMesh);

    // Dual Green Micro-LEDs (Emissive)
    const ledGeo = new THREE.BoxGeometry(0.08, 0.03, 0.08);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 2.2,
    });
    const led1 = new THREE.Mesh(ledGeo, ledMat);
    led1.position.set(0.18, -1.22, 0);
    ventralPodGroup.add(led1);

    const led2 = new THREE.Mesh(ledGeo, ledMat);
    led2.position.set(-0.18, -1.22, 0);
    ventralPodGroup.add(led2);

    // Photodiode sensor center
    const pdGeo = new THREE.BoxGeometry(0.12, 0.03, 0.12);
    const pdMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.1,
      metalness: 0.8,
    });
    const pdMesh = new THREE.Mesh(pdGeo, pdMat);
    pdMesh.position.set(0, -1.22, 0);
    ventralPodGroup.add(pdMesh);

    // Dual Ag/AgCl Dry EDA Contact Electrodes
    const edaStudGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.1, 24);
    
    // Electrode A
    const edaStudA = new THREE.Mesh(edaStudGeo, silverElectrodeMat);
    edaStudA.position.set(0.65, -1.2, 0.45);
    edaStudA.castShadow = true;
    ventralPodGroup.add(edaStudA);

    // Electrode B
    const edaStudB = new THREE.Mesh(edaStudGeo, silverElectrodeMat);
    edaStudB.position.set(-0.65, -1.2, -0.45);
    edaStudB.castShadow = true;
    ventralPodGroup.add(edaStudB);

    // Precision Skin Temperature Thermistor Bead (Contact NTC)
    const thermistorGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const thermistorMesh = new THREE.Mesh(thermistorGeo, goldPlatedMat);
    thermistorMesh.position.set(-0.65, -1.22, 0.45);
    ventralPodGroup.add(thermistorMesh);

    // Magnetic Pogo 2-Pin Charging Contacts
    const pogoA = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 12), goldPlatedMat);
    pogoA.position.set(0.65, -1.2, -0.42);
    ventralPodGroup.add(pogoA);

    const pogoB = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 12), goldPlatedMat);
    pogoB.position.set(0.8, -1.2, -0.42);
    ventralPodGroup.add(pogoB);

    // Flex Test Ribbon (matches prototype reference photo)
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.9, -1.0, 0.3),
      new THREE.Vector3(1.3, -0.8, 0.45),
      new THREE.Vector3(1.5, -0.6, 0.35),
      new THREE.Vector3(1.65, -0.3, 0.1),
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 20, 0.045, 8, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.5,
      metalness: 0.2,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ventralPodGroup.add(ribbonMesh);

    // -------------------------------------------------------------
    // Group 6: Ergonomic Fluoroelastomer Wrist Strap & Clasp
    // -------------------------------------------------------------
    const strapGroup = new THREE.Group();
    strapGroupRef.current = strapGroup;
    rootGroup.add(strapGroup);

    // Procedural curved wristband loop
    const curvePoints: THREE.Vector3[] = [];
    const radiusX = 1.85;
    const radiusY = 1.35;
    const segments = 64;

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radiusX;
      const y = Math.sin(theta) * radiusY;
      curvePoints.push(new THREE.Vector3(x, y, 0));
    }

    const bandPath = new THREE.CatmullRomCurve3(curvePoints, true);
    const strapBandGeo = new THREE.TubeGeometry(bandPath, 72, 0.38, 16, true);
    const strapBandMesh = new THREE.Mesh(strapBandGeo, strapMat);
    strapBandMesh.castShadow = true;
    strapBandMesh.receiveShadow = true;
    strapGroup.add(strapBandMesh);

    // Micro-grooved ribbed texture lines (internal sweat evacuation channels)
    for (let i = 0; i < 18; i++) {
      const ribAngle = (i / 18) * Math.PI * 2;
      const ribX = Math.cos(ribAngle) * (radiusX - 0.22);
      const ribY = Math.sin(ribAngle) * (radiusY - 0.22);
      const ribGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8);
      const ribMesh = new THREE.Mesh(ribGeo, matteGraphiteMat);
      ribMesh.position.set(ribX, ribY, 0);
      ribMesh.rotation.z = ribAngle + Math.PI / 2;
      strapGroup.add(ribMesh);
    }

    // Flush Clasp Snap Pin (circular button on strap side, from prototype photo)
    const claspPinGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.12, 28);
    const claspPinMesh = new THREE.Mesh(claspPinGeo, matteGraphiteMat);
    claspPinMesh.rotation.x = Math.PI / 2;
    claspPinMesh.position.set(0.1, -1.35, 0.42);
    strapGroup.add(claspPinMesh);

    // Strap adjustment holes
    for (let i = -3; i <= 3; i++) {
      const holeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.16, 12);
      const holeMesh = new THREE.Mesh(holeGeo, new THREE.MeshBasicMaterial({ color: 0x0a0e17 }));
      holeMesh.rotation.x = Math.PI / 2;
      holeMesh.position.set(i * 0.22 - 0.3, -1.35, 0.42);
      strapGroup.add(holeMesh);
    }

    // -------------------------------------------------------------
    // Animation & Render Loop
    // -------------------------------------------------------------
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Continuous turntable spin when enabled
      if (isSpinningRef.current && rootGroupRef.current) {
        rootGroupRef.current.rotation.y += 0.006;
      }

      // Smooth camera interpolation for preset view transitions
      if (targetCamPosRef.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.08);
        if (targetLookAtRef.current) {
          controlsRef.current.target.lerp(targetLookAtRef.current, 0.08);
        }
        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.03) {
          targetCamPosRef.current = null;
          targetLookAtRef.current = null;
        }
      }

      // Smooth Exploded View Layer Interpolation
      const targetExplode = isExplodedRef.current ? 1.0 : 0.0;
      explodeProgressRef.current += (targetExplode - explodeProgressRef.current) * 0.1;
      const ep = explodeProgressRef.current;

      if (topHousingGroupRef.current) {
        topHousingGroupRef.current.position.y = ep * 1.5;
      }
      if (pcbGroupRef.current) {
        pcbGroupRef.current.position.y = ep * 0.85;
      }
      if (batteryGroupRef.current) {
        batteryGroupRef.current.position.y = ep * 0.25;
      }
      if (gasketGroupRef.current) {
        gasketGroupRef.current.position.y = -ep * 0.45;
      }
      if (ventralPodGroupRef.current) {
        ventralPodGroupRef.current.position.y = -ep * 1.45;
      }
      if (strapGroupRef.current) {
        strapGroupRef.current.position.x = -ep * 0.6;
      }

      controls.update();
      renderer.render(scene, camera);

      // Compute 3D Screen-space Hotspots
      if (showLabelsRef.current && cameraRef.current && container) {
        const cam = cameraRef.current;
        const rect = container.getBoundingClientRect();

        const projected = HOTSPOTS_DATA.map((h) => {
          const worldPos = new THREE.Vector3(...h.position);
          if (rootGroupRef.current) {
            worldPos.applyEuler(rootGroupRef.current.rotation);
          }

          let isFacing = true;
          if (h.normal) {
            const worldNorm = new THREE.Vector3(...h.normal);
            if (rootGroupRef.current) {
              worldNorm.applyEuler(rootGroupRef.current.rotation);
            }
            const toCam = cam.position.clone().sub(worldPos).normalize();
            isFacing = worldNorm.dot(toCam) > -0.25;
          }

          const screenPos = worldPos.clone().project(cam);
          const isBehind = screenPos.z > 1.0;

          const screenX = ((screenPos.x + 1) * rect.width) / 2;
          const screenY = ((-screenPos.y + 1) * rect.height) / 2;

          return {
            id: h.id,
            title: h.title,
            x: screenX,
            y: screenY,
            visible: isFacing && !isBehind && screenX > 15 && screenX < rect.width - 15 && screenY > 15 && screenY < rect.height - 15,
          };
        });

        setProjectedHotspots(projected);
      } else {
        setProjectedHotspots([]);
      }
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []); // Only mount scene ONCE!

  // Handle X-Ray material changes imperatively
  useEffect(() => {
    chassisMaterialsRef.current.forEach((mat) => {
      if (isXRay) {
        mat.transparent = true;
        mat.opacity = 0.28;
        mat.roughness = 0.1;
        mat.metalness = 0.9;
      } else {
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.roughness = 0.35;
        mat.metalness = 0.25;
      }
      mat.needsUpdate = true;
    });

    strapMaterialsRef.current.forEach((mat) => {
      if (isXRay) {
        mat.transparent = true;
        mat.opacity = 0.22;
      } else {
        mat.transparent = false;
        mat.opacity = 1.0;
      }
      mat.needsUpdate = true;
    });
  }, [isXRay]);

  // Camera presets
  const setWristView = () => {
    targetCamPosRef.current = new THREE.Vector3(0.1, 4.0, 2.2);
    targetLookAtRef.current = new THREE.Vector3(0, 0.4, 0);
  };

  const setSensorsView = () => {
    // Smoothly rotates to view the underside ventral sensor pod directly
    targetCamPosRef.current = new THREE.Vector3(0.0, -4.2, -1.8);
    targetLookAtRef.current = new THREE.Vector3(0, -0.6, 0);
  };

  const resetView = () => {
    targetCamPosRef.current = new THREE.Vector3(4.2, 2.8, 4.5);
    targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
    if (rootGroupRef.current) {
      rootGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  // Zoom In / Zoom Out programmatic helpers
  const handleZoom = (delta: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const forward = new THREE.Vector3();
    cam.getWorldDirection(forward);
    cam.position.addScaledVector(forward, delta);
    controlsRef.current.update();
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#080C14]">
      {/* Three.js canvas container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Telemetry Overlay HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs font-mono font-medium tracking-wider text-teal-400 uppercase">
            3D DIGITAL TWIN · ACTIVE
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs font-mono text-slate-400">PBR WebGL 2.0</span>
        </div>
        <div className="text-sm font-semibold text-white/90 tracking-tight">
          Giftovate Band <span className="text-xs font-normal text-slate-400">v0.1 Concept</span>
        </div>
      </div>

      {/* Zoom In / Out On-Screen Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => handleZoom(1.0)}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 rounded-xl shadow-lg backdrop-blur-md transition-colors cursor-pointer"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-teal-400" />
        </button>
        <button
          onClick={() => handleZoom(-1.0)}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 rounded-xl shadow-lg backdrop-blur-md transition-colors cursor-pointer"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-teal-400" />
        </button>
      </div>

      {/* Real-time alert ribbon on 3D view if sympathetic surge is active */}
      {reading.surgeLevel === 'critical' && (
        <div className="absolute top-16 left-4 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 bg-red-950/80 border border-red-500/40 rounded-lg backdrop-blur-md animate-fade-in">
          <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce" />
          <div className="text-xs font-mono text-red-200">
            LRA HAPTIC ACTIVE · EDA SPIKE
          </div>
        </div>
      )}

      {/* Screen-Space Hotspots */}
      {showLabels &&
        projectedHotspots.map((h) => {
          if (!h.visible) return null;
          const isSelected = selectedHotspotId === h.id;
          return (
            <button
              key={h.id}
              onClick={() => {
                const fullItem = HOTSPOTS_DATA.find((item) => item.id === h.id) || null;
                onSelectHotspot(fullItem);
              }}
              style={{
                left: `${h.x}px`,
                top: `${h.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute z-20 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer shadow-lg ${
                isSelected
                  ? 'bg-teal-400 text-slate-950 ring-2 ring-teal-300 scale-110 font-bold'
                  : 'bg-slate-900/90 text-slate-200 border border-teal-500/30 hover:border-teal-400 hover:scale-105 backdrop-blur-md'
              }`}
              title={h.title}
            >
              <span className={`w-4 h-4 flex items-center justify-center rounded-full text-[10px] ${
                isSelected ? 'bg-slate-950 text-teal-400 font-bold' : 'bg-teal-500/20 text-teal-300'
              }`}>
                {h.id}
              </span>
              <span className="hidden sm:inline-block max-w-[120px] truncate">{h.title}</span>
            </button>
          );
        })}

      {/* Floating Bottom Pill Toolbar (Persistent labels, always visible) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 bg-slate-950/85 border border-slate-800/80 rounded-full backdrop-blur-xl shadow-2xl max-w-[95vw] overflow-x-auto">
        {/* Preset Views */}
        <button
          onClick={setWristView}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-full transition-colors cursor-pointer shrink-0"
          title="Front view of top display"
        >
          <Eye className="w-3.5 h-3.5 text-teal-400" />
          <span>Wrist</span>
        </button>

        <button
          onClick={setSensorsView}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-full transition-colors cursor-pointer shrink-0"
          title="Rotate 180° to inspect ventral skin-contact electrodes"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Sensors</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-0.5 shrink-0" />

        {/* Explode Mode */}
        <button
          onClick={onToggleExplode}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer shrink-0 ${
            isExploded
              ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Smoothly separate mechanical layer stack"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Explode</span>
        </button>

        {/* X-Ray Mode */}
        <button
          onClick={onToggleXRay}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer shrink-0 ${
            isXRay
              ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Toggle chassis transparency & reveal internal circuitry"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>X-ray</span>
        </button>

        {/* Labels Mode */}
        <button
          onClick={onToggleLabels}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer shrink-0 ${
            showLabels
              ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Toggle numbered 3D hotspots"
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Labels</span>
        </button>

        {/* Spin Mode */}
        <button
          onClick={onToggleSpin}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer shrink-0 ${
            isSpinning
              ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Toggle 360° turntable spin"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>Spin</span>
        </button>

        {/* Reset Camera */}
        <button
          onClick={resetView}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-full transition-colors cursor-pointer shrink-0"
          title="Reset Camera Orientation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
