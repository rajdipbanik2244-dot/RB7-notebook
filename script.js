// =========================
// RB7 NOTEBOOK
// =========================

const APP_PASSWORD = "12345";

let notes =
JSON.parse(
    localStorage.getItem("notes")
) || [];

// =========================
// LOGIN
// =========================

function login() {

    const password =
    document.getElementById(
        "passwordInput"
    ).value;

    if (password === APP_PASSWORD) {

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        document
        .getElementById("loginScreen")
        .classList.add("hidden");

        document
        .getElementById("app")
        .classList.remove("hidden");

        renderNotes();

    } else {

        alert("Wrong Password");

    }

}
alert(
"Welcome Rajdip 🚀"
);

// =========================
// SAVE NOTES
// =========================

function saveNotes() {

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

}

// =========================
// ADD NOTE
// =========================

function addNote() {

    const title =
    document.getElementById(
        "noteTitle"
    ).value.trim();

    const subject =
    document.getElementById(
        "subjectInput"
    ).value.trim();

    const content =
    document.getElementById(
        "noteContent"
    ).value.trim();

    if (
        !title ||
        !subject ||
        !content
    ) {

        alert(
            "Fill all fields"
        );

        return;
    }

    const note = {

        id: Date.now(),

        title,

        subject,

        content,

        favorite: false,

        pinned: false,

        createdAt:
        new Date()
        .toLocaleString()

    };

    notes.unshift(note);

    saveNotes();

    renderNotes();

    document.getElementById(
        "noteTitle"
    ).value = "";

    document.getElementById(
        "subjectInput"
    ).value = "";

    document.getElementById(
        "noteContent"
    ).value = "";

}

// =========================
// DELETE NOTE
// =========================

function deleteNote(id) {

    if (
        !confirm(
            "Delete this note?"
        )
    ) return;

    notes =
    notes.filter(
        note =>
        note.id !== id
    );

    saveNotes();

    renderNotes();

}

// =========================
// FAVORITE
// =========================

function toggleFavorite(id) {

    notes =
    notes.map(note => {

        if (
            note.id === id
        ) {

            note.favorite =
            !note.favorite;

        }

        return note;

    });

    saveNotes();

    renderNotes();

}

// =========================
// PIN NOTE
// =========================

function togglePin(id) {

    notes =
    notes.map(note => {

        if (
            note.id === id
        ) {

            note.pinned =
            !note.pinned;

        }

        return note;

    });

    saveNotes();

    renderNotes();

}

// =========================
// SEARCH
// =========================

document
.getElementById(
    "searchInput"
)
.addEventListener(
    "input",
    renderNotes
);

// =========================
// STATS
// =========================

function updateStats() {

    document
    .getElementById(
        "totalNotes"
    ).innerText =
    notes.length;

    document
    .getElementById(
        "favoriteCount"
    ).innerText =
    notes.filter(
        note =>
        note.favorite
    ).length;

    const subjects =
    [
        ...new Set(
            notes.map(
                note =>
                note.subject
            )
        )
    ];

    document
    .getElementById(
        "subjectCount"
    ).innerText =
    subjects.length;

}

// =========================
// THEME
// =========================

function toggleTheme() {

    document.body
    .classList.toggle(
        "light"
    );

    localStorage.setItem(
        "theme",
        document.body
        .classList.contains(
            "light"
        )
    );

}

if (
    localStorage.getItem(
        "theme"
    ) === "true"
) {

    document.body
    .classList.add(
        "light"
    );

}

// =========================
// EXPORT BACKUP
// =========================

function exportBackup() {

    const blob =
    new Blob(

        [
            JSON.stringify(
                notes,
                null,
                2
            )
        ],

        {
            type:
            "application/json"
        }

    );

    const url =
    URL.createObjectURL(
        blob
    );

    const a =
    document.createElement(
        "a"
    );

    a.href = url;

    a.download =
    "notes-backup.json";

    a.click();

}

