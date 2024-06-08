import { foregroundCanvas } from './CanvasManager';
import * as Config from './Config';
import { InputHandler } from './InputHandler';
import Particle from './Particle';
import Vec2D from './Vec2D';
import { attractors, grid, particles } from './script';

const inputHandler = InputHandler.getInstance();
let previousScreenX= 0, previousScreenY = 0
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

  function applyVelocity(vel: Vec2D){
    particles.forEach((particle) => {
      particle.velocity.add(vel)
    });
  }
  
  function applyField(fieldPos: Vec2D) {
    particles.forEach((particle) => {
      const pullDirection = fieldPos.difference(particle.position)
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

      const deltaX = window.screenX - previousScreenX;
      const deltaY = window.screenY - previousScreenY;
      const screenVelocity = new Vec2D(-deltaX / 60, -deltaY / 60);

      applyVelocity(screenVelocity);

      previousScreenX = window.screenX;
      previousScreenY = window.screenY;


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
    if (particle.position.y + particle.radius > foregroundCanvas.height) {
      particle.velocity = new Vec2D(particle.velocity.x, -Math.abs(particle.velocity.y)).multiply(0.5)
      particle.position.y = foregroundCanvas.height - particle.radius;
      // particle.previousPosition.y = particle.currentPosition.y + particle.currentPosition.y - particle.previousPosition.y;
      // particle.accelerate(new Vec2D(0, -(foregroundCanvas.height - particle.radius)/10))

    }
  
    // Apply Ceiling constraint
    if (particle.position.y - particle.radius < 0) {
      particle.position.y = particle.radius;
      particle.velocity = new Vec2D(particle.velocity.x, Math.abs(particle.velocity.y)).multiply(0.5);
      // particle.previousPosition.y = particle.currentPosition.y + particle.currentPosition.y - particle.previousPosition.y;
    }
  
  
    // Apply left wall constraint
    if (particle.position.x - particle.radius < 0) {
      particle.position.x = particle.radius;
      particle.velocity = new Vec2D(Math.abs(particle.velocity.x), particle.velocity.y).multiply(0.5);
      // particle.previousPosition.x = particle.currentPosition.x + particle.currentPosition.x - particle.previousPosition.x;
    }
  
    // Apply right wall constraint
    if (particle.position.x + particle.radius > foregroundCanvas.width) {
      particle.velocity = new Vec2D(-Math.abs(particle.velocity.x), particle.velocity.y).multiply(0.5);
      particle.position.x = foregroundCanvas.width - particle.radius;
      // particle.accelerate(new Vec2D(-(foregroundCanvas.width - particle.radius)/10,0))
    }
  }

  export function applyAttractorForces(particle: Particle) {
    attractors.forEach((attractor) => {
      const pullDirection = attractor.position.difference(particle.position)
      const distance = pullDirection.length();
  
      if (distance < attractor.radius && distance > 10) {
        pullDirection.multiply(attractor.force);
        pullDirection.divide(distance * distance)
        particle.accelerate(pullDirection);
      }
    });
  }
  
  function solveCollisions() {
    particles.forEach((particle1) => {
        const neighboringParticles = particle1.getNeighboringParticles();
        neighboringParticles.forEach((particle2) => {
            if (particle1 === particle2) return;

            let squaredDistance = particle1.position.squaredDistanceTo(particle2.position);

            //check if the collision occurred, if no, return
            if (squaredDistance > (particle1.radius + particle2.radius)**2) return;

            let distance = Math.sqrt(squaredDistance);
            let collisionNormal = new Vec2D((particle2.position.x - particle1.position.x)/ distance, (particle2.position.y - particle1.position.y) / distance);

            //no need to multiply by 2, because m1+ m2 is 2
            let p = (particle1.velocity.x * collisionNormal.x + particle1.velocity.y * collisionNormal.y - 
                        particle2.velocity.x * collisionNormal.x + particle2.velocity.y * collisionNormal.y);
            particle1.velocity.set(new Vec2D(particle1.velocity.x - p * collisionNormal.x, particle1.velocity.y - p * collisionNormal.y))
            particle2.velocity.set(new Vec2D(particle2.velocity.x + p * collisionNormal.x, particle2.velocity.y + p * collisionNormal.y))


            // tempCollisionDirection.set(particle1.currentPosition).subtract(particle2.currentPosition);
            // squaredDistance = tempCollisionDirection.squaredLength();
            
            // radiiSum = particle1.radius + particle2.radius;
            // squaredRadiiSum = radiiSum * radiiSum;

            // if (squaredDistance < squaredRadiiSum && squaredDistance !== 0) {
            //     numberOfCollisions++;
                
            //     let distance = Math.sqrt(squaredDistance);
            //     let normal = tempCollisionDirection.divide(distance);
            //     let delta = radiiSum - distance;

                // Move particles apart based on their overlap
            // let displacement = normal.multiply(delta * 0.5);
            // particle1.currentPosition.add(displacement);
            // particle2.currentPosition.subtract(displacement);
            let delta = (particle1.radius + particle2.radius) - distance;
            collisionNormal.multiply(delta * 0.6)

            particle1.position.subtract(collisionNormal);
            particle2.position.add(collisionNormal);

        });
    });
    // console.log(numberOfCollisions);
}

  