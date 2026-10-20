"use strict";

/* ==============================================================
 * CHỈNH LỜI CHÚC TẠI ĐÂY (có thể giữ nguyên để dùng ngay)
 * Nếu muốn cá nhân hoá không cần sửa mã, dùng file tao-ma-qr.html.
 * ============================================================== */
const CONFIG = {
  title: "Gửi bạn, cô gái tuyệt vời!",
  message:
    "Chúc bạn ngày 20/10 thật vui vẻ, luôn xinh đẹp, rạng rỡ và được yêu thương theo cách mà bạn xứng đáng.\n\nMong mỗi ngày của bạn đều có những niềm vui nho nhỏ, những nụ cười thật tươi và thật nhiều điều tốt đẹp ghé thăm! 🌷",
  signature: "Một người luôn trân trọng bạn ♡",
};

// Nhận tên/người gửi/lời chúc tùy chỉnh từ đường link quét QR.
const params = new URLSearchParams(window.location.search);
const recipient = (params.get("ten") || "").trim().slice(0, 80);
const sender = (params.get("tu") || "").trim().slice(0, 80);
const personalMessage = (params.get("loi") || "").trim().slice(0, 1200);

document.getElementById("letterTitle").textContent = recipient
  ? `Gửi ${recipient}, cô gái tuyệt vời!`
  : CONFIG.title;
document.getElementById("letterMessage").textContent = personalMessage || CONFIG.message;
document.getElementById("letterSignature").textContent = sender ? `${sender} ♡` : CONFIG.signature;

const scene = document.getElementById("scene");
const firstRose = document.getElementById("firstRose");
const firstRoseArt = document.getElementById("firstRoseArt");
const garden = document.getElementById("garden");
const fallingPetals = document.getElementById("fallingPetals");
const overlay = document.getElementById("letterOverlay");
const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");
const againButton = document.getElementById("againButton");

// Các màu chuyển sắc được dùng chung cho mọi cành hoa SVG.
document.body.insertAdjacentHTML("afterbegin", `
<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" aria-hidden="true"
     style="position:absolute;overflow:hidden;pointer-events:none">
  <defs>
    <linearGradient id="rose-petal-outer" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="#fff2f6"/>
      <stop offset=".4" stop-color="#f8b3ce"/>
      <stop offset="1" stop-color="#cb658e"/>
    </linearGradient>
    <linearGradient id="rose-petal-mid" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffebef"/>
      <stop offset=".55" stop-color="#f6a0c1"/>
      <stop offset="1" stop-color="#cb678e"/>
    </linearGradient>
    <linearGradient id="rose-petal-inner" x1="0" y1="0" x2="1" y2=".7">
      <stop offset="0" stop-color="#fff2f5"/>
      <stop offset=".65" stop-color="#ee92b5"/>
      <stop offset="1" stop-color="#bf5d84"/>
    </linearGradient>
    <linearGradient id="rose-leaf" x1="0" y1="0" x2="1" y2=".6">
      <stop offset="0" stop-color="#72ca88"/><stop offset=".55" stop-color="#398d60"/><stop offset="1" stop-color="#26744f"/>
    </linearGradient>
    <linearGradient id="rose-stem" x1="0" y1="0" x2="1" y2=".6">
      <stop offset="0" stop-color="#458c59"/><stop offset="1" stop-color="#1c6b49"/>
    </linearGradient>
  </defs>
</svg>`);

function petalsOnRing(count, distance, rx, ry, gradient, phase = 0) {
  let html = "";
  for (let i = 0; i < count; i++) {
    const a = (i * 360) / count + phase;
    html += `<ellipse cx="0" cy="-${distance}" rx="${rx}" ry="${ry}"
      transform="rotate(${a.toFixed(2)})" fill="url(#${gradient})"
      stroke="#fff1f4" stroke-opacity=".56" stroke-width=".85"/>`;
  }
  return html;
}

