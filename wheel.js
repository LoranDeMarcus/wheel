import { Winwheel } from './Winwheel.js'

const wheel = new Winwheel({
  numSegments: 8,
  outerRadius: 170,
  segments:
    [
      { fillStyle: '#eae56f', text: 'Prize 1' },
      { fillStyle: '#89f26e', text: 'Prize 2' },
      { fillStyle: '#7de6ef', text: 'Prize 3' },
      { fillStyle: '#e7706f', text: 'Prize 4' },
      { fillStyle: '#eae56f', text: 'Prize 5' },
      { fillStyle: '#89f26e', text: 'Prize 6' },
      { fillStyle: '#7de6ef', text: 'Prize 7' },
      { fillStyle: '#e7706f', text: 'Prize 8' },
    ],
  animation:
    {
      type: 'spinToStop',
      duration: 5,
      spins: 8,
      callbackAfter: drawTriangle,
    },
})

function calculatePrize() {
  // This formula always makes the wheel stop somewhere inside prize 3 at least
  // 1 degree away from the start and end edges of the segment.
  let stopAt = (91 + Math.floor((Math.random() * 43)))

  // Important thing is to set the stopAngle of the animation before stating the spin.
  wheel.animation.stopAngle = stopAt

  // May as well start the spin from here.
  wheel.startAnimation()
}

// Usual pointer drawing code.
drawTriangle()

function drawTriangle() {
  // Get the canvas context the wheel uses.
  let ctx = wheel.ctx

  ctx.strokeStyle = 'navy'     // Set line colour.
  ctx.fillStyle = 'aqua'     // Set fill colour.
  ctx.lineWidth = 2
  ctx.beginPath()              // Begin path.
  ctx.moveTo(170, 5)           // Move to initial position.
  ctx.lineTo(230, 5)           // Draw lines to make the shape.
  ctx.lineTo(200, 40)
  ctx.lineTo(171, 5)
  ctx.stroke()                 // Complete the path by stroking (draw lines).
  ctx.fill()                   // Then fill.
}
