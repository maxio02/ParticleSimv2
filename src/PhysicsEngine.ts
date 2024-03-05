import { foregroundCanvas } from './CanvasManager';
import * as Config from './Config';
import { InputHandler } from './InputHandler';
import Particle from './Particle';
import Vec2D from './Vec2D';
import { attractors, grid, particles } from './script';

const inputHandler = InputHandler.getInstance();

function updatePositions(dt: number) {
    grid.removeAll();
    particles.forEach((particle) => {
  
      particle.updatePosition(dt);
      grid.put(particle);
    });
  }
  
  function applyGravity() {
    particles.forEach((particle) => {
      particle.accelerate(Config.getGravityDirection());
    });
  }
  
  function applyField(fieldPos: Vec2D) {
    particles.forEach((particle) => {
      const pullDirection = fieldPos.difference(particle.currentPosition)
      const distance = pullDirection.length();
  
      if (distance < Config.getFieldSize() && distance > 10) {
        pullDirection.multiply(Config.getFieldStrength() * 100);
        pullDirection.divide(distance * distance);
        particle.accelerate(pullDirection);
      }
    });
  }
  
  export function applyAttractorForcesToAll() {
    particles.forEach((particle) => {
      applyAttractorForces(particle)
    });
  }


  export function tick(dt: number) {
    var sub_dt = dt / Config.getPhysicsSubstepsAmount();
  
    for (var i = 0; i < Config.getPhysicsSubstepsAmount(); i++) {
      if (Config.getGravityDirection().y != 0) {
        applyGravity();
      }
      if (inputHandler.clicked) {
        switch (Config.getPointerFunction()) {
          case 'field':
            applyField(inputHandler.pointerPosition);
            break;
          case 'gravity':
            Config.setGravityDirection(inputHandler.pointerPosition.difference(inputHandler.clickStartPosition).divide(400));
          case 'throw':
            break;
  
        }
  
      }
      // applyAttractorForcesToAll();
      applyConstraintToAllEdges();
      solveCollisions();
      updatePositions(sub_dt);
    }
  }

  function applyConstraintToAllEdges() {

    particles.forEach((particle) => {
      applyConstraint(particle);
    });
    // for (var col = 0; col < grid.length; col++) {
    //   for (var thickness = 0; thickness < 2; thickness++) {
    //     grid[col][thickness].forEach((particle) => {
    //       applyConstraint(particle);
    //     });
  
    //     grid[col][grid[0].length - thickness - 1].forEach((particle) => {
    //       applyConstraint(particle);
    //     });
    //   }
    // }
  
    // for (var row = 0; row < grid[0].length; row++) {
    //   for (var thickness = 0; thickness < 2; thickness++) {
    //     grid[thickness][row].forEach((particle) => {
    //       applyConstraint(particle);
    //     });
  
    //     grid[grid.length - thickness - 1][row].forEach((particle) => {
    //       applyConstraint(particle);
    //     });
    //   }
    // }
  }

  export function applyConstraint(particle: Particle) {
    // Apply floor constraint
    if (particle.currentPosition.y + particle.radius > foregroundCanvas.height) {
      particle.currentPosition.y = foregroundCanvas.height - particle.radius;
      particle.previousPosition.y = particle.currentPosition.y + particle.currentPosition.y - particle.previousPosition.y;
    }
  
    // Apply Ceiling constraint
    if (particle.currentPosition.y - particle.radius < 0) {
      particle.currentPosition.y = particle.radius;
      particle.previousPosition.y = particle.currentPosition.y + particle.currentPosition.y - particle.previousPosition.y;
    }
  
  
    // Apply left wall constraint
    if (particle.currentPosition.x - particle.radius < 0) {
      particle.currentPosition.x = particle.radius;
      particle.previousPosition.x = particle.currentPosition.x + particle.currentPosition.x - particle.previousPosition.x;
    }
  
    // Apply right wall constraint
    if (particle.currentPosition.x + particle.radius > foregroundCanvas.width) {
      particle.currentPosition.x = foregroundCanvas.width - particle.radius;
  
    }
  }

  export function applyAttractorForces(particle: Particle) {
    attractors.forEach((attractor) => {
      const pullDirection = attractor.position.difference(particle.currentPosition)
      const distance = pullDirection.length();
  
      if (distance < attractor.radius && distance > 10) {
        pullDirection.multiply(attractor.force);
        pullDirection.divide(distance * distance)
        particle.accelerate(pullDirection);
      }
    });
  }
  
  function solveCollisions() {
    var numberOfCollisions = 0;
  
  
    let tempCollisionDirection = new Vec2D(0, 0);
    let squaredDistance = 0;
    let radiiSum = 0;
    let squaredRadiiSum = 0;
  
    particles.forEach((particle1) => {
      const neighboringParticles = particle1.getNeighboringParticles();
      neighboringParticles.forEach((particle2) => {
        if (particle1 === particle2) return;
  
        tempCollisionDirection.set(particle1.currentPosition).subtract(particle2.currentPosition);
        squaredDistance = tempCollisionDirection.squaredLength();
        
        radiiSum = particle1.radius + particle2.radius;
        squaredRadiiSum = radiiSum * radiiSum;
  
        if (squaredDistance < squaredRadiiSum && squaredDistance != 0) {
          numberOfCollisions++;
          
            let distance = Math.sqrt(squaredDistance);
            tempCollisionDirection.divide(distance);
        
            let delta = radiiSum - distance;
            tempCollisionDirection.multiply(delta * 0.5);
        
            particle1.currentPosition.add(tempCollisionDirection);
            particle2.currentPosition.subtract(tempCollisionDirection);
        }
      });
    });
    // console.log(numberOfCollisions);
  }
  