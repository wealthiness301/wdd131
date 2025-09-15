document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;
const menuButton = document.querySelector("#menu");
const nav = document.querySelector("nav");
menuButton.addEventListener("click", () => {
    nav.classList.toggle("hidden");
    menuButton.textContent = nav.classList.contains("hidden") ? "☰" : "✖";
});