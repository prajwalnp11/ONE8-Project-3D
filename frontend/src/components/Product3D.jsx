import { Suspense, useMemo, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  ContactShadows,
  useGLTF,
  Center,
} from "@react-three/drei";
import * as THREE from "three";

/* ========================================================
   ONE8 REALISTIC 3D RUNNING SNEAKER (Hero & 3D Lab)
   Production-quality GLB loaded via useGLTF
   ======================================================== */
function SneakerModel({ color = "#171717", exploded = false }) {
  const { scene } = useGLTF("/models/running_shoe.glb");
  const modelRef = useRef();

  // Clone scene so material customizations don't mutate the cached GLTF
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Apply dynamic colorway to upper/main materials
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const mat = child.material.clone();
          if (color) {
            mat.color = new THREE.Color(color);
          }
          child.material = mat;
        }
      }
    });
  }, [clonedScene, color]);

  // Exploded anatomy effect
  const explodeOffset = exploded ? 0.35 : 0;

  return (
    <group ref={modelRef} position={[0, explodeOffset, 0]}>
      <primitive
        object={clonedScene}
        scale={1.85}
        rotation={[0.18, -Math.PI / 3.2, -0.08]}
      />
    </group>
  );
}

useGLTF.preload("/models/running_shoe.glb");

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.4, 0.4]} />
      <meshStandardMaterial color="#333333" wireframe />
    </mesh>
  );
}

export default function Product3D({
  color = "#171717",
  exploded = false,
  autoRotate = true,
  enableZoom = false,
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4.2], fov: 42 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
      }}
    >
      {/* Studio Lighting Rig */}
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-5, 4, -4]}
        intensity={1.2}
        color="#e0e8ff"
      />
      <spotLight
        position={[0, 6, 2]}
        intensity={1.6}
        angle={0.6}
        penumbra={0.8}
      />

      <Float
        speed={1.4}
        rotationIntensity={0.15}
        floatIntensity={0.28}
      >
        <Center>
          <Suspense fallback={<Loader />}>
            <SneakerModel color={color} exploded={exploded} />
          </Suspense>
        </Center>
      </Float>

      {/* Realistic Soft Contact Shadow on Ground Floor */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.65}
        scale={6}
        blur={1.8}
        far={3}
      />

      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={1.4}
        enableZoom={enableZoom}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}
