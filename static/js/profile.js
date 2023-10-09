window.addEventListener('load', function() {
    getUserProfile()
});

function getUserProfile() {
    const accessToken = localStorage.getItem("accessToken");
    axios.get("http://api.cobraspace.xyz/api/user/profile/", {
        headers: {
            "Authorization": `Bearer ${accessToken}` // Include the access token in the request headers
        }
    })
    .then(response => {
        const userProfile = response.data;
        
        // Update the DOM with the received user profile data
        document.getElementById("profile-picture").src = "http://api.cobraspace.xyz/"+userProfile.profile_picture || "https://placehold.co/142x142";
        document.getElementById("nickname").textContent = userProfile.nickname;
        document.getElementById("bio").textContent = userProfile.bio || "No bio available"; // Provide a default if bio is empty
    })
    .catch(error => {
        console.error("Error fetching user profile:", error);
        // Handle the error as needed
    });
}