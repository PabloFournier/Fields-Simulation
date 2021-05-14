import { useRef, useEffect } from "react";
import { Mesh, MeshStandardMaterial, SphereBufferGeometry } from "three";

export default function Particle(props) {
  const mesh = useRef();

  // This side effect updates the position of the model when the position
  // argument changes.
  useEffect(() => {mesh.current.position.copy(props.position)},
    [props.position.x, props.position.y, props.position.z]);

  return (
    <mesh
    position={props.position ? props.position : [0,0,0]}
    scale={props.scale ? props.scale : [1,1,1]}
    onClick={props.onClick}
    ref={mesh}>
      <sphereBufferGeometry args={[0.5]} />
      <meshStandardMaterial color={props.selected ? "gray" : "green"} />
    </mesh>
  )
}
