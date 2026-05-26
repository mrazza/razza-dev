// Lightweight, highly performant, and 100% testable 2D Physics Engine
// Designed specifically for razza.dev Resonant Sandbox.

export type BodyType = 'circle' | 'rectangle';

export interface PhysicsBody {
  id: string;
  type: BodyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  width?: number;   // Required for rectangle
  height?: number;  // Required for rectangle
  radius?: number;  // Required for circle
  restitution: number; // Bounce coefficient (0 = no bounce, 1 = perfect bounce)
  isStatic?: boolean;
  label: string;
}

export interface CollisionEvent {
  bodyA: PhysicsBody;
  bodyB: PhysicsBody;
  intensity: number; // Relative velocity at collision (used for sound synthesis)
}

export class PhysicsWorld {
  public bodies: PhysicsBody[] = [];
  public gravityX: number = 0;
  public gravityY: number = 0.4; // standard downward gravity
  public friction: number = 0.99; // air resistance
  public bounds: { width: number; height: number } = { width: 800, height: 600 };
  
  // Dragging interaction state
  private dragBodyId: string | null = null;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;

  constructor(width: number = 800, height: number = 600) {
    this.bounds = { width, height };
  }

  /**
   * Resizes world dimensions
   */
  resize(width: number, height: number) {
    this.bounds = { width, height };
  }

  /**
   * Adds a physical body to the world
   */
  addBody(body: PhysicsBody) {
    this.bodies.push(body);
  }

  /**
   * Removes a physical body
   */
  removeBody(id: string) {
    this.bodies = this.bodies.filter(b => b.id !== id);
  }

  /**
   * Clear all bodies
   */
  clear() {
    this.bodies = [];
    this.dragBodyId = null;
  }

  /**
   * Starts dragging a specific body based on pointer coordinates
   */
  startDrag(mouseX: number, mouseY: number): PhysicsBody | null {
    for (const body of this.bodies) {
      if (body.isStatic) continue;

      let isInside = false;
      if (body.type === 'circle' && body.radius) {
        const dx = mouseX - body.x;
        const dy = mouseY - body.y;
        if (Math.sqrt(dx * dx + dy * dy) <= body.radius) {
          isInside = true;
        }
      } else if (body.type === 'rectangle' && body.width && body.height) {
        const halfW = body.width / 2;
        const halfH = body.height / 2;
        if (
          mouseX >= body.x - halfW &&
          mouseX <= body.x + halfW &&
          mouseY >= body.y - halfH &&
          mouseY <= body.y + halfH
        ) {
          isInside = true;
        }
      }

      if (isInside) {
        this.dragBodyId = body.id;
        this.dragOffsetX = mouseX - body.x;
        this.dragOffsetY = mouseY - body.y;
        body.vx = 0;
        body.vy = 0;
        return body;
      }
    }
    return null;
  }

  /**
   * Updates position of dragged body based on cursor coordinates
   */
  updateDrag(mouseX: number, mouseY: number) {
    if (!this.dragBodyId) return;
    const body = this.bodies.find(b => b.id === this.dragBodyId);
    if (body) {
      const targetX = mouseX - this.dragOffsetX;
      const targetY = mouseY - this.dragOffsetY;
      
      // Calculate instantaneous velocity for launching on release
      body.vx = (targetX - body.x) * 0.3;
      body.vy = (targetY - body.y) * 0.3;
      
      body.x = targetX;
      body.y = targetY;
    }
  }

  /**
   * Ends dragging session
   */
  endDrag() {
    this.dragBodyId = null;
  }

  getDraggedBodyId(): string | null {
    return this.dragBodyId;
  }

