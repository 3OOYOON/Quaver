async function toggleReplies(button) {
    // Find the closest .forum-post ancestor
    const post = button.closest('.forum-post');
    const repliesContainer = post.querySelector('.post-replies')
    repliesContainer.classList.toggle('hidden');
    if (repliesContainer.classList.contains('hidden')) {
        button.querySelector('.btn-label').textContent = "Show Replies";
        return;
    }

    button.querySelector('.btn-label').textContent = "Hide Replies";

    if (repliesContainer.children.length <= 1) {
        // Find the .post-replies inside this post
        const res = await fetch(`http://localhost:5219/loadReplies/${post.dataset.id}`, {method: "GET"});
        const replies = await res.json()
        replies.forEach(replyData => {
            insertReply(replyData)
        })
    }
}


async function refreshPosts() {
    const res = await fetch(`http://localhost:5219/loadPosts`, {method: "GET"});
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


document.getElementById('new-post-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const postTitle = document.getElementById('post-title').value.trim();
    const postContent = document.getElementById('post-content').value.trim();
    const imageInput = document.getElementById('post-images');
    const imageFiles = Array.from(imageInput.files);

    if (imageFiles.length > 10) {
        alert('You can upload a maximum of 10 images.');
        return;
    }

    // Close modal and reset form

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

    document.getElementById('new-post-modal').classList.add('hidden');
    this.reset();

    let postData = {
        title: postTitle,
        content: postContent,
        tags: postTags
    }
    console.log(postData)
    addPostOrReply(postData, insertPost);
});


// Helper function to insert posts at top of main
function insertPost(postData, first=false) {
    const postTemplate = document.getElementById('post');
    const postElement = document.importNode(postTemplate.content.firstElementChild, true);
    postElement.dataset.id = postData['postID'];

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

    const postContainer = document.querySelector('main');
    if ((!first) || postContainer.children.length < 2) {
        postContainer.appendChild(postElement);
    }
    else {
        postContainer.insertBefore(postElement, postContainer.children[1]);
    }
}

// Helper function to insert posts at top of main
function insertReply(replyData, first=false) {
    const replyTemplate = document.getElementById('reply');
    
    const replyElement = document.importNode(replyTemplate.content.firstElementChild, true);
    replyElement.dataset.id = replyData['postID'];

    // Set title, content, date, etc.
    const datePosted = new Date(replyData['datePosted'])
    replyElement.querySelector("#reply-text").textContent = replyData['content']
    replyElement.querySelector("#reply-date").textContent = ''
    replyElement.querySelector("#reply-date").textContent = 'Replied on ' + datePosted.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'})

    // If images uploaded, append them
    // if (replyData.images.length > 0) {
    //     const imgContainer = replyDiv.querySelector('.uploaded-images');
    //     replyData.images.forEach(file => {
    //         const reader = new FileReader();
    //         reader.onload = function(e) {
    //             const img = document.createElement('img');
    //             img.src = e.target.result;
    //             img.className = 'avatar';
    //             img.alt = 'Uploaded Image';
    //             img.style.margin = "5px";
    //             imgContainer.appendChild(img);
    //         };
    //         reader.readAsDataURL(file);
    //     });
    // }

    // Insert reply into the current post's replies section
    const postContainer = document.querySelector(`[data-id="${replyData['parentID']}"]`);
    const replyContainer = postContainer.querySelector('.post-replies');
    if ((!first) || postContainer.children.length < 2) {
        replyContainer.appendChild(replyElement);
    }
    else {
        replyContainer.insertBefore(replyElement, replyContainer.children[1]);
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
function openReplyModal(buttonElement) {
  // Store the post element being replied to for later use
  window.currentReplyTarget = buttonElement.closest(".forum-post")
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
document.getElementById('reply-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const content = document.getElementById('reply-content').value.trim();
    const imageInput = document.getElementById('reply-images');
    const imageFiles = Array.from(imageInput.files);

    if (imageFiles.length > 10) {
        alert('You can upload a maximum of 10 images.');
        return;
    }

    // Close modal and reset form
    document.getElementById('reply-modal').classList.add('hidden');
    this.reset();

    // Create reply element
    let replyData = {
        'parentID': window.currentReplyTarget.dataset.id,
        'content': content,
        'images': imageFiles
    }
    addPostOrReply(replyData, insertReply)
});

async function addPostOrReply(elementData, insertElement) {
    console.log(elementData)
    const res = await fetch(`http://localhost:5219/makePost`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(elementData)
    });
    [postID, date] = await res.json()
    elementData['postID'] = postID
    elementData['datePosted'] = date
    insertElement(elementData, first=true);
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'
    })[m];
  });
}
