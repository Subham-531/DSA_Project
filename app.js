/* ══════════════════════════════════════════════════════
   DSA Project — Application Logic
   Speed control · Step mode · Sound effects
   Theme toggle · Ripple · Stats · Logs
   ══════════════════════════════════════════════════════ */

// ─── Particles ───
(function initParticles() {
  const c = document.getElementById('particles');
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    const s = 3 + Math.random() * 6;
    p.style.width = p.style.height = s + 'px';
    p.style.animationDuration = (14 + Math.random() * 22) + 's';
    p.style.animationDelay = (Math.random() * 18) + 's';
    p.style.opacity = (.3 + Math.random() * .4).toString();
    c.appendChild(p);
  }
})();

// ═══════════════════════════════════════
// GLOBAL SETTINGS
// ═══════════════════════════════════════
const settings = {
  speed: 1,         // animation speed multiplier
  soundOn: true,    // sound effects toggle
  stepMode: false,  // step-by-step mode
  _stepResolve: null,
  _stepQueue: [],

  // returns animation duration adjusted for speed
  dur(base) {
    return base / this.speed;
  }
};

// ─── Speed Slider ───
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
speedSlider.addEventListener('input', () => {
  settings.speed = parseFloat(speedSlider.value);
  speedValue.textContent = settings.speed + '×';
  document.documentElement.style.setProperty('--speed', settings.speed);
});

// ─── Sound Toggle ───
const soundToggle = document.getElementById('sound-toggle');
soundToggle.addEventListener('click', () => {
  settings.soundOn = !settings.soundOn;
  soundToggle.textContent = settings.soundOn ? 'ON' : 'OFF';
  soundToggle.classList.toggle('active', settings.soundOn);
  playSound('click');
});

// ─── Step Mode Toggle ───
const stepToggle = document.getElementById('step-toggle');
const stepControls = document.getElementById('step-controls');
const stepNextBtn = document.getElementById('step-next');

stepToggle.addEventListener('click', () => {
  settings.stepMode = !settings.stepMode;
  stepToggle.textContent = settings.stepMode ? 'ON' : 'OFF';
  stepToggle.classList.toggle('active', settings.stepMode);
  stepControls.style.display = settings.stepMode ? 'flex' : 'none';
  if (settings.stepMode) {
    showToast('Step Mode ON — click "Next Step" to advance', 'info');
  } else {
    showToast('Step Mode OFF — operations run automatically', 'info');
    // resolve any pending step
    if (settings._stepResolve) { settings._stepResolve(); settings._stepResolve = null; }
  }
});

stepNextBtn.addEventListener('click', () => {
  if (settings._stepResolve) {
    playSound('click');
    settings._stepResolve();
    settings._stepResolve = null;
  }
});

// Wait for step button if step mode is on
function waitForStep(label) {
  if (!settings.stepMode) return Promise.resolve();
  showToast(`⏸ Step: ${label} — click "Next Step"`, 'info');
  return new Promise(resolve => {
    settings._stepResolve = resolve;
  });
}

// ═══════════════════════════════════════
// SOUND EFFECTS (Web Audio API — no files)
// ═══════════════════════════════════════
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (!settings.soundOn) return;
  // Resume context if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  switch (type) {
    case 'insert':
    case 'push':
    case 'enqueue':
      // pleasant ascending chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, now);        // C5
      osc.frequency.linearRampToValueAtTime(784, now + 0.1); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;

    case 'delete':
    case 'pop':
    case 'dequeue':
      // descending tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659, now);        // E5
      osc.frequency.linearRampToValueAtTime(330, now + 0.15); // E4
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
      break;

    case 'error':
      // buzz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      break;

    case 'click':
      // soft tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
      break;

    case 'display':
      // soft chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;

    default:
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
  }
}

// ═══════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('dsa-theme', theme);
}

