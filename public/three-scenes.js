(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const forceOffline = params.has('offline') || params.has('fallback');
  const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.min.js';

  let THREE = null;
  let revealInstance = null;
  let activeScene = null;
  let running = true;
  let rafId = 0;
  let lastTime = 0;
  const scenes = new Map();
  const pointer = { x: 0, y: 0 };

  async function loadThree() {
    if (THREE) return THREE;
    const sources = ['./vendor/three.module.min.js'];
    if (!forceOffline) sources.push(THREE_CDN);

    for (const source of sources) {
      try {
        THREE = await import(source);
        return THREE;
      } catch (error) {
        console.info(`Three.js source unavailable: ${source}`);
      }
    }
    return null;
  }

  function makeRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    return renderer;
  }

  function common(canvas, cameraZ = 8) {
    const renderer = makeRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, cameraZ);

    scene.add(new THREE.HemisphereLight(0xb9f5ff, 0x1b1642, 2.0));
    const key = new THREE.DirectionalLight(0xffffff, 3.0);
    key.position.set(4, 5, 8);
    scene.add(key);
    const rim = new THREE.PointLight(0x8a78ff, 18, 30);
    rim.position.set(-4, 1, 5);
    scene.add(rim);
    const aqua = new THREE.PointLight(0x4de6d0, 13, 26);
    aqua.position.set(4, -3, 4);
    scene.add(aqua);

    const root = new THREE.Group();
    scene.add(root);

    const ctx = {
      canvas,
      renderer,
      scene,
      camera,
      root,
      objects: {},
      progress: 0,
      resize() {
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(2, Math.round(rect.width));
        const height = Math.max(2, Math.round(rect.height));
        const current = renderer.getSize(new THREE.Vector2());
        if (current.x !== width || current.y !== height) {
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      },
      render() {
        renderer.render(scene, camera);
      },
      setProgress(value) {
        ctx.progress = Math.max(0, Math.min(1, value || 0));
      },
      dispose() {
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose?.();
          if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose?.());
          }
        });
        renderer.dispose();
      }
    };

    return ctx;
  }

  function standardMaterial(color, options = {}) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: options.roughness ?? 0.34,
      metalness: options.metalness ?? 0.12,
      transparent: Boolean(options.transparent),
      opacity: options.opacity ?? 1,
      emissive: options.emissive ?? 0x000000,
      emissiveIntensity: options.emissiveIntensity ?? 0,
      side: options.side ?? THREE.FrontSide,
      depthWrite: options.depthWrite ?? true
    });
  }

  function makeParticle(radius = 0.5, cargoRadius = 0.27, hue = 0x70dcff) {
    const group = new THREE.Group();
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 30, 20),
      standardMaterial(hue, { transparent: true, opacity: 0.72, roughness: 0.18, metalness: 0.05, emissive: hue, emissiveIntensity: 0.08 })
    );
    const cargo = new THREE.Mesh(
      new THREE.SphereGeometry(cargoRadius, 24, 16),
      standardMaterial(0xffb45f, { roughness: 0.45, emissive: 0xff7a3d, emissiveIntensity: 0.08 })
    );
    const bRing = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.28, radius * 0.07, 10, 28),
      standardMaterial(0xff86c8, { roughness: 0.3, emissive: 0xff3c9d, emissiveIntensity: 0.18 })
    );
    bRing.position.set(radius * 0.72, radius * 0.15, radius * 0.25);
    bRing.rotation.set(0.5, 0.2, 0.7);
    group.add(shell, cargo, bRing);
    return group;
  }

  function createCover(canvas) {
    const ctx = common(canvas, 9.4);
    const { root } = ctx;

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 48, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0x5aa6ff,
        roughness: 0.2,
        metalness: 0.12,
        clearcoat: 0.75,
        transparent: true,
        opacity: 0.9,
        emissive: 0x245dff,
        emissiveIntensity: 0.17
      })
    );
    root.add(core);

    const ringColors = [0x72e0ff, 0x9d8dff, 0xff83c7];
    const rings = ringColors.map((color, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.15 + index * 0.42, 0.018, 8, 120),
        standardMaterial(color, { emissive: color, emissiveIntensity: 0.4, roughness: 0.25 })
      );
      ring.rotation.set(0.65 + index * 0.25, 0.35 + index * 0.55, index * 0.45);
      root.add(ring);
      return ring;
    });

    const count = 260;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const t = (i / count) * Math.PI * 8;
      const radius = 2.7 + Math.sin(t * 0.7) * 0.45;
      positions[i * 3] = Math.cos(t) * radius;
      positions[i * 3 + 1] = Math.sin(t * 0.5) * 2.2;
      positions[i * 3 + 2] = Math.sin(t) * radius * 0.46;
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({ color: 0xb9f5ff, size: 0.055, transparent: true, opacity: 0.72, depthWrite: false })
    );
    root.add(points);

    const nodeColors = [0x72e0ff, 0x5de4c7, 0x9d8dff, 0xff83c7, 0xffd166, 0xffac70, 0x72e0ff, 0x9d8dff];
    const nodes = nodeColors.map((color, index) => {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.23 + (index % 3) * 0.035, 24, 16),
        standardMaterial(color, { emissive: color, emissiveIntensity: 0.32, roughness: 0.25 })
      );
      const angle = (index / nodeColors.length) * Math.PI * 2;
      node.userData.angle = angle;
      node.userData.radius = 3.2 + (index % 2) * 0.35;
      node.userData.speed = 0.12 + index * 0.008;
      root.add(node);
      return node;
    });

    ctx.update = (time, delta) => {
      root.rotation.y += delta * 0.08;
      root.rotation.x = Math.sin(time * 0.00025) * 0.08 + pointer.y * 0.08;
      root.rotation.z = pointer.x * 0.05;
      core.rotation.y += delta * 0.16;
      rings.forEach((ring, index) => {
        ring.rotation.z += delta * (0.05 + index * 0.025);
      });
      nodes.forEach((node, index) => {
        const angle = node.userData.angle + time * 0.00022 * (1 + index * 0.04);
        node.position.set(
          Math.cos(angle) * node.userData.radius,
          Math.sin(angle * 1.34) * 2.1,
          Math.sin(angle) * 1.55
        );
        node.scale.setScalar(1 + Math.sin(time * 0.002 + index) * 0.08);
      });
      points.rotation.y -= delta * 0.025;
    };
    return ctx;
  }

  function createStone(canvas) {
    const ctx = common(canvas, 8.2);
    const { root } = ctx;
    root.rotation.z = -0.1;

    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(1.42, 1.18, 5.8, 64, 1, true),
      new THREE.MeshPhysicalMaterial({ color: 0x63d8ff, transparent: true, opacity: 0.16, roughness: 0.15, metalness: 0, side: THREE.DoubleSide, depthWrite: false })
    );
    tube.rotation.z = Math.PI / 2;
    root.add(tube);

    const fluid = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 0.9, 5.6, 48),
      new THREE.MeshPhysicalMaterial({ color: 0x58b8ff, transparent: true, opacity: 0.07, roughness: 0.05, depthWrite: false })
    );
    fluid.rotation.z = Math.PI / 2;
    root.add(fluid);

    const crystalGeometry = new THREE.DodecahedronGeometry(0.18, 0);
    const crystalMaterial = standardMaterial(0xbdefff, { emissive: 0x6f8eff, emissiveIntensity: 0.18, roughness: 0.28 });
    const crystals = [];
    for (let i = 0; i < 42; i += 1) {
      const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial.clone());
      crystal.userData.baseX = -2.45 + Math.random() * 4.9;
      crystal.userData.angle = Math.random() * Math.PI * 2;
      crystal.userData.radius = 0.15 + Math.random() * 0.68;
      crystal.userData.speed = 0.35 + Math.random() * 0.48;
      crystal.userData.seed = Math.random() * Math.PI * 2;
      crystal.scale.setScalar(0.55 + Math.random() * 0.95);
      root.add(crystal);
      crystals.push(crystal);
    }

    const stoneGroup = new THREE.Group();
    const stoneColors = [0xe8fbff, 0xa8d7ff, 0x9d8dff, 0xc7b4ff, 0x7fdceb];
    for (let i = 0; i < 11; i += 1) {
      const chunk = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.25 + Math.random() * 0.18, 0),
        standardMaterial(stoneColors[i % stoneColors.length], { roughness: 0.34, emissive: stoneColors[i % stoneColors.length], emissiveIntensity: 0.08 })
      );
      chunk.position.set((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8);
      chunk.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      stoneGroup.add(chunk);
    }
    stoneGroup.position.x = 0.9;
    root.add(stoneGroup);

    const droplets = [];
    for (let i = 0; i < 12; i += 1) {
      const drop = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), standardMaterial(0x89eaff, { emissive: 0x4ad9ff, emissiveIntensity: 0.35 }));
      drop.userData.x = -2.7 + Math.random() * 5.4;
      drop.userData.speed = 0.65 + Math.random() * 0.8;
      root.add(drop);
      droplets.push(drop);
    }

    ctx.update = (time, delta) => {
      root.rotation.y = Math.sin(time * 0.00035) * 0.12 + pointer.x * 0.08;
      root.rotation.x = pointer.y * 0.06;
      const clustering = 0.18 + ctx.progress * 0.72;
      crystals.forEach((crystal, index) => {
        const xFree = crystal.userData.baseX + Math.sin(time * 0.0006 * crystal.userData.speed + crystal.userData.seed) * 0.42;
        const targetX = 0.85 + Math.sin(index) * 0.25;
        const x = THREE.MathUtils.lerp(xFree, targetX, clustering * 0.72);
        const angle = crystal.userData.angle + time * 0.0004 * crystal.userData.speed;
        const radius = crystal.userData.radius * (1 - clustering * 0.72);
        crystal.position.set(x, Math.cos(angle) * radius, Math.sin(angle) * radius);
        crystal.rotation.x += delta * 0.42;
        crystal.rotation.y += delta * 0.34;
      });
      stoneGroup.rotation.x += delta * 0.14;
      stoneGroup.rotation.y -= delta * 0.18;
      stoneGroup.scale.setScalar(0.82 + ctx.progress * 0.26 + Math.sin(time * 0.0014) * 0.025);
      droplets.forEach((drop, index) => {
        const x = ((drop.userData.x + time * 0.0009 * drop.userData.speed + 2.8) % 5.6) - 2.8;
        drop.position.set(x, Math.sin(time * 0.002 + index) * 0.5, Math.cos(time * 0.0018 + index) * 0.45);
      });
    };
    return ctx;
  }

  function createLipoprotein(canvas) {
    const ctx = common(canvas, 8.6);
    const { root } = ctx;

    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 5.4, 2.8),
      new THREE.MeshPhysicalMaterial({ color: 0xe9556f, roughness: 0.65, transparent: true, opacity: 0.72, clearcoat: 0.12 })
    );
    wall.position.x = 3.45;
    root.add(wall);

    const endothelium = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 5.1, 2.45),
      standardMaterial(0xffafbd, { transparent: true, opacity: 0.7, emissive: 0xff5678, emissiveIntensity: 0.08 })
    );
    endothelium.position.x = 3.02;
    root.add(endothelium);

    const particles = [];
    for (let i = 0; i < 14; i += 1) {
      const particle = makeParticle(0.34 + Math.random() * 0.16, 0.16 + Math.random() * 0.08, i % 3 === 0 ? 0x9d8dff : 0x72e0ff);
      particle.userData.speed = 0.34 + Math.random() * 0.38;
      particle.userData.offset = Math.random() * 7.2;
      particle.userData.y = -2.15 + Math.random() * 4.3;
      particle.userData.z = -0.8 + Math.random() * 1.6;
      particle.userData.seed = Math.random() * Math.PI * 2;
      root.add(particle);
      particles.push(particle);
    }

    const plaque = new THREE.Group();
    for (let i = 0; i < 12; i += 1) {
      const blob = new THREE.Mesh(
        new THREE.SphereGeometry(0.18 + Math.random() * 0.18, 18, 12),
        standardMaterial(0xffb460, { roughness: 0.58, emissive: 0xff5d32, emissiveIntensity: 0.07 })
      );
      blob.position.set(2.72 + Math.random() * 0.18, -1.3 + Math.random() * 2.6, -0.75 + Math.random() * 1.5);
      blob.scale.set(1.4, 0.8, 1);
      plaque.add(blob);
    }
    root.add(plaque);

    ctx.update = (time, delta) => {
      root.rotation.x = pointer.y * 0.05;
      root.rotation.y = pointer.x * 0.07;
      particles.forEach((particle, index) => {
        const x = ((time * 0.00055 * particle.userData.speed + particle.userData.offset) % 7.1) - 3.65;
        particle.position.set(x, particle.userData.y + Math.sin(time * 0.0015 + index) * 0.15, particle.userData.z);
        const nearWall = THREE.MathUtils.smoothstep(x, 2.0, 3.1);
        particle.position.y += Math.sin(index * 1.7) * nearWall * 0.25;
        particle.rotation.x += delta * 0.25;
        particle.rotation.y += delta * 0.38;
      });
      plaque.scale.setScalar(0.72 + ctx.progress * 0.32 + Math.sin(time * 0.0012) * 0.02);
      wall.material.emissive = new THREE.Color(0x31000a);
      wall.material.emissiveIntensity = 0.04 + ctx.progress * 0.08;
    };
    return ctx;
  }

  function createApoB(canvas) {
    const ctx = common(canvas, 9.2);
    const { root } = ctx;

    const divider = new THREE.Mesh(new THREE.BoxGeometry(0.025, 5.1, 0.025), standardMaterial(0x90b1ce, { transparent: true, opacity: 0.38, emissive: 0x72e0ff, emissiveIntensity: 0.2 }));
    root.add(divider);

    const left = new THREE.Group();
    const right = new THREE.Group();
    left.position.x = -2.4;
    right.position.x = 2.4;
    root.add(left, right);

    const leftPositions = [[0,1.25,0],[0,-.1,.15],[0,-1.45,-.05]];
    const leftParticles = leftPositions.map((position, index) => {
      const particle = makeParticle(0.82, 0.54, index === 1 ? 0x9d8dff : 0x72e0ff);
      particle.position.set(...position);
      particle.userData.seed = index;
      left.add(particle);
      return particle;
    });

    const rightParticles = [];
    for (let i = 0; i < 9; i += 1) {
      const particle = makeParticle(0.41, 0.24, i % 3 === 0 ? 0x9d8dff : 0x72e0ff);
      const col = i % 3;
      const row = Math.floor(i / 3);
      particle.position.set((col - 1) * 0.92, (1 - row) * 1.18, (i % 2) * 0.15 - 0.08);
      particle.userData.seed = i + 4;
      right.add(particle);
      rightParticles.push(particle);
    }

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 5.6), new THREE.MeshBasicMaterial({ color: 0x0b1f35, transparent: true, opacity: 0.14, side: THREE.DoubleSide }));
    floor.position.z = -1.15;
    root.add(floor);

    ctx.update = (time, delta) => {
      root.rotation.x = pointer.y * 0.055;
      root.rotation.y = pointer.x * 0.06;
      leftParticles.forEach((particle, index) => {
        particle.rotation.y += delta * (0.22 + index * 0.04);
        particle.rotation.x += delta * 0.13;
        particle.position.z = Math.sin(time * 0.0014 + particle.userData.seed) * 0.18;
      });
      rightParticles.forEach((particle, index) => {
        particle.rotation.y -= delta * (0.28 + (index % 3) * 0.04);
        particle.rotation.x += delta * 0.2;
        particle.position.z = Math.sin(time * 0.0018 + particle.userData.seed) * 0.2;
      });
      const emphasis = 1 + ctx.progress * 0.08;
      right.scale.setScalar(emphasis);
    };
    return ctx;
  }

  function createLpa(canvas) {
    const ctx = common(canvas, 8.9);
    const { root } = ctx;
    root.position.x = -0.55;

    const coreGroup = makeParticle(1.22, 0.62, 0x72e0ff);
    coreGroup.scale.set(1, 1, 1);
    root.add(coreGroup);

    const anchor = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.25, 0.075, 80, 10, 2, 3),
      standardMaterial(0xff83c7, { emissive: 0xff3c9d, emissiveIntensity: 0.24, roughness: 0.25 })
    );
    anchor.position.set(1.1, 0.25, 0.25);
    anchor.scale.setScalar(0.78);
    root.add(anchor);

    const chain = new THREE.Group();
    root.add(chain);
    const beads = [];
    const beadMaterialA = standardMaterial(0xff83c7, { emissive: 0xff3c9d, emissiveIntensity: 0.17, roughness: 0.32 });
    const beadMaterialB = standardMaterial(0xffd166, { emissive: 0xff9f32, emissiveIntensity: 0.12, roughness: 0.36 });
    for (let i = 0; i < 34; i += 1) {
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.115 + (i % 4 === 0 ? 0.035 : 0), 18, 12), i % 4 === 0 ? beadMaterialB : beadMaterialA);
      bead.userData.t = i / 33;
      chain.add(bead);
      beads.push(bead);
    }

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.018, 8, 120),
      standardMaterial(0x9d8dff, { transparent: true, opacity: 0.55, emissive: 0x9d8dff, emissiveIntensity: 0.42 })
    );
    halo.rotation.set(0.9, 0.2, 0.4);
    root.add(halo);

    ctx.update = (time, delta) => {
      root.rotation.y += delta * 0.08;
      root.rotation.x = Math.sin(time * 0.00028) * 0.08 + pointer.y * 0.055;
      root.rotation.z = pointer.x * 0.045;
      coreGroup.rotation.y += delta * 0.18;
      coreGroup.rotation.x += delta * 0.08;
      anchor.rotation.x += delta * 0.34;
      anchor.rotation.y -= delta * 0.25;
      halo.rotation.z += delta * 0.05;
      beads.forEach((bead, index) => {
        const t = bead.userData.t;
        const phase = t * Math.PI * 4.2 + time * 0.0007;
        const extension = 2.6 + ctx.progress * 0.65;
        bead.position.set(
          1.05 + t * extension,
          0.28 + Math.sin(phase) * (0.44 + t * 0.22),
          0.25 + Math.cos(phase) * (0.42 + t * 0.18)
        );
        bead.scale.setScalar(1 + Math.sin(time * 0.002 + index) * 0.06);
      });
    };
    return ctx;
  }

  function createPad(canvas) {
    const ctx = common(canvas, 8.8);
    const { root } = ctx;
    root.rotation.x = 0.08;

    const vessel = new THREE.Mesh(
      new THREE.CylinderGeometry(1.55, 1.55, 7.2, 64, 1, true),
      new THREE.MeshPhysicalMaterial({ color: 0xe85469, transparent: true, opacity: 0.5, roughness: 0.42, metalness: 0, side: THREE.DoubleSide, depthWrite: false })
    );
    vessel.rotation.z = Math.PI / 2;
    root.add(vessel);

    const inner = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.15, 7.0, 64, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x7c1832, transparent: true, opacity: 0.18, side: THREE.BackSide, depthWrite: false })
    );
    inner.rotation.z = Math.PI / 2;
    root.add(inner);

    const plaqueMaterial = standardMaterial(0xffb45f, { roughness: 0.58, emissive: 0xff6f32, emissiveIntensity: 0.08 });
    const plaqueTop = new THREE.Mesh(new THREE.SphereGeometry(1.16, 36, 22), plaqueMaterial);
    plaqueTop.scale.set(1.1, 0.62, 1.05);
    plaqueTop.position.set(0.35, 1.18, 0);
    root.add(plaqueTop);
    const plaqueBottom = new THREE.Mesh(new THREE.SphereGeometry(1.05, 36, 22), plaqueMaterial.clone());
    plaqueBottom.scale.set(1.05, 0.58, 1.05);
    plaqueBottom.position.set(0.25, -1.12, 0.08);
    root.add(plaqueBottom);

    const rbcs = [];
    for (let i = 0; i < 18; i += 1) {
      const cell = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 24, 14),
        standardMaterial(0xdc274d, { roughness: 0.58, emissive: 0x7d001f, emissiveIntensity: 0.09 })
      );
      cell.scale.set(1.15, 0.52, 1.15);
      cell.userData.offset = Math.random() * 7.0;
      cell.userData.speed = 0.55 + Math.random() * 0.65;
      cell.userData.angle = Math.random() * Math.PI * 2;
      root.add(cell);
      rbcs.push(cell);
    }

    ctx.update = (time, delta) => {
      root.rotation.y = pointer.x * 0.08;
      root.rotation.x = 0.08 + pointer.y * 0.06;
      rbcs.forEach((cell, index) => {
        const x = ((time * 0.00072 * cell.userData.speed + cell.userData.offset) % 7.0) - 3.5;
        const constriction = Math.exp(-Math.pow(x - 0.25, 2) / 0.52);
        const radial = 0.68 * (1 - constriction * 0.72);
        const angle = cell.userData.angle + Math.sin(time * 0.001 + index) * 0.25;
        cell.position.set(x, Math.sin(angle) * radial, Math.cos(angle) * radial);
        cell.rotation.x += delta * 0.6;
        cell.rotation.z += delta * 0.32;
      });
      const plaquePulse = 1 + Math.sin(time * 0.0013) * 0.012 + ctx.progress * 0.025;
      plaqueTop.scale.set(1.1 * plaquePulse, 0.62 * plaquePulse, 1.05 * plaquePulse);
      plaqueBottom.scale.set(1.05 * plaquePulse, 0.58 * plaquePulse, 1.05 * plaquePulse);
    };
    return ctx;
  }

  function createCavi(canvas) {
    const ctx = common(canvas, 9.2);
    const { root } = ctx;

    const softGroup = new THREE.Group();
    const stiffGroup = new THREE.Group();
    softGroup.position.y = 1.65;
    stiffGroup.position.y = -1.65;
    root.add(softGroup, stiffGroup);

    const beadGeometry = new THREE.SphereGeometry(0.14, 16, 10);
    const softMaterial = standardMaterial(0x5de4c7, { emissive: 0x18bfa8, emissiveIntensity: 0.12, roughness: 0.32 });
    const stiffMaterial = standardMaterial(0xff7185, { emissive: 0xc52048, emissiveIntensity: 0.11, roughness: 0.42 });
    const segments = 38;
    const softWalls = [];
    const stiffWalls = [];
    for (let i = 0; i < segments; i += 1) {
      const x = -3.7 + (i / (segments - 1)) * 7.4;
      const softTop = new THREE.Mesh(beadGeometry, softMaterial);
      const softBottom = new THREE.Mesh(beadGeometry, softMaterial);
      softTop.position.set(x, 0.48, 0);
      softBottom.position.set(x, -0.48, 0);
      softGroup.add(softTop, softBottom);
      softWalls.push([softTop, softBottom]);

      const stiffTop = new THREE.Mesh(beadGeometry, stiffMaterial);
      const stiffBottom = new THREE.Mesh(beadGeometry, stiffMaterial);
      stiffTop.position.set(x, 0.36, 0);
      stiffBottom.position.set(x, -0.36, 0);
      stiffGroup.add(stiffTop, stiffBottom);
      stiffWalls.push([stiffTop, stiffBottom]);
    }

    const softPulse = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 16), standardMaterial(0xffffff, { emissive: 0x72e0ff, emissiveIntensity: 0.5, roughness: 0.15 }));
    const stiffPulse = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 16), standardMaterial(0xffffff, { emissive: 0xff7185, emissiveIntensity: 0.5, roughness: 0.15 }));
    softGroup.add(softPulse);
    stiffGroup.add(stiffPulse);

    const centerLines = [softGroup, stiffGroup].map((group, index) => {
      const line = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 7.3, 12), standardMaterial(index ? 0xff7185 : 0x5de4c7, { transparent: true, opacity: 0.24, emissive: index ? 0xff7185 : 0x5de4c7, emissiveIntensity: 0.2 }));
      line.rotation.z = Math.PI / 2;
      group.add(line);
      return line;
    });

    function gaussian(x, center, width) {
      const d = x - center;
      return Math.exp(-(d * d) / width);
    }

    ctx.update = (time) => {
      root.rotation.x = pointer.y * 0.055;
      root.rotation.y = pointer.x * 0.06;
      const softX = ((time * 0.00065) % 7.4) - 3.7;
      const stiffX = ((time * 0.00105) % 7.4) - 3.7;
      softPulse.position.set(softX, 0, 0);
      stiffPulse.position.set(stiffX, 0, 0);

      softWalls.forEach(([top, bottom], index) => {
        const x = -3.7 + (index / (segments - 1)) * 7.4;
        const expansion = 0.23 * gaussian(x, softX, 0.42);
        top.position.y = 0.48 + expansion;
        bottom.position.y = -0.48 - expansion;
        top.position.z = Math.sin(time * 0.001 + index * 0.2) * 0.02;
        bottom.position.z = -top.position.z;
      });
      stiffWalls.forEach(([top, bottom], index) => {
        const x = -3.7 + (index / (segments - 1)) * 7.4;
        const expansion = 0.065 * gaussian(x, stiffX, 0.24);
        top.position.y = 0.36 + expansion;
        bottom.position.y = -0.36 - expansion;
      });
      centerLines[0].material.opacity = 0.18 + ctx.progress * 0.08;
      centerLines[1].material.opacity = 0.22 + ctx.progress * 0.1;
    };
    return ctx;
  }


  function createHba1c(canvas) {
    const ctx = common(canvas, 9.2);
    const { root } = ctx;
    root.rotation.x = -0.08;

    const rbcMaterial = standardMaterial(0xc8244b, {
      roughness: 0.48,
      emissive: 0x5c001a,
      emissiveIntensity: 0.12
    });
    const rimMaterial = standardMaterial(0xff5a78, {
      roughness: 0.4,
      emissive: 0x7c0628,
      emissiveIntensity: 0.13
    });

    const rbcs = [];
    const rbcPositions = [
      [-2.5, 1.55, -0.2], [0.1, 1.0, 0.3], [2.45, 1.45, -0.35],
      [-1.65, -1.35, 0.15], [1.35, -1.45, -0.1]
    ];
    rbcPositions.forEach((position, index) => {
      const group = new THREE.Group();
      const disc = new THREE.Mesh(new THREE.SphereGeometry(0.8, 34, 20), rbcMaterial.clone());
      disc.scale.set(1.05, 1.05, 0.34);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.18, 14, 42), rimMaterial.clone());
      rim.scale.z = 0.42;
      group.add(disc, rim);
      group.position.set(...position);
      group.rotation.set(0.35 + index * 0.16, index * 0.58, index * 0.3);
      group.userData.base = group.position.clone();
      group.userData.phase = index * 1.3;
      root.add(group);
      rbcs.push(group);
    });

    const glucoseMaterial = standardMaterial(0xffd166, {
      roughness: 0.28,
      emissive: 0xff9b23,
      emissiveIntensity: 0.35
    });
    const glucose = [];
    for (let i = 0; i < 22; i += 1) {
      const molecule = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13 + (i % 3) * 0.018, 1), glucoseMaterial.clone());
      const angle = (i / 22) * Math.PI * 2;
      molecule.userData.start = new THREE.Vector3(
        Math.cos(angle) * (3.4 + (i % 4) * 0.18),
        Math.sin(angle * 1.3) * 2.45,
        Math.sin(angle) * 1.2
      );
      const targetRbc = rbcs[i % rbcs.length];
      const targetAngle = (i * 2.37) % (Math.PI * 2);
      molecule.userData.targetRbc = targetRbc;
      molecule.userData.localTarget = new THREE.Vector3(
        Math.cos(targetAngle) * 0.6,
        Math.sin(targetAngle) * 0.6,
        0.27
      );
      molecule.userData.threshold = 0.08 + (i / 22) * 0.78;
      molecule.userData.phase = i * 0.71;
      molecule.position.copy(molecule.userData.start);
      root.add(molecule);
      glucose.push(molecule);
    }

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(3.45, 0.025, 8, 120),
      standardMaterial(0x5de4c7, { transparent: true, opacity: 0.38, emissive: 0x5de4c7, emissiveIntensity: 0.42 })
    );
    halo.rotation.set(1.1, 0.35, 0.15);
    root.add(halo);

    ctx.update = (time, delta) => {
      root.rotation.y = pointer.x * 0.08;
      root.rotation.x = -0.08 + pointer.y * 0.055;
      halo.rotation.z += delta * 0.08;
      rbcs.forEach((rbc, index) => {
        rbc.position.y = rbc.userData.base.y + Math.sin(time * 0.0011 + rbc.userData.phase) * 0.11;
        rbc.rotation.z += delta * (0.08 + index * 0.012);
      });
      glucose.forEach((molecule, index) => {
        const threshold = molecule.userData.threshold;
        const attach = THREE.MathUtils.smoothstep(ctx.progress, threshold - 0.08, threshold + 0.08);
        const rbc = molecule.userData.targetRbc;
        const target = rbc.localToWorld(molecule.userData.localTarget.clone());
        root.worldToLocal(target);
        const floatPosition = molecule.userData.start.clone();
        floatPosition.y += Math.sin(time * 0.0018 + molecule.userData.phase) * 0.22;
        floatPosition.x += Math.cos(time * 0.0012 + molecule.userData.phase) * 0.13;
        molecule.position.lerpVectors(floatPosition, target, attach);
        molecule.rotation.x += delta * (0.7 + index * 0.015);
        molecule.rotation.y += delta * 0.62;
        molecule.scale.setScalar(1 + attach * 0.22 + Math.sin(time * 0.002 + index) * 0.04);
      });
    };
    return ctx;
  }

  function createCac(canvas) {
    const ctx = common(canvas, 9.6);
    const { root } = ctx;
    root.rotation.x = 0.12;

    const artery = new THREE.Mesh(
      new THREE.CylinderGeometry(1.45, 1.45, 7.2, 64, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: 0xd43b59,
        transparent: true,
        opacity: 0.48,
        roughness: 0.42,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    artery.rotation.z = Math.PI / 2;
    root.add(artery);

    const lumen = new THREE.Mesh(
      new THREE.CylinderGeometry(1.02, 1.02, 7.05, 64, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x4a0e1e, transparent: true, opacity: 0.22, side: THREE.BackSide, depthWrite: false })
    );
    lumen.rotation.z = Math.PI / 2;
    root.add(lumen);

    const plaqueMaterial = standardMaterial(0xf3d28c, {
      roughness: 0.6,
      emissive: 0xb97a24,
      emissiveIntensity: 0.14
    });
    const plaqueClusters = [];
    const clusterData = [
      [-2.25, 0.78, 0.15, 0.55],
      [-0.7, -0.72, 0.33, 0.7],
      [0.65, 0.72, -0.28, 0.46],
      [2.05, -0.68, -0.16, 0.62]
    ];
    clusterData.forEach(([x, y, z, scale], ci) => {
      const group = new THREE.Group();
      for (let j = 0; j < 6; j += 1) {
        const chunk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.19 + (j % 3) * 0.045, 0), plaqueMaterial.clone());
        chunk.position.set((Math.random() - 0.5) * 0.52, (Math.random() - 0.5) * 0.36, (Math.random() - 0.5) * 0.42);
        chunk.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        group.add(chunk);
      }
      group.position.set(x, y, z);
      group.scale.setScalar(scale);
      group.userData.baseScale = scale;
      group.userData.phase = ci * 1.15;
      root.add(group);
      plaqueClusters.push(group);
    });

    const scanRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.22, 0.055, 12, 100),
      standardMaterial(0x72e0ff, { transparent: true, opacity: 0.78, emissive: 0x72e0ff, emissiveIntensity: 0.7, roughness: 0.12 })
    );
    scanRing.rotation.y = Math.PI / 2;
    root.add(scanRing);

    const scanPlane = new THREE.Mesh(
      new THREE.CircleGeometry(2.15, 64),
      new THREE.MeshBasicMaterial({ color: 0x72e0ff, transparent: true, opacity: 0.035, side: THREE.DoubleSide, depthWrite: false })
    );
    scanPlane.rotation.y = Math.PI / 2;
    root.add(scanPlane);

    const specksGeometry = new THREE.BufferGeometry();
    const count = 130;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = -3.5 + Math.random() * 7;
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.12 + Math.random() * 0.2;
      positions[i * 3 + 1] = Math.cos(angle) * radius;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    specksGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const specks = new THREE.Points(specksGeometry, new THREE.PointsMaterial({ color: 0xffe6a8, size: 0.045, transparent: true, opacity: 0.45, depthWrite: false }));
    root.add(specks);

    ctx.update = (time, delta) => {
      root.rotation.y = pointer.x * 0.075;
      root.rotation.x = 0.12 + pointer.y * 0.06;
      const scanX = ((time * 0.00055) % 7.2) - 3.6;
      scanRing.position.x = scanX;
      scanPlane.position.x = scanX;
      scanRing.rotation.x += delta * 0.35;
      plaqueClusters.forEach((cluster, index) => {
        const highlight = Math.exp(-Math.pow(scanX - cluster.position.x, 2) / 0.28);
        const scale = cluster.userData.baseScale * (1 + highlight * 0.26 + ctx.progress * 0.08);
        cluster.scale.setScalar(scale);
        cluster.rotation.x += delta * 0.05;
        cluster.rotation.y += delta * (0.07 + index * 0.008);
      });
      specks.material.opacity = 0.32 + Math.sin(time * 0.0015) * 0.08 + ctx.progress * 0.1;
    };
    return ctx;
  }

  function createThalassemia(canvas) {
    const ctx = common(canvas, 9.4);
    const { root } = ctx;
    root.position.x = -0.25;

    const helix = new THREE.Group();
    helix.position.x = -1.25;
    root.add(helix);

    const alphaMaterial = standardMaterial(0x72e0ff, {
      emissive: 0x168db5,
      emissiveIntensity: 0.28,
      roughness: 0.24
    });
    const betaMaterial = standardMaterial(0xff83c7, {
      emissive: 0xb22a75,
      emissiveIntensity: 0.25,
      roughness: 0.26
    });
    const rungMaterials = [0xffd166, 0x9d8dff, 0x5de4c7, 0xffac70].map((color) => standardMaterial(color, {
      transparent: true,
      opacity: 0.8,
      emissive: color,
      emissiveIntensity: 0.1,
      roughness: 0.34
    }));

    function cylinderBetween(start, end, radius, material) {
      const direction = end.clone().sub(start);
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, direction.length(), 10),
        material
      );
      mesh.position.copy(start).add(end).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
      return mesh;
    }

    const strandNodes = [];
    const mutationNodes = [];
    const pairs = 34;
    for (let i = 0; i < pairs; i += 1) {
      const t = i / (pairs - 1);
      const y = -3.15 + t * 6.3;
      const angle = t * Math.PI * 6.2;
      const radius = 0.82;
      const leftPosition = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      const rightPosition = new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);

      const leftNode = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), alphaMaterial.clone());
      const rightNode = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), betaMaterial.clone());
      leftNode.position.copy(leftPosition);
      rightNode.position.copy(rightPosition);
      helix.add(leftNode, rightNode);
      strandNodes.push(leftNode, rightNode);

      if (i % 2 === 0) {
        const rung = cylinderBetween(leftPosition, rightPosition, 0.035, rungMaterials[i % rungMaterials.length].clone());
        helix.add(rung);
      }

      if (i === 9 || i === 24) {
        const mutation = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.24, 1),
          standardMaterial(0xff5f78, { emissive: 0xff244d, emissiveIntensity: 0.55, roughness: 0.18 })
        );
        mutation.position.copy(i === 9 ? leftPosition : rightPosition);
        mutation.userData.phase = i;
        mutation.scale.setScalar(0.15);
        helix.add(mutation);
        mutationNodes.push(mutation);
      }
    }

    const geneBands = [
      { y: 1.45, color: 0xffd166, phase: 0 },
      { y: -1.35, color: 0x9d8dff, phase: Math.PI }
    ].map(({ y, color, phase }) => {
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(1.18, 0.055, 12, 72),
        standardMaterial(color, { transparent: true, opacity: 0.78, emissive: color, emissiveIntensity: 0.5, roughness: 0.16 })
      );
      band.rotation.x = Math.PI / 2;
      band.position.y = y;
      band.userData.phase = phase;
      helix.add(band);
      return band;
    });

    const globin = new THREE.Group();
    globin.position.x = 2.15;
    root.add(globin);
    const globinNodes = [];
    const globinColors = [0x72e0ff, 0x72e0ff, 0xff83c7, 0xff83c7];
    const globinPositions = [[-0.45,0.75,0],[0.5,0.75,0.1],[-0.45,-0.35,-0.05],[0.5,-0.35,0.05]];
    globinPositions.forEach((position, index) => {
      const bead = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.32, 0.095, 72, 10, 2, 3),
        standardMaterial(globinColors[index], { emissive: globinColors[index], emissiveIntensity: 0.2, roughness: 0.28 })
      );
      bead.position.set(...position);
      bead.userData.phase = index * 1.4;
      bead.userData.baseY = position[1];
      globin.add(bead);
      globinNodes.push(bead);
    });

    const rbc = new THREE.Mesh(
      new THREE.TorusGeometry(0.9, 0.32, 20, 58),
      standardMaterial(0xd9345b, { emissive: 0x7c0929, emissiveIntensity: 0.14, roughness: 0.48 })
    );
    rbc.position.set(2.2, -2.1, 0);
    rbc.scale.set(1.18, 0.9, 0.38);
    root.add(rbc);

    ctx.update = (time, delta) => {
      root.rotation.x = pointer.y * 0.045;
      root.rotation.y = pointer.x * 0.055;
      helix.rotation.y += delta * 0.32;
      helix.rotation.z = Math.sin(time * 0.00045) * 0.045;
      strandNodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(time * 0.002 + index * 0.35) * 0.045);
      });
      geneBands.forEach((band) => {
        const pulse = 1 + Math.sin(time * 0.002 + band.userData.phase) * 0.07;
        band.scale.setScalar(pulse);
        band.material.emissiveIntensity = 0.34 + ctx.progress * 0.5;
      });
      mutationNodes.forEach((mutation) => {
        const reveal = THREE.MathUtils.smoothstep(ctx.progress, 0.15, 0.62);
        const pulse = 0.86 + Math.sin(time * 0.004 + mutation.userData.phase) * 0.16;
        mutation.scale.setScalar(Math.max(0.12, reveal * pulse));
        mutation.rotation.x += delta * 0.7;
        mutation.rotation.y -= delta * 0.62;
      });
      globinNodes.forEach((node, index) => {
        node.rotation.x += delta * (0.22 + index * 0.03);
        node.rotation.y -= delta * (0.18 + index * 0.025);
        node.position.y = node.userData.baseY + Math.sin(time * 0.0018 + node.userData.phase) * 0.07;
      });
      const imbalance = THREE.MathUtils.smoothstep(ctx.progress, 0.35, 0.9);
      globinNodes[2].scale.setScalar(1 - imbalance * 0.28);
      globinNodes[3].scale.setScalar(1 - imbalance * 0.28);
      rbc.rotation.z += delta * 0.08;
      rbc.scale.set(1.18 + imbalance * 0.12, 0.9 - imbalance * 0.1, 0.38);
    };
    return ctx;
  }

  const factories = {
    cover: createCover,
    hba1c: createHba1c,
    cac: createCac,
    stone: createStone,
    lipoprotein: createLipoprotein,
    apob: createApoB,
    lpa: createLpa,
    pad: createPad,
    cavi: createCavi,
    thalassemia: createThalassemia
  };

  function progressForSlide(slide) {
    if (!slide) return 0;
    const fragments = [...slide.querySelectorAll('.fragment')];
    if (!fragments.length) return 1;
    const visible = fragments.filter((fragment) => fragment.classList.contains('visible')).length;
    return visible / fragments.length;
  }

  function ensureScene(canvas) {
    if (!canvas || scenes.has(canvas)) return scenes.get(canvas) || null;
    const type = canvas.dataset.threeScene;
    const factory = factories[type];
    if (!factory || !THREE) return null;
    try {
      const scene = factory(canvas);
      scenes.set(canvas, scene);
      canvas.closest('[data-three-host]')?.classList.add('three-ready');
      return scene;
    } catch (error) {
      console.warn(`Three.js scene "${type}" failed to initialize.`, error);
      canvas.closest('[data-three-host]')?.classList.add('three-failed');
      return null;
    }
  }

  function activateSlide(slide) {
    activeScene = null;
    if (!slide || !THREE || !running) return;
    const canvas = slide.querySelector('canvas[data-three-scene]');
    if (!canvas) return;
    const scene = ensureScene(canvas);
    if (!scene) return;
    scene.resize();
    scene.setProgress(progressForSlide(slide));
    activeScene = scene;
  }

  function updateProgress() {
    const slide = revealInstance?.getCurrentSlide?.();
    if (activeScene && slide) activeScene.setProgress(progressForSlide(slide));
  }

  function frame(time) {
    const delta = Math.min(0.05, Math.max(0, (time - lastTime) / 1000 || 0));
    lastTime = time;
    if (running && activeScene) {
      activeScene.resize();
      activeScene.update?.(time, delta);
      activeScene.render();
    }
    rafId = requestAnimationFrame(frame);
  }

  async function init(reveal) {
    revealInstance = reveal;
    const library = await loadThree();
    if (!library) {
      document.body.classList.add('three-unavailable');
      return false;
    }

    const currentSlide = reveal.getCurrentSlide?.() || document.querySelector('.reveal .slides > section.present');
    activateSlide(currentSlide);

    reveal.on?.('slidechanged', (event) => activateSlide(event.currentSlide));
    reveal.on?.('fragmentshown', updateProgress);
    reveal.on?.('fragmenthidden', updateProgress);
    reveal.on?.('overviewshown', () => { activeScene = null; });
    reveal.on?.('overviewhidden', () => activateSlide(reveal.getCurrentSlide?.()));

    window.addEventListener('resize', () => activeScene?.resize());
    window.addEventListener('pointermove', (event) => {
      pointer.x = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointer.y = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    }, { passive: true });

    cancelAnimationFrame(rafId);
    lastTime = performance.now();
    rafId = requestAnimationFrame(frame);
    return true;
  }

  function setEnabled(value) {
    running = Boolean(value);
    if (running) activateSlide(revealInstance?.getCurrentSlide?.());
    else activeScene = null;
  }

  function dispose() {
    cancelAnimationFrame(rafId);
    scenes.forEach((scene) => scene.dispose?.());
    scenes.clear();
    activeScene = null;
  }

  window.ThreeSceneManager = { init, setEnabled, dispose };
})();
