window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const accessToken = localStorage.getItem("accessToken");

    if (postId && accessToken) {
        fetchPostDetails(postId);
    } else {
        window.location.href = './login.html'; 
    }
});

function fetchPostDetails(postId) {
    const accessToken = localStorage.getItem("accessToken");
    axios.get(`http://api.cobraspace.xyz/api/post/detail/${postId}`, {
        headers: {
            "Authorization": `Bearer ${accessToken}` // Include the access token in the request headers
        }
    })
    .then(response => {
            const post = response.data;
            // 게시물 정보를 사용하여 페이지에 표시
            document.getElementById('post-title').textContent = post.title;
            document.getElementById('post-tags').textContent = post.tags.map(tag => tag.name).join(', ');
            document.getElementById('writer-nickname').textContent = post.writer.nickname;
            document.getElementById('created-at').textContent = new Date().toLocaleString(); // Replace with the actual creation date
            document.getElementById('hit-count').textContent = post.hit;
            // You can also update other elements as needed

            // Parse and display the Markdown content
            const markdownText = post.content;
            document.getElementById('markdown-container').innerHTML = marked.parse(markdownText);
            hljs.highlightAll();
            initChat(post);
        })
        .catch(error => {
            console.error("Error fetching post details:", error);
        });
}