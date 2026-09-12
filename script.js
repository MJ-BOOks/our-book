const SUPABASE_URL = "https://lunllvoezhdmukyhdrdp.supabase.co";
const SUPABASE_KEY = "sb_publishable_tG-eXht8h9H3fT93wxo84w_KPqLgMN1";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================
// PROJECT M — OUR BOOK
// ========================================


// ========================================
// AUTHENTICATION
// ========================================

async function checkLogin() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
        showLoginScreen();
        return;
    }

    startBook();
}


function showLoginScreen() {

    document.body.className = "home-page";

    document.body.innerHTML = `

        <main class="book-cover">

            <p class="cover-small">
                OUR STORY
            </p>


            <h1>OUR BOOK</h1>


            <div class="cover-line"></div>


            <p class="cover-subtitle">
                M. - J.
            </p>


            <div
                class="add-form"
                style="
                    width: 100%;
                    max-width: 420px;
                "
            >

                <label for="loginEmail">
                    Email
                </label>


                <input
                    type="email"
                    id="loginEmail"
                    placeholder="Enter your email"
                >


                <label for="loginPassword">
                    Password
                </label>


                <input
                    type="password"
                    id="loginPassword"
                    placeholder="Enter your password"
                >


                <button
                    type="button"
                    onclick="login()"
                >
                    ENTER OUR BOOK
                </button>


                <p
                    id="loginMessage"
                    style="
                        margin: 5px 0 0;
                        text-align: center;
                        font-size: 14px;
                    "
                ></p>

            </div>


            <p class="cover-footer">
                ILY
            </p>

        </main>
    `;
}


async function login() {

    const email =
        document
        .getElementById("loginEmail")
        .value
        .trim();


    const password =
        document
        .getElementById("loginPassword")
        .value;


    const message =
        document.getElementById("loginMessage");


    if (email === "" || password === "") {

        message.textContent =
            "Please enter your email and password.";

        return;
    }


    message.textContent = "Entering our book...";


    const {
        error
    } = await supabaseClient.auth.signInWithPassword({

        email: email,

        password: password

    });


    if (error) {

        console.error(error);

        message.textContent =
            "Incorrect email or password.";

        return;
    }


    startBook();
}


async function logout() {

    await supabaseClient.auth.signOut();

    location.reload();
}


// ========================================
// START BOOK
// ========================================

async function startBook() {

    book = await loadBook();

    showHome();
}


// ========================================
// CREATE A NEW BOOK
// ========================================

function createNewBook() {

    return {

        places: {

            categories: {}

        },


        activities: {

            categories: {}

        },


        dreams: {

            categories: {}

        }

    };
}


// ========================================
// LOAD & SAVE
// ========================================

// ========================================
// LOAD & SAVE
// ========================================

async function loadBook() {

    const {
        data,
        error
    } = await supabaseClient
        .from("book_data")
        .select("book")
        .limit(1)
        .single();


    if (error) {

        console.error("Could not load book:", error);

        return createNewBook();
    }


    if (!data || !data.book) {

        return createNewBook();
    }


    const loadedBook = data.book;


    ["places", "activities", "dreams"]
        .forEach(category => {

            if (!loadedBook[category]) {

                loadedBook[category] = {
                    categories: {}
                };

            }


            if (!loadedBook[category].categories) {

                loadedBook[category].categories = {};

            }


            Object.values(
                loadedBook[category].categories
            )
            .forEach(items => {

                items.forEach(item => {

                    if (
                        item.completed === undefined
                    ) {

                        item.completed = false;

                    }

                });

            });

        });


    return loadedBook;
}


let book = createNewBook();


async function saveBook() {

    const {
        data,
        error
    } = await supabaseClient
        .from("book_data")
        .select("id")
        .limit(1)
        .single();


    if (error) {

        console.error("Could not find book row:", error);

        return;
    }


    const {
        error: updateError
    } = await supabaseClient
        .from("book_data")
        .update({
            book: book
        })
        .eq("id", data.id);


    if (updateError) {

        console.error(
            "Could not save book:",
            updateError
        );

    }
}


// ========================================
// HOME
// ========================================