function roseSVG(hue = 0, isMain = false) {
  const petalLayers =
    petalsOnRing(12, 34, 20.5, 31, "rose-petal-outer", 4) +
    petalsOnRing(11, 27, 18.3, 26.5, "rose-petal-mid", 18) +
    petalsOnRing(9, 19, 14.2, 21, "rose-petal-inner", 3) +
    petalsOnRing(7, 12, 10.6, 14.8, "rose-petal-mid", 20);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 280" role="img" aria-label="Bông hồng">
   <path d="M80 117 C84 160 74 203 81 280" fill="none" stroke="url(#rose-stem)" stroke-width="3.3" stroke-linecap="round"/>
   <path d="M80 177 C58 152 37 157 22 163 C24 187 56 199 80 177Z" fill="url(#rose-leaf)" stroke="#3b8e60" stroke-width="1"/>
   <path d="M80 177 Q48 171 28 168" fill="none" stroke="#b2e4ac" stroke-width="1.3"/>
   <path d="M79 214 C100 180 122 183 139 190 C133 216 101 230 79 214Z" fill="url(#rose-leaf)" stroke="#3b8e60" stroke-width="1"/>
   <path d="M79 214 Q112 203 132 193" fill="none" stroke="#b2e4ac" stroke-width="1.3"/>
   <path d="M81 124 C69 118 62 107 64 99 Q80 109 95 98 C99 109 92 119 81 124Z" fill="#4d9c66"/>
   <g class="flower-head" style="filter:hue-rotate(${hue}deg) ${isMain ? "drop-shadow(0 2px 3px #de8ead4d)" : ""}">
     <g transform="translate(80 72)">
       <circle cx="0" cy="0" r="51" fill="#c96a90" opacity=".54"/>
       ${petalLayers}
       <circle r="11.7" fill="url(#rose-petal-inner)" stroke="#fdd7e4" stroke-width="1.5"/>
       <path d="M-7 4 C-12 -7 -1 -13 8 -8 C16 -2 7 8 0 6 C-7 4 -4 -4 2 -3 C6 -2 4 3 1 2"
         fill="none" stroke="#b6527c" stroke-width="2.2" stroke-linecap="round"/>
       <path d="M-10 0 C-11 -7 -5 -12 1 -13" fill="none" stroke="#fff6fa" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>
     </g>
   </g>
 </svg>`;
}

firstRoseArt.innerHTML = roseSVG(0, true);

function seededRandom(seed) {
  let v = seed >>> 0;
  return () => {
    v = (v * 1664525 + 1013904223) >>> 0;
    return v / 4294967296;
  };
}

function createGarden() {
  const rand = seededRandom(20102026);
  const isMobile = window.innerWidth <= 600;
  const numberInRow = isMobile ? [12, 18, 22] : [18, 24, 32];
  // Hàng phía sau mọc cao, hàng phía trước mọc thấp để thành một khu vườn dày.
  const rows = [
    { bottom: 27, size: isMobile ? 72 : 105, duration: 0.28 },
    { bottom: 12, size: isMobile ? 86 : 130, duration: 0.22 },
    { bottom: -6, size: isMobile ? 105 : 155, duration: 0.15 },
  ];
  const hues = [0, 0, 0, -30, -30, 45, 105, 185, 255, 275];
  const fragment = document.createDocumentFragment();
  rows.forEach((row, rowIndex) => {
    const count = numberInRow[rowIndex];
    for (let i = 0; i < count; i++) {
      const flower = document.createElement("div");
      flower.className = "flower";
      flower.setAttribute("aria-hidden", "true");
      const x = (i + rand() * .65 - .3) / (count - 1) * 112 - 6;
      const bottom = row.bottom + (rand() - .5) * (rowIndex === 2 ? 14 : 17);
      const size = row.size * (.68 + rand() * .52);
      const hue = hues[Math.floor(rand() * hues.length)];
      const tilt = (rand() * 21 - 10).toFixed(1);
      const delay = (row.duration + rand() * 1.32).toFixed(2);
      flower.style.cssText = `--left:${x.toFixed(2)}%;--bottom:${bottom.toFixed(2)}vh;` +
        `--width:${size.toFixed(1)}px;--tilt:${tilt}deg;--delay:${delay}s;` +
        `--sway-delay:-${(rand()*6).toFixed(2)}s;--sway-duration:${(3+rand()*3).toFixed(2)}s;` +
        `z-index:${rowIndex + 1}`;
      flower.innerHTML = roseSVG(hue);
      fragment.appendChild(flower);
    }
  });
  garden.appendChild(fragment);
}

function createFallingPetals() {
  const rand = seededRandom(2010);
  const colors = ["#f6afc2", "#f9d2b6", "#d9b8e8", "#f7c7dc", "#b5dff0"];
  for (let i = 0; i < 24; i++) {
    const petal = document.createElement("span");
    petal.className = "petal-particle";
    petal.style.cssText = `--x:${(rand()*100).toFixed(2)}%;` +
      `--size:${(8+rand()*11).toFixed(1)}px;` +
      `--duration:${(7+rand()*8).toFixed(1)}s;` +
      `--delay:${(rand()*-13).toFixed(1)}s;` +
      `--wind:${(rand()*220-110).toFixed(0)}px;` +
      `--petal-color:${colors[Math.floor(rand()*colors.length)]};`;
    fallingPetals.appendChild(petal);
  }
}

let timers = [];
let isStarted = false;
let isOpened = false;
const after = (fn, delay) => { timers.push(window.setTimeout(fn, delay)); };

function showLetter() {
  document.body.classList.add("is-letter-visible");
  overlay.setAttribute("aria-hidden", "false");
  after(openLetter, 1650); // Tự động hiện nội dung dù không nhấn vào phong bì.
}

function openLetter() {
  if (isOpened) return;
  isOpened = true;
  document.body.classList.add("is-opening");
  after(() => {
    document.body.classList.add("is-open");
    letter.setAttribute("aria-hidden", "false");
    envelope.setAttribute("tabindex", "-1");
    after(() => { againButton.focus({preventScroll: true}); }, 850);
  }, 420);
}

function startMagic() {
  if (isStarted) return;
  isStarted = true;
  firstRose.disabled = true;
  createGarden();
  createFallingPetals();
  document.body.classList.add("is-blooming");
  scene.setAttribute("aria-label", "Khu vườn hoa đã nở");
  after(showLetter, 3300);
}

function resetMagic() {
  timers.forEach(window.clearTimeout);
  timers = [];
  isStarted = false;
  isOpened = false;
  garden.replaceChildren();
  fallingPetals.replaceChildren();
  document.body.classList.remove("is-blooming", "is-letter-visible", "is-opening", "is-open");
  letter.setAttribute("aria-hidden", "true");
  overlay.setAttribute("aria-hidden", "true");
  envelope.removeAttribute("tabindex");
  firstRose.disabled = false;
  after(() => firstRose.focus({preventScroll: true}), 100);
}

firstRose.addEventListener("click", startMagic);
envelope.addEventListener("click", openLetter);
againButton.addEventListener("click", resetMagic);
