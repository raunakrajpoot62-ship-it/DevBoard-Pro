const STORAGE_KEY = "devboard-pro-data";

/* =========================
   APP STATE
========================= */

const state =
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || {

    tasks: [],
    notes: [],
    habits: [],
    bookmarks: [],

    theme: "dark"
  };

/* =========================
   SAVE
========================= */

function saveData(){

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}

/* =========================
   ELEMENTS
========================= */

const navButtons =
  document.querySelectorAll(".nav-btn");

const sections =
  document.querySelectorAll(".section");

/* TASKS */

const taskInput =
  document.getElementById("taskInput");

const taskTagInput =
  document.getElementById("taskTagInput");

const taskSearch =
  document.getElementById("taskSearch");

const taskFilter =
  document.getElementById("taskFilter");

const taskList =
  document.getElementById("taskList");

const addTaskBtn =
  document.getElementById("addTaskBtn");

const clearDoneTasks =
  document.getElementById("clearDoneTasks");

/* NOTES */

const noteTitle =
  document.getElementById("noteTitle");

const noteBody =
  document.getElementById("noteBody");

const noteSearch =
  document.getElementById("noteSearch");

const noteList =
  document.getElementById("noteList");

const addNoteBtn =
  document.getElementById("addNoteBtn");

/* HABITS */

const habitInput =
  document.getElementById("habitInput");

const habitList =
  document.getElementById("habitList");

const addHabitBtn =
  document.getElementById("addHabitBtn");

/* BOOKMARKS */

const bookmarkTitle =
  document.getElementById("bookmarkTitle");

const bookmarkUrl =
  document.getElementById("bookmarkUrl");

const bookmarkList =
  document.getElementById("bookmarkList");

const addBookmarkBtn =
  document.getElementById("addBookmarkBtn");

/* HEADER */

const themeBtn =
  document.getElementById("themeBtn");

const exportBtn =
  document.getElementById("exportBtn");

const importFile =
  document.getElementById("importFile");

const globalSearch =
  document.getElementById("globalSearch");

/* DASHBOARD */

const totalTasks =
  document.getElementById("totalTasks");

const doneTasks =
  document.getElementById("doneTasks");

const bookmarkCount =
  document.getElementById("bookmarkCount");

const streakValue =
  document.getElementById("streakValue");

const progressFill =
  document.getElementById("progressFill");

const progressText =
  document.getElementById("progressText");

/* TIMER */

const timerDisplay =
  document.getElementById("timerDisplay");

const timerMode =
  document.getElementById("timerMode");

const timerRing =
  document.getElementById("timerRing");

const startPauseBtn =
  document.getElementById("startPauseBtn");

const resetTimerBtn =
  document.getElementById("resetTimerBtn");

const switchModeBtn =
  document.getElementById("switchModeBtn");

/* =========================
   NAVIGATION
========================= */

navButtons.forEach(btn => {

  btn.onclick = () => {

    navButtons.forEach(b =>
      b.classList.remove("active")
    );

    sections.forEach(section =>
      section.classList.remove("active")
    );

    btn.classList.add("active");

    document
      .getElementById(
        btn.dataset.target + "Section"
      )
      .classList.add("active");
  };
});

/* =========================
   TASKS
========================= */

function renderTasks(){

  taskList.innerHTML = "";

  const query =
    taskSearch.value.toLowerCase();

  const filter =
    taskFilter.value;

  const filtered =
    state.tasks.filter(task => {

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "all"
        ||
        (filter === "active" && !task.done)
        ||
        (filter === "done" && task.done);

      return matchesSearch &&
             matchesFilter;
    });

  if(!filtered.length){

    taskList.innerHTML = `
      <div class="item">
        <p>No tasks found.</p>
      </div>
    `;

    return;
  }

  filtered.forEach(task => {

    const div =
      document.createElement("div");

    div.className = "item";

    div.innerHTML = `
      <div class="item-top">

        <div>
          <h4>
            ${task.done ? "✅" : "📌"}
            ${task.title}
          </h4>

          <p>
            ${task.tag || "General"}
          </p>
        </div>

        <div class="tools">
          <button class="btn toggle-btn">
            ${task.done ? "Undo" : "Done"}
          </button>

          <button class="btn delete-btn">
            Delete
          </button>
        </div>

      </div>
    `;

    div
      .querySelector(".toggle-btn")
      .onclick = () => {

        task.done = !task.done;

        saveData();

        renderTasks();
        updateDashboard();
      };

    div
      .querySelector(".delete-btn")
      .onclick = () => {

        state.tasks =
          state.tasks.filter(
            t => t.id !== task.id
          );

        saveData();

        renderTasks();
        updateDashboard();
      };

    taskList.appendChild(div);
  });
}

