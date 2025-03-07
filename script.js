function toggleDarkMode() {
    let body = document.body;
    if (body.style.background === "white") {
        body.style.background = "black";
        body.style.color = "white";
    } else {
        body.style.background = "white";
        body.style.color = "black";
    }
}