import Polygon from './polygon';
import Utils from './utils';
import { Point, RGBA } from './interface';

class Fractal {

  private POLYGON_COUNT = 0;
  private POLYGON_VERTICES = 0;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private polygons: Array<Polygon>;

  constructor(polygons = 100, vertices = 3) {
    this.polygons = [];
    this.POLYGON_COUNT = polygons;
    this.POLYGON_VERTICES = vertices;
  }

  match(imageUrl: string) {
    this.loadImage(imageUrl).then(img => this.main(img));
  }

  private main(img: HTMLImageElement) {
    this.setContext();
    this.configureDom(img);

    this.polygons = this.generateInitialPolygons();
    setInterval(this.drawFrame.bind(this), 0);
  }

  private generateInitialPolygons(): Array<Polygon> {
    return new Array(this.POLYGON_COUNT).fill(null).map(() =>
        new Polygon(
          this.generateRandomPoints(this.POLYGON_VERTICES),
          this.generateRandomColour()
        )
    );
  }

  private drawFrame() {
    // clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let polygon of this.polygons) {
      this.drawPolygon(polygon);
    }
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
    this.context.fillStyle = polygon.getColourString();
    this.context.fill();
  }

  private generateRandomPoints(count: number): Array<Point> {
    return new Array(count).fill(null).map(() =>
      ({
          x: Utils.random(0, this.canvas.width),
          y: Utils.random(0, this.canvas.height)
      })
    );
  }

  private generateRandomColour(): RGBA {
    return {
      r: Utils.random(0, 255),
      g: Utils.random(0, 255),
      b: Utils.random(0, 255),
      a: Utils.random(0, 10000) / 10000
    }
  }

}

export default Fractal;