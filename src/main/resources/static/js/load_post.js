let posts = document.getElementById("posts");

fetch("/api/posts", {
    method: "GET",
    headers: {
        [csrfHeader]: csrfToken,
    }
}).then((response) => response.json()).then((postsData) => {
    console.log(postsData);
    var converter = new showdown.Converter()
    postsData.forEach((post) => {
        let postElement = document.createElement("div");
        let html = converter.makeHtml(post.text);
        let parts = html.split(/<a.*<\/a>/)
        let _images = html.split(/.*href="/)
        let images = []
        let a = ""


        for (var i = 1; i < _images.length; i++) {
            images.push(_images[i].split(/"/)[0])
        }

        var i =0
        for (; i < images.length; i++) {
            a += parts[i]
            a += "<img alt='" + images[i] + "'></img>"
        }
        a += parts[i]

        postElement.innerHTML = a

        let imgs = postElement.getElementsByTagName("img")

        for (let img of imgs) {
            for (var i =0 ; i< post.imageNames.length; i++) {
                if (img.alt === post.imageNames[i]) {
                    img.src = "data:image/jpg;base64," + post.images[i]
                }

            }
        }

        posts.appendChild(postElement);
    });
})