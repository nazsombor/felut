let posts = document.getElementById("posts");

fetch("/posts", {
    method: "GET",
    headers: {
        [csrfHeader]: csrfToken,
    }
}).then((response) => response.json()).then((postsData) => {
    var converter = new showdown.Converter()
    postsData.forEach((post) => {
        let text = post.text
        text = text.replace(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>')

        let postElement = document.createElement("div");
        let html = converter.makeHtml(text);

        postElement.innerHTML = html
        posts.appendChild(postElement);
        posts.appendChild(document.createElement("hr"))
    });
})