export default class Vec2D {
    x: number;
    y: number;
  
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  
    add(other: Vec2D){
      this.x += other.x;
      this.y += other.y;
      return this;
    }

    set(other: Vec2D){
      this.x = other.x;
      this.y = other.y;
      return this;
    }
    
    subtract(other: Vec2D){
      this.x -= other.x;
      this.y -= other.y;
      return this;
    }
  
    multiply(scalar: number) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    }
  
    divide(scalar: number){
      this.x /= scalar;
      this.y /= scalar;
      return this;
    }
  
    dot(vec: Vec2D): number {
      return this.x * vec.x + this.y * vec.y;
    }

    length(): number {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    squaredLength(): number {
      return this.x * this.x + this.y * this.y;
    }

    clone(): Vec2D{
      return new Vec2D(this.x, this.y)
    }

    difference(other: Vec2D): Vec2D{
      return new Vec2D(this.x - other.x, this.y - other.y)
    }

    squaredDistanceTo(other:Vec2D){
      return (this.x - other.x)**2 + (this.y - other.y)**2;
    }

}