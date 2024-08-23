let textarea = document.getElementById("new_post")
let markdown = document.getElementById("markdown")
let images = document.getElementById("images")
let imageList = document.getElementById("image_list")
const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
let imagesDto = []
let test = document.getElementById("test")

textarea.addEventListener("input", function (event) {
    var converter = new showdown.Converter(),
        text      = event.target.value,
        html      = converter.makeHtml(text);
    markdown.innerHTML = html;

    let links = markdown.getElementsByTagName("a");
    for (let link of links) {

        let split = link.href.split("/")
        let name = split[split.length - 1]
        link.href = "#"
        for (let image of imagesDto) {
            if (name == image.name) {
                let i = document.createElement("img");
                link.append(i)
                i.src = image.src;
                i.width = 400
                console.log(image.name)
            }
        }
    }

})
textarea.addEventListener("click", function (event) {
    textarea.rows = 30;
})

textarea.dispatchEvent(new Event("input"));

images.addEventListener("change", function (event) {
    let files = event.target.files;
    for (let file of files) {
        let reader = new FileReader();
        reader.onload = function (event) {
            let li = document.createElement("li")
            let span = document.createElement("span");
            let image = document.createElement("img")
            li.append(image)
            li.append(span)
            imageList.append(li)
            image.src = event.target.result;
            image.width = 50
            let truncatedName = file.name.split(/\s/)
            truncatedName = truncatedName.join("")

            span.innerText = truncatedName;

            imagesDto.push({
                src: event.target.result,
                name: truncatedName
            })

            textarea.value += "\n[](" + truncatedName + ")"
            textarea.dispatchEvent(new Event("input"));
        }
        reader.readAsDataURL(file)
    }
})

document.getElementById('post_button').addEventListener('click', function () {

    const markdownTextarea = document.getElementById('new_post');
    const imagesInput = document.getElementById('images');
    const formData = new FormData();

    formData.append('post', markdownTextarea.value);

    for (let i = 0; i < imagesInput.files.length; i++) {
        formData.append('file', imagesInput.files[i]);
    }

    fetch('/api/posts', {
        method: 'POST',
        headers: {
            [csrfHeader]: csrfToken,
        },
        body: formData
    }).then(response => {
        if (response.ok) {
            alert('Post uploaded successfully');
        } else {
            alert('Failed to upload post');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Error uploading post');
    });
});

test.addEventListener("click", function (event) {

    fetch('/api/posts', {
        method: 'GET',
        headers: {
            [csrfHeader]: csrfToken,
        }
    }).then(response => response.json()).then(response => {
        console.log(response)

    })
})