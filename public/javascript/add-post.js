async function newPostFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector("#post-title").value.trim();
  const post_text = document.querySelector("#post-text").value.trim();

  const response = await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify({
      title,
      post_text
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    console.log(response.statusText);
  }
}

document.querySelector('.new-post-form').addEventListener('submit', newPostFormHandler);