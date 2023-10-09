function includeHTML(callback) {
    var z, i, elmnt, file, xhr;
    /*loop through a collection of all HTML elements:*/
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("include-html");
        //console.log(file);
        if (file) {
            /*make an HTTP request using the attribute value as the file name:*/
            xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                    }
                    if (this.status == 404) {
                        elmnt.innerHTML = "Page not found.";
                    }
                    /*remove the attribute, and call this function once more:*/
                    elmnt.removeAttribute("include-html");
                    includeHTML(callback)
                }
            };
            xhr.open("GET", file, true);
            xhr.send();
            /*exit the function:*/
            return;
        }
    }
    setTimeout(function() {
        logout()
        checkAuthenticationStatus();
        setProfilePictureFromLocalStorage();
    }, 0);
}

window.addEventListener('load', function() {
    logout()
    checkAuthenticationStatus();
    setProfilePictureFromLocalStorage();
});

function setProfilePictureFromLocalStorage() {
    // 로컬 스토리지에서 프로필 사진 경로를 가져옵니다.
    const profilePictureUrl = localStorage.getItem("profilePictureUrl");

    // 프로필 사진 경로가 있는 경우에만 실행합니다.
    if (profilePictureUrl) {
        // 이미지 엘리먼트를 선택합니다.
        const headerProfile = document.getElementById("header_profile");

        // 프로필 사진 경로를 이미지 엘리먼트의 src 속성에 설정합니다.
        headerProfile.src = "http://api.cobraspace.xyz/" + profilePictureUrl;
    }
}

function logout() {
    const accessToken = localStorage.getItem("accessToken");
    document.getElementById("logoutForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get the access token from localStorage
    console.log(accessToken);
    // Send a POST request to the logout API endpoint with the access token in the headers
    axios.post("http://api.cobraspace.xyz/api/user/logout/", {}, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
             // Include the access token in the Authorization header
        }
    })
    .then(response => {
        // Clear the access token or any other user-related data from localStorage
        localStorage.removeItem("accessToken");

        // Redirect the user to the login page or any other desired destination
        window.location.href = "./login.html"; // Replace with the URL of your login page
    })
    .catch(error => {
        console.error("Logout failed:", error);

        // Handle logout error, display an error message, etc.

        // Redirect the user to the login page or any other desired destination
        // window.location.href = "./login.html"; // Replace with the URL of your login page
    });
    });
}

function checkAuthenticationStatus() {
    const token = localStorage.getItem('accessToken');
    const loginSection = document.getElementById('loginSection');
    const profileSection = document.getElementById('profileSection');
    console.log(loginSection);
    if (token) {
        loginSection.style.display = 'none';
        profileSection.style.display = 'block';
    } else {
        loginSection.style.display = 'block';
        profileSection.style.display = 'none';
    }
}



