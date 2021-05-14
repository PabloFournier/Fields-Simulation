import { useState } from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem} from "@material-ui/core";
import "typeface-roboto";

export default function TopMenu(props) {
  const [fieldArrowMode, setFieldArrowMode] = useState("N");
  return (
    <AppBar position="absolute">
      <Toolbar>
        <Typography variant="h5" style={{margin:"10px"}}>
          Simulation
        </Typography>
        {/* This is the dropdown that allows the user to
          change which field the field arrows follow.
          The reason why two setFieldArrowMode functions are called
          when it changes is because one changes the state in this component,
          and the other is a callback function to change the state in the App
          component. */}
        <Select style={{
              padding:"6px",
              background:"royalblue",
              color:"white"}}
            value={fieldArrowMode}
            onChange={event => {
              setFieldArrowMode(event.target.value);
              props.setFieldArrowMode(event.target.value)
            }}>
          <MenuItem value={"G"}>Gravitational Field</MenuItem>
          <MenuItem value={"E"}>Electric Field</MenuItem>
          <MenuItem value={"N"}>No Field Arrows</MenuItem>
        </Select>
      </Toolbar>
    </AppBar>
  )
}
