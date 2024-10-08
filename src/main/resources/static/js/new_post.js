const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

let textarea = document.getElementById("new_post")
let markdown = document.getElementById("markdown")
let images = document.getElementById("images")
let post_button = document.getElementById('post_button')

let new_post_id = null

textarea.addEventListener("input", function (event) {
    let text = event.target.value
    text = text.replace(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>')
    var converter = new showdown.Converter(),
        html      = converter.makeHtml(text);

    markdown.innerHTML = html
})

images.addEventListener("change", function (event) {
    const form_data = new FormData();
    for (let file of event.target.files) {
        form_data.append('images' , file)
        form_data.append('types', file.type)
        form_data.append('sizes', "" + file.size)
    }

    function uploadImages() {
        fetch("/posts/upload-images/" + new_post_id, {
            method: 'POST',
            headers: {
                [csrfHeader]: csrfToken,
            },
            body: form_data
        }).then((response) => response.json()).then((data) => {
            console.log(data)
            textarea.value += "\n"
            for (url of data) {
                textarea.value += "\n![](" + url + ")"
            }
            textarea.dispatchEvent(new Event("input"));
        })
    }

    if(new_post_id){
        uploadImages()
    } else {
        fetch("posts/create-new", {
            headers: {
                [csrfHeader]: csrfToken,
            }
        }).then((response) => response.text()).then((id) => {
            new_post_id = id
            uploadImages()
        })
    }
})

post_button.addEventListener('click', function () {

    const markdownTextarea = document.getElementById('new_post');

    function f() {
        fetch('/posts/upload-post/' + new_post_id, {
            method: 'POST',
            headers: {
                [csrfHeader]: csrfToken,
            },
            body: markdownTextarea.value
        }).then(response => {
            if (response.ok) {
                new_post_id = null;
                markdownTextarea.value = '';
                markdownTextarea.dispatchEvent(new Event("input"));
            } else {
                alert('Failed to upload post');
            }
        });
    }

    if (new_post_id) {
        f()
    } else {
        fetch("posts/create-new", {
            headers: {
                [csrfHeader]: csrfToken,
            }
        }).then((response) => response.text()).then((id) => {
            new_post_id = id
            f()
        })
    }

});