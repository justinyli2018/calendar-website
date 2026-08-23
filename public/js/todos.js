import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { db } from "./firebase-init.js";

const todoList = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");

let unsubscribe = null;

function todosCollection(uid) {
  return collection(db, "users", uid, "todos");
}

function renderTodos(uid, docs) {
  todoList.innerHTML = "";

  if (docs.length === 0) {
    const empty = document.createElement("li");
    empty.className = "bg-white rounded-lg border border-gray-200 p-3 text-sm text-gray-400 text-center";
    empty.textContent = "No to-do items yet.";
    todoList.appendChild(empty);
    return;
  }

  for (const docSnap of docs) {
    const todo = docSnap.data();
    const item = document.createElement("li");
    item.className = "bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(todo.completed);
    checkbox.className = "h-4 w-4";
    checkbox.addEventListener("change", () => {
      updateDoc(doc(db, "users", uid, "todos", docSnap.id), {
        completed: checkbox.checked,
      });
    });

    const title = document.createElement("span");
    title.textContent = todo.title;
    title.className = "flex-1 text-sm" + (todo.completed ? " line-through text-gray-400" : "");
    title.addEventListener("click", () => {
      const nextTitle = window.prompt("Edit to-do", todo.title);
      if (nextTitle !== null && nextTitle.trim() !== "") {
        updateDoc(doc(db, "users", uid, "todos", docSnap.id), {
          title: nextTitle.trim(),
        });
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "text-sm text-red-600";
    deleteButton.addEventListener("click", () => {
      deleteDoc(doc(db, "users", uid, "todos", docSnap.id));
    });

    item.append(checkbox, title, deleteButton);
    todoList.appendChild(item);
  }
}

function startListening(uid) {
  const q = query(todosCollection(uid), orderBy("createdAt", "asc"));
  unsubscribe = onSnapshot(q, (snapshot) => {
    renderTodos(uid, snapshot.docs);
  });
}

function stopListening() {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  todoList.innerHTML = "";
}

window.addEventListener("authchange", (event) => {
  stopListening();
  const user = event.detail.user;
  todoForm.dataset.uid = user ? user.uid : "";
  if (user) {
    startListening(user.uid);
  }
});

todoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = todoInput.value.trim();
  if (!title) return;

  const uid = todoForm.dataset.uid;
  if (!uid) return;

  await addDoc(todosCollection(uid), {
    title,
    completed: false,
    createdAt: serverTimestamp(),
  });
  todoInput.value = "";
});
