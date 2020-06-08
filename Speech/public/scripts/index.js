
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);

});


const dropS = document.querySelector("#dropStudent");
const cGuide = $("#create-practice")[0];

cGuide.addEventListener('click', (e) => {
  e.preventDefault();

  db.collection("users").get().then(qSnap => {
    let html = "<option value='' disabled selected>Choose your option</option>"
    let i = 1;
    qSnap.forEach( doc =>  {
      const data = doc.data()
      const name = data.name;

      html += "<option value=\"" + String(i) + "\">" + name + "</option>"
      i += 1;

    });

    dropS.innerHTML = html

  });

})


const feedForm = $("#feedback-form")[0];
feedForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const feeds = $("#feed-area")[0].value;
  const name = dropS.options[dropS.selectedIndex].text;
  //queries for the name selected
  const user = db.collection("users").where("name", "==", name).get().then(function(querySnapshot) {
        querySnapshot.forEach(doc =>  {
          const user = firebase.auth().currentUser;

          db.collection("users").doc(user.uid).get().then(doc2 => {

            db.collection("users").doc(doc.id).collection("Practices").add({
              Feedback: feeds,
              Coach: doc2.data().name
            });

          })

        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });


    const modal = $("#modal-create")[0];
    M.Modal.getInstance(modal).close();
    feedForm.reset();

})
