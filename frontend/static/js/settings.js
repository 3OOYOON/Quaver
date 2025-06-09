// For updateing profile picture
// Open the modal
document.getElementById('open-profile-pic-modal').onclick = function() {
  document.getElementById('profile-pic-modal').classList.remove('hidden');
};

// Close the modal
document.getElementById('close-profile-pic-modal').onclick = function() {
  document.getElementById('profile-pic-modal').classList.add('hidden');
};

// Preview selected image
document.getElementById('profile-pic-input').onchange = function(e) {
  const file = e.target.files[0];
  const preview = document.getElementById('profile-pic-preview');
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      preview.src = evt.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = '';
    preview.style.display = 'none';
  }
};

// Handle form submission
document.getElementById('profile-pic-form').onsubmit = function(e) {
  e.preventDefault();
  const file = document.getElementById('profile-pic-input').files[0];
  if (!file) return;
  // TODO: Upload file to server via AJAX or form submission
  alert('Profile picture updated! (implement upload logic)');
  document.getElementById('profile-pic-modal').classList.add('hidden');
  this.reset();
  document.getElementById('profile-pic-preview').style.display = 'none';
};

// Optional: Close modal when clicking outside modal content
document.getElementById('profile-pic-modal').onclick = function(e) {
  if (e.target === this) this.classList.add('hidden');
};


// For updating banner picture
// Open the banner modal
document.getElementById('open-banner-pic-modal').onclick = function() {
  document.getElementById('banner-pic-modal').classList.remove('hidden');
};

// Close the banner modal
document.getElementById('close-banner-pic-modal').onclick = function() {
  document.getElementById('banner-pic-modal').classList.add('hidden');
};

// Preview selected banner image
document.getElementById('banner-pic-input').onchange = function(e) {
  const file = e.target.files[0];
  const preview = document.getElementById('banner-pic-preview');
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      preview.src = evt.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = '';
    preview.style.display = 'none';
  }
};

// Handle banner form submission
document.getElementById('banner-pic-form').onsubmit = function(e) {
  e.preventDefault();
  const file = document.getElementById('banner-pic-input').files[0];
  if (!file) return;
  // TODO: Upload file to server via AJAX or form submission
  alert('Banner picture updated! (implement upload logic)');
  document.getElementById('banner-pic-modal').classList.add('hidden');
  this.reset();
  document.getElementById('banner-pic-preview').style.display = 'none';
};

// Optional: Close modal when clicking outside modal content
document.getElementById('banner-pic-modal').onclick = function(e) {
  if (e.target === this) this.classList.add('hidden');
};
