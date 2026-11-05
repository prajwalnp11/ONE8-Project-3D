import { useState, useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  useGLTF,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import {
  RotateCcw,
  Sparkles,
  Layers,
  Palette,
  Check,
  ZoomIn,
} from "lucide-react";
import "./ProductLab.css";

const PRESET_COLORWAYS = [
  { id: "stealth", name: "Stealth Black", hex: "#111111" },
  { id: "gold", name: "Virat Onyx Gold", hex: "#d4af37" },
  { id: "cyan", name: "Sonic Cyan", hex: "#00d2d3" },
  { id: "white", name: "Pure White", hex: "#f5f5f2" },
  { id: "crimson", name: "Crimson Strike", hex: "#c0392b" },
  { id: "volt", name: "Cyber Volt", hex: "#cbf717" },
];

const FINISHES = [
  { id: "matte", label: "MATTE", roughness: 0.85, metalness: 0.05 },
  { id: "gloss", label: "HIGH GLOSS", roughness: 0.15, metalness: 0.2 },
  { id: "metallic", label: "METALLIC", roughness: 0.25, metalness: 0.85 },
  { id: "stealth", label: "STEALTH SATIN", roughness: 0.55, metalness: 0.1 },
];

const FOCUS_PRESETS = [
  { id: "all", label: "WHOLE OBJECT", pos: [2.0, 1.0, 2.6], target: [0, 0, 0] },
  { id: "upper", label: "UPPER MESH", pos: [0.8, 1.2, 1.5], target: [0, 0.3, 0] },
  { id: "sole", label: "SOLE & TRACTION", pos: [1.8, -0.6, 1.8], target: [0, -0.2, 0] },
  { id: "crest", label: "ONE8 CREST", pos: [0.2, 0.4, 1.4], target: [0, 0.1, 0.4] },
];

/* ========================================================
   LAB MODEL WITH DYNAMIC MATERIAL PROPERTY MUTATION
   ======================================================== */
function LabDynamicModel({
  modelUrl,
  color,
  finish,
  exploded,
  modelType,
}) {
  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material.clone();
        child.castShadow = true;
        child.receiveShadow = true;

        const name = (mat.name || "").toLowerCase();
        // Modify primary material color and finish
        if (
          name.includes("upper") ||
          name.includes("fabric") ||
          name.includes("phong") ||
          name.includes("lambert") ||
          name.includes("cap") ||
          name.includes("bottle")
        ) {
          mat.color = new THREE.Color(color.hex);
          mat.roughness = finish.roughness;
          mat.metalness = finish.metalness;
        }

        child.material = mat;

        // Exploded layer separation
        if (child.name) {
          const n = child.name.toLowerCase();
          if (exploded) {
            if (n.includes("upper") || n.includes("collar")) {
              child.position.y = 0.4;
            } else if (n.includes("plate") || n.includes("spike")) {
              child.position.y = -0.35;
            }
          } else {
            child.position.y = 0;
          }
        }
      }
    });
  }, [clonedScene, color, finish, exploded]);

  // Model-specific scaling
  const scale =
    modelType === "running_shoe"
      ? 1.85
      : modelType === "cricket_shoe"
      ? 1.15
      : modelType === "tshirt" || modelType === "apparel"
      ? 1.6
      : modelType === "cap"
      ? 1.4
      : 1.1;

  const rot =
    modelType === "running_shoe" || modelType === "cricket_shoe"
      ? [0.15, -Math.PI / 3.2, -0.06]
      : [0, 0, 0];

  return <primitive object={clonedScene} scale={scale} rotation={rot} />;
}

/* ========================================================
   LAB CAMERA CONTROLLER
   ======================================================== */
function LabCameraRig({ activeFocus, controlsRef }) {
  const { camera } = useThree();
  const isTransitioning = useRef(false);
  const targetPos = useRef(new THREE.Vector3(2.0, 1.0, 2.6));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const preset =
      FOCUS_PRESETS.find((f) => f.id === activeFocus) || FOCUS_PRESETS[0];
    targetPos.current.set(...preset.pos);
    targetLook.current.set(...preset.target);
    isTransitioning.current = true;
  }, [activeFocus]);

  useFrame(() => {
    if (isTransitioning.current && controlsRef.current) {
      camera.position.lerp(targetPos.current, 0.08);
      controlsRef.current.target.lerp(targetLook.current, 0.08);
      controlsRef.current.update();

      if (camera.position.distanceTo(targetPos.current) < 0.02) {
        camera.position.copy(targetPos.current);
        isTransitioning.current = false;
      }
    }
  });

  return null;
}

/* ========================================================
   MAIN PRODUCT LAB COMPONENT
   ======================================================== */
