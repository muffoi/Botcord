(function() {
    if(Botcord.args.isPackaged) return;

    let css = document.getElementById("stylesMain"), backup = document.createElement("link");
    let href = css.href; // paused = false;

    backup.rel = css.rel;
    backup.href = href;
    document.head.appendChild(backup);

    // let intervalID = setInterval(() => {
    //     if(paused) return;
        
    //     css.href = "";
    //     css.href = href;

    //     setTimeout(() => {
    //         backup.href = "";
    //         backup.href = href;
    //     }, 150);
    // }, 500);

    // window.stopQuickDev = () => {
    //     clearInterval(intervalID);
    // }

    // window.toggleQuickDev = () => {
    //     paused = !paused;
    // }

    window.addEventListener("keydown", evt => {
        if(evt.ctrlKey == true && evt.code == "Digit1") {
            css.href = "";
            css.href = href;

            setTimeout(() => {
                backup.href = "";
                backup.href = href;
            }, 150);
        }

        if(evt.ctrlKey == true && evt.code == "KeyR") location.reload();
    })

})();