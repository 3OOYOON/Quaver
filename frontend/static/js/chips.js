const availableTags = ["Classical", "Jazz", "Electronic", "New-age", "Funk", "R&B", "Punk", 
                       "Acoustic", "Country", "Rock", "Reggae", "Pop", "Hip Hop", "Blues", 
                       "Folk", "Christian", "Rap"];

const newPostChipsContainer = document.getElementById('new-post-chips');
const newPostChipInput = document.getElementById('new-post-chip-input');
const newPostSuggestions = document.getElementById('new-post-chip-suggestions');

function updateNewPostSuggestions() {
    const val = newPostChipInput.value.toLowerCase();
    newPostSuggestions.innerHTML = '';
    if (!val) {
        newPostSuggestions.style.display = 'none';
        return;
    }
    const selectedTags = Array.from(newPostChipsContainer.getElementsByClassName('chip')).map(chip => chip.dataset.tag);
    const filtered = availableTags.filter(tag =>
        tag.toLowerCase().includes(val) &&
        !selectedTags.includes(tag)
    );
    if (filtered.length === 0) {
        newPostSuggestions.style.display = 'none';
        return;
    }
    filtered.forEach(tag => {
        const div = document.createElement('div');
        div.className = 'chip-suggestion';
        div.dataset.tag = tag;
        div.textContent = tag;
        newPostSuggestions.appendChild(div);
    });
    newPostSuggestions.style.display = 'block';
}

function addNewPostChip(tag) {
  const chips = newPostChipsContainer.getElementsByClassName('chip');
  if (Array.from(chips).some(chip => chip.dataset.tag === tag)) return;
  if (chips.length >= 5) {
    alert('You can add up to 5 tags.');
    newPostChipInput.value = '';
    newPostSuggestions.style.display = 'none';
    return;
  }
  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.dataset.tag = tag;
  chip.innerHTML = `${tag}<span class="chip-remove" title="Remove">&times;</span>`;
  newPostChipsContainer.insertBefore(chip, newPostChipInput);
  newPostChipInput.value = '';
  newPostSuggestions.style.display = 'none';
}

newPostChipsContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('chip-remove')) {
    e.target.parentElement.remove();
  }
  newPostChipInput.focus();
});

newPostChipInput.addEventListener('input', updateNewPostSuggestions);

newPostSuggestions.addEventListener('click', function(e) {
  if (e.target.classList.contains('chip-suggestion')) {
    addNewPostChip(e.target.dataset.tag);
    newPostChipInput.value = '';
    newPostSuggestions.style.display = 'none';
    newPostChipInput.focus();
  }
});

newPostChipInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const first = newPostSuggestions.querySelector('.chip-suggestion');
    if (first) {
      addNewPostChip(first.dataset.tag);
      e.preventDefault();
    }
  }
});

newPostChipInput.addEventListener('focus', updateNewPostSuggestions);

document.addEventListener('click', function(e) {
  if (!newPostChipsContainer.contains(e.target) && !newPostSuggestions.contains(e.target)) {
    newPostSuggestions.style.display = 'none';
  }
});

newPostChipsContainer.style.position = 'relative';
newPostSuggestions.style.position = 'absolute';
newPostSuggestions.style.left = '0';
newPostSuggestions.style.top = '80%';
newPostSuggestions.style.width = '100%';
newPostChipsContainer.appendChild(newPostSuggestions);

function resetNewPostChips() {
  Array.from(newPostChipsContainer.getElementsByClassName('chip')).forEach(chip => chip.remove());
  newPostChipInput.value = '';
  newPostSuggestions.style.display = 'none';
}
document.getElementById('new-post-modal').addEventListener('classChange', resetNewPostChips);
document.getElementById('new-post-form').addEventListener('reset', resetNewPostChips);

(function() {
  const modal = document.getElementById('new-post-modal');
  const observer = new MutationObserver(() => {
    const event = new Event('classChange');
    modal.dispatchEvent(event);
  });
  observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
})();
