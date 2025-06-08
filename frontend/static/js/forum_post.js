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

    // If images uploaded, append them
    // let postImages = []
    // let postImage = ""
    // imageFiles.forEach(file => {
    //     const reader = new FileReader();
    //     reader.addEventListener('load', async function () {
    //         // console.log(reader.result)
    //         postImage = await reader.result;
    //         console.log(postImage)
    //     });
    //     reader.readAsDataURL(file);
    // })
    // // console.log(imageFiles)
    // console.log(postImage)
    // jsdflkjaslgk()

    let postData = {
        title: postTitle,
        content: postContent,
        tags: postTags,
        images: '',
        imageFiles: imageFiles
    }
    addPostOrReply(postData, insertPost);
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
    postData.tags.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'chip';
        tagEl.textContent = tag;
        tagsContainer.appendChild(tagEl);
    });

    // Render images
    let imgElement;
    const imgContainer = postElement.querySelector('#post-image-container')
    postData["images"].forEach(image => {
        imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.className = 'avatar';
        imgElement.alt = 'Uploaded Image';
        imgContainer.appendChild(imgElement);
    });
        
    // Add post
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
    let replyData = {
        parentID: window.currentReplyTarget.dataset.id,
        content: content,
        images: '',
        imageFiles: imageFiles
    }

    addPostOrReply(replyData, insertReply)
});

async function addPostOrReply(elementData, insertElement) {
    const elementFormData = dictToFormData(elementData)
    console.log(elementFormData)
    const res = await fetch(`http://localhost:8000/makePost`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: elementFormData
    });
    [postID, date, images] = await res.json()
    elementData['postID'] = postID
    elementData['datePosted'] = date
    elementData['images'] = images
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

function dictToFormData(dict) {
    console.log(dict)
    let formData = new FormData();

    for (const key in dict) {
        console.log(key)
        const value = dict[key];
        if (Array.isArray(dict[key])) {
            for (const item of dict[key]) {
                formData.append(key, item);
            }
        } 
        else {
            formData.append(key, value);
        }
    }
    console.log(formData)
    return formData;
}