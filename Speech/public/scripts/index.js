const auth = firebase.auth()
const db = firebase.firestore()

document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);

});


const dropS = document.querySelector("#dropStudent");
const dropE = document.querySelector("#dropEvent")
const eventQuerying = document.querySelector("#eventQuery")
const cGuide = $("#create-practice")[0];


cGuide.addEventListener('click', (e) => {
  e.preventDefault();

  db.collection("users").get().then(qSnap => {
    let html = "<option value='' disabled selected>Choose your option</option>"
    let i = 1;
    qSnap.forEach( doc =>  {


      const data = doc.data()
      const name = data.name;

      if(!data.coach){
        html += "<option value=\"" + String(i) + "\">" + name + "</option>"
        i += 1;
      }

    });

    dropS.innerHTML = html

  });

})


const feedForm = $("#feedback-form")[0];
feedForm.addEventListener('submit', (e) => {
  e.preventDefault();

  var feeds = $("#feed-area")[0].value;
  const name = dropS.options[dropS.selectedIndex].text;
  const speechEvent = dropE.options[dropE.selectedIndex].text;
  //queries for the name selected
  const user = db.collection("users").where("name", "==", name).get().then(function(querySnapshot) {
        querySnapshot.forEach(doc =>  {
          const user = firebase.auth().currentUser;

          db.collection("users").doc(user.uid).get().then(doc2 => {

            var dateInSecs = "" + (100000000000000 - Date.now());

            d = new Date(Date.now())
            strDate =  "" + (d.getMonth() + 1)  + "/" + d.getDate() + "/" + d.getFullYear()

            //MAKE IT SO FEEDS HAS A <br> OR SOMETHING THAT GETS PARSED OUT LATER
            feeds = feeds.replace('\n', "<br />");
            db.collection("users").doc(doc.id).collection("Practices").doc(dateInSecs).set({
              Feedback: feeds,
              Coach: doc2.data().name,
              Date: strDate,
              Event: speechEvent

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

const displayPractice = (data) => {
  let html = ""
  if(data != null){

  const eventSelector = eventQuerying.options[eventQuerying.selectedIndex].text;



    data.forEach( doc =>  {
      const practice = doc.data()
      const coach = practice.Coach;
      const feedback = practice.Feedback;
      const date = practice.Date;
      const sEvent = practice.Event;

      if(sEvent==eventSelector){
        html += "<li><div class='collapsible-header grey lighten-4'>Practice with: " + coach + " on " + date + "<i class='material-icons right-align' onclick='removePractice(" + doc.id + ")'>delete</i></div><div class='collapsible-body white'><span>" + feedback + "</span></div>"
      }
    });
    if(html == ""){
      html = "You have no practices in this event. Try selecting a different one to view your practices!"
    }

    //grabs name and puts it before html
    db.collection("users").doc(auth.currentUser.uid).get().then(function(doc){
      $(".practices").html("<h3>Welcome: " + doc.data().name + "! </h3><br>" + html)
    });


  }

  else{
    $(".practices").html("<li><div class='collapsible-header grey lighten-4'>Please log in or sign up to view your practices!</div></li>")
  }

}



const removePractice = (id) => {
  if (confirm('Are you sure you want to delete this practice?')) {
    db.collection("users").doc(auth.currentUser.uid).collection("Practices").doc(id.toString()).delete().then(function(){
      console.log('deleted succesfully')
    }).catch(function(error){
      console.log('problem deleting')
  });
  }
}
