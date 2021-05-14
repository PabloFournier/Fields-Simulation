import React, { useState, useRef } from 'react';

// This is a custom hook that I had to use to get around the fact
// that React doesn't allow callback functions to directly change state.
// Instead it puts the value in a mutable ref.
export default function useMutableState(init) {
  const [state, _setState] = useState(init);
  const stateRef = useRef(state);
  const setState = data => {
    stateRef.current = data;
    _setState(data);
  }
  return [stateRef, setState];
}
