import { Point, RGBA } from './interface';

class Polygon {

  points: Array<Point>;
  colour: RGBA;
  cache: any;

  constructor(points: Array<Point>, colour: RGBA) {
    this.points = points;
    this.colour = colour;
    this.cache = {};
  }

  getPoint(index: number): Point {
    return this.points[index];
  }

  getPointArr(index: number): Array<number> {
    return [ this.points[index].x, this.points[index].y ];
  }

  getColourString(): string {
    return `rgba(${this.colour.r}, ${this.colour.g}, ${this.colour.b}, ${this.colour.a})`;
  }

  stash() {
    // destructuring does not work in this TS version { ...this.colour };
    this.cache = {
      points: this.points.reduce((prev, curr) => [...prev , Object.assign({}, curr)], []),
      colour: Object.assign({}, this.colour)
    };
  }

  // randomly mutate
  mutate() {}

  pop() {
    this.points = this.cache.points.reduce((prev, curr) => [...prev , Object.assign({}, curr)], []);
    this.colour = Object.assign({}, this.cache.colour);
  }

}

export default Polygon;