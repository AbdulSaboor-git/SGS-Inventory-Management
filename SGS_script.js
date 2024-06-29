var filterApplied = false;


function toggle_Header_dropdown() {
    var dropdownContent = document.querySelector('.header_dropdown_list');
    var dropdownContent2 = document.querySelector('.sort-dropdown');

    dropdownContent.classList.toggle('show');
    dropdownContent2.classList.remove('show');

    document.addEventListener('click', function () {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    });
    event.stopPropagation();
}

//-----------------------------------------------------------------------------

function toggle_Sort() {
    var dropdownContent = document.querySelector('.sort-dropdown');
    var dropdownContent2 = document.querySelector('.header_dropdown_list');

    dropdownContent.classList.toggle('show');
    dropdownContent2.classList.remove('show');

    document.addEventListener('click', function () {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    });
    event.stopPropagation();
}

//-----------------------------------------------------------------------------

function toggleFilterForm() {
    var filterForm = document.getElementById('FilterForm');
    filterForm.classList.add('show');
    show_filter_overlay();
}

//-----------------------------------------------------------------------------

function closeFilterForm() {
    var filterForm = document.getElementById('FilterForm');
    filterForm.classList.remove('show');
    hide_filter_overlay();
}

//-----------------------------------------------------------------------------

function togglePreferences() {
    var Form = document.getElementById('preferences');
    Form.classList.add('show');
    showOverlay();
}


function closePreferences() {
    var Form = document.getElementById('preferences');
    Form.classList.remove('show');
    hideOverlay();
    checkPreferences();
}

function savePreferences() {
    var option0 = document.getElementById('edit_delete_pref').checked;
    var option1 = document.getElementById('clear_inv_pref').checked;
    var option2 = document.getElementById('purchasePrice_pref').checked;
    var option3 = document.getElementById('category_pref').checked;
    var option4 = document.getElementById('date_added_pref').checked;
    var option5 = document.getElementById('date_updated_pref').checked;
    var option6 = document.getElementById('light-theme').checked;
    var option7 = document.getElementById('dark-theme').checked;

    preferences.edit_delete_pref = option0;
    preferences.clear_inv_pref = option1;
    preferences.purchasePrice_pref = option2;
    preferences.category_pref = option3;
    preferences.date_added_pref = option4;
    preferences.date_updated_pref = option5;
    preferences.light_theme = option6;
    preferences.dark_theme = option7;

    localStorage.setItem('preferences', JSON.stringify(preferences));
    displayFeedbackPopup('Preferences saved!', true);
    closePreferences();

    if (preferences.light_theme) {
        document.querySelector('body').classList.add('lth');
    }
    else
        document.querySelector('body').classList.remove('lth');
}

function checkPreferences() {
    document.getElementById('edit_delete_pref').checked = preferences.edit_delete_pref;
    document.getElementById('clear_inv_pref').checked = preferences.clear_inv_pref;
    document.getElementById('purchasePrice_pref').checked = preferences.purchasePrice_pref;
    document.getElementById('category_pref').checked = preferences.category_pref;
    document.getElementById('date_added_pref').checked = preferences.date_added_pref;
    document.getElementById('date_updated_pref').checked = preferences.date_updated_pref;
    document.getElementById('light-theme').checked = preferences.light_theme;
    document.getElementById('dark-theme').checked = preferences.dark_theme;

    if (preferences.light_theme) {
        document.querySelector('body').classList.add('lth');
    }
    else
        document.querySelector('body').classList.remove('lth');

    var clear_inv_btns = document.querySelectorAll('.clear_inv')
    if (!preferences.clear_inv_pref) {
        clear_inv_btns.forEach(function (button) {
            button.style.display = 'none';
        });
    }
    else {
        clear_inv_btns.forEach(function (button) {
            button.style.display = 'block';
        });
    }
}

