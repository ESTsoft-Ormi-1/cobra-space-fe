document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginData = { email, password };

    axios.post("http://api.cobraspace.xyz/api/user/login/", loginData, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      const accessToken = response.data.access;
      const sessionId = response.data.session_id;
      // Store the access token in localStorage
      localStorage.setItem("accessToken", accessToken);
      document.cookie = `sessionid=${sessionId}; path=/`;
      // Get the profile picture URL from the response
      const profilePictureUrl = response.data.profile.profile_picture;

      // Store the profile picture URL in localStorage
      localStorage.setItem("profilePictureUrl", profilePictureUrl);
      // Redirect to a different page after successful login
      window.location.href = "./index.html";
    })
    .catch(error => {
      console.error("Login failed:", error);
      // Handle login error, display an error message, etc.
    });
});