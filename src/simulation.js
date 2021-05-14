import { Vector3 } from "three";

// The values calculated by the particle methods are actually accurate
// if the mass and charge of the particles were measured in kilograms and coulombs.
const GRAVITATIONAL_CONSTANT = 0.00000000006674;
const COULOMB_CONSTANT = 8988000000;

class SimulationObject {
  constructor(key, position, rotation, scale, onClick, scene) {
    this.key = key;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.onClick = onClick;
    this.scene = scene;
    this.selected = false;
  }
}


class Particle extends SimulationObject {
  constructor(key, position, rotation, scale, onClick, scene, mass, charge) {
    super(key, position, rotation, scale, onClick, scene);
    this.mass = mass;
    this.charge = charge;
    // Particles add themselves to the scene that's passed to them as an argument.
    scene.AddParticle(this);
  }

  CalculateGravField(position) {
    // relativePosition is the vector from this particle to the vector position.
    let relativePosition = new Vector3();
    relativePosition.subVectors(position, this.position);
    // if position is actually on top of particle, to avoid a division by
    // zero error, a zero vector is returned.
    if (relativePosition.length() === 0) {
      return new Vector3();
    }
    let fieldStrength = relativePosition.clone();
    // The field is proportional to the particle's mass.
    fieldStrength.multiplyScalar(-GRAVITATIONAL_CONSTANT * this.mass);
    // The field faces from position to the particle, and its magnitude
    // is proportional to the inverse square of the distance between them.
    // Therefore the relative position vector would have to be first normalised
    // by dividing it by that distance, and then divided by the square of
    // the distance again. I combine these two steps here by dividing it by the
    // cube of relativePosition's length.
    fieldStrength.divideScalar(relativePosition.length() ** 3);
    return fieldStrength;
  }

  CalculateElecField(position) {
    // relativePosition is the vector from this particle to the vector position.
    let relativePosition = new Vector3();
    relativePosition.subVectors(position, this.position);
    // if position is actually on top of particle, to avoid a division by
    // zero error, a zero vector is returned.
    if (relativePosition.length() === 0) {
      return new Vector3();
    }
    let fieldStrength = relativePosition.clone();
    // The field is proportional to the particle's charge.
    fieldStrength.multiplyScalar(COULOMB_CONSTANT * this.charge);
    // The field's magnitude is proportional to the inverse square of the
    // distance between the particle and the position it is measured from.
    // Therefore the relative position vector would have to be first normalised
    // by dividing it by that distance, and then divided by the square of
    // the distance again. I combine these two steps here by dividing it by the
    // cube of relativePosition's length.
    fieldStrength.divideScalar(relativePosition.length() ** 3);
    return fieldStrength;
  }

  GetInspectorInfo() {
    // This function returns the information to be displayed in the Inspector window.
    let data = {
      "vectors":{
        "Position":this.position
      },
      "scalars":{
        "Mass": {"get":() => this.mass, "set":value => this.mass = value},
        "Charge": {"get":() => this.charge, "set":value => this.charge = value},
      }
    }
    return data
  }
}


class Scene {
  // Manages every particle in the scene.
  constructor(particles, sensors=null, settings=null) {
    this.particles = particles;
  }

  AddParticle(particle) {
    // Adds particles to the list of particles.
    this.particles.push(particle);
  }

  RemoveParticle(key) {
    // Searches for particles by their key and
    // removes them from the list of particles.
    let index = this.particles.findIndex(item => item.key === key);
    this.particles.splice(index, index+1);
  }

  CalculateTotalGravField(position) {
    // This function simply adds together the gravitational
    // fields from all the particles in the scene.
    let totalFieldStrength = new Vector3();
    for (var i of this.particles) {
      totalFieldStrength.add(i.CalculateGravField(position));
    }
    return totalFieldStrength;
  }

  CalculateTotalElecField(position) {
    // This function simply adds together the electric
    // fields from all the particles in the scene.
    let totalFieldStrength = new Vector3();
    for (var i of this.particles) {
      totalFieldStrength.add(i.CalculateElecField(position));
    }
    return totalFieldStrength;
  }
}


export {Particle, Scene};
