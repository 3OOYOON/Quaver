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

    if (repliesContainer.children.length <= 2) {
        // Find the .post-replies inside this post
        const res = await fetch(`http://localhost:8000/loadReplies/${post.dataset.id}`, {method: "GET"});
        const replies = await res.json()
        replies.forEach(replyData => {
            insertReply(replyData)
        })
    }
}


async function refreshPosts() {
    const res = await fetch(`http://localhost:8000/loadPosts`, {method: "GET"});
    const allData = await res.json();
    document.querySelector('.posts-container');
    allData.forEach(postData => {
        insertPost(postData);
    });
}

async function loadMorePosts() {
    currentPosts = []
    
    document.querySelectorAll('.forum-post').forEach(function(post) {
        currentPosts.push(post.dataset.id)
    });

    const res = await fetch(`http://localhost:8000/loadSomePosts/${currentPosts}`, {method: "GET"});
    let allData = await res.json();
    if (allData.length != 20) {
        document.querySelector('#more-posts-btn-container').classList.add("hidden")
    }
    else {
        allData.shift();
    }
    allData.forEach(postData => {
        insertPost(postData);
    });
}

async function loadPostsByTags() {
    refreshPosts()
    // const searchedChips = document.querySelector(".search-bar-chips")
    // const postTags = Array.from(searchedChips.getElementsByClassName('chip')).map(chip => chip.dataset.tag);

    // const res = await fetch(`http://localhost:8000/loadTagPosts/${postTags}`, {method: "GET"});
    // let allData = await res.json();
    // allData.forEach(postData => {
    //     insertPost(postData);
    // });
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
    const imageFiles = Array.from(document.getElementById('post-images').files);

    if (imageFiles.length > 10) {
        alert('You can upload a maximum of 10 images.');
        return;
    }

    // Get selected tags
    const newPostChipsContainer = document.getElementById('new-post-chips')
    const postTags = Array.from(newPostChipsContainer.getElementsByClassName('chip')).map(chip => chip.dataset.tag);

    document.getElementById('new-post-modal').classList.add('hidden');
    this.reset();

    const formData = new FormData();
    formData.append('title', postTitle);
    formData.append('content', postContent);
    formData.append('tags', JSON.stringify(postTags));
    imageFiles.forEach(file => {
        formData.append('imageFiles', file);
    });
    console.log(postTags)
    console.log(formData.get('tags'))

    addPostOrReply(formData, insertPost);
});


// Helper function to insert posts at top of main
function insertPost(postData, first=false) {
    const postTemplate = document.getElementById('post');
    const postElement = document.importNode(postTemplate.content.firstElementChild, true);
    postElement.dataset.id = postData['postID'];
    const date = new Date(postData['datePosted'])

    // Set title, content, date, etc.
    postElement.querySelector(".post-title").textContent = postData['title']
    postElement.querySelector(".post-text").textContent = postData['content']
    postElement.querySelector(".post-date").textContent = ''
    postElement.querySelector(".post-date").textContent = 'Posted on '+ date.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'})
    
    // Render tags
    const tagsContainer = postElement.querySelector('.post-tags');
    if (postData.tags) {
        postData.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'chip';
            tagEl.textContent = tag;
            tagsContainer.appendChild(tagEl);
        });
    }

    // Render images
    const imgContainer = postElement.querySelector('#post-image-container')
    if (postData.images) {
        postData.images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = `http://localhost:8000/${image}`;
            imgElement.className = 'post-image';
            imgElement.alt = 'Uploaded Image';
            imgContainer.appendChild(imgElement);
        });
    }
        
    // Add post
    const postContainer = document.querySelector('#posts-container');
    if ((!first) || postContainer.children.length == 0) {
        postContainer.appendChild(postElement);
    }
    else {
        postContainer.insertBefore(postElement, postContainer.children[0]);
    }
}

// Helper function to insert replies inside of their post
function insertReply(replyData, first=false) {
    const replyTemplate = document.getElementById('reply');
    
    const replyElement = document.importNode(replyTemplate.content.firstElementChild, true);
    replyElement.dataset.id = replyData['postID'];

    // Set title, content, date, etc.
    const datePosted = new Date(replyData['datePosted'])
    replyElement.querySelector("#reply-text").textContent = replyData['content']
    replyElement.querySelector("#reply-date").textContent = ''
    replyElement.querySelector("#reply-date").textContent = 'Replied on ' + datePosted.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'})

    // Insert reply into the current post's replies section
    const postContainer = document.querySelector(`[data-id="${replyData['parentID']}"]`);
    const replyContainer = postContainer.querySelector('.post-replies');
    if ((!first) || postContainer.children.length < 2) {
        replyContainer.appendChild(replyElement);
    }
    else {
        replyContainer.insertBefore(replyElement, replyContainer.children[1]);
    }
    replyContainer.querySelector(".no-replies").classList.add("hidden")
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

    // Close modal, reset form, and open replies
    document.getElementById('reply-modal').classList.add('hidden');
    this.reset();

    if (window.currentReplyTarget.querySelector('.post-replies').classList.contains("hidden")) {
        await toggleReplies(window.currentReplyTarget.querySelector('#toggle-replies-btn'))
    }

    // Create reply element
    const formData = new FormData();
    formData.append('parentID', window.currentReplyTarget.dataset.id);
    formData.append('content', content);
    imageFiles.forEach(file => {
        formData.append('imageFiles', file);
    });

    addPostOrReply(formData, insertReply)
});

async function addPostOrReply(formData, insertElement) {
    const res = await fetch(`http://localhost:8000/makePost`, {
        method: "POST",
        body: formData
    });
    const elementData = await res.json()
    insertElement(elementData, first=true);
}


// Helper function to escape HTML to prevent XSS
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'
    })[m];
  });
}
