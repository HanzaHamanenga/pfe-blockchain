import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const BlockchainBackground = () => {
  const mountRef = useRef(null);
  const animationRef = useRef();
  const mousePos = useRef({ x: 0, y: 0 });

  const speedFactor = 0.4;

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25; 
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.minDistance = 15; 
    controls.maxDistance = 50; 

    const colors = {
      primary: new THREE.Color(0x33ff99),
      secondary: new THREE.Color(0xff3366),
      accent: new THREE.Color(0x00ccff),
      purple: new THREE.Color(0x9933ff),
      orange: new THREE.Color(0xff9933),
      teal: new THREE.Color(0x00ffcc),
      pink: new THREE.Color(0xff66cc)
    };
    
    const documentGeometry = new THREE.IcosahedronGeometry(2.2, 3);
    const documentMaterial = new THREE.MeshPhysicalMaterial({ 
      color: colors.secondary,
      emissive: colors.secondary,
      emissiveIntensity: 0.8,
      clearcoat: 1,
      metalness: 0.8,
      roughness: 0.2,
      transmission: 0.5,
      ior: 1.5
    });
    const documentNode = new THREE.Mesh(documentGeometry, documentMaterial);
    documentNode.castShadow = true;
    scene.add(documentNode);
    
    const numNodes = 36;
    const nodes = [];
    const nodeGeometry = new THREE.DodecahedronGeometry(0.7, 1); 
    
    const nodeMaterials = [
      new THREE.MeshStandardMaterial({ color: colors.primary, emissive: colors.primary, emissiveIntensity: 0.3 }),
      new THREE.MeshStandardMaterial({ color: colors.secondary, emissive: colors.secondary, emissiveIntensity: 0.3 }),
      new THREE.MeshStandardMaterial({ color: colors.accent, emissive: colors.accent, emissiveIntensity: 0.3 }),
      new THREE.MeshStandardMaterial({ color: colors.purple, emissive: colors.purple, emissiveIntensity: 0.3 }),
      new THREE.MeshStandardMaterial({ color: colors.orange, emissive: colors.orange, emissiveIntensity: 0.3 }),
      new THREE.MeshStandardMaterial({ color: colors.teal, emissive: colors.teal, emissiveIntensity: 0.3 }),
      new THREE.MeshStandardMaterial({ color: colors.pink, emissive: colors.pink, emissiveIntensity: 0.3 })
    ];
    
    const nodeSpeeds = [];
    const nodeRadii = [];
    const nodeHeights = [];
    
    for (let i = 0; i < numNodes; i++) {
      const material = nodeMaterials[i % nodeMaterials.length];
      const node = new THREE.Mesh(nodeGeometry, material);
      
      const radius = 8 + Math.random() * 10; 
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 15; 
      
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.7,
        height
      );
      
      node.castShadow = true;
      nodes.push(node);
      scene.add(node);
      
      nodeSpeeds.push(0.0004 + Math.random() * 0.0015);
      nodeRadii.push(radius);
      nodeHeights.push(height);
      
      const lineGeometry = new THREE.BufferGeometry();
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: material.color,
        transparent: true,
        opacity: 0.4,
        linewidth: 1.5
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      node.line = line;
    }
    
    const particleCount = 1200;
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 18 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i3 + 2] = radius * Math.cos(phi);
      
      const colorIndex = i % nodeMaterials.length;
      const color = nodeMaterials[colorIndex].color;
      particleColors[i3] = color.r;
      particleColors[i3 + 1] = color.g;
      particleColors[i3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100); 
    pointLight.position.set(15, 15, 15);
    pointLight.castShadow = true;
    scene.add(pointLight);
    
    const hemiLight = new THREE.HemisphereLight(0x555555, 0x111111, 0.8);
    scene.add(hemiLight);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 80);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);
    
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime() * speedFactor;
      
      documentNode.rotation.x = time * 0.07;
      documentNode.rotation.y = time * 0.1;
      documentNode.scale.setScalar(1 + Math.sin(time * 1.2) * 0.06);
      
      nodes.forEach((node, i) => {
        const speed = nodeSpeeds[i];
        const radius = nodeRadii[i];
        const height = nodeHeights[i];
        
        node.position.x = Math.cos(time * speed * 0.6 + i) * radius;
        node.position.y = Math.sin(time * speed * 0.8 + i) * radius * 0.7;
        node.position.z = Math.sin(time * speed * 0.4 + i * 0.5) * 8 + height * 0.3;
        
        if (node.line) {
          const positions = [documentNode.position.clone(), node.position.clone()];
          node.line.geometry.setFromPoints(positions);
        }
        
        node.rotation.x = time * 0.04;
        node.rotation.y = time * 0.06;
        node.scale.setScalar(0.9 + Math.sin(time * 1.5 + i) * 0.1);
      });
      
      const positions = particles.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const speed = 0.006 + (0.03 * (i / particleCount));
        const angle = time * 0.2 + i * 0.01;
        
        positions[i3] *= 1 - speed;
        positions[i3 + 1] *= 1 - speed;
        positions[i3 + 2] *= 1 - speed;
        
        positions[i3] += Math.cos(angle) * 0.006;
        positions[i3 + 1] += Math.sin(angle) * 0.006;
        
        if (Math.sqrt(positions[i3]**2 + positions[i3+1]**2 + positions[i3+2]**2) < 0.8) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const newRadius = 12 + Math.random() * 8;
          positions[i3] = newRadius * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = newRadius * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = newRadius * Math.cos(phi);
        }
      }
      particles.attributes.position.needsUpdate = true;
      
      camera.position.x += (mousePos.current.x * 3 - camera.position.x) * 0.008;
      camera.position.y += (-mousePos.current.y * 3 - camera.position.y) * 0.008;
      camera.lookAt(scene.position);
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const handleMouseMove = (event) => {
      mousePos.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: '#000'
      }} 
    />
  );
};

export default BlockchainBackground;