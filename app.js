/* ══════════════════════════════════════════════════════
   DSA Project — Application Logic
   Theme toggle, ripple, stats pop, operation logs,
   staggered animations, input shake
   ══════════════════════════════════════════════════════ */

// ─── Floating particles ───
(function initParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    const size = 3 + Math.random() * 6;
    p.style.width = p.style.height = size + 'px';
    p.style.animationDuration = (14 + Math.random() * 22) + 's';
    p.style.animationDelay = (Math.random() * 18) + 's';
    p.style.opacity = (.3 + Math.random() * .4).toString();
    container.appendChild(p);
  }
})();

// ─── Theme Toggle ───
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('dsa-theme', theme);
}

themeToggle.addEventListener('click', () => {
  themeToggle.classList.add('spin');
  setTimeout(() => themeToggle.classList.remove('spin'), 500);
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

const saved = localStorage.getItem('dsa-theme');
if (saved) setTheme(saved);

// ─── Button Ripple Effect ───
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
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

// ─── Utility: Toast ───
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = message;
  container.appendChild(t);
  setTimeout(() => { if (t.parentNode) t.remove(); }, 3200);
}

// ─── Utility: get & validate input ───
function getInputValue(id) {
  const el = document.getElementById(id);
  const v = el.value.trim();
  if (v === '' || isNaN(Number(v))) {
    showToast('Please enter a valid number.', 'error');
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
    return null;
  }
  el.value = '';
  return Number(v);
}

// ─── Utility: timestamp ───
function timeStamp() {
  const d = new Date();
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ─── Utility: add log entry ───
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

// ─── Utility: animate stat value ───
function animateStat(elementId, value) {
  const el = document.getElementById(elementId);
  el.textContent = value;
  el.classList.remove('pop');
  // force reflow
  void el.offsetWidth;
  el.classList.add('pop');
  setTimeout(() => el.classList.remove('pop'), 500);
}

// ═══════════════════════════════════════
// TAB NAVIGATION
// ═══════════════════════════════════════
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
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

  insertBeginning(val) {
    this.head = { data: val, next: this.head };
    this.opsCount++;
    showToast(`Inserted ${val} at beginning`, 'success');
    addLog('ll-log', `Insert <strong>${val}</strong> at beginning`, 'success');
    this.render('insert-beg');
  },

  insertEnd(val) {
    const node = { data: val, next: null };
    if (!this.head) { this.head = node; }
    else { let t = this.head; while (t.next) t = t.next; t.next = node; }
    this.opsCount++;
    showToast(`Inserted ${val} at end`, 'success');
    addLog('ll-log', `Insert <strong>${val}</strong> at end`, 'success');
    this.render('insert-end');
  },

  deleteBeginning() {
    if (!this.head) { showToast('List is empty!', 'error'); addLog('ll-log', 'Delete failed — list empty', 'error'); return; }
    const val = this.head.data;
    this._animateDelete(0, () => {
      this.head = this.head.next;
      this.opsCount++;
      showToast(`Deleted ${val} from beginning`, 'success');
      addLog('ll-log', `Delete <strong>${val}</strong> from beginning`, 'success');
      this.render();
    });
  },

  deleteEnd() {
    if (!this.head) { showToast('List is empty!', 'error'); addLog('ll-log', 'Delete failed — list empty', 'error'); return; }
    const count = this._count();
    if (!this.head.next) {
      const val = this.head.data;
      this._animateDelete(0, () => {
        this.head = null;
        this.opsCount++;
        showToast(`Deleted ${val} from end`, 'success');
        addLog('ll-log', `Delete <strong>${val}</strong> from end`, 'success');
        this.render();
      });
      return;
    }
    this._animateDelete(count - 1, () => {
      let t = this.head;
      while (t.next.next) t = t.next;
      const val = t.next.data;
      t.next = null;
      this.opsCount++;
      showToast(`Deleted ${val} from end`, 'success');
      addLog('ll-log', `Delete <strong>${val}</strong> from end`, 'success');
      this.render();
    });
  },

  display() {
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
      setTimeout(cb, 450);
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
      // staggered entrance delay
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
      }, 1200);
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

  push(val) {
    if (this.top === this.MAX - 1) {
      showToast('Stack Overflow! Maximum size (10) reached.', 'error');
      addLog('stack-log', `Push <strong>${val}</strong> failed — OVERFLOW`, 'error');
      return;
    }
    this.arr[++this.top] = val;
    this.opsCount++;
    showToast(`Pushed ${val} onto stack`, 'success');
    addLog('stack-log', `Push <strong>${val}</strong> → top=${this.top}`, 'success');
    this.render('push');
  },

  pop() {
    if (this.top === -1) {
      showToast('Stack Underflow! Stack is empty.', 'error');
      addLog('stack-log', 'Pop failed — UNDERFLOW', 'error');
      return;
    }
    const val = this.arr[this.top];
    this._animatePop(() => {
      this.top--;
      this.opsCount++;
      showToast(`Popped ${val}`, 'success');
      addLog('stack-log', `Pop <strong>${val}</strong> → top=${this.top}`, 'success');
      this.render();
    });
  },

  display() {
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
      setTimeout(cb, 420);
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
        // staggered delay
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
      }, 1200);
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

  enqueue(val) {
    if (this.rear === this.MAX - 1) {
      showToast('Queue Full! Maximum size (10) reached.', 'error');
      addLog('queue-log', `Enqueue <strong>${val}</strong> failed — FULL`, 'error');
      return;
    }
    if (this.front === -1) this.front = 0;
    this.arr[++this.rear] = val;
    this.opsCount++;
    showToast(`Enqueued ${val}`, 'success');
    addLog('queue-log', `Enqueue <strong>${val}</strong> → rear=${this.rear}`, 'success');
    this.render('enqueue');
  },

  dequeue() {
    if (this.front === -1 || this.front > this.rear) {
      showToast('Queue Empty! Nothing to dequeue.', 'error');
      addLog('queue-log', 'Dequeue failed — EMPTY', 'error');
      return;
    }
    const val = this.arr[this.front];
    this._animateDequeue(() => {
      this.front++;
      this.opsCount++;
      if (this.front > this.rear) { this.front = -1; this.rear = -1; }
      showToast(`Dequeued ${val}`, 'success');
      addLog('queue-log', `Dequeue <strong>${val}</strong> → front=${this.front}`, 'success');
      this.render();
    });
  },

  display() {
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
      setTimeout(cb, 420);
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
      // staggered delay
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
      }, 1200);
    }
  }
};

document.getElementById('queue-enqueue').addEventListener('click', () => { const v = getInputValue('queue-input'); if (v !== null) queue.enqueue(v); });
document.getElementById('queue-dequeue').addEventListener('click', () => queue.dequeue());
document.getElementById('queue-display').addEventListener('click', () => queue.display());

// ─── Enter key support on all inputs ───
['ll-input', 'stack-input', 'queue-input'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      // click the first insert/push/enqueue button
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
