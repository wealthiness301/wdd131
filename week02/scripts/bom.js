const input = document.querySelector("#favchap");
const button = document.querySelector("#addButton");
const list = document.querySelector("#list");

addbutton.addEventListener("click", function () {
    if (input.value.trim() !== "") {
        const li = document.createElement("li");
        li.textContent = input.value;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.classList.add("delete");
        li.append(deleteButton);
        li.append(li);
        input.value = "";
        input.focus();

deleteButton.addEventListener("click", function () {
            list.removeChild(li);
            input.focus();
        });
    } else {
        alert("Please enter a chapter.");
        input.focus();
    }
});
input.addEventListener("keyup", function (event){
    if (event.key === "Enter") {
        addButton.click();
    }
});