addTaskBtn.onclick = () => {

  const title =
    taskInput.value.trim();

  if(!title) return;

  state.tasks.unshift({

    id: Date.now(),

    title,

    tag:
      taskTagInput.value.trim(),

    done:false
  });

  taskInput.value = "";
  taskTagInput.value = "";

  saveData();

  renderTasks();
  updateDashboard();
};

taskSearch.oninput = renderTasks;
taskFilter.onchange = renderTasks;

clearDoneTasks.onclick = () => {

  state.tasks =
    state.tasks.filter(
      task => !task.done
    );

  saveData();

  renderTasks();
  updateDashboard();
};

/* =========================
   NOTES
========================= */

function renderNotes(){

  noteList.innerHTML = "";

  const query =
    noteSearch.value.toLowerCase();

  const filtered =
    state.notes.filter(note =>

      note.title
        .toLowerCase()
        .includes(query)

      ||

      note.body
        .toLowerCase()
        .includes(query)
    );

  if(!filtered.length){

    noteList.innerHTML = `
      <div class="item">
        <p>No notes found.</p>
      </div>
    `;

    return;
  }

  filtered.forEach(note => {

    const div =
      document.createElement("div");

    div.className = "item";

    div.innerHTML = `
      <div class="item-top">

        <div>
          <h4>${note.title}</h4>
          <p>${note.body}</p>
        </div>

        <button class="btn delete-note">
          Delete
        </button>

      </div>
    `;

    div
      .querySelector(".delete-note")
      .onclick = () => {

        state.notes =
          state.notes.filter(
            n => n.id !== note.id
          );

        saveData();

        renderNotes();
      };

    noteList.appendChild(div);
  });
}

addNoteBtn.onclick = () => {

  const title =
    noteTitle.value.trim();

  const body =
    noteBody.value.trim();

  if(!title || !body) return;

  state.notes.unshift({

    id: Date.now(),

    title,
    body
  });

  noteTitle.value = "";
  noteBody.value = "";

  saveData();

  renderNotes();
};

noteSearch.oninput = renderNotes;

/* =========================
   HABITS
========================= */

function renderHabits(){

  habitList.innerHTML = "";

  if(!state.habits.length){

    habitList.innerHTML = `
      <div class="item">
        <p>No habits added.</p>
      </div>
    `;

    return;
  }

  state.habits.forEach(habit => {

    const div =
      document.createElement("div");

    div.className = "item";

    div.innerHTML = `
      <div class="item-top">

        <div>
          <h4>${habit.name}</h4>
          <p>🔥 ${habit.streak} day streak</p>
        </div>

        <div class="tools">

          <button class="btn streak-btn">
            +1 Day
          </button>

          <button class="btn delete-habit">
            Delete
          </button>

        </div>

      </div>
    `;

    div
      .querySelector(".streak-btn")
      .onclick = () => {

        habit.streak++;

        saveData();

        renderHabits();
        updateDashboard();
      };

    div
      .querySelector(".delete-habit")
      .onclick = () => {

        state.habits =
          state.habits.filter(
            h => h.id !== habit.id
          );

        saveData();

        renderHabits();
        updateDashboard();
      };

    habitList.appendChild(div);
  });
}

addHabitBtn.onclick = () => {

  const value =
    habitInput.value.trim();

  if(!value) return;

  state.habits.unshift({

    id: Date.now(),

    name:value,

    streak:0
  });

  habitInput.value = "";

  saveData();

  renderHabits();
  updateDashboard();
};

/* =========================
   BOOKMARKS
========================= */

function renderBookmarks(){

  bookmarkList.innerHTML = "";

  if(!state.bookmarks.length){

    bookmarkList.innerHTML = `
      <div class="item">
        <p>No bookmarks saved.</p>
      </div>
    `;

    return;
  }

  state.bookmarks.forEach(bookmark => {

    const div =
      document.createElement("div");

    div.className = "item";

    div.innerHTML = `
      <div class="item-top">

        <div>
          <a href="${bookmark.url}"
             target="_blank">

             ${bookmark.title}
          </a>

          <p>${bookmark.url}</p>
        </div>

        <button class="btn delete-bookmark">
          Delete
        </button>

      </div>
    `;

    div
      .querySelector(".delete-bookmark")
      .onclick = () => {

        state.bookmarks =
          state.bookmarks.filter(
            b => b.id !== bookmark.id
          );

        saveData();

        renderBookmarks();
        updateDashboard();
      };

    bookmarkList.appendChild(div);
  });
}

