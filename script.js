/**
 * ══════════════════════════════════════════════════════════
 * OUR LITTLE UNIVERSE ❤️
 * Cinematic Interactive Story Engine
 * ══════════════════════════════════════════════════════════
 */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────────────────
     0. LENIS SMOOTH SCROLL ENGINE INTEGRATION
  ────────────────────────────────────────────────────────── */
  let lenisInstance = null;
  if (typeof Lenis !== "undefined") {
    lenisInstance = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenisInstance = lenisInstance;
    document.documentElement.classList.add("has-lenis");

    function lenisRaf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);
  }

  function navigateToTarget(targetElement, duration = 1.35) {
    if (!targetElement) return;
    if (lenisInstance) {
      lenisInstance.scrollTo(targetElement, {
        offset: 0,
        duration: duration,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  /* ──────────────────────────────────────────────────────────
     1. CUSTOM SMOOTH MOUSE CURSOR
  ────────────────────────────────────────────────────────── */
  const cursor = document.getElementById("cinematic-cursor");
  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;
  let isHovering = false;

  if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = "1";
    });

    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });

    const interactiveSelectors = 'button, a, .chapter-dot-btn, .scroll-cue, .ramadan-artwork-frame, .chapter-next-btn, .dock-btn';
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursor.classList.add("hovering");
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursor.classList.remove("hovering");
      }
    });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.left = `${cursorX.toFixed(2)}px`;
      cursor.style.top = `${cursorY.toFixed(2)}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }

  /* ──────────────────────────────────────────────────────────
     2. PROCEDURAL FILM GRAIN CANVAS SHADER (24 FPS)
  ────────────────────────────────────────────────────────── */
  const grainCanvas = document.getElementById("film-grain-canvas");
  if (grainCanvas) {
    const ctx = grainCanvas.getContext("2d");
    let grainW = 0, grainH = 0;
    let grainPattern = null;
    let lastGrainTime = 0;

    function resizeGrain() {
      grainW = grainCanvas.width = Math.min(window.innerWidth, 1280);
      grainH = grainCanvas.height = Math.min(window.innerHeight, 720);
      generateGrainPattern();
    }

    function generateGrainPattern() {
      if (grainW === 0 || grainH === 0) return;
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 160;
      pCanvas.height = 160;
      const pCtx = pCanvas.getContext("2d");
      const imgData = pCtx.createImageData(160, 160);
      const buffer = new Uint32Array(imgData.data.buffer);
      const len = buffer.length;

      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.35) {
          const val = (Math.random() * 255) | 0;
          buffer[i] = (24 << 24) | (val << 16) | (val << 8) | val;
        } else {
          buffer[i] = 0;
        }
      }
      pCtx.putImageData(imgData, 0, 0);
      grainPattern = ctx.createPattern(pCanvas, "repeat");
    }

    function loopGrain(now) {
      if (now - lastGrainTime >= 41.6) { // ~24 FPS
        lastGrainTime = now;
        if (grainPattern && ctx) {
          ctx.clearRect(0, 0, grainW, grainH);
          ctx.fillStyle = grainPattern;
          ctx.save();
          ctx.translate((Math.random() * 40 - 20) | 0, (Math.random() * 40 - 20) | 0);
          ctx.fillRect(-40, -40, grainW + 80, grainH + 80);
          ctx.restore();
        }
      }
      requestAnimationFrame(loopGrain);
    }

    window.addEventListener("resize", resizeGrain);
    resizeGrain();
    requestAnimationFrame(loopGrain);
  }

  /* ──────────────────────────────────────────────────────────
     3. CHAPTER 02: GOLDEN PARTICLES CANVAS ENGINE
  ────────────────────────────────────────────────────────── */
  const particlesCanvas = document.getElementById("golden-particles-canvas");
  let particlesAnimationId = null;

  if (particlesCanvas) {
    const pCtx = particlesCanvas.getContext("2d");
    let pWidth = 0, pHeight = 0;
    const particles = [];
    const MAX_PARTICLES = 50;

    function resizeParticles() {
      pWidth = particlesCanvas.width = particlesCanvas.parentElement.offsetWidth || window.innerWidth;
      pHeight = particlesCanvas.height = particlesCanvas.parentElement.offsetHeight || window.innerHeight;
    }

    class GoldenParticle {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * pWidth;
        this.y = initial ? Math.random() * pHeight : pHeight + 10;
        this.size = Math.random() * 2.2 + 0.6;
        this.speedY = Math.random() * 0.45 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.008;
        this.pulse = Math.random() * Math.PI;
      }
      update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.pulse) * this.speedX;
        this.pulse += this.pulseSpeed;
        if (this.y < -10) this.reset();
      }
      draw() {
        const curAlpha = Math.max(0.05, Math.min(0.85, this.alpha + Math.sin(this.pulse) * 0.25));
        pCtx.save();
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(212, 189, 153, ${curAlpha.toFixed(2)})`;
        pCtx.shadowBlur = 10;
        pCtx.shadowColor = "rgba(184, 155, 114, 0.8)";
        pCtx.fill();
        pCtx.restore();
      }
    }

    function initParticles() {
      resizeParticles();
      particles.length = 0;
      for (let i = 0; i < MAX_PARTICLES; i++) {
        particles.push(new GoldenParticle());
      }
    }

    function animateParticles() {
      pCtx.clearRect(0, 0, pWidth, pHeight);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      particlesAnimationId = requestAnimationFrame(animateParticles);
    }

    window.addEventListener("resize", () => {
      resizeParticles();
    });

    initParticles();
    animateParticles();
  }

  /* ──────────────────────────────────────────────────────────
     4. CHAPTER 03: INSTAGRAM CONVERSATION ANIMATION ENGINE
  ────────────────────────────────────────────────────────── */
  const CONVERSATION_DATA = [
    { sender: "user", text: "Hey", delay: 800 },
    { sender: "user", text: "Sorry", delay: 1000 },
    { sender: "user", text: "Tereko eid Mubarak bolna bhool gaya tha", delay: 1200 },
    { sender: "her", text: "Hello...", typing: 1400, delay: 1000 },
    { sender: "her", text: "Kuch nai..", typing: 1100, delay: 900 },
    { sender: "her", text: "Belated Eid Mubarak 🍂", typing: 1300, delay: 1100 },
    { sender: "her", text: "Abhi tak Ghar nai gaya..", typing: 1500, delay: 1200 },
    {
      sender: "user",
      text: "Ghar main hi hoon",
      isReply: true,
      quotedText: "Abhi tak Ghar nai gaya..",
      delay: 1400,
    },
    { sender: "her", text: "Phir story?", typing: 1600, delay: 1000 },
  ];

  const chatStream = document.getElementById("chat-stream");
  const typingIndicator = document.getElementById("chat-typing-indicator");
  const completionHint = document.getElementById("chat-completion-hint");
  const replayBtn = document.getElementById("replay-chat-btn");
  let chatTimeouts = [];
  let chatHasRun = false;

  function clearChatTimers() {
    chatTimeouts.forEach((t) => clearTimeout(t));
    chatTimeouts = [];
  }

  function playChatPopSound() {
    if (audioEngine && audioEngine.isAudioInitialized) {
      audioEngine.playMessagePop();
    }
  }

  function renderMessageItem(msg) {
    if (!chatStream) return;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble msg-${msg.sender}`;

    if (msg.isReply) {
      const quote = document.createElement("div");
      quote.className = "chat-quote-box";
      quote.innerHTML = `
        <div class="chat-quote-header">You replied</div>
        <div class="chat-quote-body">${msg.quotedText}</div>
      `;
      bubble.appendChild(quote);
      const textSpan = document.createElement("div");
      textSpan.textContent = msg.text;
      bubble.appendChild(textSpan);
    } else {
      bubble.textContent = msg.text;
    }

    chatStream.appendChild(bubble);
    playChatPopSound();

    // Auto scroll chat to bottom smoothly
    chatStream.scrollTo({
      top: chatStream.scrollHeight,
      behavior: "smooth",
    });
  }

  function runConversationSequence() {
    if (!chatStream) return;
    clearChatTimers();
    chatStream.innerHTML = "";
    if (typingIndicator) typingIndicator.classList.add("hidden");
    if (completionHint) completionHint.classList.add("hidden");

    let accumulatedTime = 400;

    CONVERSATION_DATA.forEach((msg, idx) => {
      // If message requires typing indicator
      if (msg.typing) {
        const timerTyping = setTimeout(() => {
          if (typingIndicator) typingIndicator.classList.remove("hidden");
          chatStream.scrollTo({ top: chatStream.scrollHeight, behavior: "smooth" });
        }, accumulatedTime);
        chatTimeouts.push(timerTyping);
        accumulatedTime += msg.typing;
      }

      const timerMsg = setTimeout(() => {
        if (typingIndicator) typingIndicator.classList.add("hidden");
        renderMessageItem(msg);

        // Check if last message
        if (idx === CONVERSATION_DATA.length - 1) {
          const finalTimer = setTimeout(() => {
            if (completionHint) completionHint.classList.remove("hidden");
          }, 800);
          chatTimeouts.push(finalTimer);
        }
      }, accumulatedTime);

      chatTimeouts.push(timerMsg);
      accumulatedTime += msg.delay;
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      runConversationSequence();
    });
  }

  /* ──────────────────────────────────────────────────────────
     5. CINEMATIC WEB AUDIO SYNTHESIZER & SOUND SYSTEM
     - Generates ambient romantic piano soundscape + analog vinyl crackle
     - Authentic vintage twin-gong telephone ring synthesizer
     - Never autoplays; full user control
  ────────────────────────────────────────────────────────── */
  class CinematicAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlayingSoundtrack = false;
      this.isRinging = false;
      this.ringTimer = null;
      this.pianoTimer = null;
      this.masterGain = null;
      this.vinylNode = null;
      this.isAudioInitialized = false;
    }

    initAudioContext() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.isAudioInitialized = true;
    }

    /* Ambient Romantic Generative Soundtrack (D Major / F# Minor) */
    startAmbientSoundtrack() {
      this.initAudioContext();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      this.isPlayingSoundtrack = true;
      this.playVinylCrackle();

      // Emotional chord notes in Hz (D3, F#3, A3, C#4, D4, E4, F#4, A4)
      const NOTES = [146.83, 185.00, 220.00, 277.18, 293.66, 329.63, 369.99, 440.00, 554.37];
      const CHORDS = [
        [146.83, 220.00, 293.66, 369.99], // D maj7
        [185.00, 220.00, 277.18, 369.99], // F# min7
        [164.81, 246.94, 329.63, 392.00], // E min7
        [220.00, 277.18, 329.63, 440.00], // A sus/maj
      ];

      let chordIdx = 0;
      const playNextChord = () => {
        if (!this.isPlayingSoundtrack) return;
        const currentChord = CHORDS[chordIdx % CHORDS.length];
        chordIdx++;

        currentChord.forEach((freq, idx) => {
          setTimeout(() => {
            if (this.isPlayingSoundtrack) {
              this.playPianoTone(freq, 4.5);
            }
          }, idx * 240);
        });

        // Occasional gentle high melodic note
        if (Math.random() < 0.6) {
          setTimeout(() => {
            if (this.isPlayingSoundtrack) {
              const highNote = NOTES[Math.floor(Math.random() * (NOTES.length - 3)) + 3];
              this.playPianoTone(highNote * 1.5, 3.2, 0.08);
            }
          }, 1500);
        }

        this.pianoTimer = setTimeout(playNextChord, 5200);
      };

      playNextChord();
    }

    stopAmbientSoundtrack() {
      this.isPlayingSoundtrack = false;
      if (this.pianoTimer) clearTimeout(this.pianoTimer);
      if (this.vinylNode) {
        try { this.vinylNode.stop(); } catch (e) {}
        this.vinylNode = null;
      }
    }

    playPianoTone(freq, duration = 4.0, maxVol = 0.12) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      oscHarmonic.type = "triangle";
      oscHarmonic.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + duration);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(maxVol, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(filter);
      filter.connect(this.masterGain);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + duration);
      oscHarmonic.stop(now + duration);
    }

    playVinylCrackle() {
      if (!this.ctx || this.vinylNode) return;
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() < 0.003) ? (Math.random() * 0.15 - 0.075) : (Math.random() * 0.002 - 0.001);
      }

      this.vinylNode = this.ctx.createBufferSource();
      this.vinylNode.buffer = buffer;
      this.vinylNode.loop = true;

      const vinylFilter = this.ctx.createBiquadFilter();
      vinylFilter.type = "bandpass";
      vinylFilter.frequency.setValueAtTime(2200, this.ctx.currentTime);

      const vinylGain = this.ctx.createGain();
      vinylGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      this.vinylNode.connect(vinylFilter);
      vinylFilter.connect(vinylGain);
      vinylGain.connect(this.masterGain);

      this.vinylNode.start();
    }

    /* Subtle Message Notification Pop */
    playMessagePop() {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.08);
    }

    /* Vintage Twin-Gong Telephone Ring Synthesizer */
    playTelephoneRingSequence(onEndCallback) {
      this.initAudioContext();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      this.isRinging = true;
      let cadenceCount = 0;
      const maxCadences = 3;

      const singleRingBurst = () => {
        if (!this.isRinging) return;
        const now = this.ctx.currentTime;
        const ringDuration = 1.4;

        // Dual electromechanical bell frequencies (750Hz and 840Hz)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const tremolo = this.ctx.createOscillator();
        const tremGain = this.ctx.createGain();
        const bellGain = this.ctx.createGain();
        const bandpass = this.ctx.createBiquadFilter();

        osc1.frequency.setValueAtTime(750, now);
        osc2.frequency.setValueAtTime(840, now);

        tremolo.frequency.setValueAtTime(20, now); // 20Hz hammer strike speed
        tremGain.gain.setValueAtTime(0.4, now);
        tremolo.connect(tremGain.gain);

        bandpass.type = "bandpass";
        bandpass.frequency.setValueAtTime(800, now);
        bandpass.Q.setValueAtTime(3, now);

        bellGain.gain.setValueAtTime(0.001, now);
        bellGain.gain.linearRampToValueAtTime(0.18, now + 0.05);
        bellGain.gain.setValueAtTime(0.18, now + ringDuration - 0.1);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, now + ringDuration);

        osc1.connect(bellGain);
        osc2.connect(bellGain);
        bellGain.connect(bandpass);
        bandpass.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        tremolo.start(now);
        osc1.stop(now + ringDuration);
        osc2.stop(now + ringDuration);
        tremolo.stop(now + ringDuration);

        cadenceCount++;
        if (cadenceCount < maxCadences && this.isRinging) {
          this.ringTimer = setTimeout(singleRingBurst, 3200); // Wait 3.2s between rings
        } else {
          this.ringTimer = setTimeout(() => {
            this.stopTelephoneRing();
            if (onEndCallback) onEndCallback();
          }, ringDuration * 1000);
        }
      };

      singleRingBurst();
    }

    stopTelephoneRing() {
      this.isRinging = false;
      if (this.ringTimer) clearTimeout(this.ringTimer);
    }
  }

  const audioEngine = new CinematicAudioEngine();

  /* Soundtrack Toggle Button Handler */
  const audioToggleBtn = document.getElementById("ambient-audio-toggle");
  const audioLabel = document.getElementById("audio-label");

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", () => {
      if (!audioEngine.isPlayingSoundtrack) {
        audioEngine.startAmbientSoundtrack();
        audioToggleBtn.classList.add("playing");
        if (audioLabel) audioLabel.textContent = "SOUNDTRACK : ON";
      } else {
        audioEngine.stopAmbientSoundtrack();
        audioToggleBtn.classList.remove("playing");
        if (audioLabel) audioLabel.textContent = "SOUNDTRACK : OFF";
      }
    });
  }

  /* Telephone Ring Button Handler & Pulse Waves */
  const telRingBtn = document.getElementById("telephone-ring-toggle");
  const telRingLabel = document.getElementById("tel-ring-label");
  const telPulseRings = document.getElementById("telephone-pulse-rings");

  if (telRingBtn) {
    telRingBtn.addEventListener("click", () => {
      if (!audioEngine.isRinging) {
        telRingBtn.classList.add("ringing");
        if (telPulseRings) telPulseRings.classList.add("active");
        if (telRingLabel) telRingLabel.textContent = "☎ RINGING...";
        audioEngine.playTelephoneRingSequence(() => {
          telRingBtn.classList.remove("ringing");
          if (telPulseRings) telPulseRings.classList.remove("active");
          if (telRingLabel) telRingLabel.textContent = "☎ LISTEN TO THE RING";
        });
      } else {
        audioEngine.stopTelephoneRing();
        telRingBtn.classList.remove("ringing");
        if (telPulseRings) telPulseRings.classList.remove("active");
        if (telRingLabel) telRingLabel.textContent = "☎ LISTEN TO THE RING";
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     6. CHAPTER SCROLL INTERSECTION OBSERVER & DOCK SYNC
  ────────────────────────────────────────────────────────── */
  const chapters = document.querySelectorAll(".story-chapter");
  const chapterDotItems = document.querySelectorAll(".chapter-dot-item");
  const scrollCue1 = document.getElementById("scroll-cue-1");
  const restartBtn = document.getElementById("restart-story-btn");

  // Floating Navigation Dock elements
  const floatingPrevBtn = document.getElementById("floating-prev-btn");
  const floatingNextBtn = document.getElementById("floating-next-btn");
  const dockChapterIndicator = document.getElementById("dock-chapter-indicator");
  const dockBtnLabel = document.getElementById("dock-btn-label");

  let currentActiveChapter = 1;

  function updateNavigationState(activeIdx) {
    currentActiveChapter = activeIdx;

    if (floatingPrevBtn && floatingNextBtn && dockChapterIndicator && dockBtnLabel) {
      if (activeIdx <= 1) {
        floatingPrevBtn.classList.add("hidden");
        dockBtnLabel.textContent = "NEXT CHAPTER";
        dockChapterIndicator.textContent = "02 / 05";
      } else if (activeIdx >= 5) {
        floatingPrevBtn.classList.remove("hidden");
        dockBtnLabel.textContent = "RESTART STORY";
        dockChapterIndicator.textContent = "01 / 05";
      } else {
        floatingPrevBtn.classList.remove("hidden");
        dockBtnLabel.textContent = "NEXT CHAPTER";
        const nextChapterStr = String(activeIdx + 1).padStart(2, "0");
        dockChapterIndicator.textContent = `${nextChapterStr} / 05`;
      }
    }
  }

  const chapterObserverOptions = {
    threshold: 0.35,
  };

  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const chapterIdx = parseInt(entry.target.dataset.chapterIndex, 10);

        // Add in-view class to trigger editorial animations
        entry.target.classList.add("in-view");

        // Update active dots in side dock
        chapterDotItems.forEach((dot) => {
          dot.classList.toggle("active", parseInt(dot.dataset.chapter, 10) === chapterIdx);
        });

        // Update universal floating navigation dock
        updateNavigationState(chapterIdx);

        // Trigger Chapter 03 conversation automatically on first arrival
        if (chapterIdx === 3 && !chatHasRun) {
          chatHasRun = true;
          setTimeout(() => {
            runConversationSequence();
          }, 600);
        }
      }
    });
  }, chapterObserverOptions);

  chapters.forEach((chapter) => {
    chapterObserver.observe(chapter);
  });

  // Ensure Chapter 1 starts with in-view
  const ch1 = document.getElementById("chapter-1");
  if (ch1) ch1.classList.add("in-view");

  /* ──────────────────────────────────────────────────────────
     7. NAVIGATION BUTTON HANDLERS (LENIS SMOOTH DRIVEN)
  ────────────────────────────────────────────────────────── */

  // Chapter Dot Click to Smooth Scroll
  chapterDotItems.forEach((item) => {
    const btn = item.querySelector(".chapter-dot-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          navigateToTarget(targetEl);
        }
      });
    }
  });

  // In-Chapter "NEXT CHAPTER" Buttons
  const chapterNextBtns = document.querySelectorAll(".chapter-next-btn");
  chapterNextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextIdx = btn.getAttribute("data-next-chapter");
      const targetEl = document.getElementById(`chapter-${nextIdx}`);
      if (targetEl) {
        navigateToTarget(targetEl);
      }
    });
  });

  // Floating Navigation Dock - Next Button
  if (floatingNextBtn) {
    floatingNextBtn.addEventListener("click", () => {
      if (currentActiveChapter >= 5) {
        const targetEl = document.getElementById("chapter-1");
        if (targetEl) navigateToTarget(targetEl);
      } else {
        const targetEl = document.getElementById(`chapter-${currentActiveChapter + 1}`);
        if (targetEl) navigateToTarget(targetEl);
      }
    });
  }

  // Floating Navigation Dock - Prev Button
  if (floatingPrevBtn) {
    floatingPrevBtn.addEventListener("click", () => {
      if (currentActiveChapter > 1) {
        const targetEl = document.getElementById(`chapter-${currentActiveChapter - 1}`);
        if (targetEl) navigateToTarget(targetEl);
      }
    });
  }

  // Scroll Cue in Chapter 1
  if (scrollCue1) {
    scrollCue1.addEventListener("click", () => {
      const ch2 = document.getElementById("chapter-2");
      if (ch2) navigateToTarget(ch2);
    });
  }

  // Restart Story Button in Chapter 5
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      const ch1 = document.getElementById("chapter-1");
      if (ch1) navigateToTarget(ch1);
    });
  }

})();

