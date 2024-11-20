(() => {
    let imgs = document.querySelectorAll("img:not([src])");

    for (const img of imgs) {
        img.src = "../resources/blank.png";
    }
})()