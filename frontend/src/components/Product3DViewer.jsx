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
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Eye,
  Layers,
  Sparkles,
} from "lucide-react";
import "./Product3DViewer.css";

// Preload common models
try {
  useGLTF.preload("/models/running_shoe.glb");
  useGLTF.preload("/models/cricket_shoe.glb");
  useGLTF.preload("/models/tshirt.glb");
  useGLTF.preload("/models/cap.glb");
  useGLTF.preload("/models/cricket_bat.glb");
  useGLTF.preload("/models/cricket_ball.glb");
  useGLTF.preload("/models/water_bottle.glb");
} catch {
  // Preload is optional
}

/* ========================================================
   MODEL SPECIFIC PRESETS & CONFIGURATIONS
   ======================================================== */
const MODEL_CONFIGS = {
  running_shoe: {
    url: "/models/running_shoe.glb",
    scale: 1.85,
    rotation: [0.15, -Math.PI / 3.2, -0.06],
    cameraPos: [2.0, 1.0, 2.6],
    label: "ATHLETIC RUNNING SNEAKER",
  },
  cricket_shoe: {
    url: "/models/cricket_shoe.glb",
    scale: 1.15,
    rotation: [0.15, -Math.PI / 3.2, -0.06],
    cameraPos: [2.0, 1.1, 2.6],
    label: "CRICKET SPIKE FOOTWEAR",
  },
  apparel: {
    url: "/models/tshirt.glb",
    scale: 1.6,
    rotation: [0, 0, 0],
    cameraPos: [0, 0.4, 2.8],
    label: "TECHNICAL APPAREL",
  },
  cap: {
    url: "/models/cap.glb",
    scale: 1.4,
    rotation: [0.2, -Math.PI / 4, 0],
    cameraPos: [1.8, 1.2, 2.4],
    label: "PERFORMANCE CAP",
  },
  cricket_bat: {
    url: "/models/cricket_bat.glb",
    scale: 1.0,
    rotation: [0, -Math.PI / 4, -0.2],
    cameraPos: [1.4, 0.6, 2.8],
    label: "GRADE 1+ ENGLISH WILLOW",
  },
  cricket_ball: {
    url: "/models/cricket_ball.glb",
    scale: 1.35,
    rotation: [0.2, 0.4, 0.1],
    cameraPos: [0, 0.3, 2.2],
    label: "LEATHER MATCH BALL",
  },
  water_bottle: {
    url: "/models/water_bottle.glb",
    scale: 1.15,
    rotation: [0, 0, 0],
    cameraPos: [1.2, 0.8, 2.4],
    label: "PRO HYDRATION FLASK",
  },
};

/* ========================================================
   DYNAMIC GLB LOADER COMPONENT
   ======================================================== */
function DynamicModel({
  modelUrl,
  config,
  color,
  wireframe = false,
  exploded = false,
}) {
  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const mat = child.material.clone();
          mat.wireframe = wireframe;

          // Apply color customizer if applicable
          if (color) {
            // Apply color to upper, fabric, or main body
            const matName = (mat.name || "").toLowerCase();
            if (
              matName.includes("upper") ||
              matName.includes("fabric") ||
              matName.includes("phong") ||
              matName.includes("lambert") ||
              matName.includes("cap") ||
              matName.includes("bottle")
            ) {
              mat.color = new THREE.Color(color);
            }
          }
          child.material = mat;
        }

        // Exploded View Layer Separation (for multi-part models like cricket shoe)
        if (child.name) {
          const n = child.name.toLowerCase();
          if (exploded) {
            if (n.includes("upper") || n.includes("collar")) {
              child.position.y = 0.35;
            } else if (n.includes("plate") || n.includes("spike")) {
              child.position.y = -0.32;
            }
          } else {
            child.position.y = 0;
          }
        }
      }
    });
  }, [clonedScene, color, wireframe, exploded]);

  return (
    <primitive
      object={clonedScene}
      scale={config.scale}
      rotation={config.rotation}
    />
  );
}

/* ========================================================
   CAMERA CONTROLLER WITH SMOOTH ANGLE TRANSITIONS
   ======================================================== */