export default function ProductLab({
  product,
  initialColor = null,
  onApplyColor = null,
}) {
  const modelType = product?.model_3d_type || "running_shoe";
  const modelUrl =
    product?.model_3d_url ||
    (modelType === "cricket_shoe"
      ? "/models/cricket_shoe.glb"
      : modelType === "apparel"
      ? "/models/tshirt.glb"
      : modelType === "cap"
      ? "/models/cap.glb"
      : modelType === "cricket_bat"
      ? "/models/cricket_bat.glb"
      : modelType === "cricket_ball"
      ? "/models/cricket_ball.glb"
      : modelType === "water_bottle"
      ? "/models/water_bottle.glb"
      : "/models/running_shoe.glb");

  // Verified product colors combined with preset lab palettes
  const availableColors = useMemo(() => {
    if (product?.available_colors && product.available_colors.length > 0) {
      return product.available_colors;
    }
    return PRESET_COLORWAYS;
  }, [product]);

  const [activeColor, setActiveColor] = useState(
    initialColor || availableColors[0] || PRESET_COLORWAYS[0]
  );
  const [activeFinish, setActiveFinish] = useState(FINISHES[0]);
  const [activeFocus, setActiveFocus] = useState("all");
  const [exploded, setExploded] = useState(false);

  const controlsRef = useRef();

  // Reset to original appearance
  const handleReset = () => {
    setActiveColor(availableColors[0] || PRESET_COLORWAYS[0]);
    setActiveFinish(FINISHES[0]);
    setActiveFocus("all");
    setExploded(false);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    if (onApplyColor) {
      onApplyColor(availableColors[0] || PRESET_COLORWAYS[0]);
    }
  };

  const handleColorSelect = (c) => {
    setActiveColor(c);
    if (onApplyColor) {
      onApplyColor(c);
    }
  };

  const isFootwear =
    modelType === "running_shoe" || modelType === "cricket_shoe";

  return (
    <div className="product-lab-container">
      {/* 3D STAGE */}
      <div className="lab-stage-area">
        {/* FOCUS POINT SHORTCUT PILLS */}
        <div className="lab-focus-pills" role="toolbar" aria-label="Camera Focus">
          {FOCUS_PRESETS.map((f) => (
            <button
              key={f.id}
              className={`lab-focus-btn ${activeFocus === f.id ? "is-active" : ""}`}
              onClick={() => setActiveFocus(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 3D CANVAS */}
        <Canvas
          className="lab-canvas"
          camera={{ position: [2.0, 1.0, 2.6], fov: 40 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
          }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight
            position={[6, 9, 6]}
            intensity={2.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={[-6, 4, -5]}
            intensity={1.2}
            color="#dbe4ff"
          />

          <Center>
            <Suspense
              fallback={
                <mesh>
                  <boxGeometry args={[1, 0.4, 0.4]} />
                  <meshStandardMaterial color="#333333" wireframe />
                </mesh>
              }
            >
              <LabDynamicModel
                modelUrl={modelUrl}
                color={activeColor}
                finish={activeFinish}
                exploded={exploded}
                modelType={modelType}
              />
            </Suspense>
          </Center>

          <ContactShadows
            position={[0, -1.15, 0]}
            opacity={0.7}
            scale={7}
            blur={1.8}
            far={3.5}
          />

          <LabCameraRig
            activeFocus={activeFocus}
            controlsRef={controlsRef}
          />

          <OrbitControls
            ref={controlsRef}
            autoRotate={false}
            enableZoom={true}
            enablePan={true}
            enableDamping={true}
            dampingFactor={0.08}
            minDistance={1.2}
            maxDistance={6.0}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.75}
          />
        </Canvas>

        <div className="lab-stage-hint">
          DRAG TO ROTATE 360° · SCROLL TO ZOOM MATERIAL TEXTURES
        </div>
      </div>

      {/* CUSTOMIZATION CONTROLS SIDEBAR */}
      <aside className="lab-sidebar">
        <header className="lab-header">
          <div className="lab-header-eyebrow">
            <Sparkles size={13} />
            <span>ONE8 3D OBJECT LAB</span>
          </div>
          <h3>{product.name}</h3>
        </header>

        {/* COLOR SELECTION */}
        <section className="lab-section">
          <div className="lab-section-title">
            <span>COLORWAY STUDIO</span>
            <span className="lab-section-subtitle">{activeColor.name}</span>
          </div>

          <div className="lab-swatches-grid">
            {availableColors.map((color, idx) => (
              <button
                key={idx}
                className={`lab-swatch-card ${
                  activeColor.name === color.name ? "is-active" : ""
                }`}
                onClick={() => handleColorSelect(color)}
                title={color.name}
              >
                <span
                  className="lab-swatch-preview"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="lab-swatch-name">{color.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* MATERIAL FINISH */}
        <section className="lab-section">
          <div className="lab-section-title">
            <span>MATERIAL FINISH</span>
            <span className="lab-section-subtitle">{activeFinish.label}</span>
          </div>

          <div className="lab-finish-grid">
            {FINISHES.map((f) => (
              <button
                key={f.id}
                className={`lab-finish-btn ${
                  activeFinish.id === f.id ? "is-active" : ""
                }`}
                onClick={() => setActiveFinish(f)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* ANATOMY EXPLODED VIEW (FOR FOOTWEAR) */}
        {isFootwear && (
          <section className="lab-section">
            <div className="lab-section-title">
              <span>EXPLODED ANATOMY</span>
              <span className="lab-section-subtitle">
                {exploded ? "LAYER SEPARATION ACTIVE" : "ASSEMBLED"}
              </span>
            </div>

            <button
              className={`lab-finish-btn ${exploded ? "is-active" : ""}`}
              onClick={() => setExploded(!exploded)}
              style={{ width: "100%" }}
            >
              <Layers size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />
              {exploded ? "ASSEMBLE COMPONENT LAYERS" : "EXPLODE SOLE & UPPER LAYERS"}
            </button>
          </section>
        )}

        {/* RESET ACTION */}
        <div className="lab-actions">
          <button className="lab-btn-reset" onClick={handleReset}>
            <RotateCcw size={13} />
            RESET TO FACTORY SPEC
          </button>
        </div>
      </aside>
    </div>
  );
}
