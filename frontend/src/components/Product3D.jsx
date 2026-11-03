
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

function Sneaker() {
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
      depth: 0.42,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.045,
      bevelThickness: 0.045,
      curveSegments: 8,
    });

    const sole = new THREE.BoxGeometry(2.8, 0.18, 0.53);
    const stripe = new THREE.BoxGeometry(0.07, 0.45, 0.025);

    return { upper, sole, stripe };
  }, []);

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.12}
      floatIntensity={0.25}
    >
      <group rotation={[0.15, -0.35, -0.12]} scale={1.15}>
        {/* Shoe upper */}
        <mesh
          geometry={geometries.upper}
          position={[0, 0, -0.21]}
        >
          <meshStandardMaterial
            color="#171717"
            roughness={0.55}
            metalness={0.05}
          />
        </mesh>

        {/* White sole */}
        <mesh
          geometry={geometries.sole}
          position={[0, -0.34, 0]}
        >
          <meshStandardMaterial
            color="#eeeeeb"
            roughness={0.8}
          />
        </mesh>

        {/* Three side stripes */}
        {[-0.25, 0, 0.25].map((x) => (
          <mesh
            key={x}
            geometry={geometries.stripe}
            position={[x, 0.08, 0.245]}
            rotation={[0, 0, -0.45]}
          >
            <meshStandardMaterial color="white" />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export default function Product3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      dpr={[1, 1.25]}
      
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
      }}
    >
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[4, 5, 5]}
        intensity={2}
      />

      <Sneaker />

      <OrbitControls
  autoRotate={true}
  autoRotateSpeed={1.2}
  enableZoom={false}
  enablePan={false}
  enableDamping={true}
  minPolarAngle={Math.PI / 3}
  maxPolarAngle={Math.PI / 1.8}
/>
    </Canvas>
  );
}
