import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Typography,
  Button } from '@material-ui/core';
import "typeface-roboto";
import { makeStyles } from "@material-ui/core/styles"
import useMutableState from "./useMutableState";

// This is an example of a higher order function: makeStyles returns a custom hook
// that allows me to use the css classes defined here in my React components.
const useStyles = makeStyles({
  title: {
    background:"dodgerblue",
    color:"white",
    padding:"10px"
  },
  removeBtn: {
    background:"red",
    color: "white",
    '&:hover': {
      backgroundColor: 'darkred',
    }
  }
});

// JavaScript's parseFloat didn't serve my purposes to check if a string
// could be parsed as a float or not, so I wrote this quick function
// using RegEx to do so.
function isFloat(value) {
  return value.match(/^-?[0-9]*\.?[0-9]*$/) !== null
}

export default function SidePanel(props) {
  // This is the same function as in App: it forces an update by
  // changing the dummy variable.
  const [forceUpdateDummy, setForceUpdateDummy] = useMutableState(false);
  function forceUpdate() {
    setForceUpdateDummy(!forceUpdateDummy.current);
  }

  // Calling that custom hook from earlier.
  const classes = useStyles();

  // Here the GetInspectorInfo method of the selected object is called.
  // It returns an object with getters and setters of the values which
  // the object would like to display.
  // The format of this info is as follows:
  // data is an object with two attributes, vectors and scalars.
  // - vectors is an object where its attribute names are the names
  //   that should be displayed, and the value of said attributes
  //   are reference to the corresponding vectors.
  // - scalars is an object where its attribute names are the names
  //   that should be displayed, and the value of said attributes
  //   are objects with a get and set attribute which correspond
  //   to the getter and setter functions of the attribute.
  const data = useRef(props.selection.GetInspectorInfo());
  // These objects contain the temporary values that are displayed
  // in the Inspector window. These values are applied when the user enters them.
  const tempVectors = useRef({});
  const tempScalars = useRef({});

  // This side effect runs every time the selected object is changed.
  // It gets the new data, and initializes tempScalars to the current values that
  // the scalars in data, using the getters.
  useEffect(() => {
    data.current = props.selection.GetInspectorInfo();
    tempScalars.current = {};
    for (var [key, value] of Object.entries(data.current.scalars)) {
      tempScalars.current[key] = value.get();
    }
    forceUpdate();
  }, [props.selection]);

  // This side effect runs both when the selected object changes and when the
  // vectors in data change.
  // It updates tempVectors to reflect the change.
  // The expression in the dependency array (second argument) of useEffect represents an Array
  // of every x y and z value in all the vectors in data.
  useEffect (() => {
      for (var vector in data.current.vectors) {
      tempVectors.current[vector] = [
        data.current.vectors[vector].x,
        data.current.vectors[vector].y,
        data.current.vectors[vector].z
      ].map(item => Math.round(item*100)/100);
    }
  }, [props.selection, ...Object.entries(data.current.vectors).map(pair => {return pair[1].toArray()}).flat()]);

  // This function is the callback function for keypresses on the textfields of the
  // inspecter window. If the key pressed was an enter key, the id attribute of the textfield
  // is parsed to see if it was a vector or scalar ("v" or "s"), what property it corresponded to,
  // and if it was a vector, what component of the vector it was ("x", "y", or "z").
  // Then, the value in the textfield is validated, and if it is valid, the corresponding
  // value in data is updated, and if not, the value in the textfield is overwritten
  // by the current value in data.
  function handleKeyPress(event) {
    if (event.code === "Enter") {
      let id = event.target.id.split(" ");
      // Switch to check if the textfield changed a vector or scalar.
      switch (id[0]) {
        case "v":
          // Validate value:
          if (isFloat((event.target.value))) {
            // Temporary variables to shorten code.
            // vector is the corresponding vector in data,
            // and tempVector is the corresponding vector in tempVectors.
            let vector = data.current.vectors[id[1]];
            let tempVector = tempVectors.current[id[1]];

            //This switch checks what component of the vector changed,
            // and updates the corresponding component of vector.
            switch (id[2]) {
              case "x":
                vector.set(parseFloat(event.target.value), vector.y, vector.z);
                tempVector[0] = Math.round(parseFloat(event.target.value)*100)/100;
                break;
              case "y":
                vector.set(vector.x, parseFloat(event.target.value), vector.z);
                tempVector[1] = Math.round(parseFloat(event.target.value)*100)/100;
                break;
              case "z":
                vector.set(vector.x, vector.y, parseFloat(event.target.value));
                tempVector[2] = Math.round(parseFloat(event.target.value)*100)/100;
            }
            props.forceCanvasUpdate();
          } else {
            // If the validation check fails, tempVectors is updated to reflect
            // to reflect the actual value of the vector in data.
            tempVectors.current[id[1]] = [
              data.current.vectors[id[1]].x,
              data.current.vectors[id[1]].y,
              data.current.vectors[id[1]].z
            ].map(item => Math.round(item*100)/100);
            forceUpdate();
          }
          break;
        case "s":
          // When the textfield is from a scalar value, the validation check
          // doesn't allow the field with the name "Mass" to take a negative value.
          if (isFloat((event.target.value)) && !(parseFloat(event.target.value) < 0 && id[1] === "Mass")) {
            data.current.scalars[id[1]].set(parseFloat(event.target.value));
            props.forceCanvasUpdate();
          } else {
            //Again, if the validation check fails, tempScalars is updated.
            tempScalars.current[id[1]] = data.current.scalars[id[1]].get();
            forceUpdate();
          }
      }
    }
  }

  // This Array will contain the actual TextField components for the vectors.
  let vectorInputs = [];

  for (const property in tempVectors.current) {
    // This will add a row for the name of the current vector.
    vectorInputs.push(
      <TableRow>
        <TableCell colSpan="3">
          <Typography variant="body1" align="center"><b>{property}</b></Typography>
        </TableCell>
      </TableRow>
    );

    // This adds the textfields themselves.
    vectorInputs.push(
      <TableRow>
        <TableCell>
          <TextField
            id={`v ${property} x`}
            style={{width:"70px"}}
            onKeyPress={handleKeyPress}
            onChange={event => {tempVectors.current[property][0] = event.target.value; forceUpdate()}}
            variant="outlined"
            size="small"
            value={tempVectors.current[property][0]}/>
        </TableCell>
        <TableCell>
          <TextField
            id={`v ${property} y`}
            style={{width:"70px"}}
            onKeyPress={handleKeyPress}
            onChange={event => {tempVectors.current[property][1] = event.target.value; forceUpdate()}}
            variant="outlined"
            size="small"
            value={tempVectors.current[property][1]}/>
        </TableCell>
        <TableCell>
          <TextField
            id={`v ${property} z`}
            style={{width:"70px"}}
            onKeyPress={handleKeyPress}
            onChange={event => {tempVectors.current[property][2] = event.target.value; forceUpdate()}}
            variant="outlined"
            size="small"
            value={tempVectors.current[property][2]}/>
        </TableCell>
      </TableRow>
    );
  }

  // Similarly here, this Array will contain all the TextField components for the scalars.
  let scalarInputs = [];

  for (const property in tempScalars.current) {
    scalarInputs.push(
      <TableRow>
        <TableCell>
          <Typography variant="body1"><b>{property}</b></Typography>
        </TableCell>
        <TableCell>
          <TextField
          id={`s ${property}`}
          style={{width:"70px"}}
          onKeyPress={handleKeyPress}
          onChange={event => {tempScalars.current[property] = event.target.value; forceUpdate()}}
          variant="outlined"
          size="small"
          value={tempScalars.current[property]}/>
        </TableCell>
      </TableRow>
    );
  }

  // This is a small callback function to remove the selected
  // particle and deselect it.
  function Remove() {
    props.selection.scene.RemoveParticle(props.selection.key);
    props.deselect();
  }

  return (
    <Drawer anchor="right" variant="permanent">
      <Box className={classes.title}>
        <Typography align="center" variant="h6">Inspector window</Typography>
      </Box>
      <Table>
        <TableBody>
          {vectorInputs}
          {scalarInputs}
        </TableBody>
      </Table>
      <Button className={classes.removeBtn}
        onClick={Remove}>
          Remove
        </Button>
    </Drawer>
  )
}
