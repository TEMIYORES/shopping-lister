const input = document.querySelector("input");
const inputForm = document.querySelector("form");
const itemContainer = document.querySelector("ul");
const clearbtn = document.querySelector("button.clearBtn");
const filter = document.querySelector("input.filterInput");
const updateBtn = document.getElementById("update");
const addBtn = document.getElementById("add");
// check if input is empty
input.addEventListener("input", (e) => {
  if (input.value.trim() === "") {
    input.value = "";
    return;
  }
});

// Adds submitted item to the localStorage and the ui
const addItem = (e) => {
  e.preventDefault();
  // Validate Input
  if (input.value.trim() === "") {
    alert("Please add item");
    return;
  }
  const item = createItem(input.value);

  if (Array.from(itemContainer.children)[0].tagName == "SMALL") {
    itemContainer.replaceChild(item, itemContainer.children[0]);
  }
  if (itemContainer.lastChild.className == "filterText") {
    itemContainer.replaceChild(item, itemContainer.lastChild);
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

// Creates the item to be added
function createItem(itemtoAdd) {
  const item = document.createElement("li");
  const itemTextContainer = document.createElement("p");
  const itemText = document.createTextNode(`${itemtoAdd}`);
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
  return item;
}

// Displays when there is no item to display
function noItemsText(textItem, filterCount = 1) {
  if (itemContainer.children.length === 0) {
    const text = document.createElement("small");
    const textContent = document.createTextNode(textItem);
    text.appendChild(textContent);
    itemContainer.appendChild(text);
  }
  if (filterCount == 0) {
    if (itemContainer.lastChild.className == "filterText") {
      return;
    } else {
      const text = document.createElement("small");
      text.className = "filterText";
      const textContent = document.createTextNode(textItem);
      text.appendChild(textContent);
      itemContainer.appendChild(text);
    }
  } else {
    if (document.querySelector(".filterText")) {
      const item = document.querySelector(".filterText");
      itemContainer.removeChild(item);
    }
  }
}

// Deletes a particular item
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
  noItemsText("No items...");
}

// Clears the items list
function clearItem() {
  if (confirm("Are you sure? ")) {
    itemContainer.replaceChildren();
    localStorage.setItem("items", "");
    noItemsText("No items...");
  }
}

// Filters the items based on the search
function filterItems(e) {
  let items = document.querySelectorAll("li");
  if (items.length == 0) {
    if (e.inputType == "deleteContentBackward") {
      return;
    } else {
      alert("No items to filter");
      return;
    }
  }
  let filterCount = 0;
  items.forEach((item) => {
    const itemName = item.firstChild.textContent;
    if (itemName.indexOf(e.target.value) !== -1) {
      item.style.display = "flex";
      filterCount += 1;
    } else {
      item.style.display = "none";
    }
  });

  noItemsText("No filtered items...", filterCount);
}

// Loads data when the page is loaded
function loadItems() {
  if (localStorage.getItem("items")) {
    const items = JSON.parse(localStorage.getItem("items"));
    items.forEach((shopItem) => {
      const item = createItem(shopItem);
      itemContainer.appendChild(item);
    });
    const textItem = document.createElement("small");
    const textContent = document.createTextNode("no filtered items...");
    textItem.appendChild(textContent);
    textItem.className = "no_filter_text";
    textItem.style.display = "none";
    itemContainer.appendChild(textItem);
  } else {
    noItemsText("No items...");
  }
}

// Edits item when clicked
let itemTextContent = {
  target: "",
  text: "",
};
function editItem(e) {
  if (e.target.tagName === "P") {
    input.value = e.target.textContent;
    e.target.classList.add("text-[#ccc]");
    changeButtonState();
    itemTextContent.target = e.target;
    itemTextContent.text = e.target.textContent;
  }
}

function updateItem() {
  const items = JSON.parse(localStorage.getItem("items"));
  const index = items.indexOf(itemTextContent.text);
  items[index] = input.value;
  itemTextContent.classList.add("text-[#000]");
  changeButtonState();
  localStorage.setItem("items", JSON.stringify(items));
}

// Changes button add state to update state
function changeButtonState() {
  if (updateBtn.classList.contains("hidden")) {
    updateBtn.classList.replace("hidden", "flex");
    addBtn.classList.replace("flex", "hidden");
  } else {
    updateBtn.classList.replace("flex", "hidden");
    addBtn.classList.replace("hidden", "flex");
  }
}

function init() {
  itemContainer.addEventListener("click", editItem);
  addBtn.addEventListener("click", addItem);
  window.addEventListener("DOMContentLoaded", loadItems);
  clearbtn.addEventListener("click", clearItem);
  itemContainer.addEventListener("click", deleteItem);
  filter.addEventListener("input", filterItems);
  updateBtn.addEventListener("click", updateItem);
}

init();