// =========================
// PDF EXPORT
// =========================

function exportPDF() {

    const { jsPDF } =
    window.jspdf;

    const doc =
    new jsPDF();

    let y = 20;

    doc.setFontSize(20);

    doc.text(
        "RB7 Notebook",
        20,
        y
    );

    y += 15;

    notes.forEach(
        (note, index) => {

            doc.setFontSize(
                14
            );

            doc.text(
                `${index + 1}. ${note.title}`,
                20,
                y
            );

            y += 8;

            doc.setFontSize(
                11
            );

            doc.text(
                `Subject: ${note.subject}`,
                20,
                y
            );

            y += 8;

            const lines =
            doc.splitTextToSize(
                note.content,
                170
            );

            doc.text(
                lines,
                20,
                y
            );

            y +=
            lines.length *
            6 +
            12;

            if (
                y > 260
            ) {

                doc.addPage();

                y = 20;

            }

        }
    );

    doc.save(
        "RB7-Notes.pdf"
    );

}

// =========================
// RENDER NOTES
// =========================

function renderNotes() {

    const container =
    document.getElementById(
        "notesContainer"
    );

    const searchText =
    document
    .getElementById(
        "searchInput"
    )
    .value
    .toLowerCase();

    container.innerHTML =
    "";

    let sortedNotes =
    [...notes];

    sortedNotes.sort(
        (a, b) => {

            if (
                a.pinned &&
                !b.pinned
            )
                return -1;

            if (
                !a.pinned &&
                b.pinned
            )
                return 1;

            return 0;

        }
    );

    sortedNotes.forEach(
        note => {

            const match =

                note.title
                .toLowerCase()
                .includes(
                    searchText
                )

                ||

                note.subject
                .toLowerCase()
                .includes(
                    searchText
                )

                ||

                note.content
                .toLowerCase()
                .includes(
                    searchText
                );

            if (
                !match
            ) return;

            container.innerHTML += `

            <div class="note-card">

                <div class="note-title">
                    ${note.title}
                </div>

                <div class="subject-tag">
                    ${note.subject}
                </div>

                <div class="note-content">
                    ${note.content}
                </div>

                <div class="note-date">
                    ${note.createdAt}
                </div>

                <div class="note-actions">

                    <button
                    onclick="toggleFavorite(${note.id})">

                    ${note.favorite ? "⭐" : "☆"}

                    </button>

                    <button
                    onclick="togglePin(${note.id})">

                    ${note.pinned ? "📌" : "📍"}

                    </button>

                    <button
                    onclick="deleteNote(${note.id})">

                    🗑️

                    </button>
                    <button
                    class="action-btn"
                    onclick="exportPDF(${note.id})">
                    📄
                    </button>
                    <button
                    class="action-btn"
                    onclick="editNote(${note.id})">
                    ✏️
                    </button>

                </div>

            </div>

            `;

        }
    );

    updateStats();

}

// =========================
// AUTO LOGIN
// =========================

if (
    localStorage.getItem(
        "loggedIn"
    ) === "true"
) {

    document
    .getElementById(
        "loginScreen"
    )
    .classList.add(
        "hidden"
    );

    document
    .getElementById(
        "app"
    )
    .classList.remove(
        "hidden"
    );

    renderNotes();

}

console.log(
    "RB7 Notebook Loaded"
);
document.getElementById("loginBtn").addEventListener("click", function () {

    const password =
    document.getElementById("passwordInput").value;

    if (password === APP_PASSWORD) {

        localStorage.setItem("loggedIn", "true");

        document.getElementById("loginScreen").style.display = "none";

        document.getElementById("app").classList.remove("hidden");

        renderNotes();

    } else {

        alert("Wrong Password");

    }

});
function logout() {

    localStorage.removeItem("loggedIn");

    location.reload();

}
function logout() {

    localStorage.removeItem("loggedIn");

    location.reload();

}