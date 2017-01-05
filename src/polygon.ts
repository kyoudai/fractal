import { Point, RGBA } from './interface';
import Utils from './utils';

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
  mutate(width, height) {

    const points = this.points.length * 2;
    const mutables = points + 4 - 1;
    const seed = Utils.random(0, mutables);

    if (seed < points) {
      const index = Math.floor(seed/2);
      if (seed % 2 > 0) {
        this.points[index]['y'] = Utils.random(0, height);
      }
      else {
        this.points[index]['x'] = Utils.random(0, width);
      }
    }
    else if (seed < mutables) {
      const colours = ['b', 'g', 'r'];
      this.colour[colours[mutables - points - 1]] = Utils.random(0, 255);
    }
    else if (seed === mutables) {
      this.colour.a = Utils.random(0, 10000) / 10000
    }
  }

  pop() {
    this.points = this.cache.points.reduce((prev, curr) => [...prev , Object.assign({}, curr)], []);
    this.colour = Object.assign({}, this.cache.colour);
  }

}

export default Polygon;