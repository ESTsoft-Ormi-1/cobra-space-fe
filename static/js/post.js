document.addEventListener("DOMContentLoaded", function () {
    const postForm = document.getElementById("postForm");
  
    postForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission behavior
      const accessToken = localStorage.getItem("accessToken");

      // Define the headers with the access token
      const headers = {
        "Authorization": `Bearer ${accessToken}`
      };
      // Get form data
      const formData = new FormData(postForm);
  
      // Send a POST request using Axios
      axios
        .post("http://api.cobraspace.xyz/api/post/write/", formData, { headers })
        .then(function (response) {
          // Handle the success response
          console.log("Post created successfully!", response.data);
  
          // You can also redirect the user to a different page or perform other actions here
        })
        .catch(function (error) {
          // Handle any errors that occur during the request
          console.error("Error creating post:", error);
        });
    });
  });