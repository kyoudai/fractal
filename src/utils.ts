import { RGBA, Point } from './interface';

class Utils {

  static random(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateRandomPoints(count: number, width: number, height: number): Array<Point> {
    return new Array(count).fill(null).map(() =>
      ({
          x: this.random(0, width),
          y: this.random(0, height)
      })
    );
  }

  static generateRandomColour(): RGBA {
    return {
      r: this.random(0, 255),
      g: this.random(0, 255),
      b: this.random(0, 255),
      a: this.random(0, 10000) / 10000
    }
  }

}

export default Utils;