function toggleCheckbox(checkedId, uncheckedId) {
    const checkedCheckbox = document.getElementById(checkedId);
    const uncheckedCheckbox = document.getElementById(uncheckedId);

    if (checkedCheckbox.checked) {
        uncheckedCheckbox.checked = false;
    }
    else {
        uncheckedCheckbox.checked = true;
    }
}
//-----------------------------------------------------------------------------

function toggleCategoriesForm() {
    enableAdd();
    clearCategoryForm();
    var categoryForm = document.querySelector('.manageCategories');
    categoryForm.classList.add('show');
    showOverlay();
}


function closeCategoriesForm() {
    var categoryForm = document.querySelector('.manageCategories');
    categoryForm.classList.remove('show');
    hideOverlay();
}


function clearCategoryForm() {
    document.getElementById('categName').value = '';
    document.getElementById('categNewName').value = '';
}

function enableCategButtons() {
    var categInput = document.getElementById('categName').value;
    var categNewInput = document.getElementById('categNewName');
    var categ = document.getElementById('selectCateg').value;
    var addButton = document.getElementById('addCategButton');
    var renameButton = document.getElementById('renameCategButton');
    var removeButton = document.getElementById('removeCategButton');


    if (categInput != '') {
        addButton.removeAttribute('disabled');
    }
    else
        addButton.setAttribute('disabled', true);

    if (categNewInput.value != '') {
        renameButton.removeAttribute('disabled');
    }
    else
        renameButton.setAttribute('disabled', true);

    if (categ != '') {
        categNewInput.removeAttribute('disabled');
        removeButton.removeAttribute('disabled');
    }
    else {
        categNewInput.setAttribute('disabled', true);
        removeButton.setAttribute('disabled', true);
    }
}

async function addCategory() {
    var categoryName = document.getElementById('categName').value.trim();

    var categories = JSON.parse(localStorage.getItem('categories')) || [];
    var categoryExists = categories.some(function (category) {
        return category.toLowerCase() === categoryName.toLowerCase();
    });

    if (categoryExists) {
        displayFeedbackPopup("Category '" + categoryName + "' already exists!", false);
        return;
    }

    try {
        categories.push(categoryName);
        displayFeedbackPopup("Category '" + categoryName + "' added successfully!", true);
        clearCategoryForm();
        localStorage.setItem('categories', JSON.stringify(categories));
        AddCategoriesToDropdowns();
    }
    catch {
        displayFeedbackPopup("Error adding category!", false);
    }
}

async function renameCategory() {
    var oldCategory_name = document.getElementById('selectCateg').value;
    var newCategory_name = document.getElementById('categNewName').value.trim();

    try {
        if (!categories.includes(newCategory_name)) {
            products.forEach(item => {
                if (item.category === oldCategory_name)
                    item.category = newCategory_name;
            });
            var ind = categories.indexOf(oldCategory_name);
            categories[ind] = newCategory_name;
            displayFeedbackPopup("Category '" + oldCategory_name + "' renamed to '" + newCategory_name + "' successfully!", true);
            localStorage.setItem('categories', JSON.stringify(categories));
            AddCategoriesToDropdowns();
            clearCategoryForm();
        }
        else
            displayFeedbackPopup("Unable to rename! Category with this name already exists", false);
    }
    catch {
        displayFeedbackPopup("Error renaming category!", false);
    }

}

async function removeCategory() {
    var category = document.getElementById('selectCateg').value;
    var n = 0;
    products.forEach(product => {
        if (product.category === category)
            n++;
    });
    if (!n) {
        var confirm = await confirmation("Are you sure you want to delete Category '" + category + "'?");

        if (confirm) {
            try {
                if (confirm) {
                    var ind = categories.indexOf(category);
                    categories.splice(ind, 1);
                    displayFeedbackPopup("Category '" + category + "' removed successfully!", true);
                    localStorage.setItem('categories', JSON.stringify(categories));
                    AddCategoriesToDropdowns();
                }
            }
            catch {
                displayFeedbackPopup("Error removing category!", false);
            }
        }
    }
    else {
        displayFeedbackPopup("Empty the category before deleting! There are " + n + " items in this category", false);
    }
}

