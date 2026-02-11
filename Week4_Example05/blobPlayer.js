/*
BlobPlayer.js (Example 5)

BlobPlayer owns all "dynamic" player state:
- position (x,y), radius (r)
- velocity (vx,vy)
- movement tuning (accel, friction, max run)
- jump state (onGround)
- blob rendering animation parameters (noise wobble)

It also implements:
- update() for physics + collision against platforms
- jump() for input
- draw() for the "breathing blob" look

The algorithm is the same as the original blob world example from Week 2: 
- Apply input acceleration
- Apply friction
- Apply gravity
- Compute an AABB (box) around the blob
- Move box in X and resolve collisions
- Move box in Y and resolve collisions
- Write back box center to blob position
*/

class BlobPlayer {
  constructor() {
    // Position + size
    this.x = 0;
    this.y = 0;
    this.r = 26;

    // Velocity
    this.vx = 0;
    this.vy = 0;

    // Movement tuning
    this.accel = 0.55;
    this.maxRun = 4.0;

    // Physics (overridden by level)
    this.gravity = 0.65;
    this.jumpV = -11.0;

    // State
    this.onGround = false;

    // Friction
    this.frictionAir = 0.995;
    this.frictionGround = 0.88;

    // Blob animation
    this.t = 0;
    this.tSpeed = 0.01;
    this.wobble = 7;
    this.points = 48;
    this.wobbleFreq = 0.9;
  }

  spawnFromLevel(level) {
    this.startX = level.start.x;
    this.startY = level.start.y;

    this.gravity = level.gravity;
    this.jumpV = level.jumpV;

    this.x = this.startX;
    this.y = this.startY;
    this.r = level.start.r;

    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
  }

  update(platforms) {
    let move = 0;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) move -= 1;
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) move += 1;

    this.vx += this.accel * move;
    this.vx *= this.onGround ? this.frictionGround : this.frictionAir;
    this.vx = constrain(this.vx, -this.maxRun, this.maxRun);

    this.vy += this.gravity;

    let box = {
      x: this.x - this.r,
      y: this.y - this.r,
      w: this.r * 2,
      h: this.r * 2,
    };

    box.x += this.vx;

    for (const s of platforms) {
      // Lava kills you
      if (s.type === "lava" && overlapAABB(box, s)) {
        this.respawn();
        return;
      }

      // Ghost platforms: ignore physics
      if (s.type === "ghost") continue;

      // Normal solid collision
      if (overlapAABB(box, s)) {
        if (this.vx > 0) box.x = s.x - box.w;
        else if (this.vx < 0) box.x = s.x + s.w;
        this.vx = 0;
      }
    }

    box.y += this.vy;
    box.y += this.vy;
    this.onGround = false;

    for (const s of platforms) {
      if (s.type === "lava" && overlapAABB(box, s)) {
        this.respawn();
        return;
      }
      if (s.type === "ghost") continue;

      if (overlapAABB(box, s)) {
        if (this.vy > 0) {
          box.y = s.y - box.h;
          this.vy = 0;
          this.onGround = true;
        } else if (this.vy < 0) {
          box.y = s.y + s.h;
          this.vy = 0;
        }
      }
    }

    this.x = box.x + box.w / 2;
    this.y = box.y + box.h / 2;

    this.x = constrain(this.x, this.r, width - this.r);

    this.t += this.tSpeed;
  }

  jump() {
    if (!this.onGround) return;
    this.vy = this.jumpV;
    this.onGround = false;
  }
  respawn() {
    this.x = this.startX;
    this.y = this.startY;
    this.vx = 0;
    this.vy = 0;
  }

  draw(colourHex) {
    fill(color(colourHex));
    beginShape();

    for (let i = 0; i < this.points; i++) {
      const a = (i / this.points) * TAU;
      const n = noise(
        cos(a) * this.wobbleFreq + 100,
        sin(a) * this.wobbleFreq + 100,
        this.t
      );
      const rr = this.r + map(n, 0, 1, -this.wobble, this.wobble);
      vertex(this.x + cos(a) * rr, this.y + sin(a) * rr);
    }

    endShape(CLOSE);
  }
}

function overlapAABB(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}
