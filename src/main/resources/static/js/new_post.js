let textarea = document.getElementById("new_post")
let markdown = document.getElementById("markdown")
let images = document.getElementById("images")
let imageList = document.getElementById("image_list")
let imagesDto = []

textarea.addEventListener("input", function (event) {
    var converter = new showdown.Converter(),
        text      = event.target.value,
        html      = converter.makeHtml(text);
    markdown.innerHTML = html;

    let links = markdown.getElementsByTagName("a");
    for (let link of links) {

        let split = link.href.split("/")
        let name = split[split.length - 1]
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
            image.width = 100
            span.innerText= file.name;

            imagesDto.push({
                src: event.target.result,
                name: file.name
            })

            textarea.value += "\n[test](" + file.name + ")"
            textarea.dispatchEvent(new Event("input"));
        }
        reader.readAsDataURL(file)
    }
})