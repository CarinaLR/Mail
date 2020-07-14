document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
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

  if (mailbox === "inbox") {
    loadInbox();
  }
  if (mailbox === "sent") {
    loadSent();
  }
  if (mailbox === "archive") {
    loadArchive();
  }
}

// Load inbox emails
function loadInbox() {
  fetch("/emails/inbox")
    .then((response) => response.json())
    .then((emails) => {
      // Print emails
      console.log("emails ->", emails);

      // ... do something else with emails ...
      emails.forEach(add_emailsInbox);
    });
}

// Add a new email to the corresponding mailbox with given contents to DOM
function add_emailsInbox(contents) {
  //Set variables to pass as text
  const sender =
    contents.sender.charAt(0).toUpperCase() +
    contents.sender.substr(1, contents.sender.lastIndexOf("@") - 1);
  const subject = contents.subject;
  const time = contents.timestamp;
  const read = contents.read;

  //Create td for each email
  const emailTd = document.createElement("td");
  emailTd.className = "tdEmails";
  emailTd.innerHTML = `From: ${sender} Subject:  ${subject} ${time}`;

  // Add post to DOM
  document.querySelector("#emails-view").append(emailTd);

  if (read !== true) {
    document.querySelector(".tdEmails").style.backgroundColor = "lightGrey";
  } else {
    document.querySelector(".tdEmails").style.backgroundColor = "lavenderBlush";
  }
}

// Load sent emails
function loadSent() {
  fetch("/emails/sent")
    .then((response) => response.json())
    .then((emails) => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      emails.forEach(add_emailsSent);
    });
}

// Add a sent email to the corresponding mailbox with given contents to DOM
function add_emailsSent(contents) {
  //Set variables to pass as text
  const recipients = contents.recipients;
  const subject = contents.subject;
  const time = contents.timestamp;

  //Create td for each email
  const emailTd = document.createElement("td");
  emailTd.className = "tdEmails";
  emailTd.innerHTML = `To: ${recipients} Subject:  ${subject} ${time}`;

  // Add post to DOM
  document.querySelector("#emails-view").append(emailTd);
}

// Load archive emails
function loadArchive() {
  fetch("/emails/archive")
    .then((response) => response.json())
    .then((emails) => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      emails.forEach(add_emailsArchive);
    });
}

// Add a new email to the corresponding mailbox with given contents to DOM
function add_emailsArchive(contents) {
  //Set variables to pass as text
  const recipients = contents.recipients;
  const subject = contents.subject;
  const time = contents.timestamp;

  //Create td for each email
  const emailTd = document.createElement("td");
  emailTd.className = "tdEmails";
  emailTd.innerHTML = `To: ${recipients} Subject:  ${subject} ${time}`;

  // Add post to DOM
  document.querySelector("#emails-view").append(emailTd);
}
