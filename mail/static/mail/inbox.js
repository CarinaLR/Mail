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

  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  document.querySelector("compose-form").onsubmit = () => {
    postEmail();
  };

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

function loadInbox() {
  fetch("/emails/inbox")
    .then((response) => response.json())
    .then((emails) => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      emails.forEach(add_email);
    });
}

// Add a new post with given contents to DOM
function add_email(contents) {
  var recipients = document.querySelector("#compose-recipients").value;
  var subject = document.querySelector("#compose-subject").value;
  var body = document.querySelector("#compose-body").value;

  contents = {
    recipients: recipients,
    subject: subject,
    body: body,
  };
  // Create new email
  const email = document.createElement("div");
  email.className = "post";
  email.innerHTML = contents;

  // Add post to DOM
  document.querySelector("#posts").append(email);
}

function loadSent() {
  fetch("/emails/sent")
    .then((response) => response.json())
    .then((emails) => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
    });
}

function loadArchive() {
  fetch("/emails/archive")
    .then((response) => response.json())
    .then((emails) => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
    });
}

function postEmail() {
  var recipients = document.querySelector("#compose-recipients").value;
  var subject = document.querySelector("#compose-subject").value;
  var body = document.querySelector("#compose-body").value;

  fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      // Print result
      console.log(result);
    });
}
