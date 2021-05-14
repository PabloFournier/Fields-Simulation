import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Vector3, Quaternion } from "three";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

// Here I import the classes and components from other files
import * as Sim from "./simulation.js";
import TopMenu from "./TopMenu";
import SidePanel from "./SidePanel.js";
import Particle from "./Particle";
import FieldArrows from "./FieldArrows";
import SelectionArrows from "./SelectionArrows";
import useMutableState from "./useMutableState";

// This component is the only one that doesn't actually return anything:
// instead it only uses the useFrame hook to run a callback function every
// frame of the render.
// Here it moves the camera to the position it recieves as an argument and has
// it look at the focus (the center of the simulation).
function OrbitControls(props) {
  useFrame(({ camera }) => {
    camera.position.set(...props.cameraPos);
    camera.lookAt(...props.focus);
  })
  return null
}

// This is the main function, the one rendered in the index.js file.
function App() {

  const [cameraPos, setPos] = useMutableState([0,0,5]);
  const [focus, setFocus] = useState([0,0,0]);
  const [mouse, setMouse] = useMutableState(false);
  const [orbit, setOrbit] = useMutableState(true); // Whether to allow camera movement or not
  const [movingArrow, setMovingArrow] = useMutableState(null);
  const [originalPos, setOriginalPos] = useMutableState(new Vector3());
  const [particleNumber, setParticleNumber] = useMutableState(0);
  const [fieldArrowMode, setFieldArrowMode] = useState("N");
  const [selected, setSelected] = useMutableState(null);
  const canvas = useRef();
  const [scene, setScene] = useMutableState(new Sim.Scene([]));

  // React re-renders components when their arguments or state change, but if they're
  // just references instead of values, it can't keep track of them as well.
  // This function forces an update by changing the the dummy variable.
  const [forceUpdateDummy, setForceUpdateDummy] = useMutableState(false);
  function forceUpdate() {
    setForceUpdateDummy(!forceUpdateDummy.current);
  }

  // This adds a particle to the center of the simulation, with 0 mass and charge.
  function addParticle() {
    let particle = new Sim.Particle(
      particleNumber.current,
      new Vector3(...focus),
      new Quaternion(),
      new Vector3(1,1,1),
      null,
      scene.current,
      0,
      0
    );
    particle.onClick = () => Select(particle);
    setParticleNumber(particleNumber.current+1);
  }

  // These calls use the useEffect hook in a slightly unintended way.
  // The useEffect hook is typically used to allow function components to have side effects
  // with callback functions, but here I take advantage of how they can be called
  // only when a value in their dependency array changes (the second argument).
  // The dependency arrays are all empty, so the callback functions are called only
  // once when the component is instanced for the first time and not again.
  // This is useful so that I can add event listeners to the HTML elements just once.
  useEffect(() => canvas.current.addEventListener('mousemove', handleMouseMove), []);
  useEffect(() => canvas.current.addEventListener('mousedown', () => setMouse(true)), []);
  useEffect(() => canvas.current.addEventListener('mouseup', handleMouseUp), []);
  useEffect(() => canvas.current.addEventListener('wheel', event => handleScroll(event, 0.9)), []);
  useEffect(() => canvas.current.addEventListener('mouseleave', () => setMouse(false)), []);

  // This function handles the scroll wheel. It zooms in or out a fraction of
  // the camera's distance to the center, rather than a fixed amount.
  // Zooming in when already very zoomed in is very slow, and zooming
  // out when already zoomed out is very fast. The user should experiance less
  // issues with sensitivity being too high or low, as it is adaptive.
  function handleScroll(event, speed) {
    let rel =
     [focus[0] - cameraPos.current[0],
      focus[1] - cameraPos.current[1],
      focus[2] - cameraPos.current[2]];
    let newRel = rel.map(x => x*(speed*(event.deltaY/1000)));
    newRel =
     [cameraPos.current[0]+newRel[0],
     cameraPos.current[1]+newRel[1],
     cameraPos.current[2]+newRel[2]];
    // This check prevents users from zooming out so far in or out that
    // scene is no longer in the cameras view frustum.
    if (newRel[0]**2 + newRel[1]**2 + newRel[2]**2 > 0.05 &&
        newRel[0]**2 + newRel[1]**2 + newRel[2]**2 < 900) {
      setPos(newRel);
    }
  }

  // This function handles mouse clicks away from the selection arrows, mostly.
  // The main point of interest is the check to see if the shift key was pressed,
  // and if so return the selected object to it's original position.
  function handleMouseUp(event) {
    setMouse(false);
    if (movingArrow.current) {
      if (event.shiftKey) {
        selected.current.position.copy(originalPos.current);
      }
      originalPos.current.set(0,0,0);
      setMovingArrow(null);
    }
  }

  // These vectors are here to help orient the camera.
  // The up vector is constant and simply defines the up direction to be the y axis
  // for the purposes of this program.
  // It could have just as easily been in the z direction.
  // The side vector is recalculated every time the camera is moved and represents a direction
  // perpendicular to both up and the direction the camera is looking.
  // The camera is then rotated around the center of the simulation using these as
  // its axes of rotation.
  const up = new Vector3(0,1,0);
  const side = new Vector3(1,0,0);

  function handleMouseMove(event) {
    if (mouse.current && orbit.current && !movingArrow.current) {
      // This block of code deals with the camera movement if the mouse is down and
      // no selection arrow is selected.
      // newPos is the vector from the camera to the center of the simulation.
      let newPos = new Vector3(cameraPos.current[0]-focus[0],
                               cameraPos.current[1]-focus[1],
                               cameraPos.current[2]-focus[2]);
      // side is recalculated here.
      side.crossVectors(up, newPos);
      side.normalize();
      // And here newPos is rotated around the two axes proportional to the mouse's movement.
      newPos.applyAxisAngle(up, event.movementX / -300);
      newPos.applyAxisAngle(side, event.movementY / -300);
      // Then the newPos and focus vectors are added together to find the new position of the camera,
      // and pos is set to the result.
      newPos = newPos.toArray();
      newPos = [newPos[0]+focus[0], newPos[1]+focus[1], newPos[2]+focus[2]];
      setPos(newPos);
    } else if (movingArrow.current) {
      // This block of code deals with the selected object's movement when a selection
      // arrow is selected.
      // The if statements inside the switch statement are neccessary because the
      // selected object's movement can be viewed from the front or behind, and in order
      // for it to follow the mouse in both cases there needs to be a check.

      // Front:
      // ^
      // |
      // O -->
      // mouse movement matches arrow direction
      //
      // Back:
      //       ^
      //      |
      //  <-- O
      // mouse movement goes against arrow direction

      switch (movingArrow.current) {
        case 'X':
        if (focus[2]>cameraPos.current[2]) {
          selected.current.position.add(new Vector3(event.movementX / -300, 0, 0));
        } else {
          selected.current.position.add(new Vector3(event.movementX / 300, 0, 0));
        }
        break;
        case 'Y':
          selected.current.position.add(new Vector3(0, event.movementY / -300, 0));
          break;
        case 'Z':
          if (focus[0]>cameraPos.current[0]) {
            selected.current.position.add(new Vector3(0, 0, event.movementX / 300));
          } else {
            selected.current.position.add(new Vector3(0, 0, event.movementX / -300));
          }
      }
      forceUpdate();
    }
  }

  // This function is passed as a callback function to the particles to allow them
  // to select themselves when clicked.
  // There are a few checks to prevent it from accessing the selected object's
  // attributes when there is no selected object.
  function Select(object) {
    if (!movingArrow.current) {
      if (selected.current) {
        selected.current.selected=false;
      }
      if (object === selected.current) {
        setSelected(null);
      } else {
        object.selected=true;
        setSelected(object);
      }
    }
  }

  // A simple function (again a callback) to select a selection arrow.
  function selectArrow(axis) {
    if (!movingArrow.current) {
      originalPos.current.copy(selected.current.position);
      setMovingArrow(axis);
    }
  }

  // This callback function may seem useless but the program doesn't actually work without
  // this so ¯\_(ツ)_/¯
  function _setFieldArrowMode(mode) {
    setFieldArrowMode(mode);
  }

  // These variables could have been put directly in the return value but were taken out
  // to make a little more space. cameraZoom is proportional to the distance from the camera
  // to the center of the simulation.
  // arrows is the component SelectedArrows, or null if nothing is selected.
  const cameraZoom=(new Vector3(...cameraPos.current.map((x, i) => x-focus[i]))).length()*0.1;
  const arrows = selected.current ? (<SelectionArrows
    position = {selected.current.position ? selected.current.position : new Vector3()}
    scale={cameraZoom}
    movingArrow={movingArrow.current}
    selectArrow={axis => selectArrow(axis)}/>) : null;

  return (
    <div style={{display:'flex', flexDirection:'column', height:"100%"}}>
      {/* These divs uses the height attribute and flexbox feature of css to fill the screen space */}
      <div ref={canvas} style={{flex:1}} id="canvas">
        <Canvas>
          <OrbitControls cameraPos = {cameraPos.current} focus={focus}/>
          <ambientLight intensity={0.5} />
          <pointLight position={[-10, 10, -10]} />
          {arrows}
          {/* Lists of components can be rendered, and here I take advantage of that to render all the particles at once */}
          {scene.current.particles.map(particle => (<Particle {...particle}/>))}
          <FieldArrows scene={scene.current} cameraZoom={cameraZoom} fieldArrowMode={fieldArrowMode}/>
        </Canvas>
      </div>
      <TopMenu addParticle={addParticle} setFieldArrowMode={mode => _setFieldArrowMode(mode)}/>
      {/* "Fab" actually stands for "Floating Action Button", and is the round plus in the bottom left
        of the UI. It simply adds a particle to the simulation. */}
      <Fab onClick={addParticle} style={{background:"skyblue",position:"absolute", bottom:"20px", left:"20px"}}>
        <AddIcon />
      </Fab>
      {selected.current ? <SidePanel deselect={() => {setSelected(null)}}
        selection={selected.current}
        forceCanvasUpdate={forceUpdate} /> : null}
    </div>
  )
}

export default App;
