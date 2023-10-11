const input = document.querySelector("input");
const inputForm = document.querySelector("form");
const itemContainer = document.querySelector("ul");
const clearbtn = document.querySelector("button.clearBtn");
const filter = document.querySelector("input.filterInput");
// add item function
const addItem = (e) => {
  e.preventDefault();

  // Validate Input
  if (input.value.trim() === "") {
    alert("Please add Item");
    return;
  }
  const item = document.createElement("li");
  const itemTextContainer = document.createElement("p");
  itemTextContainer.title = "tap to edit";

  const itemText = document.createTextNode(`${input.value}`);
  item.className =
    "max-sm:w-full w-[48%] bg-white px-2 py-2 rounded-md flex items-center justify-between";
  const icon = document.createElement("span");
  icon.className = "material-icons text-red-700 cursor-pointer close";
  icon.style.fontSize = "1.5rem";
  const iconText = document.createTextNode("close");
  icon.appendChild(iconText);
  itemTextContainer.appendChild(itemText);
  item.appendChild(itemTextContainer);
  item.appendChild(icon);
  if (Array.from(itemContainer.children)[0].tagName == "SMALL") {
    itemContainer.replaceChild(item, itemContainer.children[0]);
  }
  itemContainer.appendChild(item);
  if (localStorage.getItem("items")) {
    const items = JSON.parse(localStorage.getItem("items"));
    items.push(input.value);
    localStorage.setItem("items", JSON.stringify(items));
  } else {
    localStorage.setItem("items", JSON.stringify([input.value]));
  }
  input.value = "";
};
inputForm.addEventListener("submit", addItem);

// text displayed when there's no items
function noItemsText() {
  if (itemContainer.children.length === 0) {
    const text = document.createElement("small");
    const textContent = document.createTextNode("No items...");
    text.appendChild(textContent);
    itemContainer.appendChild(text);
  }
}

function deleteItem(e) {
  if (e.target.tagName === "SPAN") {
    if (confirm("Are you sure? ")) {
      const items = JSON.parse(localStorage.getItem("items"));
      const newItems = items.filter(
        (item) => item !== e.target.previousSibling.textContent
      );
      localStorage.setItem("items", JSON.stringify(newItems));

      e.target.parentNode.remove();
    }
  }
  noItemsText();
}

itemContainer.addEventListener("click", deleteItem);

function clearItem() {
  if (confirm("Are you sure? ")) {
    itemContainer.replaceChildren();
    localStorage.setItem("items", "");
    noItemsText();
  }
}
clearbtn.addEventListener("click", clearItem);

filter.addEventListener("input", (e) => {
  let filteredItems;
  if (e.target.value.trim() == "") {
    e.target.value = "";
    return;
  } else {
    noItemsText();
    const filteredNodes = JSON.parse(localStorage.getItem("items"));
    filteredItems = filteredNodes.filter((item) =>
      item.includes(e.target.value)
    );
  }
  if (filteredItems.length === 0) {
    console.log(filteredItems);
    alert("nothing to filter");
    return;
  } else {
    itemContainer.replaceChildren();
  }
  filteredItems.forEach((shopItem) => {
    const item = document.createElement("li");
    const itemTextContainer = document.createElement("p");
    const itemText = document.createTextNode(`${shopItem}`);
    item.className =
      "w-[48%] bg-white px-2 py-2 rounded-md flex items-center justify-between";
    const icon = document.createElement("span");
    icon.className = "material-icons text-red-700 cursor-pointer close";
    icon.style.fontSize = "1.5rem";
    const iconText = document.createTextNode("close");
    icon.appendChild(iconText);
    itemTextContainer.appendChild(itemText);
    item.appendChild(itemTextContainer);
    item.appendChild(icon);
    itemContainer.appendChild(item);
  });
});

function loadItems() {
  if (localStorage.getItem("items") === "") {
    noItemsText();
    return;
  }
  if (JSON.parse(localStorage.getItem("items")).length > 0) {
    const items = JSON.parse(localStorage.getItem("items"));
    items.forEach((shopItem) => {
      const item = document.createElement("li");
      const itemTextContainer = document.createElement("p");
      const itemText = document.createTextNode(`${shopItem}`);
      item.className =
        "w-[48%] bg-white px-2 py-2 rounded-md flex items-center justify-between";
      const icon = document.createElement("span");
      icon.className = "material-icons text-red-700 cursor-pointer close";
      icon.style.fontSize = "1.5rem";
      const iconText = document.createTextNode("close");
      icon.appendChild(iconText);
      itemTextContainer.appendChild(itemText);
      item.appendChild(itemTextContainer);
      item.appendChild(icon);
      itemContainer.appendChild(item);
    });
  } else {
    noItemsText();
  }
}
window.addEventListener("DOMContentLoaded", loadItems);

function editItem(e) {
  if (e.target.tagName === "P") {
    input.value = e.target.textContent;
    const items = JSON.parse(localStorage.getItem("items"));
    // let itemIndex = "";
    // const editItem = items.filter((item, index) => {
    //   itemIndex = index;
    //   return item === e.target.textContent;
    // })[0];
    // console.log(itemIndex);
  }
}
itemContainer.addEventListener("click", editItem);
