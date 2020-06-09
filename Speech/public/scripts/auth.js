
//signing up
const signupForm = $("#signup-form")[0];
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $("#signup-email")[0].value;
  const password = $("#signup-password")[0].value;
  const name = $("#signup-name")[0].value;

  auth.createUserWithEmailAndPassword(email, password).then(cred => {

    db.collection("users").doc(cred.user.uid).set({
      name: name
    })

    // db.collection("users").doc(cred.user.uid).collection("practices").doc("Practice 0").set({
    //   feedback: "View Your Practices Here"
    // });

    const modal = $("#modal-signup")[0];
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });

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
  });
});


const inNavs = document.querySelectorAll(".logged-in");
const outNavs = document.querySelectorAll(".logged-out");

auth.onAuthStateChanged(user => {
  if(user){



    //GRABS ALL DATA UNDERNEATH YOUR NAME
    db.collection("users").doc(user.uid).collection("Practices").onSnapshot(qSnap => {
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
