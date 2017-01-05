import Fractal from './fractal';

let fractal: Fractal;
// hacky logic for now

document.getElementById('start_match').addEventListener('click', () => {
  const polygons = (<HTMLInputElement>document.getElementById('polygons')).value;
  const vertices = (<HTMLInputElement>document.getElementById('vertices')).value;

  fractal = new Fractal(parseInt(polygons), parseInt(vertices));
  fractal.match('reference/Mona-Lisa-200x200.jpg');
});
