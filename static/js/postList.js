window.addEventListener('load', function() {
    fetchAndDisplayPosts()
});

function fetchAndDisplayPosts() {
    axios.get("http://api.cobraspace.xyz/api/post/", {
    })
    .then(response => {
        const posts = response.data;

        const postList = document.getElementById("postList");

        posts.forEach(post => {
        const createdAt = new Date(post.created_at);
        const formattedDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getDate().toString().padStart(2, '0')} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}`;

        const tags = post.tags.map((tag) => `<span class="badge bg-secondary me-auto">${tag.name}</span>`).join(' ');

          const postCard = document.createElement("div");
          postCard.className = "row mb-2";
          postCard.innerHTML = `
            <div class="col-md-12">
              <div class="card">
                <div class="card-body">
                  <a href="./post_detail.html?id=${post.id}" class="card-title h2">${post.title}</a>
                  <p class="card-text">${post.content.substring(0, 100)}...</p>
                  <div class="d-flex align-items-center">
                    <span class="me-auto">${tags || "No Tags"}</span>
                    <img src="http://api.cobraspace.xyz/${post.writer_profile_picture}" alt="프로필 사진" class="rounded-circle" style="object-fit: cover; width: 40px; height: 40px;">
                    <p class="mb-0 ms-2">${post.writer_nickname}</p>
                  </div>
                  <p class="mt-2 mb-0">${formattedDate}</p>
                </div>
              </div>
            </div>
          `;
          postList.appendChild(postCard);
        });
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });
}