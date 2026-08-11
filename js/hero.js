// ============================================================
// HERO: typewriter effect cycling through role subtitles
// Types out each role in `roles` one character at a time, pauses,
// deletes it back to nothing, then moves to the next role and repeats
// forever. All state is tracked in the three variables below rather
// than CSS animation, since the text content itself has to change.
// ============================================================

const roles = [
  'Software Developer',
  'Full-Stack Developer',
  'AI/ML Enthusiast',
  'Cloud Learner',
  'Cybersecurity Explorer'
];

const typewriterEl = document.getElementById('typewriterText');
let roleIndex = 0;       // which entry in `roles` is currently being typed/deleted
let charIndex = 0;       // how many characters of the current role are shown
let isDeleting = false;  // false = typing forward, true = deleting backward

// Recursive setTimeout loop (rather than setInterval) so the delay
// between characters can change on the fly — typing is faster than
// deleting, and there's a long pause once a word is fully typed.
function typeLoop() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typewriterEl.textContent = currentRole.substring(0, charIndex);

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentRole.length) {
    // Finished typing this role: hold it fully visible for a beat,
    // then start deleting on the next tick.
    delay = 1400; // pause at full word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting: move on to the next role (wrapping back to
    // the start of the array after the last one) and start typing it.
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  setTimeout(typeLoop, delay);
}

typeLoop();