function showHome() {

    document.body.className = "home-page";


    document.body.innerHTML = `

        <main class="book-cover">

            <p class="cover-small">
                OUR STORY
            </p>


            <h1>OUR BOOK</h1>


            <div class="cover-line"></div>


            <p class="cover-subtitle">
                M. - J.
            </p>


            <div class="categories">

                <div
                    class="category"
                    onclick="openCategory('places')"
                >

                    <h2>PLACES</h2>

                    <p>
                        Places we want to visit
                    </p>

                </div>


                <div
                    class="category"
                    onclick="openCategory('activities')"
                >

                    <h2>ACTIVITIES</h2>

                    <p>
                        Things we want to do
                    </p>

                </div>


                <div
                    class="category"
                    onclick="openCategory('dreams')"
                >

                    <h2>DREAMS</h2>

                    <p>
                        Things we dream of
                    </p>

                </div>

            </div>


            <button
                class="back-button"
                onclick="logout()"
                style="
                    align-self: center;
                    margin-top: 30px;
                "
            >
                LOG OUT
            </button>


            <p class="cover-footer">
                ILY
            </p>

        </main>
    `;
}


// ========================================
// OPEN MAIN CATEGORY
// ========================================

function openCategory(category) {

    showCategory(category);
}


// ========================================
// SHOW MAIN CATEGORY
// ========================================

function showCategory(category) {

    document.body.className = "";


    let title =
        category.toUpperCase();


    let description = "";


    if (category === "places") {

        description =
            "Places we want to visit together.";

    }


    if (category === "activities") {

        description =
            "Things we want to do together.";

    }


    if (category === "dreams") {

        description =
            "Things we dream of experiencing together.";

    }


    let categories =
        book[category].categories;


    let categoryNames =
        Object.keys(categories);


    document.body.innerHTML = `

        <button
            class="back-button"
            onclick="goHome()"
        >
            ← OUR BOOK
        </button>


        <h1>${title}</h1>


        <p>${description}</p>


        <button
            class="add-button"
            onclick="showAddCategoryForm('${category}')"
        >
            + Add category
        </button>


        <div class="items">

            ${
                categoryNames.length === 0

                ? `
                    <p class="empty-message">
                        No categories added yet.
                    </p>
                `

                : categoryNames.map((name, index) => `

                    <div class="item">

                        <h2>${name}</h2>


                        <p>
                            ${categories[name].length}

                            ${
                                categories[name].length === 1
                                ? "item"
                                : "items"
                            }
                        </p>


                        <div style="
                            margin-top: 15px;
                            display: flex;
                            gap: 10px;
                        ">

                            <button
                                onclick="
                                    showEditCategoryForm(
                                        '${category}',
                                        ${index}
                                    );
                                    event.stopPropagation();
                                "
                            >
                                Edit
                            </button>


                            <button
                                onclick="
                                    deleteCategory(
                                        '${category}',
                                        ${index}
                                    );
                                    event.stopPropagation();
                                "
                            >
                                Delete
                            </button>


                            <button
                                onclick="
                                    openSubcategory(
                                        '${category}',
                                        ${index}
                                    );
                                    event.stopPropagation();
                                "
                            >
                                Open
                            </button>

                        </div>

                    </div>

                `).join("")
            }

        </div>
    `;
}


// ========================================
// ADD CATEGORY FORM
// ========================================

function showAddCategoryForm(category) {

    document.body.innerHTML = `

        <button
            class="back-button"
            onclick="showCategory('${category}')"
        >
            ← ${category.toUpperCase()}
        </button>


        <h1>NEW CATEGORY</h1>


        <div class="add-form">

            <label>Category name</label>


            <input
                type="text"
                id="categoryName"
                placeholder="e.g. Museums"
            >


            <button
                onclick="addCategory('${category}')"
            >
                ADD
            </button>

        </div>
    `;
}


// ========================================
// ADD CATEGORY
// ========================================

function addCategory(category) {

    const name =
        document
        .getElementById("categoryName")
        .value
        .trim();


    if (name === "") {

        alert(
            "Please enter a category name."
        );

        return;
    }


    if (
        book[category].categories[name]
    ) {

        alert(
            "That category already exists."
        );

        return;
    }


    book[category].categories[name] = [];


    saveBook();


    showCategory(category);
}


