const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

let textarea = document.getElementById("new_post")
let markdown = document.getElementById("markdown")
let images = document.getElementById("images")
let post_button = document.getElementById('post_button')
let imageList = document.getElementById("image_list")

let new_post_id = null

textarea.addEventListener("input", function (event) {
    var converter = new showdown.Converter(),
        text      = event.target.value,
        html      = converter.makeHtml(text);
    markdown.innerHTML = html
})
textarea.addEventListener("click", function (event) {
    textarea.rows = 30;
})
textarea.addEventListener("focusout", function (event) {
    textarea.rows = 10;
})

textarea.dispatchEvent(new Event("input"));

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
        } else {
            alert('Failed to upload post');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Error uploading post');
    });
});