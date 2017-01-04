import Polygon from './polygon';

class Fractal {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private polygons: Array<Polygon>;

  private POLYGON_COUNT = 0;

  constructor(polygons = 100) {
    this.polygons = [];
    this.POLYGON_COUNT = polygons;

    this.setContext();
  }

  start(imageUrl: string) {
    this.loadImage(imageUrl).then(img => this.configureDom(img))
    .then(()=> {
      this.drawPolygon(
        new Polygon(
          [
            { x: 15, y: 10 },
            { x: 40, y: 75 },
            { x: 104, y: 42 }
          ],
          { r: 105, g: 105, b: 105, a: 1 }
        )
      )
    });
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
    console.log('Moving to ', ...polygon.getPointArr(0));
    const points = polygon.points.length;
    for (let i = 1; i < points; i++) {
      console.log('Line to ', ...polygon.getPointArr(i));
      this.context.lineTo.apply(this.context, polygon.getPointArr(i));
    }

    this.context.closePath();
    this.context.fillStyle = `rgba(${polygon.colour.r}, ${polygon.colour.g}, ${polygon.colour.b}, ${polygon.colour.a}`;
    this.context.fill();
  }

  // private generateRandomPoints(count: number): Array<Points> {}

}

export default Fractal;