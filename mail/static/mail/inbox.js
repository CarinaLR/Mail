document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"), loadSent());
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  //Post request for input.
  document.querySelector("#compose-form").onsubmit = () => {
    fetch("/emails", {
      method: "POST",
      body: JSON.stringify({
        recipients: document.querySelector("#compose-recipients").value,
        subject: document.querySelector("#compose-subject").value,
        body: document.querySelector("#compose-body").value,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // Print result
        console.log(result);
      });
    // return false;
    load_mailbox("sent");
  };

  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;
}

// Load sent emails
function loadSent() {
  fetch("/emails/inbox")
    .then((response) => response.json())
    .then((emails) => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      emails.forEach(add_sent);
    });
}

// Add a new sent email to the sent inbox with given contents to DOM
function add_sent(contents) {
  // // Create new post
  // const emailSent = document.createElement("div");
  // emailSent.className = "post";
  // //Using substr() build js function and last indexOf() eliminates everything after the "@" character.
  // emailSent.innerHTML = `From: ${
  //   contents.sender.charAt(0).toUpperCase() +
  //   contents.sender.substr(1, contents.sender.lastIndexOf("@") - 1)
  // }        Subject:  ${contents.subject}        ${contents.timestamp}`;

  //Set variables to pass as text
  const sender =
    contents.sender.charAt(0).toUpperCase() +
    contents.sender.substr(1, contents.sender.lastIndexOf("@") - 1);
  const subject = contents.subject;
  const time = contents.timestamp;
  const space = "   ";
  //Create td for each email
  const emailTd = document.createElement("td");
  emailTd.className = "tdEmails";
  emailTd.innerHTML = ` From: ${space}${sender}${space} Subject:${space} ${subject}${space} ${time}${space}`;

  // Add post to DOM
  document.querySelector("#emails-view").append(emailTd);
}
