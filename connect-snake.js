function generateGrid(topLeft, topRight, bottomLeft, bottomRight, numRows, numColumns) {
  const [tl_x, tl_y] = topLeft;
  const [tr_x, tr_y] = topRight;
  const [bl_x, bl_y] = bottomLeft;
  const [br_x, br_y] = bottomRight;

  // top left to top right
  const x_step = Math.abs(tl_x - tr_x)/(numColumns-1)

  // to accomodate the angled board (top left to top right)
  const y_drift = Math.abs(tl_y - tr_y) / (numRows-1)

  // top left to bottom left
  const y_step = Math.abs(tl_y - bl_y) / (numRows-1)

  // TODO: Account for changing y drift as you go down the grid

  let grid = []

  let px = tl_x
  for (let x = 0; x < numColumns; x++) {
    let py = tl_y - (x * y_drift)
    for (let y = 0; y < numRows; y++) {
      grid.push({x, y, px, py})
      
      py += y_step
    }

    px += x_step
  }

  return grid
}

const originalGridList = [
  {x: 0, y: 0, px: 285, py: 333}, // top left
  {x: 0, y: 1, px: 283, py: 377.5},
  {x: 0, y: 2, px: 284, py: 424},
  {x: 0, y: 3, px: 282, py: 467.5},
  {x: 0, y: 4, px: 283, py: 512},
  {x: 0, y: 5, px: 283, py: 556}, // bottom left
  {x: 1, y: 0, px: 318, py: 330},
  {x: 1, y: 1, px: 317, py: 374.5},
  {x: 1, y: 2, px: 316, py: 419},
  {x: 1, y: 3, px: 317, py: 463.5},
  {x: 1, y: 4, px: 317, py: 508},
  {x: 1, y: 5, px: 318, py: 550},
  {x: 2, y: 0, px: 351, py: 327},
  {x: 2, y: 1, px: 350.3, py: 371.5},
  {x: 2, y: 2, px: 350, py: 416},
  {x: 2, y: 3, px: 349, py: 460.5},
  {x: 2, y: 4, px: 349, py: 502},
  {x: 2, y: 5, px: 349.5, py: 545},
  {x: 3, y: 0, px: 384, py: 324},
  {x: 3, y: 1, px: 383.5, py: 368.5},
  {x: 3, y: 2, px: 383, py: 413},
  {x: 3, y: 3, px: 383.5, py: 454.5},
  {x: 3, y: 4, px: 385, py: 498},
  {x: 3, y: 5, px: 384.8, py: 539},
  {x: 4, y: 0, px: 417, py: 321},
  {x: 4, y: 1, px: 416.6, py: 365},
  {x: 4, y: 2, px: 416.7, py: 406},
  {x: 4, y: 3, px: 416.6, py: 451},
  {x: 4, y: 4, px: 416.9, py: 493},
  {x: 4, y: 5, px: 417.5, py: 535},
  {x: 5, y: 0, px: 450, py: 318},
  {x: 5, y: 1, px: 449.6, py: 362.5},
  {x: 5, y: 2, px: 449.6, py: 405.5},
  {x: 5, y: 3, px: 450, py: 447},
  {x: 5, y: 4, px: 450.5, py: 489},
  {x: 5, y: 5, px: 451, py: 527},
  {x: 6, y: 0, px: 483, py: 315}, // top right
  {x: 6, y: 1, px: 482, py: 358},
  {x: 6, y: 2, px: 482, py: 399},
  {x: 6, y: 3, px: 480.8, py: 442},
  {x: 6, y: 4, px: 480.8, py: 484},
  {x: 6, y: 5, px: 480, py: 523} // bottom right
]

const gridList = generateGrid(
  [originalGridList[0].px, originalGridList[0].py], // top left
  [originalGridList[36].px, originalGridList[36].py], // top right
  [originalGridList[5].px, originalGridList[5].py], // bottom left
  [originalGridList[41].px, originalGridList[41].py], // bottom right
  6, // rows
  7 // cols
)

console.log(gridList)

// Creates a default snake
function createSnake () {
  return {
    alive: true,
    vel: new Velocity('down'),
    tail: [ {x: 4, y: 0} ]
  }
}

function coordOutOfBounds (pos) {
  return pos.x < 0 ||
         pos.x > 6 ||
         pos.y < 0 ||
         pos.y > 5
}

class Velocity {
  constructor (direction) {
    if (direction === 'up') {
      return {x: 0, y: 1}
    } else if (direction === 'down') {
      return {x: 0, y: -1}
    } else if (direction === 'left') {
      return {x: -1, y: 0}
    } else if (direction === 'right') {
      return {x: 1, y: 0}
    }
  }
  static left () {
    return new Velocity('left')
  }
  static right () {
    return new Velocity('right')
  }
  static up () {
    return new Velocity('up')
  }
  static down () {
    return new Velocity('down')
  }
}

class ConnectSnakeGame {
  constructor (nodeId) {
    this.canvas = null
    this.context = null
    this.board = null
    this.yellow = null
    this.red = null
    this.game = null
    this.gameFlash = 0
    this.interval = null
    this.defaultInterval = 500
    this.food = null
    this.snake = null
    this.velInput = null
    this.nodeId = nodeId
    this.initializeGame()
  }

