const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.2
class Sprite {
  constructor({ position, velocity, color = 'red', offset }) {
    this.position = position
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey = ''
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    }
    this.color = color
    this.isAttacking = false
    this.health = 100
  }

  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

    if (this.isAttacking) {
      c.fillStyle = 'green'
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height,
      )
    }
  }

  update() {
    this.draw()
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x
    this.attackBox.position.y = this.position.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0
    } else this.velocity.y += gravity
  }

  attack() {
    this.isAttacking = true

    setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
})
player.draw()

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  offset: {
    x: 50,
    y: 0,
  },
})
enemy.draw()

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
}

function rectangularCollision({ rec1, rec2 }) {
  return (
    rec1.attackBox.position.x + rec1.attackBox.width >= rec2.position.x &&
    rec1.attackBox.position.x <= rec2.position.x + rec2.width &&
    rec1.attackBox.position.y + rec1.attackBox.height >= rec2.position.y &&
    rec1.attackBox.position.y <= rec2.position.y + rec2.height
  )
}

function determineWinner({ player, enemy, timerId }) {
  clearInterval(timerId)
  document.querySelector('#displayText').style.display = 'flex'

  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player Wins'
  } else {
    document.querySelector('#displayText').innerHTML = 'Enemy Wins'
  }
}

let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#time').innerHTML = timer
  }

  if (timer !== 0) return

  determineWinner({ player, enemy, timerId })
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)

  c.fillStyle = 'black'
  c.clearRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -1
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 1
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -1
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 1
  }

  // detect for collision
  if (
    rectangularCollision({ rec1: player, rec2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false
    enemy.health -= 20
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }

  if (
    rectangularCollision({ rec1: enemy, rec2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false
    player.health -= 20
    document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break

    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break

    case 'w':
      player.velocity.y = -10
      break

    case ' ':
      player.attack()
      break

    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break

    case 'ArrowUp':
      enemy.velocity.y = -10
      break
    case 'ArrowDown':
      enemy.attack()
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'w':
      keys.w.pressed = false
      break

    // enemy keys
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      break
  }
})
