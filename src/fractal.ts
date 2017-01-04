import Polygon from './polygon';
import { Point, RGBA } from './interface';

class Fractal {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private polygons: Array<Polygon>;

  private POLYGON_COUNT = 0;
  private POLYGON_VERTICES = 0;

  constructor(polygons = 100, vertices = 3) {
    this.polygons = [];
    this.POLYGON_COUNT = polygons;
    this.POLYGON_VERTICES = vertices;
  }

  start(imageUrl: string) {
    this.loadImage(imageUrl).then(img => this.main(img));
  }

  private main(img: HTMLImageElement) {
    this.setContext();
    this.configureDom(img);

    this.drawPolygon(
      new Polygon(
        this.generateRandomPoints(this.POLYGON_VERTICES),
        this.generateRandomColour()
      )
    );
  }

  private setContext() {
    this.canvas = <HTMLCanvasElement>document.getElementById('stage');
    this.context = this.canvas.getContext('2d');
  }

  private loadImage(imageUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      let img = new Image();

      img.src = imageUrl;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject('Could not load image');
    });
  }

  private configureDom(img: HTMLImageElement) {
    document.getElementById('reference').appendChild(img);

    this.canvas.width = img.width;
    this.canvas.height = img.height;
  }

  private drawPolygon(polygon: Polygon) {
    this.context.beginPath();
    this.context.moveTo.apply(this.context, polygon.getPointArr(0));
    const points = polygon.points.length;
    for (let i = 1; i < points; i++) {
      this.context.lineTo.apply(this.context, polygon.getPointArr(i));
    }

    this.context.closePath();
    this.context.fillStyle = `rgba(${polygon.colour.r}, ${polygon.colour.g}, ${polygon.colour.b}, ${polygon.colour.a}`;
    this.context.fill();
  }

  private generateRandomPoints(count: number): Array<Point> {
    let points = [];
    for (let i = 0; i < count; i++ ) {
      points.push({
        x: this.generateRandomNumber(0, this.canvas.width),
        y: this.generateRandomNumber(0, this.canvas.height)
      });
    }

    return points;
  }

  private generateRandomNumber(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateRandomColour(): RGBA {
    return {
      r: this.generateRandomNumber(0, 255),
      g: this.generateRandomNumber(0, 255),
      b: this.generateRandomNumber(0, 255),
      a: this.generateRandomNumber(0, 10000) / 10000
    }
  }

}

export default Fractal;