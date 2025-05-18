function toggleReplies(button) {
  const replies = button.nextElementSibling;
  if (replies.classList.contains('hidden')) {
    replies.classList.remove('hidden');
    button.textContent = "Hide Replies";
  } else {
    replies.classList.add('hidden');
    button.textContent = "Show Replies";
  }
}