addBookmarkBtn.onclick = () => {

  const title =
    bookmarkTitle.value.trim();

  const url =
    bookmarkUrl.value.trim();

  if(!title || !url) return;

  state.bookmarks.unshift({

    id: Date.now(),

    title,
    url
  });

  bookmarkTitle.value = "";
  bookmarkUrl.value = "";

  saveData();

  renderBookmarks();
  updateDashboard();
};

/* =========================
   DASHBOARD
========================= */

function updateDashboard(){

  const total =
    state.tasks.length;

  const completed =
    state.tasks.filter(
      t => t.done
    ).length;

  const progress =
    total
    ?
    Math.round(
      completed / total * 100
    )
    :
    0;

  totalTasks.textContent =
    total;

  doneTasks.textContent =
    completed;

  bookmarkCount.textContent =
    state.bookmarks.length;

  const streak =
    state.habits.reduce(
      (max,h) =>
        Math.max(max,h.streak),
      0
    );

  streakValue.textContent =
    streak;

  progressFill.style.width =
    progress + "%";

  progressText.textContent =
    progress + "%";
}

/* =========================
   THEME
========================= */

function applyTheme(){

  if(state.theme === "light"){

    document.documentElement
      .setAttribute(
        "data-theme",
        "light"
      );

  }else{

    document.documentElement
      .removeAttribute(
        "data-theme"
      );
  }
}

themeBtn.onclick = () => {

  state.theme =
    state.theme === "light"
    ? "dark"
    : "light";

  saveData();

  applyTheme();
};

/* =========================
   TIMER
========================= */

let focusMode = true;

let timerSeconds = 1500;

let timerInterval;

let timerRunning = false;

function updateTimer(){

  const minutes =
    String(
      Math.floor(
        timerSeconds / 60
      )
    ).padStart(2,"0");

  const seconds =
    String(
      timerSeconds % 60
    ).padStart(2,"0");

  timerDisplay.textContent =
    `${minutes}:${seconds}`;

  const max =
    focusMode ? 1500 : 300;

  const progress =
    (
      (max - timerSeconds)
      / max
    ) * 100;

  timerRing.style.setProperty(
    "--timer-progress",
    `${progress}%`
  );
}

startPauseBtn.onclick = () => {

  timerRunning = !timerRunning;

  startPauseBtn.textContent =
    timerRunning
    ? "Pause"
    : "Start";

  if(timerRunning){

    timerInterval =
      setInterval(() => {

        if(timerSeconds > 0){

          timerSeconds--;

          updateTimer();

        }else{

          clearInterval(
            timerInterval
          );

          timerRunning = false;

          startPauseBtn.textContent =
            "Start";

          alert(
            focusMode
            ?
            "Focus session complete!"
            :
            "Break finished!"
          );
        }

      },1000);

  }else{

    clearInterval(timerInterval);
  }
};

resetTimerBtn.onclick = () => {

  clearInterval(timerInterval);

  timerRunning = false;

  timerSeconds =
    focusMode
    ? 1500
    : 300;

  startPauseBtn.textContent =
    "Start";

  updateTimer();
};

switchModeBtn.onclick = () => {

  focusMode = !focusMode;

  timerMode.textContent =
    focusMode
    ? "Focus session"
    : "Break session";

  timerSeconds =
    focusMode
    ? 1500
    : 300;

  updateTimer();
};

/* =========================
   EXPORT / IMPORT
========================= */

exportBtn.onclick = () => {

  const blob =
    new Blob(

      [
        JSON.stringify(
          state,
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
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    "devboard-backup.json";

  a.click();

  URL.revokeObjectURL(url);
};

importFile.addEventListener(
  "change",
  e => {

    const file =
      e.target.files[0];

    if(!file) return;

    const reader =
      new FileReader();

    reader.onload = event => {

      try{

        const data =
          JSON.parse(
            event.target.result
          );

        Object.assign(
          state,
          data
        );

        saveData();

        init();

        alert(
          "Backup imported!"
        );

      }catch{

        alert(
          "Invalid backup file."
        );
      }
    };

    reader.readAsText(file);
  }
);

/* =========================
   GLOBAL SEARCH
========================= */

globalSearch.oninput = () => {

  const query =
    globalSearch.value
      .toLowerCase();

  document
    .querySelectorAll(".item")
    .forEach(item => {

      item.style.display =
        item.innerText
          .toLowerCase()
          .includes(query)

        ? "block"

        : "none";
    });
};

/* =========================
   INIT
========================= */

function init(){

  applyTheme();

  renderTasks();
  renderNotes();
  renderHabits();
  renderBookmarks();

  updateDashboard();

  updateTimer();
}

init();
