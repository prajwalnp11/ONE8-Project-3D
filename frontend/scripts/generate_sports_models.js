import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, "../public/models");

// Polyfill FileReader for Node.js GLTFExporter
globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
      if (this.onload) this.onload();
    });
  }
};

function exportGLB(scene, filename) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf) => {
        const dest = path.join(outputDir, filename);
        fs.writeFileSync(dest, Buffer.from(gltf));
        console.log(`Exported ${filename} (${(fs.statSync(dest).size / 1024).toFixed(1)} KB)`);
        resolve(dest);
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

// ----------------------------------------------------
// 1. CRICKET BAT MODEL (English Willow with Spine & Grip)
// ----------------------------------------------------
function buildCricketBat() {
  const batGroup = new THREE.Group();
  batGroup.name = "CricketBat";

  // Materials
  const willowWoodMat = new THREE.MeshStandardMaterial({
    name: "WillowWood",
    color: 0xdeb887, // Natural golden English willow
    roughness: 0.45,
    metalness: 0.05,
  });

  const gripMat = new THREE.MeshStandardMaterial({
    name: "BatGrip",
    color: 0x171717, // Premium matte black grip
    roughness: 0.85,
    metalness: 0.1,
  });

  const goldDecalMat = new THREE.MeshStandardMaterial({
    name: "One8GoldDecal",
    color: 0xd4af37, // Metallic trophy gold
    roughness: 0.25,
    metalness: 0.85,
  });

  const rubberToeMat = new THREE.MeshStandardMaterial({
    name: "ToeGuard",
    color: 0x222222,
    roughness: 0.9,
  });

  // Handle (cylinder with slight taper)
  const handleGeom = new THREE.CylinderGeometry(0.045, 0.05, 0.65, 24);
  const handleMesh = new THREE.Mesh(handleGeom, gripMat);
  handleMesh.position.y = 1.05;
  handleMesh.castShadow = true;
  batGroup.add(handleMesh);

  // Grip texture rings (spiral ridges)
  for (let y = 0.78; y <= 1.32; y += 0.035) {
    const ringGeom = new THREE.TorusGeometry(0.049, 0.007, 8, 24);
    const ring = new THREE.Mesh(ringGeom, gripMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    batGroup.add(ring);
  }

  // Handle Top Pommel
  const pommelGeom = new THREE.SphereGeometry(0.055, 16, 16);
  pommelGeom.scale(1, 0.4, 1);
  const pommel = new THREE.Mesh(pommelGeom, gripMat);
  pommel.position.y = 1.38;
  batGroup.add(pommel);

  // Bat Splice / Shoulders (curved transition from handle to blade)
  const spliceGeom = new THREE.CylinderGeometry(0.052, 0.12, 0.22, 16);
  spliceGeom.scale(1.2, 1, 0.85);
  const spliceMesh = new THREE.Mesh(spliceGeom, willowWoodMat);
  spliceMesh.position.y = 0.64;
  batGroup.add(spliceMesh);

  // Bat Blade Shape: Flat front face, spine ridge on back, curved toe
  const bladeWidth = 0.28;
  const bladeLength = 1.25;
  const bladeFrontDepth = 0.04;
  const bladeSpineDepth = 0.09;

  // Front Blade Face
  const frontGeom = new THREE.BoxGeometry(bladeWidth, bladeLength, bladeFrontDepth);
  const frontMesh = new THREE.Mesh(frontGeom, willowWoodMat);
  frontMesh.position.set(0, 0, 0.015);
  frontMesh.castShadow = true;
  batGroup.add(frontMesh);

  // Back Spine (Distinctive power ridge of English Willow)
  const spineGeom = new THREE.ConeGeometry(bladeWidth * 0.46, bladeLength * 0.95, 4);
  spineGeom.scale(1, 1, bladeSpineDepth / (bladeWidth * 0.46));
  const spineMesh = new THREE.Mesh(spineGeom, willowWoodMat);
  spineMesh.position.set(0, 0.05, -0.03);
  spineMesh.rotation.y = Math.PI / 4;
  batGroup.add(spineMesh);

  // Rounded Bottom Toe Guard
  const toeGeom = new THREE.CylinderGeometry(bladeWidth * 0.48, bladeWidth * 0.48, 0.05, 16);
  toeGeom.scale(1, 1, 0.5);
  const toeMesh = new THREE.Mesh(toeGeom, rubberToeMat);
  toeMesh.position.set(0, -0.64, 0.005);
  toeMesh.rotation.z = Math.PI / 2;
  batGroup.add(toeMesh);

  // ONE8 Gold Brand Badge on front blade face
  const badgeGeom = new THREE.BoxGeometry(0.16, 0.38, 0.005);
  const badgeMesh = new THREE.Mesh(badgeGeom, goldDecalMat);
  badgeMesh.position.set(0, 0.15, 0.038);
  batGroup.add(badgeMesh);

  // Gold Spine Stripes on back
  const spineStripeGeom = new THREE.BoxGeometry(0.04, 0.5, 0.005);
  const spineStripe = new THREE.Mesh(spineStripeGeom, goldDecalMat);
  spineStripe.position.set(0, 0.1, -0.075);
  batGroup.add(spineStripe);

  batGroup.scale.set(0.9, 0.9, 0.9);
  return batGroup;
}

// ----------------------------------------------------
// 2. ATHLETIC CAP MODEL (6-panel Crown, Curved Visor, Logo)
// ----------------------------------------------------
function buildCap() {
  const capGroup = new THREE.Group();
  capGroup.name = "AthleticCap";

  const fabricMat = new THREE.MeshStandardMaterial({
    name: "CapFabric",
    color: 0x171717, // Sleek black twill
    roughness: 0.8,
    metalness: 0.05,
  });

  const goldLogoMat = new THREE.MeshStandardMaterial({
    name: "CapGoldLogo",
    color: 0xd4af37,
    roughness: 0.3,
    metalness: 0.8,
  });

  const eyeletMat = new THREE.MeshStandardMaterial({
    name: "CapEyelet",
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.5,
  });

  // Crown (Hemisphere sculpted into cap crown)
  const crownGeom = new THREE.SphereGeometry(0.65, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
  crownGeom.scale(0.98, 0.82, 1.12);
  const crownMesh = new THREE.Mesh(crownGeom, fabricMat);
  crownMesh.castShadow = true;
  capGroup.add(crownMesh);

  // Inner sweatband / rim
  const rimGeom = new THREE.TorusGeometry(0.63, 0.03, 12, 32);
  rimGeom.scale(0.98, 0.25, 1.12);
  const rimMesh = new THREE.Mesh(rimGeom, fabricMat);
  rimMesh.position.y = -0.06;
  rimMesh.rotation.x = Math.PI / 2;
  capGroup.add(rimMesh);

  // Top Button
  const buttonGeom = new THREE.SphereGeometry(0.055, 16, 12);
  buttonGeom.scale(1, 0.4, 1);
  const buttonMesh = new THREE.Mesh(buttonGeom, fabricMat);
  buttonMesh.position.set(0, 0.54, 0);
  capGroup.add(buttonMesh);

  // Curved Visor / Brim extending forward
  const visorShape = new THREE.Shape();
  visorShape.moveTo(-0.54, 0);
  visorShape.quadraticCurveTo(-0.56, 0.38, -0.4, 0.65);
  visorShape.quadraticCurveTo(0, 0.85, 0.4, 0.65);
  visorShape.quadraticCurveTo(0.56, 0.38, 0.54, 0);
  visorShape.quadraticCurveTo(0, 0.12, -0.54, 0);

  const visorGeom = new THREE.ExtrudeGeometry(visorShape, {
    depth: 0.025,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  });
  visorGeom.rotateX(Math.PI / 2);
  visorGeom.rotateX(-0.18); // Downward forward angle

  const visorMesh = new THREE.Mesh(visorGeom, fabricMat);
  visorMesh.position.set(0, -0.04, 0.48);
  visorMesh.castShadow = true;
  capGroup.add(visorMesh);

  // Front 3D Metallic ONE8 Logo
  const logoGeom = new THREE.BoxGeometry(0.24, 0.16, 0.02);
  const logoMesh = new THREE.Mesh(logoGeom, goldLogoMat);
  logoMesh.position.set(0, 0.24, 0.63);
  logoMesh.rotation.x = -0.32;
  capGroup.add(logoMesh);

  // Embroidered ventilation eyelets (6 around crown)
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const eyeletGeom = new THREE.TorusGeometry(0.02, 0.007, 8, 16);
    const eyelet = new THREE.Mesh(eyeletGeom, eyeletMat);
    eyelet.position.set(Math.sin(angle) * 0.48, 0.32, Math.cos(angle) * 0.54);
    eyelet.lookAt(0, 0.32, 0);
    capGroup.add(eyelet);
  }

  capGroup.scale.set(1.4, 1.4, 1.4);
  return capGroup;
}

// ----------------------------------------------------
// 3. CRICKET SPIKE SHOE MODEL (Performance Spikes & Studs)
// ----------------------------------------------------
function buildCricketShoe() {
  const shoeGroup = new THREE.Group();
  shoeGroup.name = "CricketShoe";

  // Materials
  const upperMat = new THREE.MeshStandardMaterial({
    name: "CricketUpper",
    color: 0xf5f5f2, // High-performance white athletic mesh
    roughness: 0.5,
    metalness: 0.05,
  });

  const overlayMat = new THREE.MeshStandardMaterial({
    name: "SyntheticOverlay",
    color: 0x171717, // Sleek black reinforcement overlays
    roughness: 0.4,
    metalness: 0.15,
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    name: "GoldAccent",
    color: 0xd4af37, // ONE8 Signature Gold
    roughness: 0.25,
    metalness: 0.85,
  });

  const spikeMat = new THREE.MeshStandardMaterial({
    name: "MetalSpikes",
    color: 0xcccccc, // Polished chrome cricket spikes
    roughness: 0.2,
    metalness: 0.95,
  });

  const soleMat = new THREE.MeshStandardMaterial({
    name: "SpikePlate",
    color: 0x1b1b1b,
    roughness: 0.7,
  });

  // Sculpted aerodynamic shoe upper
  const upperGeom = new THREE.CylinderGeometry(0.42, 0.48, 1.9, 16);
  upperGeom.scale(0.85, 0.48, 1.3);
  upperGeom.rotateX(Math.PI / 2);
  const upperMesh = new THREE.Mesh(upperGeom, upperMat);
  upperMesh.position.set(0, 0.18, 0);
  upperMesh.castShadow = true;
  shoeGroup.add(upperMesh);

  // Ankle collar & tongue
  const collarGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.5, 16);
  collarGeom.scale(0.8, 1, 0.9);
  const collarMesh = new THREE.Mesh(collarGeom, overlayMat);
  collarMesh.position.set(0, 0.45, -0.38);
  shoeGroup.add(collarMesh);

  // Abrasion-resistant Cricket Bowler/Batsman Toe Guard
  const toeGuardGeom = new THREE.SphereGeometry(0.45, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
  toeGuardGeom.scale(0.78, 0.38, 0.6);
  const toeGuard = new THREE.Mesh(toeGuardGeom, overlayMat);
  toeGuard.position.set(0, 0.08, 0.76);
  toeGuard.rotation.x = Math.PI / 2;
  shoeGroup.add(toeGuard);

  // Midsole cushioning bed
  const midsoleGeom = new THREE.BoxGeometry(0.78, 0.16, 2.3);
  const midsoleMesh = new THREE.Mesh(midsoleGeom, upperMat);
  midsoleMesh.position.set(0, -0.06, 0);
  shoeGroup.add(midsoleMesh);

  // Rigid TPU Cricket Spike Outsole Plate
  const plateGeom = new THREE.BoxGeometry(0.74, 0.08, 2.25);
  const plateMesh = new THREE.Mesh(plateGeom, soleMat);
  plateMesh.position.set(0, -0.16, 0);
  plateMesh.castShadow = true;
  shoeGroup.add(plateMesh);

  // Side Racing Formstripes (ONE8 signature)
  const stripeGeom = new THREE.BoxGeometry(0.04, 0.18, 0.95);
  const stripeLeft = new THREE.Mesh(stripeGeom, goldAccentMat);
  stripeLeft.position.set(0.38, 0.15, 0.05);
  stripeLeft.rotation.set(-0.25, 0, -0.15);
  shoeGroup.add(stripeLeft);

  const stripeRight = new THREE.Mesh(stripeGeom, goldAccentMat);
  stripeRight.position.set(-0.38, 0.15, 0.05);
  stripeRight.rotation.set(-0.25, 0, 0.15);
  shoeGroup.add(stripeRight);

  // 11 Replaceable Conical Cricket Spikes
  // 7 Forefoot spikes
  const forefootSpikePositions = [
    [-0.24, -0.25, 0.85],
    [0.24, -0.25, 0.85],
    [-0.26, -0.25, 0.55],
    [0.26, -0.25, 0.55],
    [0, -0.25, 0.55],
    [-0.22, -0.25, 0.25],
    [0.22, -0.25, 0.25],
  ];

  // 4 Heel spikes
  const heelSpikePositions = [
    [-0.22, -0.25, -0.65],
    [0.22, -0.25, -0.65],
    [-0.22, -0.25, -0.95],
    [0.22, -0.25, -0.95],
  ];

  const spikeGeom = new THREE.ConeGeometry(0.042, 0.12, 8);
  spikeGeom.rotateX(Math.PI); // Point down into pitch

  [...forefootSpikePositions, ...heelSpikePositions].forEach(([x, y, z]) => {
    const spike = new THREE.Mesh(spikeGeom, spikeMat);
    spike.position.set(x, y, z);
    shoeGroup.add(spike);

    // Spike washer ring
    const washerGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.02, 8);
    const washer = new THREE.Mesh(washerGeom, goldAccentMat);
    washer.position.set(x, y + 0.06, z);
    shoeGroup.add(washer);
  });

  shoeGroup.scale.set(1.15, 1.15, 1.15);
  return shoeGroup;
}

// ----------------------------------------------------
// 4. CRICKET BALL MODEL (Four-piece Leather & Stitched Seam)
// ----------------------------------------------------
function buildCricketBall() {
  const ballGroup = new THREE.Group();
  ballGroup.name = "CricketBall";

  const leatherMat = new THREE.MeshStandardMaterial({
    name: "BallLeather",
    color: 0x8b0000, // Rich dark cherry red match cricket ball
    roughness: 0.35,
    metalness: 0.1,
  });

  const seamMat = new THREE.MeshStandardMaterial({
    name: "BallSeam",
    color: 0xffffff, // White linen seam thread
    roughness: 0.8,
  });

  const goldStampMat = new THREE.MeshStandardMaterial({
    name: "BallGoldStamp",
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85,
  });

  // Main leather ball sphere (radius 0.36m scaled)
  const sphereGeom = new THREE.SphereGeometry(0.36, 32, 32);
  const sphereMesh = new THREE.Mesh(sphereGeom, leatherMat);
  sphereMesh.castShadow = true;
  ballGroup.add(sphereMesh);

  // Raised prominent cricket seam running around circumference
  const seamGeom = new THREE.TorusGeometry(0.362, 0.012, 12, 64);
  const seamMesh = new THREE.Mesh(seamGeom, seamMat);
  ballGroup.add(seamMesh);

  // Secondary seam stitch rings (traditional 6-row seam)
  for (const offset of [-0.018, 0.018]) {
    const stitchRingGeom = new THREE.TorusGeometry(0.361, 0.005, 8, 48);
    const stitchRing = new THREE.Mesh(stitchRingGeom, seamMat);
    stitchRing.position.z = offset;
    ballGroup.add(stitchRing);
  }

  // Gold embossed ONE8 Crest stamp on hemisphere
  const stampGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.005, 24);
  const stampMesh = new THREE.Mesh(stampGeom, goldStampMat);
  stampMesh.position.set(0, 0, 0.36);
  stampMesh.rotation.x = Math.PI / 2;
  ballGroup.add(stampMesh);

  ballGroup.scale.set(1.5, 1.5, 1.5);
  return ballGroup;
}

// ----------------------------------------------------
// RUN EXPORTS
// ----------------------------------------------------
async function main() {
  console.log("Generating realistic sports 3D GLB assets in:", outputDir);
  await exportGLB(buildCricketBat(), "cricket_bat.glb");
  await exportGLB(buildCap(), "cap.glb");
  await exportGLB(buildCricketShoe(), "cricket_shoe.glb");
  await exportGLB(buildCricketBall(), "cricket_ball.glb");
  console.log("All sports 3D models generated successfully!");
}

main().catch(console.error);
