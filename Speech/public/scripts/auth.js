
const signupForm = $("#signup-form")[0];
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $("#signup-email")[0].value;
  const password = $("#signup-password")[0].value;
  const confirmPass = $("#confirm-password")[0].value;
  const name = $("#signup-name")[0].value;
  const emailEnding = email.substring(email.indexOf("@"));

  // if(emailEnding != "@kentdenver.org" & email != "judeb@seas.upenn.edu"){
  //   alert("Please use an email affiliated with Kent Denver.")
  // }
  // else if(password != confirmPass){
  //   alert("Make sure password is same as confirmed password.")
  // }
  // else{



    auth.createUserWithEmailAndPassword(email, password).then(cred => {


        const cStatus = $("#coach-check")[0].value
        var coach = false;
        if(cStatus=="Coach"){
          coach = true;
        }
        console.log(firebase.auth().currentUser.uid)
        db.collection("users").doc(cred.user.uid).set({
          name: name,
          coach: coach
        })



        const modal = $("#modal-signup")[0];
        M.Modal.getInstance(modal).close();
        signupForm.reset();
      })//.catch((err)=>{
	       //alert("Error signing up. Email most likely in use.")
    //  });
  //}
});


//sign in
const loginForm = $("#login-form")[0];
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = $("#login-email")[0].value;
  const password = $("#login-password")[0].value;

  auth.signInWithEmailAndPassword(email, password).then(cred => {
    console.log(cred)
    const modal = $("#modal-login")[0];
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });



})


//logging out
const logout = $("#logout")[0];
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(cred => {
    console.log("heyyyy")
  });
});


const inNavs = document.querySelectorAll(".logged-in");
const outNavs = document.querySelectorAll(".logged-out");

auth.onAuthStateChanged(user => {
  if(firebase.auth().currentUser != null){

    //GRABS ALL DATA UNDERNEATH YOUR NAME
    db.collection("users").doc(user.uid).collection("Practices").onSnapshot(qSnap => {
      if(user.uid != null){
        displayPractice(qSnap)
      }
    });

    //hides the parts of navbar you don't want to see
    inNavs.forEach(nav => nav.style.display =  "block");
    outNavs.forEach(nav => nav.style.display =  "none");

  }
  else{

    //tells the user to log in to see information
    displayPractice(null)
    //hides parts of navbar you don't want to See
    inNavs.forEach(nav => nav.style.display =  "none");
    outNavs.forEach(nav => nav.style.display =  "block");

  }

})

eventQuerying.addEventListener("change", (e) =>{

  if(firebase.auth().currentUser != null){

    //GRABS ALL DATA UNDERNEATH YOUR NAME
    db.collection("users").doc(firebase.auth().currentUser.uid).collection("Practices").onSnapshot(qSnap => {

      displayPractice(qSnap)
    });

    //hides the parts of navbar you don't want to see
    inNavs.forEach(nav => nav.style.display =  "block");
    outNavs.forEach(nav => nav.style.display =  "none");

  }
  else{

    //tells the user to log in to see information
    displayPractice(null)
    //hides parts of navbar you don't want to See
    inNavs.forEach(nav => nav.style.display =  "none");
    outNavs.forEach(nav => nav.style.display =  "block");

  }

})

//
// const myPractice = db.collection("users").doc(cred.user.uid).collection("practices");
// myPractice.get().then(snap => {
//
//   console.log(snap.docs)
// })