function enableAdd() {
    document.getElementById('categFormHeaderButtonAdd').classList.add('focused');
    document.getElementById('categFormHeaderButtonRename').classList.remove('focused');
    document.getElementById('categFormHeaderButtonRemove').classList.remove('focused');

    document.getElementById('categName').style.display = 'block';
    document.getElementById('categNameLabel').style.display = 'block';
    document.getElementById('categNewName').style.display = 'none';
    document.getElementById('renameLabel').style.display = 'none';
    document.getElementById('selectCategLabel').style.display = 'none';
    document.getElementById('selectCateg').style.display = 'none';

    document.getElementById('addCategButton').style.display = 'inline';
    document.getElementById('renameCategButton').style.display = 'none';
    document.getElementById('removeCategButton').style.display = 'none';
}

function enableRename() {
    document.getElementById('categFormHeaderButtonAdd').classList.remove('focused');
    document.getElementById('categFormHeaderButtonRename').classList.add('focused');
    document.getElementById('categFormHeaderButtonRemove').classList.remove('focused');

    document.getElementById('categName').style.display = 'none';
    document.getElementById('categNameLabel').style.display = 'none';
    document.getElementById('selectCategLabel').style.display = 'block';
    document.getElementById('selectCateg').style.display = 'block';
    document.getElementById('categNewName').style.display = 'block';
    document.getElementById('renameLabel').style.display = 'block';

    document.getElementById('addCategButton').style.display = 'none';
    document.getElementById('renameCategButton').style.display = 'inline';
    document.getElementById('removeCategButton').style.display = 'none';

    document.getElementById('selectCateg').value = '';
}


function enableRemove() {
    document.getElementById('categFormHeaderButtonAdd').classList.remove('focused');
    document.getElementById('categFormHeaderButtonRename').classList.remove('focused');
    document.getElementById('categFormHeaderButtonRemove').classList.add('focused');

    document.getElementById('categName').style.display = 'none';
    document.getElementById('categNameLabel').style.display = 'none';
    document.getElementById('categNewName').style.display = 'none';
    document.getElementById('renameLabel').style.display = 'none';
    document.getElementById('selectCategLabel').style.display = 'block';
    document.getElementById('selectCateg').style.display = 'block';

    document.getElementById('addCategButton').style.display = 'none';
    document.getElementById('renameCategButton').style.display = 'none';
    document.getElementById('removeCategButton').style.display = 'inline';
    document.getElementById('removeCategButton').setAttribute('disabled', true);
    document.getElementById('selectCateg').value = '';

}

//-----------------------------------------------------------------------------

function toggleAddItemForm() {
    var addItemForm = document.querySelector('.addItemForm');
    addItemForm.classList.add('show');
    if (!editingItemId)
        document.getElementById('category').value = '';
    showOverlay();
    enable();
}


function closeAddItemForm() {
    var addItemForm = document.querySelector('.addItemForm');
    document.getElementById('saveButton').textContent = 'Save';
    document.getElementById('addEditHeader').textContent = 'Add Product';
    document.getElementById('saveButton').onclick = saveItem;
    addItemForm.classList.remove('show');
    clearAddItemForm();
    hideOverlay();

}

function clearAddItemForm() {
    document.getElementById('itemName').value = '';
    document.getElementById('purchasePrice').value = '';
    document.getElementById('salePrice').value = '';
    document.getElementById('governmentSalePrice').value = '';
    document.getElementById('category').value = '';
    enable();
}

