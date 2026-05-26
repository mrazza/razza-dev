import { describe, it, expect, beforeEach } from 'vitest';
import { PhysicsWorld, PhysicsBody } from '../utils/physics';

describe('Tactile Physics Engine Unit Tests', () => {
  let world: PhysicsWorld;

  beforeEach(() => {
    world = new PhysicsWorld(800, 600);
  });

  it('should initialize with correct default bounds', () => {
    expect(world.bounds.width).toBe(800);
    expect(world.bounds.height).toBe(600);
    expect(world.bodies.length).toBe(0);
  });

  it('should support dynamic resizing', () => {
    world.resize(1024, 768);
    expect(world.bounds.width).toBe(1024);
    expect(world.bounds.height).toBe(768);
  });

  it('should add, remove, and clear physical bodies', () => {
    const ball: PhysicsBody = {
      id: 'ball-1',
      type: 'circle',
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 20,
      restitution: 0.8,
      label: 'ball'
    };

    world.addBody(ball);
    expect(world.bodies.length).toBe(1);
    expect(world.bodies[0].id).toBe('ball-1');

    world.removeBody('ball-1');
    expect(world.bodies.length).toBe(0);

    world.addBody(ball);
    world.addBody({ ...ball, id: 'ball-2' });
    expect(world.bodies.length).toBe(2);

    world.clear();
    expect(world.bodies.length).toBe(0);
  });

  it('should apply gravity, friction, and advance positions on step', () => {
    const ball: PhysicsBody = {
      id: 'ball-1',
      type: 'circle',
      x: 100,
      y: 100,
      vx: 2,
      vy: 0,
      mass: 1,
      radius: 10,
      restitution: 0.8,
      label: 'ball'
    };

    world.gravityY = 1.0;
    world.gravityX = 0;
    world.friction = 0.9; // 10% resistance per step

    world.addBody(ball);

    // After 1 step:
    // vx = (2 + 0) * 0.9 = 1.8
    // vy = (0 + 1) * 0.9 = 0.9
    // x = 100 + 1.8 = 101.8
    // y = 100 + 0.9 = 100.9
    world.step();

    expect(ball.vx).toBeCloseTo(1.8, 5);
    expect(ball.vy).toBeCloseTo(0.9, 5);
    expect(ball.x).toBeCloseTo(101.8, 5);
    expect(ball.y).toBeCloseTo(100.9, 5);
  });

  it('should bounce circles off boundary walls', () => {
    const ball: PhysicsBody = {
      id: 'ball-1',
      type: 'circle',
      x: 785, // close to right wall (width 800)
      y: 585, // close to floor (height 600)
      vx: 10, // moving right
      vy: 10, // moving down
      mass: 1,
      radius: 10,
      restitution: 0.8,
      label: 'ball'
    };

    world.gravityX = 0;
    world.gravityY = 0;
    world.friction = 1.0; // no air resistance for easy prediction

    world.addBody(ball);

    // Initial position 785, 585. Rad 10.
    // 1st step:
    // x becomes 795, y becomes 595.
    // Boundary checks:
    // x + rad = 795 + 10 = 805 >= 800.
    // Bounces: x gets set to 800 - 10 = 790. vx becomes -10 * 0.8 = -8.
    // y + rad = 595 + 10 = 605 >= 600.
    // Bounces: y gets set to 600 - 10 = 590. vy becomes -10 * 0.8 = -8.
    const collisions = world.step();

    expect(ball.x).toBe(790);
    expect(ball.y).toBe(590);
    expect(ball.vx).toBe(-8);
    expect(ball.vy).toBe(-8);
    expect(collisions.length).toBeGreaterThanOrEqual(1);
    expect(collisions[0].intensity).toBeGreaterThan(0);
  });

  it('should bounce rectangles off boundary walls', () => {
    const rect: PhysicsBody = {
      id: 'rect-1',
      type: 'rectangle',
      x: 15, // close to left wall
      y: 15, // close to ceiling
      vx: -10,
      vy: -10,
      mass: 1,
      width: 20,
      height: 20,
      restitution: 0.5,
      label: 'card'
    };

    world.gravityX = 0;
    world.gravityY = 0;
    world.friction = 1.0;
    world.addBody(rect);

    // step: x = 5, y = 5
    // half width/height = 10.
    // x - halfW = -5 <= 0. Bounces to x = 10, vx = -(-10) * 0.5 = 5.
    // y - halfH = -5 <= 0. Bounces to y = 10, vy = -(-10) * 0.5 = 5.
    world.step();

    expect(rect.x).toBe(10);
    expect(rect.y).toBe(10);
    expect(rect.vx).toBe(5);
    expect(rect.vy).toBe(5);
  });

  it('should resolve circle-to-circle collisions perfectly', () => {
    // Two circles heading straight towards each other
    const c1: PhysicsBody = {
      id: 'c1',
      type: 'circle',
      x: 100,
      y: 100,
      vx: 5,
      vy: 0,
      mass: 1,
      radius: 15,
      restitution: 1.0,
      label: 'ball'
    };

    const c2: PhysicsBody = {
      id: 'c2',
      type: 'circle',
      x: 125, // Distance = 25. Combined radii = 30. Overlap = 5.
      y: 100,
      vx: -5,
      vy: 0,
      mass: 1,
      radius: 15,
      restitution: 1.0,
      label: 'ball'
    };

    world.gravityX = 0;
    world.gravityY = 0;
    world.friction = 1.0;
    world.addBody(c1);
    world.addBody(c2);

    // Before collision logic runs in step(), they move:
    // c1.x becomes 105, c2.x becomes 120.
    // New distance = 15. Overlap = 30 - 15 = 15.
    // Let's step and check resolved velocities (due to mass=1 and restitution=1, they should fully swap velocities)
    const collisions = world.step();

    expect(collisions.length).toBe(1);
    expect(c1.vx).toBeLessThan(0); // bounce back left
    expect(c2.vx).toBeGreaterThan(0); // bounce back right
    expect(c1.x).toBeLessThan(105); // pushed away
    expect(c2.x).toBeGreaterThan(120); // pushed away
  });

  it('should resolve rectangle-to-rectangle collisions perfectly', () => {
    const r1: PhysicsBody = {
      id: 'r1',
      type: 'rectangle',
      x: 100,
      y: 100,
      vx: 2,
      vy: 0,
      mass: 1,
      width: 40,
      height: 40,
      restitution: 0.5,
      label: 'card'
    };

    const r2: PhysicsBody = {
      id: 'r2',
      type: 'rectangle',
      x: 135, // w1/2 + w2/2 = 40. overlap occurs when |dx| < 40. Currently 35.
      y: 100,
      vx: -2,
      vy: 0,
      mass: 1,
      width: 40,
      height: 40,
      restitution: 0.5,
      label: 'card'
    };

    world.gravityX = 0;
    world.gravityY = 0;
    world.friction = 1.0;
    world.addBody(r1);
    world.addBody(r2);

    const collisions = world.step();
    expect(collisions.length).toBe(1);
    expect(r1.vx).toBeLessThan(0);
    expect(r2.vx).toBeGreaterThan(0);
  });

  it('should resolve mixed rectangle-to-circle collisions perfectly', () => {
    const rect: PhysicsBody = {
      id: 'r1',
      type: 'rectangle',
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      mass: 100, // heavy
      width: 50,
      height: 50,
      restitution: 1.0,
      label: 'card'
    };

    const circle: PhysicsBody = {
      id: 'c1',
      type: 'circle',
      x: 140, // rect bounds: 75 to 125. Circle center is 140, radius is 20. Overlaps! (140 - 20 = 120 < 125)
      y: 100,
      vx: -10, // moving fast into rect
      vy: 0,
      mass: 1, // light
      radius: 20,
      restitution: 1.0,
      label: 'ball'
    };

    world.gravityX = 0;
    world.gravityY = 0;
    world.friction = 1.0;
    world.addBody(rect);
    world.addBody(circle);

    const collisions = world.step();
    expect(collisions.length).toBe(1);
    // Circle should bounce backward fast
    expect(circle.vx).toBeGreaterThan(0);
  });

  describe('Mouse Drag and Drop Mechanics', () => {
    it('should identify hover/clicks and start dragging', () => {
      const card: PhysicsBody = {
        id: 'card-1',
        type: 'rectangle',
        x: 100,
        y: 100,
        vx: 5,
        vy: 5,
        mass: 1,
        width: 60,
        height: 40,
        restitution: 0.5,
        label: 'card'
      };

      world.addBody(card);

      // Mouse click far away
      const bodyClickedFar = world.startDrag(300, 300);
      expect(bodyClickedFar).toBeNull();
      expect(world.getDraggedBodyId()).toBeNull();

      // Mouse click on card
      const bodyClickedOn = world.startDrag(110, 95);
      expect(bodyClickedOn).not.toBeNull();
      expect(bodyClickedOn?.id).toBe('card-1');
      expect(world.getDraggedBodyId()).toBe('card-1');
      
      // Velocities should be reset to 0 while dragging starts
      expect(card.vx).toBe(0);
      expect(card.vy).toBe(0);
    });

    it('should update body position and accumulate velocity during drag', () => {
      const card: PhysicsBody = {
        id: 'card-1',
        type: 'rectangle',
        x: 100,
        y: 100,
        vx: 0,
        vy: 0,
        mass: 1,
        width: 60,
        height: 40,
        restitution: 0.5,
        label: 'card'
      };

      world.addBody(card);
      world.startDrag(100, 100); // offset = 0

      // Move mouse to 200, 250
      world.updateDrag(200, 250);

      // Position should update
      expect(card.x).toBe(200);
      expect(card.y).toBe(250);
      // Velocity should be calculated dynamically: (target - current) * 0.3
      // targetX = 200, old x = 100. vx = 100 * 0.3 = 30
      expect(card.vx).toBe(30);
      expect(card.vy).toBe(45);
    });

    it('should release body on endDrag', () => {
      const card: PhysicsBody = {
        id: 'card-1',
        type: 'rectangle',
        x: 100,
        y: 100,
        vx: 0,
        vy: 0,
        mass: 1,
        width: 60,
        height: 40,
        restitution: 0.5,
        label: 'card'
      };

      world.addBody(card);
      world.startDrag(100, 100);
      expect(world.getDraggedBodyId()).toBe('card-1');

      world.endDrag();
      expect(world.getDraggedBodyId()).toBeNull();
    });
  });
});
