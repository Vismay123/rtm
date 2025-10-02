import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

export function Avatar({
  phoneme = "rest",
  audioAnalyser = null,
  animateHands = false,
  ...props
}) {
  const { scene } = useGLTF("/model/gopi.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const group = useRef();

  const bonesRef = useRef({
    leftShoulder: null,
    rightShoulder: null,
    leftArm: null,
    rightArm: null,
    spine: null,
    head: null,
    initial: {},
  });

  // 🟢 Store baseline body position so no drifting
  const basePosition = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    clone.traverse((o) => {
      if (o.isBone) {
        if (/shoulder/i.test(o.name) && /left/i.test(o.name))
          bonesRef.current.leftShoulder = o;
        if (/shoulder/i.test(o.name) && /right/i.test(o.name))
          bonesRef.current.rightShoulder = o;
        if (/arm/i.test(o.name) && /left/i.test(o.name))
          bonesRef.current.leftArm = o;
        if (/arm/i.test(o.name) && /right/i.test(o.name))
          bonesRef.current.rightArm = o;
        if (/spine/i.test(o.name)) bonesRef.current.spine = o;
        if (/head/i.test(o.name)) bonesRef.current.head = o;
      }
    });

    // Save rest quaternions
    const save = (key, bone) => {
      if (bone) bonesRef.current.initial[key] = bone.quaternion.clone();
    };
    save("leftShoulder", bonesRef.current.leftShoulder);
    save("rightShoulder", bonesRef.current.rightShoulder);
    save("leftArm", bonesRef.current.leftArm);
    save("rightArm", bonesRef.current.rightArm);
    save("spine", bonesRef.current.spine);
    save("head", bonesRef.current.head);

    // ✅ Baseline correction → bring arms closer to torso
    if (bonesRef.current.leftShoulder) {
      bonesRef.current.leftShoulder.rotation.z += THREE.MathUtils.degToRad(-12);
    }
    if (bonesRef.current.rightShoulder) {
      bonesRef.current.rightShoulder.rotation.z += THREE.MathUtils.degToRad(12);
    }
    if (bonesRef.current.leftArm) {
      bonesRef.current.leftArm.rotation.z += THREE.MathUtils.degToRad(-18);
    }
    if (bonesRef.current.rightArm) {
      bonesRef.current.rightArm.rotation.z += THREE.MathUtils.degToRad(18);
    }

    // store base group position
    if (group.current) {
      basePosition.current.copy(group.current.position);
    }
  }, [clone]);

  // 💋 Lip sync setup
  const morphMeshesRef = useRef([]);
  useMemo(() => {
    const list = [];
    clone.traverse((o) => {
      if (o.isMesh && o.morphTargetDictionary && o.morphTargetInfluences) {
        list.push(o);
      }
    });
    morphMeshesRef.current = list;
  }, [clone]);

  const phonemeMap = {
    A: /aa|ah|open|jaw/i,
    B: /bmp|closed|m/i,
    C: /ch|sh|j/i,
    D: /d|t/i,
    E: /ee|ih|smile/i,
    F: /f|v/i,
    rest: null,
  };

  const mouthOpenRef = useRef(0);

  // helpers
  const _quat = new THREE.Quaternion();
  const _offsetQuat = new THREE.Quaternion();
  const _targetQuat = new THREE.Quaternion();
  const _euler = new THREE.Euler();

  useFrame(({ clock }) => {
    let targetAmp = 0;

    // audio amplitude
    if (audioAnalyser) {
      const data = new Uint8Array(audioAnalyser.frequencyBinCount);
      audioAnalyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      targetAmp = THREE.MathUtils.clamp((avg - 20) / 120, 0, 1);
    } else if (phoneme && phonemeMap[phoneme]) {
      targetAmp = 1;
    }

    mouthOpenRef.current += (targetAmp - mouthOpenRef.current) * 0.15;

    // reset morphs
    morphMeshesRef.current.forEach((mesh) => {
      const dict = mesh.morphTargetDictionary;
      const infl = mesh.morphTargetInfluences;
      if (!dict || !infl) return;
      Object.keys(dict).forEach((key) => {
        if (/viseme_|jaw|mouth|open|aa|ee|f|v|oh|oo/i.test(key)) {
          infl[dict[key]] = 0;
        }
      });
    });

    // apply mouth morph (slightly smoother)
    if (mouthOpenRef.current > 0.02) {
      morphMeshesRef.current.forEach((mesh) => {
        const dict = mesh.morphTargetDictionary;
        const infl = mesh.morphTargetInfluences;
        const keys = Object.keys(dict);
        const match =
          targetAmp > 0.6
            ? keys.find((k) => /aa|open/i.test(k))
            : targetAmp > 0.3
            ? keys.find((k) => /ee|ih/i.test(k))
            : keys.find((k) => /bmp|m|closed/i.test(k));
        if (match) infl[dict[match]] = mouthOpenRef.current * 0.9; // 👄 softer influence
      });
    }

    const applyOffset = (bone, initial, euler, lerp = 0.12) => {
      if (!bone || !initial) return;
      _offsetQuat.setFromEuler(euler);
      _targetQuat.copy(initial).multiply(_offsetQuat);
      bone.quaternion.slerp(_targetQuat, lerp);
    };

    if (animateHands && (phoneme !== "rest" || targetAmp > 0.03)) {
      const t = clock.getElapsedTime();
      const amp = THREE.MathUtils.clamp(mouthOpenRef.current * 1.5, 0, 1);

      // ✋ ARMS (closer to torso but expressive)
      if (bonesRef.current.leftArm) {
        _euler.set(
          THREE.MathUtils.degToRad(-10 * amp + Math.sin(t * 2.2) * 15 * amp),
          THREE.MathUtils.degToRad(Math.sin(t * 1.5) * 8 * amp),
          THREE.MathUtils.degToRad(12 * amp + Math.cos(t * 1.8) * 8 * amp)
        );
        applyOffset(
          bonesRef.current.leftArm,
          bonesRef.current.initial.leftArm,
          _euler,
          0.15
        );
      }
      if (bonesRef.current.rightArm) {
        _euler.set(
          THREE.MathUtils.degToRad(-10 * amp + Math.sin(t * 2.0 + 1) * 15 * amp),
          THREE.MathUtils.degToRad(Math.cos(t * 1.3) * 8 * amp),
          THREE.MathUtils.degToRad(-12 * amp + Math.cos(t * 1.6) * 8 * amp)
        );
        applyOffset(
          bonesRef.current.rightArm,
          bonesRef.current.initial.rightArm,
          _euler,
          0.15
        );
      }

      // 🌀 SPINE (gentle breathing / sway)
      if (bonesRef.current.spine) {
        _euler.set(
          THREE.MathUtils.degToRad(Math.sin(t * 1.1) * 3 * amp),
          THREE.MathUtils.degToRad(Math.sin(t * 0.7) * 5 * amp),
          THREE.MathUtils.degToRad(Math.cos(t * 1.2) * 2 * amp)
        );
        applyOffset(
          bonesRef.current.spine,
          bonesRef.current.initial.spine,
          _euler,
          0.1
        );
      }

      // 🧑 HEAD (nod + tilt expressive)
      if (bonesRef.current.head) {
        _euler.set(
          THREE.MathUtils.degToRad(Math.sin(t * 3) * 6 * amp),
          THREE.MathUtils.degToRad(Math.sin(t * 2.5) * 10 * amp),
          THREE.MathUtils.degToRad(Math.cos(t * 2.8) * 4 * amp)
        );
        applyOffset(
          bonesRef.current.head,
          bonesRef.current.initial.head,
          _euler,
          0.12
        );
      }

      // BODY sway (relative to baseline → no drifting up)
      if (group.current) {
        const swayY = Math.sin(t * 0.9) * 0.04 * amp;
        const bob = Math.sin(t * 1.5) * 0.015 * amp;

        group.current.rotation.y +=
          (swayY - group.current.rotation.y) * 0.08;

        const targetY = basePosition.current.y + bob;
        group.current.position.y +=
          (targetY - group.current.position.y) * 0.08;
      }
    } else {
      // 🔄 Reset to neutral pose when idle
      if (bonesRef.current.leftArm) {
        bonesRef.current.leftArm.quaternion.slerp(
          bonesRef.current.initial.leftArm,
          0.1
        );
      }
      if (bonesRef.current.rightArm) {
        bonesRef.current.rightArm.quaternion.slerp(
          bonesRef.current.initial.rightArm,
          0.1
        );
      }
      if (bonesRef.current.spine) {
        bonesRef.current.spine.quaternion.slerp(
          bonesRef.current.initial.spine,
          0.1
        );
      }
      if (bonesRef.current.head) {
        bonesRef.current.head.quaternion.slerp(
          bonesRef.current.initial.head,
          0.1
        );
      }
      if (group.current) {
        group.current.position.y +=
          (basePosition.current.y - group.current.position.y) * 0.1;
      }
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload("/model/gopi.glb");
