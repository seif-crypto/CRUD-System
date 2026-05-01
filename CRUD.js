// get total
// create product
// save local storage
// clear data
// read
// count
// delete
// update
// search
// clean data
let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let catagory = document.getElementById('catagory');
let submit = document.getElementById('submit');
let search = document.getElementById('search');

let mood = 'create';
let tmp; 
let searchMood = 'title';

// 1. Get Total
function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = '#040';
    } else {
        total.innerHTML = '';
        total.style.background = 'red';
    }
}

// 2. التحقق اللحظي (إطار أحمر للقيم السالبة أو غير الرقمية)
[price, taxes, ads, discount, count].forEach(input => {
    input.oninput = function() {
        if (isNaN(this.value) || this.value < 0) {
            this.style.border = '2px solid red';
        } else {
            this.style.border = 'none';
        }
    }
});

// 3. التحقق من البيانات الموجودة مسبقاً
let dataPro;
if (localStorage.product != null) {
    dataPro = JSON.parse(localStorage.product);
} else {
    dataPro = [];
}

submit.onclick = function() {
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        catagory: catagory.value.toLowerCase(),
        date: new Date().toLocaleDateString(), // إضافة التاريخ
    }

    // التحقق من الحقول الإجبارية
    if(title.value != '' && price.value != '' && catagory.value != '' && newPro.count < 101) {
        if (mood === 'create') {
            if (newPro.count > 1) {
                for (let i = 0; i < newPro.count; i++) {
                    dataPro.push(newPro);
                }
            } else {
                dataPro.push(newPro);
            }
        } else {
            dataPro[tmp] = newPro;
            mood = 'create';
            submit.innerHTML = 'Create';
            count.style.display = 'block';
        }
        clearData();
    } else {
        alert("Please fill all main fields correctly (Title, Price, Category)");
    }

    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}

// 4. Clear Data
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    catagory.value = '';
    total.style.background = 'red';
}

// 5. Show Data & Statistics
function showData() {
    getTotal();
    let table = '';
    let totalCash = 0;

    for (let i = 0; i < dataPro.length; i++) {
        totalCash += +dataPro[i].total; // حساب إجمالي المبالغ
        table += buildRow(i);
    }
    
    document.getElementById('tbody').innerHTML = table;

    // تحديث أزرار المسح والإحصائيات
    let btnDelete = document.getElementById('deleteAll');
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `
            <div style="margin: 20px 0; padding: 10px; background: #333; border-radius: 10px;">
                <p>Total Products: ${dataPro.length} | Total Value: ${totalCash}</p>
            </div>
            <button onclick="deleteAll()">Delete All</button>
            <button onclick="deleteSelected()" style="background: #a00; margin-top: 10px;">Delete Selected</button>
            <button onclick="window.print()" style="background: #555; margin-top: 10px;">Print Report</button>
        `;
    } else {
        btnDelete.innerHTML = '';
    }
}
showData();

// 6. Delete One
function deleteData(i) {
    if(confirm('Are you sure?')){
        dataPro.splice(i, 1);
        localStorage.product = JSON.stringify(dataPro);
        showData();
    }
}

// 7. Delete All
function deleteAll() {
    if(confirm('This will delete EVERYTHING. Are you sure?')){
        localStorage.clear();
        dataPro.splice(0);
        showData();
    }
}

// 8. Delete Selected
function deleteSelected() {
    let checkboxes = document.querySelectorAll('.delete-checkbox:checked');
    if (checkboxes.length > 0) {
        if (confirm(`Delete ${checkboxes.length} items?`)) {
            let indices = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-id')));
            indices.sort((a, b) => b - a); 
            indices.forEach(index => {
                dataPro.splice(index, 1);
            });
            localStorage.product = JSON.stringify(dataPro);
            showData();
        }
    }
}

// 9. Update
function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal();
    count.style.display = 'none';
    catagory.value = dataPro[i].catagory;
    submit.innerHTML = 'Update';
    mood = 'update';
    tmp = i;
    scroll({ top: 0, behavior: 'smooth' });
}

// 10. Search
function getSearchMood(id) {
    if (id == 'searchTitle') {
        searchMood = 'title';
    } else {
        searchMood = 'catagory';
    }
    search.placeholder = 'Search By ' + searchMood;
    search.focus();
    search.value = '';
    showData();
}

function searchDats(value) {
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        if (searchMood == 'title') {
            if (dataPro[i].title.includes(value.toLowerCase())) {
                table += buildRow(i);
            }
        } else {
            if (dataPro[i].catagory.includes(value.toLowerCase())) {
                table += buildRow(i);
            }
        }
    }
    document.getElementById('tbody').innerHTML = table;
}

// بناء الصف
function buildRow(i) {
    return `
    <tr>
        <td><input type="checkbox" class="delete-checkbox" data-id="${i}"></td>
        <td>${i + 1}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].taxes}</td>
        <td>${dataPro[i].ads}</td>
        <td>${dataPro[i].discount}</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].catagory}</td>
        <td>${dataPro[i].date}</td>
        <td><button onclick="updateData(${i})" id="update">update</button></td>
        <td><button onclick="deleteData(${i})" id="delete">delete</button></td>
    </tr>`;
}

// Enter Key Logic
let inputsList = [title, price, taxes, ads, discount, count, catagory];
inputsList.forEach((input, index) => {
    input.onkeydown = function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index < inputsList.length - 1) {
                inputsList[index + 1].focus();
            } else {
                submit.click();
            }
        }
    };
});