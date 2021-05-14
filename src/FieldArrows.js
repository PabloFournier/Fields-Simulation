import { Vector3, Quaternion, Euler } from "three";
import Arrow from "./Arrow";

export default function FieldArrows(props) {
  // sideLength represents how many arrows there should be on each edge of the 3D grid.
  // With 6 on each edge, that makes 216.
  const sideLength = 6;
  // These two variables represent the maximum and minimum size thqt the field arrows
  // can reach.
  const [max, min] = [0.4, 0];
  // This Array will hold all the Arrow components.
  const arrows = [];
  for (var x = 0; x < sideLength; x++) {
    for (var y = 0; y < sideLength; y++) {
      for (var z = 0; z < sideLength; z++) {
        let pos = new Vector3(x-sideLength/2+0.5, y-sideLength/2+0.5, z-sideLength/2+0.5);
        pos.multiplyScalar(3);
        let field = new Vector3();
        let fieldMagnitude = 0;
        // This switch sets field and fieldMagnitude to the field strength and
        // magnitude for either the gravitational field or the electric field.
        switch (props.fieldArrowMode) {
          case "G":
            field = props.scene.CalculateTotalGravField(pos);
            fieldMagnitude = Math.max(Math.min(field.length()*100000000000, max), min);
            break;
          case "E":
            field = props.scene.CalculateTotalElecField(pos);
            fieldMagnitude = Math.max(Math.min(field.length()/1000000000, max), min);
            break;
        }
        // This section calculates what rotation the arrow should have.
        field.normalize();
        let rotationQ = new Quaternion();
        rotationQ.setFromUnitVectors(new Vector3(0,-1,0), field);
        let rotation = new Euler();
        rotation.setFromQuaternion(rotationQ);
        arrows.push(<Arrow
          key={`${x} ${y} ${z}`}
          position={pos}
          scale={props.cameraZoom*fieldMagnitude}
          rotation={rotation}
          color="darkblue"/>);
      }
    }
  }
  return arrows
}
