async function logout() {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    // unable to logout
    console.log(response.statusText);
  }
}

document.querySelector('#logout-btn').addEventListener('click', logout);