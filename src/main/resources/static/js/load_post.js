let posts = document.getElementById("posts");

fetch("/posts", {
    method: "GET",
    headers: {
        [csrfHeader]: csrfToken,
    }
}).then((response) => response.json()).then((postsData) => {
    var converter = new showdown.Converter()
    postsData.forEach((post) => {
        let postElement = document.createElement("div");
        let html = converter.makeHtml(post.text);
        postElement.innerHTML = html
        posts.appendChild(postElement);
        posts.appendChild(document.createElement("hr"))
    });
})