themeToggle.addEventListener('click', () => {
  playSound('click');
  themeToggle.classList.add('spin');
  setTimeout(() => themeToggle.classList.remove('spin'), 500);
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

const savedTheme = localStorage.getItem('dsa-theme');
if (savedTheme) setTheme(savedTheme);

// ─── Button Ripple ───
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    playSound('click');
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ─── Utilities ───
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = message;
  container.appendChild(t);
  setTimeout(() => { if (t.parentNode) t.remove(); }, 3200);
}

function getInputValue(id) {
  const el = document.getElementById(id);
  const v = el.value.trim();
  if (v === '' || isNaN(Number(v))) {
    showToast('Please enter a valid number.', 'error');
    playSound('error');
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
    return null;
  }
  el.value = '';
  return Number(v);
}

function timeStamp() {
  const d = new Date();
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function addLog(logId, message, type = 'info') {
  const body = document.getElementById(logId);
  const empty = body.querySelector('.log-empty');
  if (empty) empty.remove();
  const entry = document.createElement('div');
  entry.className = `log-entry log-${type}`;
  entry.innerHTML = `<span class="log-time">${timeStamp()}</span><span class="log-msg">${message}</span>`;
  body.prepend(entry);
  while (body.children.length > 50) body.lastChild.remove();
}

function animateStat(elementId, value) {
  const el = document.getElementById(elementId);
  el.textContent = value;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
  setTimeout(() => el.classList.remove('pop'), 500);
}

// ═══════════════════════════════════════
// TAB NAVIGATION
// ═══════════════════════════════════════
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    playSound('click');
    document.querySelectorAll('.tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

// ═══════════════════════════════════════
// LINKED LIST
// ═══════════════════════════════════════
const ll = {
  head: null,
  opsCount: 0,

  async insertBeginning(val) {
    await waitForStep(`Insert ${val} at beginning`);
    this.head = { data: val, next: this.head };
    this.opsCount++;
    playSound('insert');
    showToast(`Inserted ${val} at beginning`, 'success');
    addLog('ll-log', `Insert <strong>${val}</strong> at beginning`, 'success');
    this.render('insert-beg');
  },

  async insertEnd(val) {
    await waitForStep(`Insert ${val} at end`);
    const node = { data: val, next: null };
    if (!this.head) { this.head = node; }
    else { let t = this.head; while (t.next) t = t.next; t.next = node; }
    this.opsCount++;
    playSound('insert');
    showToast(`Inserted ${val} at end`, 'success');
    addLog('ll-log', `Insert <strong>${val}</strong> at end`, 'success');
    this.render('insert-end');
  },

  async deleteBeginning() {
    if (!this.head) { playSound('error'); showToast('List is empty!', 'error'); addLog('ll-log', 'Delete failed — list empty', 'error'); return; }
    const val = this.head.data;
    await waitForStep(`Delete ${val} from beginning`);
    this._animateDelete(0, () => {
      this.head = this.head.next;
      this.opsCount++;
      playSound('delete');
      showToast(`Deleted ${val} from beginning`, 'success');
      addLog('ll-log', `Delete <strong>${val}</strong> from beginning`, 'success');
      this.render();
    });
  },

  async deleteEnd() {
    if (!this.head) { playSound('error'); showToast('List is empty!', 'error'); addLog('ll-log', 'Delete failed — list empty', 'error'); return; }
    const count = this._count();
    if (!this.head.next) {
      const val = this.head.data;
      await waitForStep(`Delete ${val} from end`);
      this._animateDelete(0, () => {
        this.head = null;
        this.opsCount++;
        playSound('delete');
        showToast(`Deleted ${val} from end`, 'success');
        addLog('ll-log', `Delete <strong>${val}</strong> from end`, 'success');
        this.render();
      });
      return;
    }
    await waitForStep('Delete from end');
    this._animateDelete(count - 1, () => {
      let t = this.head;
      while (t.next.next) t = t.next;
      const val = t.next.data;
      t.next = null;
      this.opsCount++;
      playSound('delete');
      showToast(`Deleted ${val} from end`, 'success');
      addLog('ll-log', `Delete <strong>${val}</strong> from end`, 'success');
      this.render();
    });
  },

  display() {
    playSound('display');
    if (!this.head) { showToast('List is empty!', 'info'); addLog('ll-log', 'Display — list is empty', 'info'); }
    else { addLog('ll-log', `Display — ${this._count()} node(s)`, 'info'); }
    this.render();
  },

  _count() { let c = 0, t = this.head; while (t) { c++; t = t.next; } return c; },

  _animateDelete(index, cb) {
    const viz = document.getElementById('ll-viz');
    const wrappers = viz.querySelectorAll('.ll-node-wrapper');
    if (wrappers[index]) {
      const node = wrappers[index].querySelector('.ll-node');
      if (node) node.classList.add('delete-highlight');
      wrappers[index].classList.add('deleting');
      setTimeout(cb, settings.dur(450));
    } else { cb(); }
  },

  render(highlightType) {
    const viz = document.getElementById('ll-viz');
    viz.innerHTML = '';
    const count = this._count();

    if (!this.head) {
      viz.innerHTML = '<div class="empty-state">List is empty — insert a node to begin</div>';
      animateStat('ll-count', '0');
      animateStat('ll-ops', this.opsCount);
      return;
    }

    let t = this.head, idx = 0;
    while (t) {
      const wrapper = document.createElement('div');
      wrapper.className = 'll-node-wrapper';
      wrapper.style.animationDelay = (idx * 0.08) + 's';

      const box = document.createElement('div');
      box.className = 'll-node';
      box.textContent = t.data;

      if (idx === 0) {
        const lbl = document.createElement('span');
        lbl.className = 'll-head-label';
        lbl.textContent = 'HEAD';
        box.appendChild(lbl);
      }
      if (highlightType === 'insert-beg' && idx === 0) box.classList.add('insert-highlight');
      if (highlightType === 'insert-end' && idx === count - 1) box.classList.add('insert-highlight');

      wrapper.appendChild(box);

      if (t.next) {
        const arrow = document.createElement('span');
        arrow.className = 'll-arrow';
        arrow.textContent = '→';
        wrapper.appendChild(arrow);
      }

      viz.appendChild(wrapper);
      t = t.next; idx++;
    }

    const nullArrow = document.createElement('span');
    nullArrow.className = 'll-arrow';
    nullArrow.textContent = '→';
    viz.appendChild(nullArrow);
    const nullNode = document.createElement('span');
    nullNode.className = 'll-null';
    nullNode.textContent = 'NULL';
    viz.appendChild(nullNode);

    animateStat('ll-count', count);
    animateStat('ll-ops', this.opsCount);

    if (highlightType) {
      setTimeout(() => {
        viz.querySelectorAll('.insert-highlight').forEach(n => n.classList.remove('insert-highlight'));
      }, settings.dur(1200));
    }
  }
};

document.getElementById('ll-insert-beg').addEventListener('click', () => { const v = getInputValue('ll-input'); if (v !== null) ll.insertBeginning(v); });
document.getElementById('ll-insert-end').addEventListener('click', () => { const v = getInputValue('ll-input'); if (v !== null) ll.insertEnd(v); });
document.getElementById('ll-delete-beg').addEventListener('click', () => ll.deleteBeginning());
document.getElementById('ll-delete-end').addEventListener('click', () => ll.deleteEnd());
document.getElementById('ll-display').addEventListener('click', () => ll.display());

// ═══════════════════════════════════════
// STACK (fixed size 10)
// ═══════════════════════════════════════
const stack = {
  MAX: 10,
  arr: [],
  top: -1,
  opsCount: 0,

  async push(val) {
    if (this.top === this.MAX - 1) {
      playSound('error');
      showToast('Stack Overflow! Maximum size (10) reached.', 'error');
      addLog('stack-log', `Push <strong>${val}</strong> failed — OVERFLOW`, 'error');
      return;
    }
    await waitForStep(`Push ${val}`);
    this.arr[++this.top] = val;
    this.opsCount++;
    playSound('push');
    showToast(`Pushed ${val} onto stack`, 'success');
    addLog('stack-log', `Push <strong>${val}</strong> → top=${this.top}`, 'success');
    this.render('push');
  },

  async pop() {
    if (this.top === -1) {
      playSound('error');
      showToast('Stack Underflow! Stack is empty.', 'error');
      addLog('stack-log', 'Pop failed — UNDERFLOW', 'error');
      return;
    }
    const val = this.arr[this.top];
    await waitForStep(`Pop ${val}`);
    this._animatePop(() => {
      this.top--;
      this.opsCount++;
      playSound('pop');
      showToast(`Popped ${val}`, 'success');
      addLog('stack-log', `Pop <strong>${val}</strong> → top=${this.top}`, 'success');
      this.render();
    });
  },

  display() {
    playSound('display');
    if (this.top === -1) { showToast('Stack is empty!', 'info'); addLog('stack-log', 'Display — stack empty', 'info'); }
    else { addLog('stack-log', `Display — ${this.top + 1} element(s)`, 'info'); }
    this.render();
  },

  _animatePop(cb) {
    const viz = document.getElementById('stack-viz');
    const blocks = viz.querySelectorAll('.stack-block');
    if (blocks.length > 0) {
      const topBlock = blocks[blocks.length - 1];
      topBlock.classList.add('delete-highlight', 'deleting');
      setTimeout(cb, settings.dur(400));
    } else { cb(); }
  },

  render(highlightType) {
    const viz = document.getElementById('stack-viz');
    viz.innerHTML = '';

    const base = document.createElement('div');
    base.className = 'stack-base';
    viz.appendChild(base);
    const baseLbl = document.createElement('div');
    baseLbl.className = 'stack-base-label';
    baseLbl.textContent = 'STACK BASE';
    viz.appendChild(baseLbl);

    if (this.top === -1) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.style.marginTop = '1rem';
      empty.textContent = 'Stack is empty — push an element';
      viz.appendChild(empty);
    } else {
      for (let i = 0; i <= this.top; i++) {
        const block = document.createElement('div');
        block.className = 'stack-block';
        block.textContent = this.arr[i];
        block.style.animationDelay = (i * 0.06) + 's';
        if (i === this.top) {
          const topLbl = document.createElement('span');
          topLbl.className = 'stack-top-label';
          topLbl.textContent = 'TOP';
          block.appendChild(topLbl);
          if (highlightType === 'push') block.classList.add('insert-highlight');
        }
        viz.appendChild(block);
      }
    }

    animateStat('stack-top', this.top);
    animateStat('stack-size', this.top + 1);
    animateStat('stack-ops', this.opsCount);

    if (highlightType) {
      setTimeout(() => {
        viz.querySelectorAll('.insert-highlight').forEach(n => n.classList.remove('insert-highlight'));
      }, settings.dur(1200));
    }
  }
};

document.getElementById('stack-push').addEventListener('click', () => { const v = getInputValue('stack-input'); if (v !== null) stack.push(v); });
document.getElementById('stack-pop').addEventListener('click', () => stack.pop());
document.getElementById('stack-display').addEventListener('click', () => stack.display());

// ═══════════════════════════════════════
// QUEUE (fixed size 10)
// ═══════════════════════════════════════
const queue = {
  MAX: 10,
  arr: new Array(10),
  front: -1,
  rear: -1,
  opsCount: 0,

  async enqueue(val) {
    if (this.rear === this.MAX - 1) {
      playSound('error');
      showToast('Queue Full! Maximum size (10) reached.', 'error');
      addLog('queue-log', `Enqueue <strong>${val}</strong> failed — FULL`, 'error');
      return;
    }
    await waitForStep(`Enqueue ${val}`);
    if (this.front === -1) this.front = 0;
    this.arr[++this.rear] = val;
    this.opsCount++;
    playSound('enqueue');
    showToast(`Enqueued ${val}`, 'success');
    addLog('queue-log', `Enqueue <strong>${val}</strong> → rear=${this.rear}`, 'success');
    this.render('enqueue');
  },

  async dequeue() {
    if (this.front === -1 || this.front > this.rear) {
      playSound('error');
      showToast('Queue Empty! Nothing to dequeue.', 'error');
      addLog('queue-log', 'Dequeue failed — EMPTY', 'error');
      return;
    }
    const val = this.arr[this.front];
    await waitForStep(`Dequeue ${val}`);
    this._animateDequeue(() => {
      this.front++;
      this.opsCount++;
      if (this.front > this.rear) { this.front = -1; this.rear = -1; }
      playSound('dequeue');
      showToast(`Dequeued ${val}`, 'success');
      addLog('queue-log', `Dequeue <strong>${val}</strong> → front=${this.front}`, 'success');
      this.render();
    });
  },

  display() {
    playSound('display');
    const empty = this.front === -1 || this.front > this.rear;
    if (empty) { showToast('Queue is empty!', 'info'); addLog('queue-log', 'Display — queue empty', 'info'); }
    else { addLog('queue-log', `Display — ${this.rear - this.front + 1} element(s)`, 'info'); }
    this.render();
  },

  _animateDequeue(cb) {
    const viz = document.getElementById('queue-viz');
    const blocks = viz.querySelectorAll('.queue-block');
    if (blocks.length > 0) {
      blocks[0].classList.add('delete-highlight', 'deleting');
      setTimeout(cb, settings.dur(400));
    } else { cb(); }
  },

  render(highlightType) {
    const viz = document.getElementById('queue-viz');
    viz.innerHTML = '';
    const empty = this.front === -1 || this.front > this.rear;

    if (empty) {
      viz.innerHTML = '<div class="empty-state">Queue is empty — enqueue an element</div>';
      animateStat('queue-front', '-1');
      animateStat('queue-rear', '-1');
      animateStat('queue-size', '0');
      animateStat('queue-ops', this.opsCount);
      return;
    }

    const count = this.rear - this.front + 1;
    let blockIdx = 0;
    for (let i = this.front; i <= this.rear; i++) {
      const block = document.createElement('div');
      block.className = 'queue-block';
      block.textContent = this.arr[i];
      block.style.animationDelay = (blockIdx * 0.07) + 's';
      if (i === this.front) {
        const fl = document.createElement('span');
        fl.className = 'queue-ptr-label front-label';
        fl.textContent = '▼ FRONT';
        block.appendChild(fl);
      }
      if (i === this.rear) {
        const rl = document.createElement('span');
        rl.className = 'queue-ptr-label rear-label';
        rl.textContent = '▲ REAR';
        block.appendChild(rl);
        if (highlightType === 'enqueue') block.classList.add('insert-highlight');
      }
      viz.appendChild(block);
      blockIdx++;
    }

    animateStat('queue-front', this.front);
    animateStat('queue-rear', this.rear);
    animateStat('queue-size', count);
    animateStat('queue-ops', this.opsCount);

    if (highlightType) {
      setTimeout(() => {
        viz.querySelectorAll('.insert-highlight').forEach(n => n.classList.remove('insert-highlight'));
      }, settings.dur(1200));
    }
  }
};

document.getElementById('queue-enqueue').addEventListener('click', () => { const v = getInputValue('queue-input'); if (v !== null) queue.enqueue(v); });
document.getElementById('queue-dequeue').addEventListener('click', () => queue.dequeue());
document.getElementById('queue-display').addEventListener('click', () => queue.display());

// ─── Enter key support ───
['ll-input', 'stack-input', 'queue-input'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const panel = e.target.closest('.panel');
      const firstBtn = panel.querySelector('.btn-insert');
      if (firstBtn) firstBtn.click();
    }
  });
});

// ─── Initial render ───
ll.render();
stack.render();
queue.render();
