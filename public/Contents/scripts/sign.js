const signupForm = document.querySelector('.login-box form');
signupForm.addEventListener('submit', handleSignup);

function handleSignup(event) {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Get form data
    const formData = new FormData(signupForm);
    const userData = Object.fromEntries(formData);
  
    // Send the form data to the server
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (response.ok) {
        // Handle successful signup
        console.log('Signup successful');
        // You can redirect the user or perform additional actions here
      } else {
        // Handle signup error
        console.error('Signup failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
