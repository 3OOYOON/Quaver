const availableTags = ["Classical", "Jazz", "Electronic", "New-age", "Funk", "R&B", "Punk", 
                       "Acoustic", "Country", "Rock", "Reggae", "Pop", "Hip Hop", "Blues", 
                       "Folk", "Christian", "Rap", "J-Pop", "K-Pop"];

// For search bar
initChipInput({
  containerId: 'search-bar-chips',
  inputId: 'search-bar-chip-input',
  suggestionsId: 'chip-suggestions',
  maxChips: null // unlimited or set a number
});

// For new post modal
initChipInput({
  containerId: 'new-post-chips',
  inputId: 'new-post-chip-input',
  suggestionsId: 'new-post-chip-suggestions',
  maxChips: 5
});


function initChipInput({ containerId, inputId, suggestionsId, maxChips = 5 }) {
  const chipsContainer = document.getElementById(containerId);
  const chipInput = document.getElementById(inputId);
  const suggestions = document.getElementById(suggestionsId);

  function updateSuggestions() {
    const val = chipInput.value.toLowerCase();
    suggestions.innerHTML = '';
    if (!val) {
      suggestions.style.display = 'none';
      return;
    }
    const selectedTags = Array.from(chipsContainer.getElementsByClassName('chip')).map(chip => chip.dataset.tag);
    const filtered = availableTags.filter(tag =>
      tag.toLowerCase().includes(val) && !selectedTags.includes(tag)
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

  function addChip(tag) {
    if (Array.from(chipsContainer.getElementsByClassName('chip')).some(chip => chip.dataset.tag === tag)) return;
    if (maxChips && chipsContainer.getElementsByClassName('chip').length >= maxChips) {
      alert(`You can add up to ${maxChips} tags.`);
      chipInput.value = '';
      suggestions.style.display = 'none';
      return;
    }
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.dataset.tag = tag;
    chip.innerHTML = `${tag}<span class="chip-remove" title="Remove">&times;</span>`;
    chipsContainer.insertBefore(chip, chipInput);
    chipInput.value = '';
    suggestions.style.display = 'none';

    refreshPosts()
  }

  // Event Listeners
  chipsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('chip-remove')) {
        e.target.parentElement.remove();
        refreshPosts()
    }
    chipInput.focus();
  });

  chipInput.addEventListener('input', updateSuggestions);
  chipInput.addEventListener('focus', updateSuggestions);
  chipInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const first = suggestions.querySelector('.chip-suggestion');
      if (first) {
        addChip(first.dataset.tag);
        e.preventDefault();
      }
    }
  });

  suggestions.addEventListener('click', e => {
    if (e.target.classList.contains('chip-suggestion')) {
      addChip(e.target.dataset.tag);
      chipInput.value = '';
      suggestions.style.display = 'none';
      chipInput.focus();
    }
  });

  document.addEventListener('click', e => {
    if (!chipsContainer.contains(e.target) && !suggestions.contains(e.target)) {
      suggestions.style.display = 'none';
    }
  });

  // Positioning
  chipsContainer.style.position = 'relative';
  suggestions.style.position = 'absolute';
  suggestions.style.left = '0';
  suggestions.style.top = '80%';
  suggestions.style.width = '100%';
  chipsContainer.appendChild(suggestions);
}


function resetNewPostChips() {
  const container = document.getElementById('new-post-chips');
  Array.from(container.getElementsByClassName('chip')).forEach(chip => chip.remove());
  document.getElementById('new-post-chip-input').value = '';
  document.getElementById('new-post-chip-suggestions').style.display = 'none';
}

document.getElementById('new-post-modal').addEventListener('classChange', resetNewPostChips);
document.getElementById('new-post-form').addEventListener('reset', resetNewPostChips);

