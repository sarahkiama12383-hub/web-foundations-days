// Selecting DOM Elements
const noteInput = document.getElementById('note-text');
const charDisplay = document.getElementById('char-count');
const wordDisplay = document.getElementById('word-count');
const clearButton = document.getElementById('clear-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

// Helper to count words naturally
function countWords(str) {
  const words = str.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

// Main function to refresh counters and apply styling
function updateCounts() {
  const content = noteInput.value;
  const totalChars = content.length;
  const totalWords = countWords(content);

  charDisplay.textContent = `${totalChars} / 200 characters`;
  wordDisplay.textContent = `${totalWords} ${totalWords === 1 ? 'word' : 'words'}`;

  // Reset classes first
  charDisplay.classList.remove('warning', 'over');

  // Apply highlight classes based on character limits
  if (totalChars > 200) {
    charDisplay.classList.add('over');
  } else if (totalChars > 180) {
    charDisplay.classList.add('warning');
  }
}

// Clears field, storage draft, and updates UI
function resetNote() {
  noteInput.value = '';
  localStorage.removeItem('userDraft');
  updateCounts();
}

// Input Listener: Live updates & auto-saving draft
noteInput.addEventListener('input', () => {
  updateCounts();
  localStorage.setItem('userDraft', noteInput.value);
});

// Clear button trigger
clearButton.addEventListener('click', resetNote);

// Escape key shortcut inside text area
noteInput.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    resetNote();
  }
});

// Dark mode toggle & state saving
themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeToggleBtn.textContent = isDark ? 'Light mode' : 'Dark mode';
  localStorage.setItem('selectedTheme', isDark ? 'dark' : 'light');
});

// On initial page load: Restore draft and theme preference
function init() {
  const savedDraft = localStorage.getItem('userDraft');
  if (savedDraft !== null) {
    noteInput.value = savedDraft;
  }

  const activeTheme = localStorage.getItem('selectedTheme');
  if (activeTheme === 'gray') {
    document.body.classList.add('dark');
    themeToggleBtn.textContent = 'Light mode';
  }

  updateCounts();
}

// Run initialization
init();
