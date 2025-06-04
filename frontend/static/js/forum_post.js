async function toggleReplies(button) {
    // Find the closest .forum-post ancestor
    const post = button.closest('.forum-post');
    // Find the .post-replies inside this post
    const replies = post.querySelector('.post-replies');
    if (!replies) return;
    if (replies.classList.contains('hidden')) {
        replies.classList.remove('hidden');
        button.querySelector('.btn-label').textContent = "Hide Replies";
    } else {
        replies.classList.add('hidden');
        button.querySelector('.btn-label').textContent = "Replies";
    }
}


async function refreshPosts() {
    const res = await fetch("http://localhost:8000/loadPosts", {method: "GET"});
    const allData = await res.json();

    allData.forEach(postData => {
        insertPost(postData);
    });
}



document.getElementById('open-modal-btn').addEventListener('click', function() {
  document.getElementById('new-post-modal').classList.remove('hidden');
});

document.getElementById('close-modal-btn').addEventListener('click', function() {
  document.getElementById('new-post-modal').classList.add('hidden');
});

// Close modal when clicking outside the modal content
// document.getElementById('new-post-modal').addEventListener('click', function(e) {
//   if (e.target === this) this.classList.add('hidden');
// });


document.getElementById('new-post-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const postTitle = document.getElementById('post-title').value.trim();
    const postContent = document.getElementById('post-content').value.trim();
    const postDate = Date.now()
    const imageInput = document.getElementById('post-images');
    const imageFiles = Array.from(imageInput.files);

    if (imageFiles.length > 10) {
        alert('You can upload a maximum of 10 images.');
        return;
    }

    // // If images uploaded, append them
    // if (imageFiles.length > 0) {
    //     const imgContainer = postDiv.querySelector('.uploaded-images');
    //     imageFiles.forEach(file => {
    //     const reader = new FileReader();
    //     reader.onload = function(e) {
    //         const img = document.createElement('img');
    //         img.src = e.target.result;
    //         img.className = 'avatar';
    //         img.alt = 'Uploaded Image';
    //         img.style.margin = "5px";
    //         imgContainer.appendChild(img);
    //     };
    //     reader.readAsDataURL(file);
    //     });
    // }


    // Get selected tags
    const newPostChipsContainer = document.getElementById('new-post-chips')
    const postTags = Array.from(newPostChipsContainer.getElementsByClassName('chip')).map(chip => chip.dataset.tag);

    const postData = {
        title: postTitle,
        content: postContent,
        datePosted: postDate,
        tags: postTags
    }
    insertPost(postData, first=true);

    fetch("http://localhost:8000/makePost", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)});

    // Close modal and reset form
    document.getElementById('new-post-modal').classList.add('hidden');
    this.reset();
});


// Helper function to insert posts at top of main
function insertPost(postData, first=false) {
    const postTemplate = document.getElementById('post');
    const postContainer = document.querySelector('main');
    const postElement = postTemplate.content.cloneNode(true);

    // Set title, content, date, etc.
    postElement.querySelector(".post-title").textContent = postData['title']
    postElement.querySelector(".post-text").textContent = postData['content']
    postElement.querySelector(".post-date").textContent = ''
    const date = new Date(postData['datePosted'])
    postElement.querySelector(".post-date").textContent = 'Posted on '+ date.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'})
    
    // Render tags
    const tagsContainer = postElement.querySelector('.post-tags');
    postData.tags.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'chip';
        tagEl.textContent = tag;
        tagsContainer.appendChild(tagEl);
    });

    if ((!first) || postContainer.children.length < 2) {
        postContainer.appendChild(postElement);
    }
    else {
        postContainer.insertBefore(postElement, postContainer.children[1]);
    }
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'
    })[m];
  });
}




// This takes alot from how new posts works

// Open the reply modal
function openReplyModal(postElement) {
  // Store the post element being replied to for later use
  window.currentReplyTarget = postElement;
  document.getElementById('reply-modal').classList.remove('hidden');
}

// Close the reply modal
document.getElementById('close-reply-modal-btn').addEventListener('click', function() {
  document.getElementById('reply-modal').classList.add('hidden');
});

// Close modal when clicking outside the modal content
document.getElementById('reply-modal').addEventListener('click', function(e) {
  if (e.target === this) this.classList.add('hidden');
});

// Handle reply form submission
document.getElementById('reply-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const content = document.getElementById('reply-content').value.trim();
  const imageInput = document.getElementById('reply-images');
  const imageFiles = Array.from(imageInput.files);

  if (imageFiles.length > 10) {
    alert('You can upload a maximum of 10 images.');
    return;
  }

  // Create reply element
  const replyDiv = document.createElement('div');
  replyDiv.className = 'reply';
  replyDiv.innerHTML = `
    <img src="/static/images/profile_picture.jpg" alt="Profile Picture" class="profile-pic small">
    <div class="reply-content">
      <strong>You</strong>
      <span class="post-date">Replied just now</span>
      <p>${escapeHtml(content)}</p>
      <div class="uploaded-images"></div>
    </div>
  `;

  // If images uploaded, append them
  if (imageFiles.length > 0) {
    const imgContainer = replyDiv.querySelector('.uploaded-images');
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'avatar';
        img.alt = 'Uploaded Image';
        img.style.margin = "5px";
        imgContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  // Insert reply into the current post's replies section
  if (window.currentReplyTarget) {
    const replies = window.currentReplyTarget.querySelector('.post-replies');
    if (replies) {
      replies.appendChild(replyDiv);
      replies.classList.remove('hidden'); // Show replies if hidden
    }
  }

  // Close modal and reset form
  document.getElementById('reply-modal').classList.add('hidden');
  this.reset();
});

// Helper: Escape HTML to prevent XSS
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'
    })[m];
  });
}