  initializeGame () {
    // Build dom elements
    this.canvas = document.createElement('canvas')
    this.canvas.setAttribute('width', 720)
    this.canvas.setAttribute('height', 715)
    this.canvas.setAttribute('id', 'gamecanvas')
    this.context = this.canvas.getContext('2d')

    this.board = document.createElement('img')
    this.board.setAttribute('src', 'static/board.png')
    this.board.setAttribute('style', 'display: none')

    this.dot = document.createElement('img')
    this.dot.setAttribute('src', 'static/dot.png')
    this.dot.setAttribute('style', 'display: none')

    let self = this
    this.board.onload = () => {
      self.context.drawImage(self.board, 0, 0)

      gridList.forEach(coord => {
        self.context.drawImage(self.dot, coord.px, coord.py)
      })
    }

    this.yellow = document.createElement('img')
    this.yellow.setAttribute('src', 'static/yellow.png')
    this.yellow.setAttribute('style', 'display: none')

    this.red = document.createElement('img')
    this.red.setAttribute('src', 'static/red.png')
    this.red.setAttribute('style', 'display: none')

    let elRoot = document.getElementById(this.nodeId)
    elRoot.appendChild(this.board)
    elRoot.appendChild(this.red)
    elRoot.appendChild(this.yellow)
    elRoot.appendChild(this.canvas)
  }

  gameStart () {
    // Make sure we're not overwriting an existing game
    if (this.game != null) { return }
    // Set everything to initial values. Clears values from previous plays
    this.game = null
    this.gameFlash = 0
    this.interval = this.defaultInterval
    this.food = null
    this.snake = null
    this.velInput = null
    this.context.drawImage(this.board, 0, 0)
    this.snake = createSnake()
    this.food = this.createFood()
    this.renderSnake()
    this.renderFood()
    window.addEventListener(
      'keydown',
      (function (self) {
        return function (e) { self.keypress(e) }
      })(this),
      false
    )
    this.updateGameInterval()
  }

  updateGameInterval() {
    clearInterval(this.game)
    this.game = setInterval(
      (function (self) {
        return function () { self.gameTick() }
      })(this),
      this.interval
    )
  }

  renderPuck (color, x, y) {
    let coord = gridList[x * 6 + y]
    this.context.drawImage(color, coord.px, coord.py)
  }

  renderSnake () {
    let self = this
    this.snake.tail.forEach(function (i) {
      self.renderPuck(self.yellow, i.x, i.y)
    })
  }

  renderFood () {
    this.renderPuck(this.red, this.food.x, this.food.y)
  }

  createFood () {
    let spaces = JSON.parse(JSON.stringify(gridList))
    // Remove spaces occupied by the snake tail. Spaces with the tail are
    // marked as null. The subsequent filter just removes all items that
    // are null, leaving unoccupied spaces.
    this.snake.tail.forEach(item => { spaces[item.x * 6 + item.y] = null })
    let available = spaces.filter(item => item != null)
    return available[Math.floor(Math.random() * available.length)]
  }

  keypress (event) {
    // Prevent arrow keys from scrolling around
    if (event.code === 'ArrowLeft' ||
        event.code === 'ArrowRight' ||
        event.code === 'ArrowUp' ||
        event.code === 'ArrowDown') {
      event.preventDefault()
    }
    if (this.snake.vel.x === 0 && event.code === 'ArrowLeft') {
      this.velInput = Velocity.left()
    } else if (this.snake.vel.x === 0 && event.code === 'ArrowRight') {
      this.velInput = Velocity.right()
    } else if (this.snake.vel.y === 0 && event.code === 'ArrowDown') {
      this.velInput = Velocity.down()
    } else if (this.snake.vel.y === 0 && event.code === 'ArrowUp') {
      this.velInput = Velocity.up()
    }
  }

  snakeOverlaps (newPos) {
    let overlap = false
    this.snake.tail.slice(1, this.snake.tail.length - 1).forEach(item => {
      if (item.x === newPos.x && item.y === newPos.y) {
        overlap = true
      }
    })
    return overlap
  }

  gameOver () {
    this.gameFlash += 1
    this.context.drawImage(this.board, 0, 0)
    if (this.gameFlash % 2 !== 1) {
      this.renderSnake()
      this.renderFood()
    }
  }

  gameTick (game) {
    if (this.snake.alive) {
      this.snake.alive = this.gameLoop()
    } else if (this.gameFlash < 7) {
      this.gameOver()
    } else {
      clearInterval(this.game)
      this.game = null
      window.removeEventListener('keydown', this.keypress, false)
    }
  }

  gameLoop () {
    // apply user input
    if (this.velInput != null) {
      this.snake.vel.x = this.velInput.x
      this.snake.vel.y = this.velInput.y
    }

    // apply velocity, updating the position of the snake
    let newPos = Object.assign({}, this.snake.tail[this.snake.tail.length - 1])
    newPos.x += this.snake.vel.x
    newPos.y -= this.snake.vel.y

    // Check if new position is overlapping snake body or if new position will be out of bounds
    if (this.snakeOverlaps(newPos) || coordOutOfBounds(newPos)) {
      return false
    }

    // Update the position of the snake. If the new position
    // is on the food, don't trim the end of the tail and instead
    // generate another food somewhere
    this.snake.tail.push(newPos)
    if (newPos.x === this.food.x && newPos.y === this.food.y) {
      this.food = this.createFood()
      this.interval -= 20
      this.updateGameInterval()
    } else {
      this.snake.tail = this.snake.tail.splice(1)
    }

    // Re render the game
    this.context.drawImage(this.board, 0, 0)
    this.renderSnake()
    this.renderFood()
    return true
  }
}

export { ConnectSnakeGame }
