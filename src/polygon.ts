import { Point, RGBA } from './interface';

class Polygon {

  points: Array<Point>;
  colour: RGBA;

  constructor(points: Array<Point>, colour: RGBA) {
    this.points = points;
    this.colour = colour;
  }

  getPoint(index: number): Point {
    return this.points[index];
  }

  getPointArr(index: number): Array<number> {
    return [ this.points[index].x, this.points[index].y ];
  }

}

export default Polygon;