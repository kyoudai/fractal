interface Point {
  x: number,
  y: number
}

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface StatsDOM {
  match?: HTMLElement
  break?: HTMLElement;
  mutations?: HTMLElement;
}

export { Point, RGBA, StatsDOM }