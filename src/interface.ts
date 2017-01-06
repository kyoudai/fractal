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

// cannot have enum inside class
enum mutationType {
  POINT_X,
  POINT_Y,
  COLOUR,
  ALPHA,
  FULL_POSITION,
  FULL_COLOUR,
  FULL
}

interface Mutagen {
  prop: string;
  type: mutationType;
  index?: number;
}

export { Point, RGBA, StatsDOM, Mutagen, mutationType };