function enable() {
    var itemName = document.getElementById('itemName').value;
    var saveButton1 = document.getElementById('saveButton');
    var purchasePriceField = document.getElementById('purchasePrice');
    var salePriceField = document.getElementById('salePrice');
    var categoryField = document.getElementById('category');
    var governmentSalePriceField = document.getElementById('governmentSalePrice');


    if (itemName != '') {
        categoryField.removeAttribute('disabled');
        if (categoryField.value != '') {
            purchasePriceField.removeAttribute('disabled');
            governmentSalePriceField.removeAttribute('disabled');
            if (purchasePriceField.value != '') {
                saveButton1.removeAttribute('disabled');
                salePriceField.removeAttribute('disabled');
            } else {
                saveButton1.setAttribute('disabled', true);
                salePriceField.setAttribute('disabled', true);
            }
        }
    } else {
        purchasePriceField.setAttribute('disabled', true);
        salePriceField.setAttribute('disabled', true);
        governmentSalePriceField.setAttribute('disabled', true);
        saveButton1.setAttribute('disabled', true);
        categoryField.setAttribute('disabled', true);
    }

}

function setText() {
    var inputField1 = document.getElementById('salePrice');
    var inputField2 = document.getElementById('purchasePrice');
    var purchaseValue = parseInt(inputField2.value);
    var saleValue = purchaseValue + (purchaseValue * 0.07);
    saleValue = Math.round(saleValue / 10) * 10;
    inputField1.value = saleValue;
}


//-----------------------------------------------------------------------------

function addItem_button_functionality() {

    var lastScrollTop = 0;
    var AddButton = document.querySelector('.addItem_overlay_btn');

    window.addEventListener('scroll', function () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            AddButton.classList.add('hide');
        } else {
            AddButton.classList.remove('hide');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
}

//-----------------------------------------------------------------------------


function move_to_top() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


function move_to_top_functionality() {
    var lastScrollTop = 0;
    var ScrollButton = document.querySelector('.move_to_top_btn');

    window.addEventListener('scroll', function () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            ScrollButton.classList.remove('move');
        } else {
            ScrollButton.classList.add('move');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        if (scrollTop <= 300) {
            ScrollButton.classList.remove('show');
        }
        else
            ScrollButton.classList.add('show');

    }, false);
}

//-----------------------------------------------------------------------------


var FeedbackTimeout;
function displayFeedbackPopup(message, isSuccess) {
    var feedbackPopup = document.getElementById('feedbackPopup');
    feedbackPopup.textContent = message;

    if (isSuccess) {
        feedbackPopup.classList.add('success');
        feedbackPopup.classList.remove('error');
    } else {
        feedbackPopup.classList.add('error');
        feedbackPopup.classList.remove('success');
    }

    if (FeedbackTimeout)
        clearTimeout(FeedbackTimeout);

    feedbackPopup.classList.add('show');

    FeedbackTimeout = setTimeout(function () {
        feedbackPopup.classList.remove('show');
    }, 3000);
}

//-----------------------------------------------------------------------------

function confirmation(message) {
    return new Promise((resolve) => {
        var confirmation_dialogue = document.getElementById('confirmation_dialogue');
        var yesButton = document.getElementById('yesButton');
        var noButton = document.getElementById('noButton');
        var confirmationText = document.getElementById('confirmation_text');

        confirmationText.textContent = message;
        confirmation_dialogue.classList.add('show');
        showOverlay2();

        yesButton.addEventListener('click', function (event) {
            confirmation_dialogue.classList.remove('show');
            hideOverlay2();
            resolve(true);
        });

        noButton.addEventListener('click', function (event) {
            confirmation_dialogue.classList.remove('show');
            hideOverlay2();
            resolve(false);
        });
    });
}

//-----------------------------------------------------------------------------

