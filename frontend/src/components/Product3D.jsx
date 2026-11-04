import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

/* ========================================================
   ONE8 EDITORIAL 3D SNEAKER (Homepage Hero & 3D Lab)
   Clean, minimal, luxury black-and-white visual identity
   ======================================================== */
function Sneaker({ color = "#171717", exploded = false }) {
  const geometries = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(-1.35, -0.22);
    shape.lineTo(0.95, -0.22);
    shape.quadraticCurveTo(1.5, -0.18, 1.48, 0.12);
    shape.quadraticCurveTo(1.4, 0.28, 1.05, 0.3);
    shape.lineTo(0.25, 0.32);
    shape.quadraticCurveTo(0, 0.4, -0.2, 0.68);
    shape.quadraticCurveTo(-0.45, 0.88, -0.8, 0.78);
    shape.lineTo(-1.05, 0.65);
    shape.quadraticCurveTo(-1.2, 0.5, -1.12, 0.25);
    shape.lineTo(-1.35, 0.12);
    shape.quadraticCurveTo(-1.48, -0.02, -1.35, -0.22);

    const upper = new THREE.ExtrudeGeometry(shape, {
      depth: 0.44,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.045,
      bevelThickness: 0.045,
      curveSegments: 12,
    });

    const sole = new THREE.BoxGeometry(2.82, 0.18, 0.55);
    const midsole = new THREE.BoxGeometry(2.76, 0.14, 0.52);
    const stripe = new THREE.BoxGeometry(0.07, 0.46, 0.025);

    return { upper, sole, midsole, stripe };
  }, []);

  const upperY = exploded ? 0.45 : 0;
  const midsoleY = exploded ? -0.28 : -0.24;
  const soleY = exploded ? -0.65 : -0.34;

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.12}
      floatIntensity={0.25}
    >
      <group rotation={[0.15, -0.35, -0.12]} scale={1.12}>
        {/* Shoe upper */}
        <mesh
          geometry={geometries.upper}
          position={[0, upperY, -0.22]}
          castShadow
        >
          <meshStandardMaterial
            color={color}
            roughness={0.58}
            metalness={0.06}
          />
        </mesh>

        {/* Midsole Cushioning */}
        <mesh
          geometry={geometries.midsole}
          position={[0, midsoleY, 0]}
          castShadow
        >
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.7}
          />
        </mesh>

        {/* White sole */}
        <mesh
          geometry={geometries.sole}
          position={[0, soleY, 0]}
          castShadow
        >
          <meshStandardMaterial
            color="#eeeeeb"
            roughness={0.85}
          />
        </mesh>

        {/* Three minimal white racing stripes */}
        {[-0.25, 0, 0.25].map((x) => (
          <mesh
            key={x}
            geometry={geometries.stripe}
            position={[x, upperY + 0.08, 0.245]}
            rotation={[0, 0, -0.45]}
          >
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export default function Product3D({
  color = "#171717",
  exploded = false,
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      dpr={[1, 1.25]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
      }}
    >
      <ambientLight intensity={1.4} />

      <directionalLight
        position={[4, 5, 5]}
        intensity={2.2}
        castShadow
      />

      <directionalLight
        position={[-4, 2, -3]}
        intensity={0.8}
      />

      <Sneaker color={color} exploded={exploded} />

      <OrbitControls
        autoRotate
        autoRotateSpeed={1.2}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
