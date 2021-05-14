import Arrow from "./Arrow";
import { Euler } from "three";
import { useEffect, useRef } from "react";

export default function SelectionArrows(props) {
  const materialZ = useRef(null);
  const materialX = useRef(null);
  const materialY = useRef(null);

  // This side effect changes the colour of the selected arrow to yellow
  // when a new arrow is selected.
  useEffect(() => {
    switch (props.movingArrow) {
      case 'X':
        materialX.current.color.set('yellow');
        materialY.current.color.set('green');
        materialZ.current.color.set('blue');
        break;
      case 'Y':
        materialX.current.color.set('red');
        materialY.current.color.set('yellow');
        materialZ.current.color.set('blue');
        break;
      case 'Z':
        materialX.current.color.set('red');
        materialY.current.color.set('green');
        materialZ.current.color.set('yellow');
        break;
      default:
        materialX.current.color.set('red');
        materialY.current.color.set('green');
        materialZ.current.color.set('blue');
    }
  }, [props.movingArrow]);

  return (
    <group>
      <Arrow
      color={props.movingArrow === 'X' ? 'yellow' : 'red'}
      scale={props.scale ? props.scale : 0.5}
      rotation={new Euler(0,0,Math.PI/2)}
      position={props.position}
      onClick={() => props.selectArrow('X')}
      meshMaterial={materialX}/>
      <Arrow
      hidden={props.mode2D}
      color= {props.movingArrow === 'Y' ? 'yellow' : 'green'}
      scale={props.scale ? props.scale : 0.5}
      rotation={new Euler(0,0,Math.PI)}
      position={props.position}
      onClick={() => props.selectArrow('Y')}
      meshMaterial={materialY}/>
      <Arrow
      color={props.movingArrow === 'Z' ? 'yellow' : 'blue'}
      scale={props.scale ? props.scale : 0.5}
      rotation={new Euler(-Math.PI/2,0,0)}
      position={props.position}
      onClick={() => props.selectArrow('Z')}
      meshMaterial={materialZ}/>
    </group>
  )
}
