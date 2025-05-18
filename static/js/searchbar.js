const availableTags = ["Classical", "Jazz", "Electronic", "New-age", "Funk", "R&B", "Punk", 
                       "Acoustic", "Country", "Rock", "Reggae", "Pop", "Hip Hop", "Blues", 
                       "Folk", "Christian", "Rap"];
const chipsContainer = document.getElementById('search-bar-chips');
const chipInput = document.getElementById('search-bar-chip-input');
const suggestions = document.getElementById('chip-suggestions');

function updateSuggestions() {
  const val = chipInput.value.toLowerCase();
  suggestions.innerHTML = '';
  if (!val) {
    suggestions.style.display = 'none';
    return;
  }
  const filtered = availableTags.filter(tag =>
    tag.toLowerCase().includes(val) &&
    !Array.from(chipsContainer.getElementsByClassName('chip')).some(chip => chip.dataset.tag === tag)
  );
  if (filtered.length === 0) {
    suggestions.style.display = 'none';
    return;
  }
  filtered.forEach(tag => {
    const div = document.createElement('div');
    div.className = 'chip-suggestion';
    div.dataset.tag = tag;
    div.textContent = tag;
    suggestions.appendChild(div);
  });
  suggestions.style.display = 'block';
}

// Add chip
function addChip(tag) {
  if (Array.from(chipsContainer.getElementsByClassName('chip')).some(chip => chip.dataset.tag === tag)) return;
  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.dataset.tag = tag;
  chip.innerHTML = `${tag}<span class="chip-remove" title="Remove">&times;</span>`;
  chipsContainer.insertBefore(chip, chipInput);
  chipInput.value = '';
  suggestions.style.display = 'none';
}

// Remove chip
chipsContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('chip-remove')) {
    e.target.parentElement.remove();
  }
  chipInput.focus();
});

// Handle input
chipInput.addEventListener('input', updateSuggestions);

// Handle suggestion click
suggestions.addEventListener('click', function(e) {
  if (e.target.classList.contains('chip-suggestion')) {
    addChip(e.target.dataset.tag);
    chipInput.value = '';
    suggestions.style.display = 'none';
    chipInput.focus();
  }
});

// Keyboard navigation: Enter to select first suggestion
chipInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const first = suggestions.querySelector('.chip-suggestion');
    if (first) {
      addChip(first.dataset.tag);
      e.preventDefault();
    }
  }
});

// Show suggestions on focus
chipInput.addEventListener('focus', updateSuggestions);

// Hide suggestions when clicking outside
document.addEventListener('click', function(e) {
  if (!chipsContainer.contains(e.target) && !suggestions.contains(e.target)) {
    suggestions.style.display = 'none';
  }
});

// Position suggestions
chipsContainer.style.position = 'relative';
suggestions.style.position = 'absolute';
suggestions.style.left = '0';
suggestions.style.top = '110%';
suggestions.style.width = '100%';
chipsContainer.appendChild(suggestions);