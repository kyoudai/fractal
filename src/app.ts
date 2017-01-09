import Fractal from './fractal';

let fractal: Fractal;

// hacky logic for now
document.getElementById('start_match').addEventListener('click', () => {
  const polygons = (<HTMLInputElement>document.getElementById('polygons')).value;
  const vertices = (<HTMLInputElement>document.getElementById('vertices')).value;

  fractal = new Fractal(parseInt(polygons), parseInt(vertices));
  fractal.match('reference/circle.png');

  // get start date
  let date = new Date();
  date.setTime(Date.now());
  const friendlyDate = date.toUTCString();
  document.getElementById('initial').innerHTML = `Started on ${friendlyDate}.<br> Using ${polygons} polygons with ${vertices} vertices.`;
});