function CameraRig({ viewAngle, controlsRef, defaultPos }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(...defaultPos));
  const isTransitioning = useRef(false);

  useEffect(() => {
    const dist = 3.2;
    let pos = [...defaultPos];

    switch (viewAngle) {
      case "front":
        pos = [0, 0.1, dist];
        break;
      case "back":
        pos = [0, 0.1, -dist];
        break;
      case "left":
        pos = [-dist, 0.2, 0];
        break;
      case "right":
        pos = [dist, 0.2, 0];
        break;
      case "top":
        pos = [0, dist, 0.01];
        break;
      case "bottom":
        pos = [0, -dist, 0.01];
        break;
      case "default":
      default:
        pos = defaultPos;
        break;
    }

    targetPos.current.set(pos[0], pos[1], pos[2]);
    isTransitioning.current = true;
  }, [viewAngle, defaultPos]);

  useFrame(() => {
    if (isTransitioning.current && controlsRef.current) {
      camera.position.lerp(targetPos.current, 0.08);
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.08);
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
   MAIN PRODUCT 3D VIEWER COMPONENT
   ======================================================== */
export default function Product3DViewer({
  product,
  selectedColor = null,
  onClose = null,
}) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewAngle, setViewAngle] = useState("default");
  const [hasError, setHasError] = useState(false);

  const controlsRef = useRef();
  const wrapperRef = useRef();

  // Resolve 3D model config
  const modelType = product?.model_3d_type || "running_shoe";
  const config = MODEL_CONFIGS[modelType] || MODEL_CONFIGS.running_shoe;
  const modelUrl = product?.model_3d_url || config.url;

  // Toggle Fullscreen Mode
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Reset Camera View
  const handleResetCamera = () => {
    setViewAngle("default");
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const isFootwear =
    modelType === "running_shoe" || modelType === "cricket_shoe";

  if (hasError) {
    return (
      <div className="viewer-3d-wrapper">
        <div className="viewer-error-box">
          <h4>3D MODEL PREVIEW</h4>
          <p>
            Detailed 3D geometry for this item is being optimized for web delivery.
            Inspect the high-resolution photo gallery or 360° turntable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`viewer-3d-wrapper ${isFullscreen ? "is-fullscreen" : ""}`}
    >
      {/* FLOATING HEADER BADGE */}
      <div className="viewer-header-badge">
        <span className="viewer-pulse-dot" />
        <span>{config.label} · 3D REAL-TIME STUDIO</span>
      </div>

      {/* CAMERA ANGLE PRESETS */}
      <div className="viewer-angles-bar" role="toolbar" aria-label="Camera angles">
        {["default", "front", "back", "left", "right", "top"].map((angle) => (
          <button
            key={angle}
            className={`angle-btn ${viewAngle === angle ? "is-active" : ""}`}
            onClick={() => setViewAngle(angle)}
            title={`View from ${angle}`}
          >
            {angle.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 3D CANVAS STAGE */}
      <Canvas
        className="viewer-canvas"
        camera={{ position: config.cameraPos, fov: 40 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
      >
        {/* Studio Lighting Rig */}
        <ambientLight intensity={1.4} />
        <directionalLight
          position={[6, 9, 6]}
          intensity={2.6}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-6, 4, -5]}
          intensity={1.2}
          color="#dbe4ff"
        />
        <directionalLight
          position={[0, -3, 3]}
          intensity={0.4}
          color="#ffffff"
        />

        <Center>
          <Suspense
            fallback={
              <mesh>
                <boxGeometry args={[1, 0.4, 0.4]} />
                <meshStandardMaterial color="#444444" wireframe />
              </mesh>
            }
          >
            <DynamicModel
              modelUrl={modelUrl}
              config={config}
              color={selectedColor?.hex || null}
              wireframe={wireframe}
              exploded={exploded}
            />
          </Suspense>
        </Center>

        {/* Soft Realistic Contact Shadow */}
        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.7}
          scale={7}
          blur={1.8}
          far={3.5}
        />

        {/* Camera Rig & OrbitControls */}
        <CameraRig
          viewAngle={viewAngle}
          controlsRef={controlsRef}
          defaultPos={config.cameraPos}
        />

        <OrbitControls
          ref={controlsRef}
          autoRotate={autoRotate}
          autoRotateSpeed={1.4}
          enableZoom={true}
          enablePan={true}
          enableDamping={true}
          dampingFactor={0.08}
          minDistance={1.4}
          maxDistance={7.0}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.75}
        />
      </Canvas>

      {/* HELPER HINT */}
      <div className="viewer-hint">
        DRAG TO ROTATE · SCROLL / PINCH TO ZOOM · RIGHT-CLICK TO PAN
      </div>

      {/* BOTTOM FLOATING TOOLBAR */}
      <div className="viewer-toolbar" role="toolbar" aria-label="3D Controls">
        <button
          className={`viewer-btn ${autoRotate ? "is-active" : ""}`}
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? "Pause auto-rotation" : "Start auto-rotation"}
        >
          {autoRotate ? <Pause size={13} /> : <Play size={13} />}
          <span>{autoRotate ? "PAUSE" : "AUTO-SPIN"}</span>
        </button>

        <div className="viewer-divider" />

        <button
          className="viewer-btn"
          onClick={handleResetCamera}
          title="Reset camera to default view"
        >
          <RotateCcw size={13} />
          <span>RESET</span>
        </button>

        {isFootwear && (
          <>
            <div className="viewer-divider" />
            <button
              className={`viewer-btn ${exploded ? "is-active" : ""}`}
              onClick={() => setExploded(!exploded)}
              title="Toggle exploded anatomy"
            >
              <Layers size={13} />
              <span>{exploded ? "ASSEMBLE" : "EXPLODE"}</span>
            </button>
          </>
        )}

        <div className="viewer-divider" />

        <button
          className={`viewer-btn ${wireframe ? "is-active" : ""}`}
          onClick={() => setWireframe(!wireframe)}
          title="Toggle wireframe topology"
        >
          <Eye size={13} />
          <span>{wireframe ? "SHADED" : "WIREFRAME"}</span>
        </button>

        <div className="viewer-divider" />

        <button
          className={`viewer-btn ${isFullscreen ? "is-active" : ""}`}
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          <span>{isFullscreen ? "MINIMIZE" : "FULLSCREEN"}</span>
        </button>
      </div>
    </div>
  );
}
