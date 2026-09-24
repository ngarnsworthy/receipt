// RECEIPT!
// This is the file to edit. p5.js reference: https://p5js.org/reference/
import JsBarcode from "jsbarcode";

export const receipt = {
  height: 1080, // 240–2000 px. Width is fixed by the printer.
  seed: 263594,
};

/**
 * @param {import('p5')} p - The p5 instance.
 */
export function drawReceipt(p) {
  const { width: w, height: h } = p;
  const margin = 24;
  const numStars = 100;
  const waterPoints = 1500;

  // Header
  p.noStroke();
  p.fill(0);
  p.textFont("monospace");
  p.textAlign(p.CENTER, p.TOP);
  p.textStyle(p.BOLD);
  p.textSize(28);
  p.text("MORNING WATER", w / 2, 30);

  dashedLine(p, margin, 94, w - margin, 94, 6, 5);

  // Top: 118

  // Sky: 118-430

  for (let i = 0; i < numStars; i++) {
    const x = p.random(margin, w - margin);
    const y = p.random(118, 430);
    const rawSize = p.random(0, 5);
    const sizeChange = ((y - 118) / (430 - 118)) * 5;
    const size = rawSize - sizeChange;
    if (size < 0) {
      i--;
      continue;
    }
    p.circle(x, y, size);
  }

  // Sun

  p.arc(w / 2, 430, w / 6, w / 6, Math.PI, Math.PI * 2);

  // Water: 430-600

  p.noFill();
  for (let i = 0; i < waterPoints; i++) {
    // const x = p.random(margin, w - margin);
    const y = p.random(430, 750);
    const xSquish = (y - 430) / (650 - 430) + 0.3;
    const x = p.randomGaussian(w / 2, (w / 5) * xSquish);
    p.point(x, y);
  }
  p.fill(0);

  // Sand: 600-915

  sand(p, margin, 600, w - margin, 915);

  // Bottom: 915

  dashedLine(p, margin, 930, w - margin, 930, 6, 5);

  const barcodeValue = "www.ngarnsworthy.dev";
  drawBarcode(p, barcodeValue, w / 2, 960);

  p.noStroke();
  p.fill(0);
  p.textFont("monospace");
  p.textAlign(p.CENTER, p.TOP);
  p.textStyle(p.NORMAL);
  p.textSize(10);
  p.text(barcodeValue, w / 2, 1024);

  // Margins
  p.fill("white");
  p.noStroke();
  p.rect(0, 0, margin, h);
  p.rect(w - margin, 0, margin, h);
}

function drawBarcode(p, value, centerX, y) {
  const barcodeCanvas = document.createElement("canvas");
  JsBarcode(barcodeCanvas, value, {
    format: "CODE128",
    width: 1,
    height: 52,
    displayValue: false,
    margin: 0,
    background: "#ffffff",
    lineColor: "#000000",
  });
  // Draw directly on p5's canvas: p.image expects a p5 image wrapper, while
  // JsBarcode returns a regular browser canvas.
  p.drawingContext.drawImage(
    barcodeCanvas,
    Math.floor(centerX - barcodeCanvas.width / 2),
    y,
  );
}

function dashedLine(p, x1, y1, x2, y2, dash, gap) {
  p.stroke(0);
  p.strokeWeight(2);
  for (let x = x1; x < x2; x += dash + gap) {
    p.line(x, y1, Math.min(x + dash, x2), y2);
  }
}

/**
 * @param {import('p5')} p - The p5 instance.
 */
function sand(p, x1, y1, x2, y2) {
  for (let x = x1; x < x2; x += 4) {
    for (let y = y1; y < y2; y += 4) {
      const value =
        p.noise(x * 0.003, y * 0.003) * 0.6 +
        ((y - y1) / (y2 - y1)) * -0.8 +
        0.7;
      if (value < 0.8) {
        p.fill("white");
        p.noStroke();
        p.rect(x, y, 4);
        p.stroke("black");
        p.fill("black");
      }
      if (value < 0.2) {
        p.rect(x, y, 2);
      } else if (value < 0.4) {
        p.point(x, y);
        p.point(x, y + 2);
        p.point(x + 2, y + 2);
      } else if (value < 0.6) {
        p.point(x, y);
        p.point(x + 2, y + 2);
      } else if (value < 0.8) {
        p.point(x, y);
      }
    }
  }
}