  /**
   * Step the physical simulation forward in time.
   * Resolves boundaries, gravity, and collisions.
   * Returns a list of collision events for triggering programmatic chimes/clicks.
   */
  step(): CollisionEvent[] {
    const collisions: CollisionEvent[] = [];

    // 1. Apply gravity, air resistance, and step positions
    for (const body of this.bodies) {
      if (body.isStatic || body.id === this.dragBodyId) continue;

      body.vx += this.gravityX;
      body.vy += this.gravityY;
      body.vx *= this.friction;
      body.vy *= this.friction;

      body.x += body.vx;
      body.y += body.vy;
    }

    // 2. Resolve screen/boundary collisions
    for (const body of this.bodies) {
      if (body.isStatic) continue;

      const boundaryImpact = this.resolveBoundaries(body);
      if (boundaryImpact > 0.5) {
        collisions.push({
          bodyA: body,
          bodyB: { id: 'wall', type: 'rectangle', x: 0, y: 0, vx: 0, vy: 0, mass: 9999, restitution: 1.0, label: 'boundary', isStatic: true },
          intensity: boundaryImpact
        });
      }
    }

    // 3. Resolve body-to-body collisions (O(N^2) double-loop, fine for <= 30 items)
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const bodyA = this.bodies[i];
        const bodyB = this.bodies[j];

        const impact = this.resolveCollision(bodyA, bodyB);
        if (impact > 0.1) {
          collisions.push({ bodyA, bodyB, intensity: impact });
        }
      }
    }

    return collisions;
  }

  /**
   * Resolves collision of physical body against world walls/boundaries.
   */
  private resolveBoundaries(body: PhysicsBody): number {
    let impactIntensity = 0;

    if (body.type === 'circle' && body.radius) {
      const rad = body.radius;
      // Floor
      if (body.y + rad >= this.bounds.height) {
        body.y = this.bounds.height - rad;
        impactIntensity = Math.abs(body.vy);
        body.vy = -body.vy * body.restitution;
      }
      // Ceiling
      else if (body.y - rad <= 0) {
        body.y = rad;
        impactIntensity = Math.abs(body.vy);
        body.vy = -body.vy * body.restitution;
      }
      // Left wall
      if (body.x - rad <= 0) {
        body.x = rad;
        impactIntensity = Math.abs(body.vx);
        body.vx = -body.vx * body.restitution;
      }
      // Right wall
      else if (body.x + rad >= this.bounds.width) {
        body.x = this.bounds.width - rad;
        impactIntensity = Math.abs(body.vx);
        body.vx = -body.vx * body.restitution;
      }
    } else if (body.type === 'rectangle' && body.width && body.height) {
      const halfW = body.width / 2;
      const halfH = body.height / 2;

      // Floor
      if (body.y + halfH >= this.bounds.height) {
        body.y = this.bounds.height - halfH;
        impactIntensity = Math.abs(body.vy);
        body.vy = -body.vy * body.restitution;
      }
      // Ceiling
      else if (body.y - halfH <= 0) {
        body.y = halfH;
        impactIntensity = Math.abs(body.vy);
        body.vy = -body.vy * body.restitution;
      }
      // Left wall
      if (body.x - halfW <= 0) {
        body.x = halfW;
        impactIntensity = Math.abs(body.vx);
        body.vx = -body.vx * body.restitution;
      }
      // Right wall
      else if (body.x + halfW >= this.bounds.width) {
        body.x = this.bounds.width - halfW;
        impactIntensity = Math.abs(body.vx);
        body.vx = -body.vx * body.restitution;
      }
    }

    return impactIntensity;
  }

  /**
   * Resolves dual body collisions with standard physics reflection + push-out.
   */
  private resolveCollision(bodyA: PhysicsBody, bodyB: PhysicsBody): number {
    if (bodyA.isStatic && bodyB.isStatic) return 0;

    // Handle Circle-to-Circle
    if (bodyA.type === 'circle' && bodyB.type === 'circle') {
      return this.resolveCircleToCircle(bodyA, bodyB);
    }
    
    // Handle Rectangle-to-Rectangle
    if (bodyA.type === 'rectangle' && bodyB.type === 'rectangle') {
      return this.resolveRectangleToRectangle(bodyA, bodyB);
    }

    // Handle Mixed: Rectangle-to-Circle
    if (bodyA.type === 'rectangle' && bodyB.type === 'circle') {
      return this.resolveRectToCircle(bodyA, bodyB);
    } else {
      return this.resolveRectToCircle(bodyB, bodyA);
    }
  }

  private resolveCircleToCircle(bodyA: PhysicsBody, bodyB: PhysicsBody): number {
    const rA = bodyA.radius || 0;
    const rB = bodyB.radius || 0;
    const dx = bodyB.x - bodyA.x;
    const dy = bodyB.y - bodyA.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = rA + rB;

    if (dist >= minDist || dist === 0) return 0;

    // 1. Separate overlapping circles (push out along collision normal)
    const overlap = minDist - dist;
    const nx = dx / dist;
    const ny = dy / dist;

    // Distribute separation based on static/mass distribution
    const totalInverseMass = (bodyA.isStatic ? 0 : 1 / bodyA.mass) + (bodyB.isStatic ? 0 : 1 / bodyB.mass);
    if (totalInverseMass === 0) return 0;

    const separationX = nx * overlap;
    const separationY = ny * overlap;

    if (!bodyA.isStatic && bodyA.id !== this.dragBodyId) {
      bodyA.x -= separationX * ((1 / bodyA.mass) / totalInverseMass);
      bodyA.y -= separationY * ((1 / bodyA.mass) / totalInverseMass);
    }
    if (!bodyB.isStatic && bodyB.id !== this.dragBodyId) {
      bodyB.x += separationX * ((1 / bodyB.mass) / totalInverseMass);
      bodyB.y += separationY * ((1 / bodyB.mass) / totalInverseMass);
    }

    // 2. Relative velocity along normal
    const rvx = bodyB.vx - bodyA.vx;
    const rvy = bodyB.vy - bodyA.vy;
    const velAlongNormal = rvx * nx + rvy * ny;

    // Do not resolve if velocities are separating
    if (velAlongNormal > 0) return 0;

    // 3. Elastic impulse calculation
    const restitution = Math.min(bodyA.restitution, bodyB.restitution);
    let impulseScalar = -(1 + restitution) * velAlongNormal;
    impulseScalar /= totalInverseMass;

    // Apply impulse
    const impulseX = impulseScalar * nx;
    const impulseY = impulseScalar * ny;

    if (!bodyA.isStatic && bodyA.id !== this.dragBodyId) {
      bodyA.vx -= (1 / bodyA.mass) * impulseX;
      bodyA.vy -= (1 / bodyA.mass) * impulseY;
    }
    if (!bodyB.isStatic && bodyB.id !== this.dragBodyId) {
      bodyB.vx += (1 / bodyB.mass) * impulseX;
      bodyB.vy += (1 / bodyB.mass) * impulseY;
    }

    return Math.abs(velAlongNormal);
  }

  private resolveRectangleToRectangle(bodyA: PhysicsBody, bodyB: PhysicsBody): number {
    const wA = bodyA.width || 0;
    const hA = bodyA.height || 0;
    const wB = bodyB.width || 0;
    const hB = bodyB.height || 0;

    const dx = bodyB.x - bodyA.x;
    const dy = bodyB.y - bodyA.y;

    const halfWA = wA / 2;
    const halfHA = hA / 2;
    const halfWB = wB / 2;
    const halfHB = hB / 2;

    const overlapX = (halfWA + halfWB) - Math.abs(dx);
    const overlapY = (halfHA + halfHB) - Math.abs(dy);

    if (overlapX <= 0 || overlapY <= 0) return 0;

    // Determine normal of collision (axis of least penetration)
    let nx = 0;
    let ny = 0;
    let overlap = 0;

    if (overlapX < overlapY) {
      overlap = overlapX;
      nx = Math.sign(dx);
    } else {
      overlap = overlapY;
      ny = Math.sign(dy);
    }

    const totalInverseMass = (bodyA.isStatic ? 0 : 1 / bodyA.mass) + (bodyB.isStatic ? 0 : 1 / bodyB.mass);
    if (totalInverseMass === 0) return 0;

    // Separate
    const separationX = nx * overlap;
    const separationY = ny * overlap;

    if (!bodyA.isStatic && bodyA.id !== this.dragBodyId) {
      bodyA.x -= separationX * ((1 / bodyA.mass) / totalInverseMass);
      bodyA.y -= separationY * ((1 / bodyA.mass) / totalInverseMass);
    }
    if (!bodyB.isStatic && bodyB.id !== this.dragBodyId) {
      bodyB.x += separationX * ((1 / bodyB.mass) / totalInverseMass);
      bodyB.y += separationY * ((1 / bodyB.mass) / totalInverseMass);
    }

    // Relative velocity
    const rvx = bodyB.vx - bodyA.vx;
    const rvy = bodyB.vy - bodyA.vy;
    const velAlongNormal = rvx * nx + rvy * ny;

    if (velAlongNormal > 0) return 0;

    const restitution = Math.min(bodyA.restitution, bodyB.restitution);
    let impulseScalar = -(1 + restitution) * velAlongNormal;
    impulseScalar /= totalInverseMass;

    const impulseX = impulseScalar * nx;
    const impulseY = impulseScalar * ny;

    if (!bodyA.isStatic && bodyA.id !== this.dragBodyId) {
      bodyA.vx -= (1 / bodyA.mass) * impulseX;
      bodyA.vy -= (1 / bodyA.mass) * impulseY;
    }
    if (!bodyB.isStatic && bodyB.id !== this.dragBodyId) {
      bodyB.vx += (1 / bodyB.mass) * impulseX;
      bodyB.vy += (1 / bodyB.mass) * impulseY;
    }

    return Math.abs(velAlongNormal);
  }

  private resolveRectToCircle(rect: PhysicsBody, circle: PhysicsBody): number {
    const rw = rect.width || 0;
    const rh = rect.height || 0;
    const cr = circle.radius || 0;

    // Find closest point on rectangle to circle's center
    const closestX = Math.max(rect.x - rw / 2, Math.min(circle.x, rect.x + rw / 2));
    const closestY = Math.max(rect.y - rh / 2, Math.min(circle.y, rect.y + rh / 2));

    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // If closest point is inside circle, there is a collision
    if (dist >= cr && dist !== 0) return 0;

    // Normal points from closest point on rect to circle center
    let nx = dist === 0 ? 0 : dx / dist;
    let ny = dist === 0 ? -1 : dy / dist;
    let overlap = cr - dist;

    // If circle center is completely inside rectangle, handle edge penetration
    if (dist === 0) {
      const overlapLeft = circle.x - (rect.x - rw / 2) + cr;
      const overlapRight = (rect.x + rw / 2) - circle.x + cr;
      const overlapTop = circle.y - (rect.y - rh / 2) + cr;
      const overlapBottom = (rect.y + rh / 2) - circle.y + cr;

      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
      if (minOverlap === overlapLeft) {
        nx = -1;
        overlap = overlapLeft;
      } else if (minOverlap === overlapRight) {
        nx = 1;
        overlap = overlapRight;
      } else if (minOverlap === overlapTop) {
        ny = -1;
        overlap = overlapTop;
      } else {
        ny = 1;
        overlap = overlapBottom;
      }
    }

    const totalInverseMass = (rect.isStatic ? 0 : 1 / rect.mass) + (circle.isStatic ? 0 : 1 / circle.mass);
    if (totalInverseMass === 0) return 0;

    // Separate
    const separationX = nx * overlap;
    const separationY = ny * overlap;

    if (!rect.isStatic && rect.id !== this.dragBodyId) {
      rect.x -= separationX * ((1 / rect.mass) / totalInverseMass);
      rect.y -= separationY * ((1 / rect.mass) / totalInverseMass);
    }
    if (!circle.isStatic && circle.id !== this.dragBodyId) {
      circle.x += separationX * ((1 / circle.mass) / totalInverseMass);
      circle.y += separationY * ((1 / circle.mass) / totalInverseMass);
    }

    // Relative velocity
    const rvx = circle.vx - rect.vx;
    const rvy = circle.vy - rect.vy;
    const velAlongNormal = rvx * nx + rvy * ny;

    if (velAlongNormal > 0) return 0;

    const restitution = Math.min(rect.restitution, circle.restitution);
    let impulseScalar = -(1 + restitution) * velAlongNormal;
    impulseScalar /= totalInverseMass;

    const impulseX = impulseScalar * nx;
    const impulseY = impulseScalar * ny;

    if (!rect.isStatic && rect.id !== this.dragBodyId) {
      rect.vx -= (1 / rect.mass) * impulseX;
      rect.vy -= (1 / rect.mass) * impulseY;
    }
    if (!circle.isStatic && circle.id !== this.dragBodyId) {
      circle.vx += (1 / circle.mass) * impulseX;
      circle.vy += (1 / circle.mass) * impulseY;
    }

    return Math.abs(velAlongNormal);
  }
}
