# ⚡ DSA Project — Interactive Data Structure Visualizer

An interactive web application that visually simulates **Linked List**, **Stack**, and **Queue** operations with rich animations, sound effects, and step-by-step mode.

> Built with ❤️ by **Subham Kumar** and **Subham Panigarhi** | Submitted to **Navreet Kaur Mam**

---

## 🎯 Features

### Data Structures
- **Linked List** — Insert at Beginning/End, Delete from Beginning/End, Display
- **Stack** (Max 10) — Push, Pop, Display with Overflow/Underflow detection
- **Queue** (Max 10) — Enqueue, Dequeue, Display with Full/Empty detection

### UI/UX
- 🌗 **Dark / Light Theme** toggle with localStorage persistence
- 🎨 **Color-coded operations** — green for insert, red for delete
- ✨ **Rich CSS animations** — ripple, glow, stagger, bounce, shimmer
- 🔊 **Sound effects** — audio feedback on every operation
- ⏱️ **Animation Speed Control** — slider from 0.25x to 3x speed
- 📋 **Operation Log** — timestamped log of every action
- 📊 **Stats Dashboard** — live node count, operation counter
- 📖 **Info Cards** — algorithm descriptions with time complexity badges
- 🔔 **Toast Notifications** — for errors like overflow, underflow, empty
- 📱 **Fully Responsive** — works on desktop, tablet, and mobile
- ⌨️ **Keyboard Support** — press Enter to submit values

### Tech Stack
- **Frontend:** Pure HTML5 + CSS3 + Vanilla JavaScript
- **No external libraries** — zero dependencies
- **Original C++ source** included as reference

---

## 📁 Project Structure

```
projectcpp/
├── index.html                   # Main HTML structure
├── style.css                    # Complete stylesheet (dark/light themes)
├── app.js                       # All application logic & animations
├── menu.cpp                     # Original C++ console program
├── README.md                    # This file
└── .gitignore                   # Git ignore rules
```

---

## 🚀 How to Run

Simply open `index.html` in any modern browser — no server or build step needed:

```bash
# Clone the repo
git clone https://github.com/Subham-531/DSA_Project.git

# Open in browser
open DSA_Project/index.html
```

Or double-click `index.html` in your file manager.

---

## 🖥️ Screenshots

### Dark Mode — Linked List
Nodes connected by animated arrows with HEAD label and NULL terminator.

### Stack Visualization
Vertical block tower with alternating gradients, TOP label, and base glow.

### Queue Visualization
Horizontal blocks with bouncing FRONT/REAR pointer labels.

---

## 🎮 Controls

| Action | How |
|--------|-----|
| Insert/Push/Enqueue | Enter value → click green button |
| Delete/Pop/Dequeue | Click red button |
| Display | Click purple button |
| Switch Structure | Click tab (Linked List / Stack / Queue) |
| Change Theme | Click 🌙/☀️ button (top-right) |
| Adjust Speed | Move the speed slider |
| Submit Value | Press Enter in input field |

---

## 📚 Algorithm Complexity

| Operation | Linked List | Stack | Queue |
|-----------|------------|-------|-------|
| Insert/Push/Enqueue | O(1) / O(n) | O(1) | O(1) |
| Delete/Pop/Dequeue | O(1) / O(n) | O(1) | O(1) |
| Search/Peek | O(n) | O(1) | O(1) |

---

## 🔧 Original C++ Program

The web app replicates the functionality of `menu_LL_Stack_queue.cpp` — a menu-driven console program implementing the same three data structures with identical operations.

---

## 📄 License

This project is for educational purposes. Feel free to use and modify.

---

**Made with ⚡ Pure HTML · CSS · JavaScript — No Libraries**
