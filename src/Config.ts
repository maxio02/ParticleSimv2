import { PointerFunctionType } from "./InputHandler";
import Vec2D from "./Vec2D";

var fieldStrength = 10;
var physicsSubstepsAmount = 4;
var gravityDirection = new Vec2D(0, 1.2);
var fieldSize = 250;
var particleNumber = 400;
var pointerFunction: PointerFunctionType = 'field';
var gridSize = 26;
var gyroEnabled = false;
export function getGravityDirection() {
    return gravityDirection;
}

export function getPhysicsSubstepsAmount() {
    return physicsSubstepsAmount;
}

export function getFieldStrength() {
    return fieldStrength;
}

export function getFieldSize() {
    return fieldSize;
}

export function getParticleNumber() {
    return particleNumber;
}

export function getPointerFunction() {
    return pointerFunction;
}

export function getGridSize() {
    return gridSize;    
}

export function isGyroEnabled() {
    return gyroEnabled;
}

export function setGravityDirection(newGravityDirection: Vec2D) {
    gravityDirection = newGravityDirection;
}

export function setPhysicsSubstepsAmount(newAmount: number) {
    physicsSubstepsAmount = newAmount;
}

export function setFieldStrength(newfieldStrength: number) {
    fieldStrength = newfieldStrength;
}

export function setFieldSize(newfieldSize: number) {
    fieldSize = newfieldSize;
}

export function setParticleNumber(newParticleNumber: number) {
    particleNumber = newParticleNumber;
}

export function setPointerFunction(newPointerFunction: PointerFunctionType) {
    pointerFunction = newPointerFunction;
}

export function setIsGyroEnabled(newIsGyroEnabled: boolean) {
    gyroEnabled = newIsGyroEnabled;
}