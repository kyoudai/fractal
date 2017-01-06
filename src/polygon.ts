import { Point, RGBA, Mutagen, mutationType } from './interface';
import Utils from './utils';


class Polygon {

  points: Array<Point>;
  colour: RGBA;
  cache: any;
  mutagens: Array<Mutagen>;

  constructor(points: Array<Point>, colour: RGBA) {
    this.points = points;
    this.colour = colour;
    this.cache = {};

    this.mutagens = this.getMutagens();
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

  getMutagens(): Array<Mutagen> {
    return [
      ...this.points.map((point, index) =>  [{ index, prop: 'x', type: mutationType.POINT_X }, {index, prop: 'y', type: mutationType.POINT_Y }]).reduce((a, b) => a.concat(b)),
      ...['r', 'g', 'b'].map( (colour, index) => ({ index, prop: colour, type: mutationType.COLOUR }) ),
      { prop: 'a', type: mutationType.ALPHA },
      { prop: 'xy', type: mutationType.FULL_POSITION },
      { prop: 'rgba', type: mutationType.FULL_COLOUR },
      { prop: 'xyrgba', type: mutationType.FULL }
    ];
  }

  // randomly mutate
  mutate(width, height) {
    const mutagen = this.mutagens;
    const seed = Utils.random(0, mutagen.length - 1);

    let agent = mutagen[seed];
    switch(agent.type) {
      case mutationType.POINT_X:
        this.getPoint(agent.index).x = Utils.random(0, width);
        break;
      case mutationType.POINT_Y:
        this.getPoint(agent.index).y = Utils.random(0, height);
        break;
      case mutationType.COLOUR:
        this.colour[agent.prop] = Utils.random(0, 255);
        break;
      case mutationType.ALPHA:
        this.colour.a = Utils.random(0, 10000) / 10000;
        break;
      case mutationType.FULL_POSITION:
        this.points = Utils.generateRandomPoints(this.points.length, width, height);
        break;
      case mutationType.FULL_COLOUR:
        this.colour = Utils.generateRandomColour();
        break;
      case mutationType.FULL:
        this.points = Utils.generateRandomPoints(this.points.length, width, height);
        this.colour = Utils.generateRandomColour();
        break;
      default:
        console.warn('No mutation matched');
    }
  }

  pop() {
    this.points = this.cache.points.reduce((prev, curr) => [...prev , Object.assign({}, curr)], []);
    this.colour = Object.assign({}, this.cache.colour);
  }

}

export default Polygon;