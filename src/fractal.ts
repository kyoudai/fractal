import Polygon from './polygon';
import Utils from './utils';
import { Point, RGBA, StatsDOM } from './interface';

class Fractal {

  private POLYGON_COUNT = 0;
  private POLYGON_VERTICES = 0;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private polygons: Array<Polygon>;
  private nextMutable: number;
  private imageData: Uint8ClampedArray;
  private lastMatch: number;
  private maxDifference: number;
  private stats: StatsDOM;
  private mutations: number;
  private breakthroughs: number;
  private graph: HTMLCanvasElement;

  constructor(polygons = 100, vertices = 3) {
    this.polygons = [];
    this.stats = {};
    this.lastMatch = 0;
    this.nextMutable = 0;
    this.maxDifference = 1;
    this.mutations = 0;
    this.breakthroughs = 0;
    this.POLYGON_COUNT = polygons;
    this.POLYGON_VERTICES = vertices;
  }

  match(imageUrl: string) {
    this.loadImage(imageUrl)
    .then(img => this.getImageData(img))
    .then(img => this.main(img));
  }

  private main(img: HTMLImageElement) {
    this.setContext();
    this.configureDom(img);
    this.cacheDomElements();

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
    //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // fill with pure white
    this.context.fillStyle = '#fff';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // reset index in case we need to
    if (this.nextMutable >= this.POLYGON_COUNT) {
      this.nextMutable = 0;
    }

    // mutate one polygon
    let poly = this.polygons[this.nextMutable];
    poly.stash()
    poly.mutate(this.canvas.width, this.canvas.height);

    // draw stuff
    for (let polygon of this.polygons) {
      this.drawPolygon(polygon);
    }

    const match = this.getMatch();
    if ( match > this.lastMatch ) {
      this.lastMatch = match;
      this.setStat('break', this.breakthroughs++);
      this.setStat('match', match.toFixed(4) + '%');
    }
    else {
      poly.pop();
    }

    // go to next mutable
    this.setStat('mutations', this.mutations++);
    this.nextMutable++;
  }

  private setContext() {
    this.canvas = <HTMLCanvasElement>document.getElementById('stage');
    this.context = this.canvas.getContext('2d');
    this.graph = <HTMLCanvasElement>document.getElementById('graph');
  }

  private loadImage(imageUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      let img = new Image();

      img.src = imageUrl;
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject('Could not load image');
    });
  }

  private configureDom(img: HTMLImageElement) {
    document.getElementById('reference').appendChild(img);

    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.graph.width = img.width;
    this.graph.height = img.height;
    this.maxDifference = this.canvas.width * this.canvas.height * 3 * 255;
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

  private getImageData(img: HTMLImageElement): Promise<HTMLImageElement> {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    ({ width: canvas.width, height: canvas.height } = img );
    context.drawImage(img, 0, 0);

    this.imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    return Promise.resolve(img);
  }

  private getMatch(): number {
    const diff = this.calculateDifference();

    return  100 * (1 - diff/this.maxDifference);
  }

  private calculateDifference(): number {
    let imageData = this.imageData;
    let canvasData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;

    if (imageData.length !== canvasData.length) {
      console.warn('Invalid data comparison');
      return;
    }

    let difference = 0;
    let differenceR, differenceG, differenceB
    let graphContext = this.graph.getContext('2d');
    let graphData: any = graphContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let dat = graphData.data;
    for (let i = 0; i <= canvasData.length - 5; i += 4) {
      differenceR = Math.abs(imageData[i] - canvasData[i] );
      differenceG = Math.abs(imageData[i + 1] - canvasData[i + 1]);
      differenceB = Math.abs(imageData[i + 2] - canvasData[i + 2]);

      dat[i] = 0
      dat[i + 1] = 0;
      dat[i + 2] = 0;
      //dat[i + 3] = (1 - (differenceR + differenceG + differenceB) / (255 * 3)) * 255;
      //wolfram simplified
      dat[i + 3] = 1/3 * (-differenceR - differenceG - differenceB + 765);
      difference += differenceR + differenceG + differenceB;
    }

    graphContext.putImageData(graphData, 0, 0);
    return difference;
  }

  private cacheDomElements() {
    this.stats =  {
      match: document.getElementById('match'),
      break: document.getElementById('break'),
      mutations: document.getElementById('mutations')
    };
  }

  private setStat(stat: 'match' | 'break' | 'mutations', val: string | number) {
    this.stats[stat].innerHTML = val.toString();
  }

}

export default Fractal;