// ========================================
// EDIT CATEGORY FORM
// ========================================

function showEditCategoryForm(
    category,
    index
) {

    const categoryNames =
        Object.keys(
            book[category].categories
        );


    const oldName =
        categoryNames[index];


    document.body.innerHTML = `

        <button
            class="back-button"
            onclick="showCategory('${category}')"
        >
            ← ${category.toUpperCase()}
        </button>


        <h1>EDIT CATEGORY</h1>


        <div class="add-form">

            <label>Category name</label>


            <input
                type="text"
                id="categoryName"
                value="${oldName}"
            >


            <button
                onclick="
                    editCategory(
                        '${category}',
                        ${index}
                    )
                "
            >
                SAVE
            </button>

        </div>
    `;
}


// ========================================
// EDIT CATEGORY
// ========================================

function editCategory(
    category,
    index
) {

    const categoryNames =
        Object.keys(
            book[category].categories
        );


    const oldName =
        categoryNames[index];


    const newName =
        document
        .getElementById("categoryName")
        .value
        .trim();


    if (newName === "") {

        alert(
            "Please enter a category name."
        );

        return;
    }


    if (
        newName !== oldName &&
        book[category].categories[newName]
    ) {

        alert(
            "That category already exists."
        );

        return;
    }


    const items =
        book[category].categories[oldName];


    delete book[category].categories[oldName];


    book[category].categories[newName] =
        items;


    saveBook();


    showCategory(category);
}


// ========================================
// DELETE CATEGORY
// ========================================

function deleteCategory(
    category,
    index
) {

    const categoryNames =
        Object.keys(
            book[category].categories
        );


    const name =
        categoryNames[index];


    const confirmed =
        confirm(
            `Delete "${name}" and everything inside it?`
        );


    if (!confirmed) {

        return;
    }


    delete book[category].categories[name];


    saveBook();


    showCategory(category);
}


// ========================================
// OPEN SUBCATEGORY
// ========================================

function openSubcategory(
    category,
    index
) {

    const categoryNames =
        Object.keys(
            book[category].categories
        );


    const subcategory =
        categoryNames[index];


    const items =
        book[category]
        .categories[subcategory];


    document.body.innerHTML = `

        <button
            class="back-button"
            onclick="
                showCategory('${category}')
            "
        >
            ← ${category.toUpperCase()}
        </button>


        <h1>${subcategory}</h1>


        <button
            class="add-button"
            onclick="
                showAddItemForm(
                    '${category}',
                    ${index}
                )
            "
        >
            + Add
        </button>


        <div class="items">

            ${
                items.length === 0

                ? `
                    <p class="empty-message">
                        No items added yet.
                    </p>
                `

                : items.map((item, itemIndex) => `

                    <div class="item">

                        <h2>${item.name}</h2>


                        <p>${item.notes}</p>


                        <p style="
                            margin-top: 15px;
                            font-style: italic;
                        ">
                            ${
                                item.completed
                                ? "✓ Done"
                                : "○ Not done yet"
                            }
                        </p>


                        <div style="
                            margin-top: 15px;
                            display: flex;
                            gap: 10px;
                            flex-wrap: wrap;
                        ">

                            <button
                                onclick="
                                    toggleCompleted(
                                        '${category}',
                                        ${index},
                                        ${itemIndex}
                                    );
                                    event.stopPropagation();
                                "
                            >
                                ${
                                    item.completed
                                    ? "Mark as not done"
                                    : "Mark as done"
                                }
                            </button>


                            <button
                                onclick="
                                    showEditItemForm(
                                        '${category}',
                                        ${index},
                                        ${itemIndex}
                                    );
                                    event.stopPropagation();
                                "
                            >
                                Edit
                            </button>


                            <button
                                onclick="
                                    deleteItem(
                                        '${category}',
                                        ${index},
                                        ${itemIndex}
                                    );
                                    event.stopPropagation();
                                "
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `).join("")
            }

        </div>
    `;
}


// ========================================
// ADD ITEM FORM
// ========================================

