

// ! Ay  Dizisi
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  


// ! HTML den İlgili Elemanların Çekilmesi
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup-box .popup");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const form = document.querySelector("form");
const settings = document.querySelector(".settings");
const wrapper = document.querySelector(".wrapper");
const button = document.querySelector(".popup button");





/// not güncellemesi 


let isUpdate =false;
let updateId;


/// local storage veriler içekip notes anahtarına aktardık

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// ekle iconuna tıklanınca popup açıyor

addBox.addEventListener("click",()=>{

    popupBox.classList.add("show");
    popupBoxContainer.classList.add("show");
    
    document.querySelector("body").style.overflow="hidden";

});

// ekle iconuna tıklanınca popup kapatıyor

closeIcon.addEventListener("click",()=>{
    popupBox.classList.remove("show");
    popupBoxContainer.classList.remove("show");
    document.querySelector("body").style.overflow="hidden";
});

form.addEventListener("submit", (e) => {
  // Sayfa yenilemeyi iptal ettik
  e.preventDefault();
  // Inputlardaki değerlere eriştik
  let titleInput = e.target[0];
  let descriptionInput = e.target[1];
  // Boşlukları temizledik
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();
  //Inputların boş olma durumunu kontrol ettik eğer doluysa bir not objesi oluşturduk ve bunu locale gönderdik.
  if (title && description) {
    const date = new Date();
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();

    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    //Eğer düzenleme moddaysak notu güncelle değilse yeni note ekle
    if (isUpdate) {
      // Güncelleme modundaysak ilgili elemanın içeriğini güncelle
      notes[updateId] = noteInfo;
      // Güncelleme modunu kapat
      isUpdate = false;
    } else {
      notes.push(noteInfo);
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    // Popup ı eski haline çevirdik
    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");
    popupTitle.textContent = "Notu Ekle";
    button.textContent = "Not Ekle";

    document.querySelector("body").style.overflow = "auto";
  }
  // Inputların içeriğini temizledik
  titleInput.value = "";
  descriptionInput.value = "";
  // Not eklendikten sonra notları render et
  showNotes();
});


function updateNote(noteId,title,description){
  isUpdate = true;
  updateId=noteId;
// Popup ı görünür kıldık
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  popupTitle.textContent = "Notu Güncelle";
  button.textContent = "Notu Güncelle";
  form.elements[0].value = title;
  form.elements[1].value = description;
   




};


function deleteNote(noteId){
 
  if( confirm("silmek istediğinizden emin misiniz?")){

    notes.splice(noteId,1);
    localStorage.setItem("notes",JSON.stringify(notes));

  };
  showNotes();

};


function showMenu(elem) {
  // parentElement bir elemanın kapsam elemanına erişmek için kullanılır.Burada tıklanan iconun kapsayıcısına bir class eklemememiz gerektiğinden parentElement ile bu elemanın kapsayıcısına eriştik.
  // Kapsam elemanına show classı ekledik
  elem.parentElement.classList.add("show");
  // Menu harici bir yere tıklanırsa show classını kaldır
  document.addEventListener("click",(e)=>{
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }

    
  });


};




function showNotes(){
  if(!notes) return;

  document.querySelectorAll(".note").forEach((li)=>li.remove());

  notes.forEach((note, id) => {
    let liTag = `   <li class="note">
        <div class="details">
          <p>${note.title} </p>
          <span>${note.description} </span>
        </div>

        <div class="bottom-content">
          <span>${note.date} </span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded" ></i>
                <ul class="menu">
            <li onclick='updateNote(${id}, "${note.title}", "${note.description}")'><i class="bx bx-edit"></i> Düzenle</li>
            <li onclick='deleteNote(${id})'><i class="bx bx-trash"></i> Sil</li>
          </ul>
          </div>
        </div>
      </li>`;
    // insertAdjacentHTML metodu belirli bir öğeyi Html kısmına sıratlı şekilde eklemek için kullanılır.Bu metod hangi yapının ardında bir  eleman eklenecekse bunu yazmamızı sonrasında ise eklenecek elemanın içeriğini belirltmemizi ister.
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}


wrapper.addEventListener("click",(e)=>{
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }


  else if(e.target.classList.contains("bx-trash")){
    const noteId = parseInt(e.target.closest(".note").dateset.id,10);
    deleteNote(noteId);
  }

  else if (e.target.classList.contains("bx-edit")) {
    // Düzenleme işlemi yapılacak kapsam elemana eriş
    const noteElement = e.target.closest(".note");
    const noteId = parseInt(noteElement.dataset.id, 10);
    // title ve description değerlerine eriş
    const title = noteElement.querySelector(".details p").innerText;
    const description = noteElement.querySelector(".details span").innerText;

    updateNote(noteId, title, description);
  }



});





document.addEventListener("DOMContentLoaded", () => showNotes());



  