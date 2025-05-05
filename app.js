// DOM Elements
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const clearButton = document.querySelector("#clear-btn");
const span = document.querySelector("#task-count");
eventListeners();
function eventListeners()
{
    document.addEventListener("DOMContentLoaded",onPageLoad());
    form.addEventListener("submit", addTodo);
    list.addEventListener("click", deleteTodo)
    clearButton.addEventListener("click",deleteAllTodos)
}
// Löscht alle Aufgaben sowohl aus dem DOM als auch aus dem localStorage.
function deleteAllTodos()
{
    let todos = getTodosFromStorage();
  if(todos.length !== 0){
    if(confirm("Sind Sie sicher alle Aufgaben zu löschen?"))
      {
        while(list.firstChild)
          {
            list.removeChild(list.firstChild);
          }       
          localStorage.removeItem("todos");
          updateEmptyMessage();
          updateTaskCount();
     }
  }
}
// Zeigt alle im localStorage gespeicherten Aufgaben in der Benutzeroberfläche an
function loadAllTodosUI()
{
    let todos = getTodosFromStorage();
    todos.forEach(function(todo)
    {
        addTodoUI(todo);
    });
}
// Ruft die nötigen Funktionen beim Laden der Seite auf
// Lädt alle Aufgaben aus dem localStorage und aktualisiert die Anzeige (z. B. Aufgabenanzahl)
function onPageLoad()
{
    loadAllTodosUI();
    updateEmptyMessage();
    updateTaskCount();
}
//Löscht eine Aufgabe aus dem UI (DOM) und dem localStorage.
function deleteTodo(e)
{
    if(e.target.classList.contains("fa-remove"))
    {
        e.target.closest("li").remove();
        showMessage("success","Aufgabe ist erfolgreich gelöscht!");
        //Ruft auf, um die Aufgabe auch aus dem localStorage zu entfernen
        deleteTodoFromStorage(e.target.closest("li").getAttribute("todo-id"));
        updateTaskCount();
    }
    updateEmptyMessage();
}
//Löscht die ausgwählte Aufgabe aus dem localStorage anhand ihrer eindeutigen ID
function deleteTodoFromStorage(id)
{
    let todos = getTodosFromStorage();
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem("todos", JSON.stringify(todos));
}
// Fügt eine neue Aufgabe hinzu, wenn das Eingabefeld nicht leer ist.
function addTodo(e)
{
    const newTodo = input.value.trim();
    if(newTodo === "") //Wenn das Feld leer ist, wird eine Warnmeldung angezeigt
        showMessage("danger", "Geben Sie bitte ein Aufgabe ein!");
    else
    {
        const todo = {id: generateId(),
            text : newTodo
        }
        addTodoUI(todo);
        addTodoToStorage(todo);
        updateTaskCount(e);
        updateEmptyMessage();
        showMessage("success","Aufgabe ist erfolgreich gespeichert!");
    }
    //Verhindert das automatische Neuladen des Formulars
    e.preventDefault();
}
/* Fügt eine neue Aufgabe dem localStorage hinzu.
 * - Ruft das bestehende Aufgaben-Array mit getTodosFromStorage() ab
 * - Fügt das übergebene ToDo-Objekt dem Array hinzu
 * - Speichert das aktualisierte Array als JSON-String unter dem Schlüssel "todos" im localStorage
 * - Jede Aufgabe sollte ein Objekt mit einer eindeutigen ID und einem Textfeld sein.*/
function addTodoToStorage(todo)
{
    let todos = getTodosFromStorage();
    todos.push(todo);
    localStorage.setItem("todos",JSON.stringify(todos));
}

/* Liest die gespeicherten Aufgaben aus dem localStorage aus.
 Wandelt den JSON-String mithilfe von JSON.parse in ein Array um
Falls im Speicher kein Eintrag vorhanden ist (null), wird ein leeres Array zurückgegeben */
function getTodosFromStorage()
{
        return JSON.parse(localStorage.getItem("todos")) || [];
}

// Fügt eine einzelne Aufgabe in die Benutzeroberfläche (DOM) ein.
function addTodoUI(todo)
{
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.setAttribute("todo-id",todo.id);

    const link = document.createElement("a");
    link.className = "delete-item";
    link.href ="#";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.appendChild(document.createTextNode(todo.text));
    listItem.appendChild(link);
    list.appendChild(listItem);

    //Leert das Eingabefeld nach erfolgreicher Erstellung
    input.value = "";
}

//Zeigt eine temporäre Bootstrap-Alert-Nachricht unterhalb des Formulars an.
function showMessage(type,message)
{
    const alertItem = document.createElement("div");
    alertItem.className = `alert alert-${type}`;
    alertItem.textContent = message;
    alertItem.setAttribute("role","alert");
    form.insertAdjacentElement("afterend", alertItem);
    setTimeout(() =>{
        alertItem.remove()
    }, 1500);
}
/**
 * Generiert eine (nahezu) eindeutige ID für eine neue Aufgabe.
 * Diese ID wird verwendet, um jede Aufgabe eindeutig zu identifizieren —
 * selbst wenn zwei Aufgaben denselben Text haben.
 * Dadurch wird verhindert, dass beim Löschen versehentlich 
 * mehrere gleichlautende Aufgaben aus dem Speicher entfernt werden.
 */
function generateId(){
    return Date.now().toString() + Math.floor(Math.random()*1000);
}
//Aktualisiert die angezeigte Anzahl der offenen Aufgaben.
function updateTaskCount() 
{
    const count = getTodosFromStorage().length;
    if(span)
        span.textContent = count;
}
/**
 * Zeigt eine Hinweisnachricht an, wenn keine Aufgaben vorhanden sind.
 * - Prüft, ob die Nachricht bereits existiert (um doppelte Anzeige zu verhindern)
 * - Erstellt ein <div> mit Bild und Text
 * - Fügt die Nachricht direkt unterhalb des Formulars in den DOM ein
 */
function updateEmptyMessage(){
    const todos = getTodosFromStorage();
    if(todos.length === 0)
        showEmptyMessage();
    else
        deleteEmptyMessage();
}
function showEmptyMessage()
{
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-message";
    emptyMessage.id = "empty-message";

    const image = document.createElement("img");
    image.src = "https://cdn-icons-png.flaticon.com/512/4076/4076549.png";
    image.alt = "No tasks";

    const text = document.createElement("p");
    text.textContent ="Noch keine Aufgaben. Füge eine Aufgabe hinzu, um loszulegen!";

    emptyMessage.appendChild(image);
    emptyMessage.appendChild(text);
    form.insertAdjacentElement("afterend",emptyMessage);
}
function deleteEmptyMessage()
{
    const existEmptyMessage = document.getElementById("empty-message");
    if(existEmptyMessage)
      existEmptyMessage.remove();
}