function showOverlay() {
    var overlay = document.getElementById('overlay');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideOverlay() {
    var overlay = document.getElementById('overlay');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

function showOverlay2() {
    var overlay = document.getElementById('overlay2');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideOverlay2() {
    var overlay = document.getElementById('overlay2');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

var filterFlag = false;
function show_filter_overlay() {
    var overlay = document.getElementById('filter_overlay');
    filterFlag = true;
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hide_filter_overlay() {
    var overlay = document.getElementById('filter_overlay');
    overlay.classList.remove('show');
    filterFlag = false;
    document.body.style.overflow = '';
}

function checkScreenWidthforOverlay() {
    window.addEventListener('resize', checkScreenWidthforOverlay);
    if (window.innerWidth < 800 && filterFlag == true) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}


//-----------------------------------------------------------------------------

function clearSearch() {
    var searchBar = document.getElementById('search-bar');
    searchBar.value = '';
    var clearSearch = document.getElementById('clearSearch');
    clearSearch.classList.remove('show');
    displayInventoryList();
}

function toggleClearSearch() {
    var searchBar = document.getElementById('search-bar');
    var clearSearch = document.getElementById('clearSearch');
    if (searchBar.value != '') {
        clearSearch.classList.add('show');
    }
    else {
        clearSearch.classList.remove('show');
    }
}

//-----------------------------------------------------------------------------

function AddCategoriesToDropdowns() {
    populateCategoryDropdown('category');
    populateCategoryDropdown('filterCategory');
    populateCategoryDropdown('selectCateg');
}

function populateCategoryDropdown(targetSelect) {
    var categorySelect = document.getElementById(targetSelect);
    var categories = JSON.parse(localStorage.getItem('categories')) || [];
    categories.sort(function (a, b) {
        return a.localeCompare(b);
    });
    categorySelect.innerHTML = '';
    if (targetSelect === 'filterCategory') {
        var option1 = document.createElement('option');
        option1.value = 'All';
        option1.textContent = option1.value;

        var option2 = document.createElement('option');
        option2.value = 'Government Rate List';
        option2.textContent = option2.value;
        categorySelect.appendChild(option1);
        categorySelect.appendChild(option2);
    }
    categories.forEach(function (category) {
        var option = document.createElement('option');
        option.value = category;
        option.textContent = option.value;
        categorySelect.appendChild(option);
    });
}

//-----------------------------------------------------------------------------

async function saveItem() {
    var itemName = document.getElementById('itemName').value.trim();
    var category = document.getElementById('category').value;
    var purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    var salePrice = parseFloat(document.getElementById('salePrice').value);
    var governmentSalePrice = parseFloat(document.getElementById('governmentSalePrice').value) || 0;
    const currentDateTime = moment().format('YYYY/MM/DD HH:mm:ss');

    var productExists = products.some(function (product) {
        return product.prod_name.toLowerCase() === itemName.toLowerCase();
    });

    if (productExists) {
        displayFeedbackPopup("Product '" + itemName + "' already exists!", false);
        return;
    }

    try {
        var item = {
            prod_id: products.length + 1,
            prod_name: itemName,
            category: category,
            purchase_price: purchasePrice,
            sale_price: salePrice,
            govt_sale_price: governmentSalePrice,
            date_added: currentDateTime,
            date_updated: currentDateTime
        }
        products.push(item);

        displayFeedbackPopup("Product '" + itemName + "' added successfully!", true);
        localStorage.setItem('products', JSON.stringify(products));
        sort_prod_list_display(sort_by, sort_order);
        closeAddItemForm();
    }
    catch {
        displayFeedbackPopup("Error adding product!", false);
    }
}


//-----------------------------------------------------------------------------

async function updateItem() {
    var itemId = editingItemId;
    var itemName = document.getElementById('itemName').value.trim();
    var category = document.getElementById('category').value;
    var purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    var salePrice = parseFloat(document.getElementById('salePrice').value);
    var governmentSalePrice = parseFloat(document.getElementById('governmentSalePrice').value) || 0;
    const currentDateTime = moment().format('YYYY/MM/DD HH:mm:ss');


    var preUpdated_Product = products.find(function (product) {
        return itemId == product.prod_id;
    });
    var oldName = preUpdated_Product.prod_name;
    if (preUpdated_Product.prod_name != itemName || preUpdated_Product.category != category || preUpdated_Product.purchase_price != purchasePrice || preUpdated_Product.sale_price != salePrice || preUpdated_Product.govt_sale_price != governmentSalePrice) {
        try {
            if (preUpdated_Product) {
                preUpdated_Product.prod_id = itemId;
                preUpdated_Product.prod_name = itemName;
                preUpdated_Product.category = category;
                preUpdated_Product.purchase_price = purchasePrice;
                preUpdated_Product.sale_price = salePrice;
                preUpdated_Product.govt_sale_price = governmentSalePrice;
                preUpdated_Product.date_updated = currentDateTime;
            }
            displayFeedbackPopup("Product " + oldName + " updated successfully!", true);
            closeAddItemForm();
            localStorage.setItem('products', JSON.stringify(products));
            sort_prod_list_display(sort_by, sort_order);
        }
        catch {
            displayFeedbackPopup("Error updating product!", false);
        }
    }
    else {
        displayFeedbackPopup("No Changings made!", false);
        closeAddItemForm();
    }
}

//-----------------------------------------------------------------------------

async function deleteItem(itemId, itemName) {
    var confirmDelete = await confirmation("Are you sure you want to delete Product '" + itemName + "'?");
    if (confirmDelete) {
        try {
            var indexToDelete = products.findIndex(function (item) {
                return item.prod_id === itemId;
            });

            if (indexToDelete !== -1) {
                products.splice(indexToDelete, 1);
                displayFeedbackPopup("Product '" + itemName + "' deleted successfully!", true);
                localStorage.setItem('products', JSON.stringify(products));
                sort_prod_list_display(sort_by, sort_order);
            }
            else {
                displayFeedbackPopup("Item deletion failed!", false);
            }
        }
        catch {
            displayFeedbackPopup("Error deleting product!", false);
        }
    }
}

//-----------------------------------------------------------------------------

function editItem(product_id) {
    var itemToEdit = products.find(function (product) {
        return product.prod_id === product_id;
    });

    document.getElementById('itemName').value = itemToEdit.prod_name;
    document.getElementById('purchasePrice').value = itemToEdit.purchase_price;
    document.getElementById('salePrice').value = itemToEdit.sale_price;
    document.getElementById('governmentSalePrice').value = itemToEdit.govt_sale_price;
    document.getElementById('category').value = itemToEdit.category;

    editingItemId = product_id;


    document.getElementById('saveButton').textContent = 'Update';
    document.getElementById('saveButton').onclick = updateItem;
    document.getElementById('addEditHeader').textContent = 'Update Product';
    toggleAddItemForm();
}

//-----------------------------------------------------------------------------

function displayInventoryList() {
    checkPreferences();
    var inventoryList = document.getElementById('inventoryList');
    var fil_ind = document.getElementById('filterIndicator');
    inventoryList.innerHTML = '';

    var display_Products_List = [];

    if (filterApplied) {
        fil_ind.classList.add('show');
        display_Products_List = filtered_products;
    }
    else {
        fil_ind.classList.remove('show');
        display_Products_List = products;
    }

    var searchQuery = document.getElementById('search-bar').value.toLowerCase().trim();
    var filteredItems = display_Products_List.filter(function (product) {
        return product.prod_name.toLowerCase().includes(searchQuery) || product.category.toLowerCase().includes(searchQuery);
    });

    filteredItems.forEach(function (product) {
        var listItem = document.createElement('li');
        var listItem2 = document.createElement('button');
        listItem2.className = 'details';

        var itemNameDiv = document.createElement('div');
        itemNameDiv.className = 'item-name';
        itemNameDiv.textContent = product.prod_name;
        listItem.appendChild(itemNameDiv);

        var salePriceDiv = document.createElement('div');
        salePriceDiv.className = 'sale-price';
        salePriceDiv.textContent = `Rs. ${product.sale_price}`;
        listItem.appendChild(salePriceDiv);


        if (product.govt_sale_price != 0) {
            var GovtSalePriceDiv = document.createElement('div');
            GovtSalePriceDiv.className = 'sale-price';
            GovtSalePriceDiv.textContent = `Rs. ${product.govt_sale_price} Govt.`;
            listItem.appendChild(GovtSalePriceDiv);
        }
        inventoryList.appendChild(listItem);
        listItem.appendChild(listItem2);

        listItem2.addEventListener('click', function () {
            toggleItemDetails(product);
        });
    });
}

function toggleItemDetails(product) {
    var existingDetails = document.querySelector('.item-details');

    if (existingDetails) {
        if (existingDetails.innerHTML.includes(product.prod_name)) {
            existingDetails.parentNode.removeChild(existingDetails);
            return;
        } else {
            existingDetails.parentNode.removeChild(existingDetails);
        }
    }

    var detailsDiv = document.createElement('div');
    detailsDiv.className = 'item-details';

    let govtSalePriceRow = '';
    if (product.govt_sale_price != 0) {
        govtSalePriceRow = `
            <tr>
                <td class="m">Govt. Sale Price</td>
                <td>Rs. ${product.govt_sale_price}</td>
            </tr>   `
            ;
    }

    let PurchasePriceRow = '';
    if (preferences.purchasePrice_pref) {
        PurchasePriceRow = `
            <tr>
                <td class="m">Purchase Price</td>
                <td>Rs. ${product.purchase_price}</td>
            </tr>
        `;
    }

    let dateAddedRow = '';
    if (preferences.date_added_pref) {
        dateAddedRow = `
            <tr>
                <td class="m">Date Added</td>
                <td>${product.date_added}</td>
            </tr>
        `;
    }

    let dateUpdatedRow = '';
    if (preferences.date_updated_pref) {
        dateUpdatedRow = `
            <tr>
                <td class="m">Last Updated</td>
                <td>${product.date_updated}</td>
            </tr>
        `;
    }

    let categoryRow = '';
    if (preferences.category_pref) {
        categoryRow = `
            <tr>
                <td class="m">Category</td>
                <td>${product.category}</td>
            </tr>
        `;
    }

    detailsDiv.innerHTML = `
        <h3>Product Details</h3>

        <table>
            <tr>
                <td class="m">Product Name</td>
                <td>${product.prod_name}</td>
            </tr>
            
            ${categoryRow}
            ${PurchasePriceRow}
            <tr>
                <td class="m">Sale Price</td>
                <td>Rs. ${product.sale_price}</td>
            </tr>
            ${govtSalePriceRow}
            ${dateAddedRow}
            ${dateUpdatedRow}
        </table>
    `;

    var editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function (event) {
        event.stopPropagation();
        editItem(product.prod_id);
    });

    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function (event) {
        event.stopPropagation();
        deleteItem(product.prod_id, product.prod_name);
    });

    if (preferences.edit_delete_pref == true) {
        detailsDiv.appendChild(editButton);
        detailsDiv.appendChild(deleteButton);
    }

    var clickedItem = event.target;
    clickedItem.parentNode.insertBefore(detailsDiv, clickedItem.nextSibling);
}

//-----------------------------------------------------------------------------

function sort_prod_list_display(property, order) {
    sort_by = property;
    sort_order = order;
    var sorted_prods = [];
    if (filterApplied)
        sorted_prods = filtered_products;
    else
        sorted_prods = products;

    if (order === 'asc') {
        sorted_prods.sort(function (a, b) {
            if (property === 'sale_price')
                return parseFloat(a[property]) - parseFloat(b[property]);
            else
                return a[property].localeCompare(b[property]);
        });
    } else if (order === 'desc') {
        sorted_prods.sort(function (a, b) {
            if (property === 'sale_price')
                return parseFloat(b[property]) - parseFloat(a[property]);
            else
                return b[property].localeCompare(a[property]);
        });
    }

    if (filterApplied)
        filtered_products = sorted_prods;
    else {
        products = sorted_prods;
        localStorage.setItem('products', JSON.stringify(products));
    }
    displayInventoryList();
}

//-----------------------------------------------------------------------------

function clearFilter() {
    closeFilterForm();

    if (filterApplied) {
        filterApplied = false;
        displayFeedbackPopup('Filter cleared!', true);
        sort_prod_list_display(sort_by, sort_order);
        products = JSON.parse(localStorage.getItem('products')) || [];
    }
    else
        displayFeedbackPopup('Filter is already cleared!', false);


}


function filterItems() {
    var Category = document.getElementById('filterCategory').value;
    var maxPrice = document.getElementById('maxPrice').value;
    var minPrice = parseFloat(document.getElementById('minPrice').value) || 0;

    if (maxPrice === '')
        maxPrice = Infinity;
    else
        maxPrice = parseFloat(maxPrice);

    var FilteredInv = products.filter(function (product) {
        if (Category === 'All' && minPrice === 0 && maxPrice === Infinity) {
            filterApplied = false;
            return product;
        }
        else if (Category === 'All') {
            filterApplied = true;
            return product.sale_price <= maxPrice && product.sale_price >= minPrice;
        }
        else if (Category === 'Government Rate List') {
            filterApplied = true;
            return product.govt_sale_price != 0 && product.sale_price <= maxPrice && product.sale_price >= minPrice;
        }
        else {
            filterApplied = true;
            return product.category === Category && product.sale_price <= maxPrice && product.sale_price >= minPrice;
        }
    });

    filtered_products = FilteredInv;
    if (filterApplied)
        displayFeedbackPopup('Filter applied!', true);
    else
        displayFeedbackPopup('No filter applied!', false);

    displayInventoryList();
    closeFilterForm();
}


//-----------------------------------------------------------------------------

function loadDataFromCSVFile() {
    var fileInput = document.getElementById('csvFileInput');
    var file = fileInput.files[0];

    if (file) {
        empty();
        var reader = new FileReader();

        reader.onload = function (e) {
            var csvData = e.target.result;
            parseCSVData(csvData);
        };
        displayFeedbackPopup("Data loaded from CSV successfully!", true);
        reader.readAsText(file);
    } else {
        displayFeedbackPopup("No CSV file selected!", false);
    }
}

function parseCSVData(csvData) {
    var lines = csvData.split('\n');
    var headers = lines[0].split(',');
    for (var i = 1; i < lines.length; i++) {
        var data = lines[i].split(',');
        var newItem = {};

        for (var j = 0; j < headers.length; j++) {
            newItem[headers[j].trim()] = data[j].trim();
        }

        products.push(newItem);

        var categoryExists = categories.some(function (category) {
            return category === newItem.category;
        });

        if (!categoryExists) {
            categories.push(newItem.category);
        }
        AddCategoriesToDropdowns();
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('categories', JSON.stringify(categories));
        sort_prod_list_display(sort_by, sort_order);
    }
}

//-----------------------------------------------------------------------------

function downloadCSV() {
    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "prod_id,prod_name,purchase_price,sale_price,govt_sale_price,category,date_added,date_updated\n";

    var products_List = JSON.parse(localStorage.getItem('products'));


    products_List.forEach(function (product) {
        csvContent += `${product.prod_id},${product.prod_name},${product.purchase_price},${product.sale_price},${product.govt_sale_price},${product.category},${product.date_added},${product.date_updated} \n`;
    });

    var encodedURI = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "inventory_data.csv");
    document.body.appendChild(link);
    link.click();
}

//-----------------------------------------------------------------------------

async function clearInventoryList() {
    var confirmDelete = await confirmation("Are you sure you want to clear all data?");

    if (confirmDelete) {
        empty();
        displayFeedbackPopup("Inventory cleared successfully!", true);
    }
}

function empty() {
    var myList = document.getElementById("inventoryList");
    while (myList.firstChild) {
        myList.removeChild(myList.firstChild);
    }
    products = [];
    categories = [];
    localStorage.removeItem('products');
    localStorage.removeItem('categories');
    displayInventoryList();
}