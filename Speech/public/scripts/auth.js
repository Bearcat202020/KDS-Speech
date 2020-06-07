
const auth = firebase.auth()

const signupForm = $("#signup-form")[0];
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $("#signup-email")[0].value;
  const password = $("#signup-password")[0].value;

  console.log(email);
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    const modal = $("#modal-signup")[0];
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });

});
