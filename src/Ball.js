import {
  BALL_RADIUS,
  COLORS,
  MORTALITY_PERCENTATGE,
  SYMPTOMATIC_PERCENTAGE,
  TICKS_TO_RECOVER,
  RUN,
  SPEED,
  MAXSPEED,
  STATES
} from './options.js'
import { checkCollision, calculateChangeDirection } from './collisions.js'

const diameter = BALL_RADIUS * 2

export class Ball {
  constructor ({ x, y, id, state, sketch, hasMovement, has_app_installed: hasAppInstalled }) {
    this.x = x
    this.y = y
    this.vx = sketch.random(-1, 1) * SPEED
    this.vy = sketch.random(-1, 1) * SPEED
    this.sketch = sketch
    this.id = id
    this.state = state
    this.timeInfected = 0
    this.hasMovement = hasMovement
    this.hasCollision = true
    this.survivor = false
    this.hasAppInstalled = hasAppInstalled
    this.contacts = []
    this.feelSick = null
  }

  checkState () {
    if (this.state === STATES.infected || this.state === STATES.quarantine) {
      if (RUN.filters.death && !this.survivor && this.timeInfected >= TICKS_TO_RECOVER / 2) {
        this.survivor = this.sketch.random(100) >= MORTALITY_PERCENTATGE
        if (!this.survivor) {
          this.hasMovement = false
          const oldState = this.state
          this.state = STATES.death
          RUN.results[oldState]--
          RUN.results[STATES.death]++
          return
        }
      }
      if (this.hasAppInstalled) {
        this.hasMovement = false
      }

      if (this.timeInfected >= TICKS_TO_RECOVER) {
        const oldState = this.state
        this.state = STATES.recovered
        RUN.results[oldState]--
        RUN.results[STATES.recovered]++
        this.hasMovement = true
      } else {
        this.timeInfected++
      }
    }

    // after a while it may feel sick
    if (this.state === STATES.infected) {
      if (this.feelSick === null && this.timeInfected >= TICKS_TO_RECOVER / 3) {
        this.feelSick = SYMPTOMATIC_PERCENTAGE >= this.sketch.random(100)
        if (this.feelSick) {
          this.state = STATES.quarantine
          RUN.results[STATES.infected]--
          RUN.results[STATES.quarantine]++
          return
        }
      }
    }

    // notify quarantine state to all contacts having app
    if (this.state === STATES.quarantine) {
      if (this.hasAppInstalled) {
        for (let i = 0; i < this.contacts.length; i++) {
          const otherBall = this.contacts[i]
          if (otherBall.hasAppInstalled && otherBall.state === STATES.infected) {
            otherBall.contacts.splice(otherBall.contacts.indexOf(this), 1)
            otherBall.state = STATES.quarantine
            RUN.results[STATES.infected]--
            RUN.results[STATES.quarantine]++
          }
        }
        this.contacts = []
      }
    }
  }

  checkCollisions ({ others }) {
    if (this.state === STATES.death) return

    for (let i = this.id + 1; i < others.length; i++) {
      const otherBall = others[i]
      const { state, x, y } = otherBall
      if (state === STATES.death) continue

      const dx = x - this.x
      const dy = y - this.y

      if (checkCollision({ dx, dy, diameter: BALL_RADIUS * 2 })) {
        const { ax, ay } = calculateChangeDirection({ dx, dy })

        this.vx -= ax
        this.vy -= ay
        otherBall.vx = ax
        otherBall.vy = ay

        // limit vx and vy to MAXSPEED
        this.vx = Math.max(Math.min(this.vx, MAXSPEED), -MAXSPEED)
        this.vy = Math.max(Math.min(this.vy, MAXSPEED), -MAXSPEED)
        otherBall.vx = Math.max(Math.min(otherBall.vx, MAXSPEED), -MAXSPEED)
        otherBall.vy = Math.max(Math.min(otherBall.vy, MAXSPEED), -MAXSPEED)

        // both has same state, so nothing to do
        if (this.state === state) return
        // if any is recovered, then nothing happens
        if (this.state === STATES.recovered || state === STATES.recovered) return
        // if any is in quarantine, then nothing happens
        if (this.state === STATES.quarantine || state === STATES.quarantine) return
        // then, if some is infected, then we make both infected
        if (this.state === STATES.infected || state === STATES.infected) {
          // this and otherBall came in touch, update their contact list
          if (this.contacts.indexOf(otherBall) === -1) {
            this.contacts.push(otherBall)
            otherBall.contacts.push(this)
          }
          this.state = otherBall.state = STATES.infected
          RUN.results[STATES.infected]++
          RUN.results[STATES.well]--
        }
      }
    }
  }

  move () {
    if (!this.hasMovement) return

    this.x += this.vx
    this.y += this.vy

    // check horizontal walls
    if (
      (this.x + BALL_RADIUS > this.sketch.width && this.vx > 0) ||
      (this.x - BALL_RADIUS < 0 && this.vx < 0)) {
      this.vx *= -1
    }

    // check vertical walls
    if (
      (this.y + BALL_RADIUS > this.sketch.height && this.vy > 0) ||
      (this.y - BALL_RADIUS < 0 && this.vy < 0)) {
      this.vy *= -1
    }
  }

  render () {
    const color = COLORS[this.state]
    this.sketch.noStroke()
    this.sketch.fill(color)
    this.sketch.ellipse(this.x, this.y, diameter, diameter)
    if (this.hasAppInstalled) {
      this.sketch.fill(COLORS.app_installed)
      this.sketch.ellipse(this.x, this.y, 4, 4)
    }
  }
}
