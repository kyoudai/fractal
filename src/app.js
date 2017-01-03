(function() {
  const TRIANGLES_COUNT = 100;

  let CURRENT_MATCH = 0;
  let CURRENT_INDEX = 0;
  let IMAGE_DATA = [];

  // stats
  let MUTATIONS = 0;
  let BREAKTHROUGHS = 0;

  function start() {
    let {canvas, context} = initCanvas('stage');
    configureCanvas(canvas);

    IMAGE_DATA = getImageFidelity('reference');

    // draw initial batch
    let triangles = generateInitialTriangles(TRIANGLES_COUNT, canvas);
    drawAllTriangles(context, triangles);

    // the magic frame draw
    setInterval(drawFrame.bind(this, canvas, context, triangles), 0);
  }

  function drawFrame(canvas, context, triangles) {

    if (CURRENT_INDEX >= triangles.length) {
      CURRENT_INDEX = 0;
    }

    // save CURRENT_MATCH
    const triangle = triangles[CURRENT_INDEX];
    const { p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y, p5x, p5y, p6x, p6y, r, g, b, a } = triangle;

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // mutate property
    triangle.mutateProperty(canvas);
    document.getElementById('mutations').innerHTML = ++MUTATIONS;

    // draw all
    drawAllTriangles(context, triangles);

    // if we improved, keep the triangle, otherwise revert
    let match = calculateMatch(canvas, context);
    if ( match > CURRENT_MATCH ) {
      CURRENT_MATCH = match;
      document.getElementById('breakthroughs').innerHTML = ++BREAKTHROUGHS;
      document.getElementById('best_diff').innerHTML = match.toFixed(4) + '%';
    }
    else {
      triangles[CURRENT_INDEX] = new Triangle(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y, p5x, p5y, p6x, p6y, r, g, b, a);
    }

    CURRENT_INDEX++;
  }

  function calculateMatch(canvas, context) {
    let diff = getCanvasDifference(canvas, context);
    let max_diff = canvas.width * canvas.height * 3 * 255;

    return  100 * (1 - diff/max_diff);
  }

  function drawAllTriangles(context, triangles) {
    for (let triangle of triangles) {
      drawTriangle(context, triangle);
    }
  }

  function initCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext('2d');

    return {context, canvas};
  }

  function configureCanvas(canvas) {
    // get sizes from the reference image
    ({ width: canvas.width, height: canvas.height } = document.getElementById('reference') || new Image() );
  }

  function getImageFidelity(imageId) {
    const img = document.getElementById(imageId);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    ({ width: canvas.width, height: canvas.height } = img );
    context.drawImage(img, 0, 0);

    return context.getImageData(0, 0, canvas.width, canvas.height).data;
  }

  function getCanvasDifference(canvas, context) {
    let imgData = IMAGE_DATA;
    let canvasData = context.getImageData(0, 0, canvas.width, canvas.height).data;

    if (imgData.length !== canvasData.length) {
      console.warn('Invalid data comparison');
      return;
    }

    let difference = 0;
    for (let i = 0; i <= canvasData.length - 3; i += 4) {
      difference += Math.abs(imgData[i] - canvasData[i] );
      difference += Math.abs(imgData[i + 1] - canvasData[i + 1]);
      difference += Math.abs(imgData[i + 2] - canvasData[i + 2]);
    }

    return difference;
  }

  function generateInitialTriangles(limit, canvas) {
    let triangles = [];
    const { width, height } = canvas;

    const lw = -width * 0.05;
    const uw = width * 1.05;
    const lh = -height * 0.05;
    const uh = height * 1.05;

    for (let i = 0; i <= limit; i++) {
      triangles.push(
        new Triangle(
          randomNumber(lw, uw),
          randomNumber(lh, uh),
          randomNumber(lw, uw),
          randomNumber(lh, uh),
          randomNumber(lw, uw),
          randomNumber(lh, uh),
          randomNumber(lw, uw),
          randomNumber(lh, uh),
          randomNumber(lw, uw),
          randomNumber(lh, uh),
          randomNumber(lw, uw),
          randomNumber(lh, uh),
          randomNumber(0, 255),
          randomNumber(0, 255),
          randomNumber(0, 255),
          Math.random()
        )
      );
    }

    return triangles;
  }

  function randomNumber(lower, upper) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }

  function drawTriangle(context, triangle) {
    context.beginPath();
    context.moveTo(triangle.p1x, triangle.p1y);
    context.lineTo(triangle.p2x, triangle.p2y);
    context.lineTo(triangle.p3x, triangle.p3y);
    context.lineTo(triangle.p4x, triangle.p4y);
    context.lineTo(triangle.p5x, triangle.p5y);
    context.lineTo(triangle.p6x, triangle.p6y);
    context.closePath();

    context.fillStyle = `rgba(${triangle.r}, ${triangle.g}, ${triangle.b}, ${triangle.a}`;
    context.fill();
  }

  // Triangle class
  function Triangle( p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y, p5x, p5y, p6x, p6y, r, g, b, a ) {
    this.p1x = p1x;
    this.p1y = p1y;
    this.p2x = p2x;
    this.p2y = p2y;
    this.p3x = p3x;
    this.p3y = p3y;

    this.p4x = p4x;
    this.p4y = p4y;
    this.p5x = p5x;
    this.p5y = p5y;
    this.p6x = p6x;
    this.p6y = p6y;

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.saved = null;
  }

  Triangle.prototype.mutateProperty = function(canvas) {
    const mutator = randomNumber(0, 18);
    const { width, height } = canvas;

    const lw = -width * 0.05;
    const uw = width * 1.05;
    const lh = -height * 0.05;
    const uh = height * 1.05;

    switch(mutator) {
    case 0:
      this.p1x = randomNumber(lw, uw);
      break;
    case 1:
      this.p1y = randomNumber(lh, uh);
      break;
    case 2:
      this.p2x = randomNumber(lw, uw);
      break;
    case 3:
      this.p2y = randomNumber(lh, uh);
      break;
    case 4:
      this.p3x = randomNumber(lw, uw);
      break;
    case 5:
      this.p3y = randomNumber(lh, uh);
      break;
    case 6:
      this.p4x = randomNumber(lw, uw);
      break;
    case 7:
      this.p4y = randomNumber(lh, uh);
      break;
    case 8:
      this.p5x = randomNumber(lw, uw);
      break;
    case 9:
      this.p5y = randomNumber(lh, uh);
      break;
    case 10:
      this.p6x = randomNumber(lw, uw);
      break;
    case 11:
      this.p6y = randomNumber(lh, uh);
      break;
    case 12:
      this.r = randomNumber(0, 255);
      break;
    case 13:
      this.g = randomNumber(0, 255);
      break;
    case 14:
      this.b = randomNumber(0, 255);
      break;
    case 15:
      this.a = Math.random();
      break;
    case 16: // FULL POSITION RANDOM
      this.p1x = randomNumber(lw, uw);
      this.p1y = randomNumber(lh, uh);
      this.p2x = randomNumber(lw, uw);
      this.p2y = randomNumber(lh, uh);
      this.p3x = randomNumber(lw, uw);
      this.p3y = randomNumber(lh, uh);
      this.p4x = randomNumber(lw, uw);
      this.p4y = randomNumber(lh, uh);
      this.p5x = randomNumber(lw, uw);
      this.p5y = randomNumber(lh, uh);
      this.p6x = randomNumber(lw, uw);
      this.p6y = randomNumber(lh, uh);
      break;
    case 17: // FULL COLOUR RANDOM
      this.r = randomNumber(0, 255);
      this.g = randomNumber(0, 255);
      this.b = randomNumber(0, 255);
      break;
    case 18: // FUCK IT UP
      this.p1x = randomNumber(lw, uw);
      this.p1y = randomNumber(lh, uh);
      this.p2x = randomNumber(lw, uw);
      this.p2y = randomNumber(lh, uh);
      this.p3x = randomNumber(lw, uw);
      this.p3y = randomNumber(lh, uh);
      this.p4x = randomNumber(lw, uw);
      this.p4y = randomNumber(lh, uh);
      this.p5x = randomNumber(lw, uw);
      this.p5y = randomNumber(lh, uh);
      this.p6x = randomNumber(lw, uw);
      this.p6y = randomNumber(lh, uh);
      this.r = randomNumber(0, 255);
      this.g = randomNumber(0, 255);
      this.b = randomNumber(0, 255);
      this.a = Math.random();
      break;
    }
  };

  window.onload = start();

})();



