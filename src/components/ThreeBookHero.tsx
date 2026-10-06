import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useStore } from "@/context/StoreContext";
import { BOOKS, IMG } from "@/data/bookData";

const HERO_BOOK = BOOKS.find((book) => book.featured) ?? BOOKS[0];

function makeCoverTexture(title: string, author: string, from: string, to: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, 512, 720);
  gradient.addColorStop(0, from);
  gradient.addColorStop(1, to);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 720);

  ctx.strokeStyle = "rgba(212,175,55,0.85)";
  ctx.lineWidth = 4;
  ctx.strokeRect(38, 38, 436, 644);
  ctx.strokeStyle = "rgba(212,175,55,0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 52, 408, 616);

  ctx.textAlign = "center";
  ctx.fillStyle = "#fbf9f4";
  ctx.font = "600 44px Georgia, 'Times New Roman', serif";
  const words = title.split(" ");
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > 360 && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  const startY = 300 - (lines.length - 1) * 26;
  lines.forEach((text, index) => ctx.fillText(text, 256, startY + index * 52));

  ctx.fillStyle = "rgba(212,175,55,0.9)";
  ctx.fillRect(216, 400, 80, 2);

  ctx.fillStyle = "#e5c158";
  ctx.font = "500 20px Helvetica, Arial, sans-serif";
  ctx.fillText(author.toUpperCase(), 256, 620);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export default function ThreeBookHero() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { goTo, setSearchOpen } = useStore();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.3, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    mount.appendChild(renderer.domElement);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const group = new THREE.Group();
    scene.add(group);

    const ivory = new THREE.MeshStandardMaterial({ color: 0xf3e9d2, roughness: 0.85, metalness: 0.05 });
    const spine = new THREE.MeshStandardMaterial({ color: 0x111a2e, roughness: 0.5, metalness: 0.25 });
    const back = new THREE.MeshStandardMaterial({ color: 0x0d1424, roughness: 0.6, metalness: 0.2 });
    const coverTex = makeCoverTexture(HERO_BOOK.title, HERO_BOOK.author, HERO_BOOK.coverFrom, HERO_BOOK.coverTo);
    const front = new THREE.MeshStandardMaterial({
      map: coverTex ?? undefined,
      color: 0xffffff,
      roughness: 0.45,
      metalness: 0.2,
    });

    const geometry = new THREE.BoxGeometry(2.5, 3.5, 0.72);
    const book = new THREE.Mesh(geometry, [ivory, spine, ivory, ivory, front, back]);
    group.add(book);

    const companionGeo = new THREE.BoxGeometry(1.7, 2.4, 0.5);
    const companions: THREE.Mesh[] = [
      new THREE.Mesh(companionGeo, [
        ivory,
        spine,
        ivory,
        ivory,
        new THREE.MeshStandardMaterial({ color: 0x172033, roughness: 0.5, metalness: 0.25 }),
        back,
      ]),
      new THREE.Mesh(companionGeo, [
        ivory,
        spine,
        ivory,
        ivory,
        new THREE.MeshStandardMaterial({ color: 0x1f4a44, roughness: 0.5, metalness: 0.25 }),
        back,
      ]),
    ];
    companions[0].position.set(-3.1, -0.7, -1.8);
    companions[0].rotation.set(0.12, 0.5, -0.28);
    companions[1].position.set(3.2, 0.6, -2.1);
    companions[1].rotation.set(-0.1, -0.6, 0.24);
    companions.forEach((mesh) => group.add(mesh));

    const dustGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(160 * 3);
    for (let i = 0; i < 160; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.045, transparent: true, opacity: 0.7 });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    scene.add(new THREE.AmbientLight(0x25304d, 1.1));
    const key = new THREE.DirectionalLight(0xfff4dd, 2.1);
    key.position.set(5, 6, 6);
    scene.add(key);
    const goldLight = new THREE.PointLight(0xd4af37, 26, 22);
    goldLight.position.set(-3.5, -2, 3);
    scene.add(goldLight);
    const rim = new THREE.DirectionalLight(0x6f8bd6, 1.1);
    rim.position.set(-6, 2, -4);
    scene.add(rim);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduceMotion) window.addEventListener("pointermove", onPointerMove);

    let frame = 0;
    const clock = new THREE.Clock();

    const render = () => {
      const elapsed = clock.getElapsedTime();
      if (!reduceMotion) {
        target.x += (pointer.x * 0.45 - target.x) * 0.06;
        target.y += (pointer.y * 0.28 - target.y) * 0.06;
        group.rotation.y = 0.35 + target.x + Math.sin(elapsed * 0.5) * 0.06;
        group.rotation.x = -target.y + Math.sin(elapsed * 0.7) * 0.04;
        group.position.y = Math.sin(elapsed * 1.05) * 0.14;
        book.rotation.z = Math.sin(elapsed * 0.9) * 0.035;
        dust.rotation.y = elapsed * 0.04;
      } else {
        group.rotation.y = 0.35;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();

    const resize = () => {
      if (!mount.clientWidth || !mount.clientHeight) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      companionGeo.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      [ivory, spine, back, front].forEach((material) => material.dispose());
      coverTex?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-navy-deep">
      <img
        src={IMG.hero}
        alt="A grand library lit at night"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy-deep/90 to-navy/95" />
      <div className="absolute -left-32 top-1/4 h-[32rem] w-[32rem] rounded-full bg-gold/15 blur-[120px]" />
      <div ref={mountRef} className="absolute inset-0 z-10 opacity-95" aria-hidden="true" />

      <div className="relative z-20 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-center px-6 pt-28 pb-16 lg:px-10">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold"
        >
          BookVerse - Addis Ababa
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 max-w-2xl font-serif text-5xl leading-[1.02] tracking-tight text-ivory sm:text-6xl lg:text-7xl"
        >
          Every great story starts with a single page.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-ivory/70"
        >
          Hand-picked literature, delivered across Ethiopia in Birr. Browse, search and read more.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => goTo("catalog")}
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy transition active:scale-[0.98] hover:bg-gold-soft"
          >
            Explore the catalog
            <ArrowRight weight="bold" className="transition group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-ivory/25 bg-ivory/5 px-7 py-3.5 text-sm font-medium text-ivory backdrop-blur-sm transition active:scale-[0.98] hover:border-gold/60 hover:text-gold"
          >
            <MagnifyingGlass weight="bold" />
            Search titles
          </button>
        </motion.div>
      </div>
    </section>
  );
}