(() => {
    let imgs = document.querySelectorAll<HTMLImageElement>("img:not([src])");

    for (const img of imgs) {
        img.src = "../resources/blank.png";
    }
})()