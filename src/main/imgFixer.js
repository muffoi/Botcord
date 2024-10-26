(() => {
    let imgs = elem("img:not([src])", true);

    for (const img of imgs) {
        img.src = "../resources/blank.png";
    }
})()