function showAddItemForm(
    category,
    index
) {

    const categoryNames =
        Object.keys(
            book[category].categories
        );


    const subcategory =
        categoryNames[index];


    document.body.innerHTML = `

        <button
            class="back-button"
            onclick="
                openSubcategory(
                    '${category}',
                    ${index}
                )
            "
        >
            ← ${subcategory}
        </button>


        <h1>ADD TO ${subcategory}</h1>


        <div class="add-form">

            <label>Name</label>


            <input
                type="text"
                id="itemName"
                placeholder="Enter a name..."
            >


            <label>Notes</label>


            <textarea
                id="itemNotes"
                placeholder="Add some notes..."
            ></textarea>


            <button
                onclick="
                    addItem(
                        '${category}',
                        ${index}
                    )
                "
            >
                ADD
            </button>

        </div>
    `;
}


// ========================================
// ADD ITEM
// ========================================

function addItem(
    category,
    index
) {

    const categoryNames =
        Object.keys(
            book[category].categories
        );


    const subcategory =
        categoryNames[index];


    const name =
        document
        .getElementById("itemName")
        .value
        .trim();


    const notes =
        document
        .getElementById("itemNotes")
        .value
        .trim();


    if (name === "") {

        alert(
            "Please enter a name."
        );

        return;
    }


    book[category]
        .categories[subcategory]
        .push({

            name: name,

            notes: notes,

            completed: false

        });


    saveBook();


    openSubcategory(
        category,
        index
    );
}


// ========================================
// TOGGLE COMPLETION
// ========================================

function toggleCompleted(
    category,
    categoryIndex,
    itemIndex
) {

    const categoryNames =
        Object.keys(
            book[category].categories
        );


    const subcategory =
        categoryNames[categoryIndex];


    const item =
        book[category]
        .categories[subcategory][itemIndex];


    item.completed =
        !item.completed;


    saveBook();


    openSubcategory(
        category,
        categoryIndex
    );
}


// ========================================
// EDIT ITEM FORM
// ========================================

function showEditItemForm(
    category,
    categoryIndex,
    itemIndex
) {

    const categoryNames =
        Object.keys(
            book[category].categories
        );


    const subcategory =
        categoryNames[categoryIndex];


    const item =
        book[category]
        .categories[subcategory][itemIndex];


    document.body.innerHTML = `

        <button
            class="back-button"
            onclick="
                openSubcategory(
                    '${category}',
                    ${categoryIndex}
                )
            "
        >
            ← ${subcategory}
        </button>


        <h1>EDIT ITEM</h1>


        <div class="add-form">

            <label>Name</label>


            <input
                type="text"
                id="itemName"
                value="${item.name}"
            >


            <label>Notes</label>


            <textarea
                id="itemNotes"
            >${item.notes}</textarea>


            <button
                onclick="
                    editItem(
                        '${category}',
                        ${categoryIndex},
                        ${itemIndex}
                    )
                "
            >
                SAVE
            </button>

        </div>
    `;
}


// ========================================
// EDIT ITEM
// ========================================

function editItem(
    category,
    categoryIndex,
    itemIndex
) {

    const categoryNames =
        Object.keys(
            book[category].categories
        );


    const subcategory =
        categoryNames[categoryIndex];


    const item =
        book[category]
        .categories[subcategory][itemIndex];


    const name =
        document
        .getElementById("itemName")
        .value
        .trim();


    const notes =
        document
        .getElementById("itemNotes")
        .value
        .trim();


    if (name === "") {

        alert(
            "Please enter a name."
        );

        return;
    }


    item.name = name;

    item.notes = notes;


    saveBook();


    openSubcategory(
        category,
        categoryIndex
    );
}


// ========================================
// DELETE ITEM
// ========================================

function deleteItem(
    category,
    categoryIndex,
    itemIndex
) {

    const categoryNames =
        Object.keys(
            book[category].categories
        );


    const subcategory =
        categoryNames[categoryIndex];


    const item =
        book[category]
        .categories[subcategory][itemIndex];


    const confirmed =
        confirm(
            `Delete "${item.name}"?`
        );


    if (!confirmed) {

        return;
    }


    book[category]
        .categories[subcategory]
        .splice(itemIndex, 1);


    saveBook();


    openSubcategory(
        category,
        categoryIndex
    );
}


// ========================================
// RETURN HOME
// ========================================

function goHome() {

    showHome();
}


// ========================================
// START
// ========================================

checkLogin();