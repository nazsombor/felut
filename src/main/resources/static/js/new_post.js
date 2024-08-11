let textarea = document.getElementById("new_post")
let markdown = document.getElementById("markdown")
let images = document.getElementById("images")
let imageList = document.getElementById("image_list")

textarea.addEventListener("input", function (event) {
    var converter = new showdown.Converter(),
        text      = event.target.value,
        html      = converter.makeHtml(text);
    markdown.innerHTML = html;
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
            let image = document.createElement("img")
            li.append(image)
            imageList.append(li)
            image.src = event.target.result;
            image.width = 100
        }
        reader.readAsDataURL(file)
    }
})