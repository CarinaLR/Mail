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
    //Once the email has been sent, load sent mailbox, return flase to prevent reload.
    load_mailbox("sent");
    return false;
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
  const email_id = contents.id;
  const archived = contents.archived;
  console.log("contents ->", contents);

  //Create elements holding the information from each email in inbox
  const emailInfoFrom = document.createElement("div");
  emailInfoFrom.innerHTML = `<span className="infoFrom">${sender}</span>`;
  const emailInfoSubject = document.createElement("div");
  emailInfoSubject.innerHTML = `<span className="infoSubject">${subject}</span>`;
  const emailInfoTime = document.createElement("div");
  emailInfoTime.innerHTML = `<span className="infoTime">${time}</span>`;

  //Create a nested "div" to have 2 elements instead of 3 in the parent "div"
  const nestedDiv = document.createElement("div");
  nestedDiv.className = "nestedDiv";
  nestedDiv.appendChild(emailInfoFrom);
  nestedDiv.appendChild(emailInfoSubject);

  //Create parent 'div' and append children elements
  const emailInInbox = document.createElement("div");
  emailInInbox.className = "emailInbox";
  //Add event listener to each "div"
  emailInInbox.addEventListener("click", function () {
    //Get request by id.
    fetch(`/emails/${email_id}`)
      .then((response) => response.json())
      .then((email) => {
        // Print emails
        console.log("email ->", email);
        load_viewEmail(email);
      });
    if (read === false) {
      //Put request to update email.
      fetch(`/emails/${email_id}`, {
        method: "PUT",
        body: JSON.stringify({
          read: true,
        }),
      });
    }
  });
  //If statements to change background color of "div"
  if (read === false) {
    emailInInbox.style.backgroundColor = "white";
  } else {
    emailInInbox.style.backgroundColor = "lightGrey";
  }
  emailInInbox.appendChild(nestedDiv);
  emailInInbox.appendChild(emailInfoTime);

  // Add post to DOM
  document.querySelector("#emails-view").append(emailInInbox);
}

// Load sent emails
function loadSent() {
  fetch("/emails/sent")
    .then((response) => response.json())
    .then((emails) => {
      // Print emails
      console.log(emails);

      emails.forEach(add_emailsSent);
    });
}

// Add a sent email to the corresponding mailbox with given contents to DOM
function add_emailsSent(contents) {
  //Set variables to pass as text
  const recipients = contents.recipients;
  const subject = contents.subject;
  const time = contents.timestamp;

  //Create elements holding the information from each email in inbox
  const emailInfoTo = document.createElement("div");
  emailInfoTo.innerHTML = `<span className="infoFrom">${recipients}</span>`;
  const emailInfoSubject = document.createElement("div");
  emailInfoSubject.innerHTML = `<span className="infoSubject">${subject}</span>`;
  const emailInfoTime = document.createElement("div");
  emailInfoTime.innerHTML = `<span className="infoTime">${time}</span>`;

  //Create a nested "div" to have 2 elements instead of 3 in the parent "div"
  const nestedDiv = document.createElement("div");
  nestedDiv.className = "nestedDivSent";
  nestedDiv.appendChild(emailInfoTo);
  nestedDiv.appendChild(emailInfoSubject);

  //Create parent 'div' and append children elements
  const emailInSent = document.createElement("div");
  emailInSent.className = "emailInbox";
  emailInSent.appendChild(nestedDiv);
  emailInSent.appendChild(emailInfoTime);

  // Add post to DOM
  document.querySelector("#emails-view").append(emailInSent);
}

// Load archive emails
function loadArchive() {
  fetch("/emails/archive")
    .then((response) => response.json())
    .then((emails) => {
      // Print emails
      console.log("archived e ->", emails);

      emails.forEach(add_emailsArchive);
    });
}

// Add a new email to the corresponding mailbox with given contents to DOM
function add_emailsArchive(contents) {
  //Set variables to pass as text
  const sender =
    contents.sender.charAt(0).toUpperCase() +
    contents.sender.substr(1, contents.sender.lastIndexOf("@") - 1);
  const subject = contents.subject;
  const time = contents.timestamp;
  const archived = contents.archived;
  const email_id = contents.id;

  //Create elements holding the information from each email in inbox
  const emailInfoFrom = document.createElement("div");
  emailInfoFrom.innerHTML = `<span className="infoFrom">${sender}</span>`;
  const emailInfoSubject = document.createElement("div");
  emailInfoSubject.innerHTML = `<span className="infoSubject">${subject}</span>`;
  const emailInfoTime = document.createElement("div");
  emailInfoTime.innerHTML = `<span className="infoTime">${time}</span>`;

  //Create a nested "div" to have 2 elements instead of 3 in the parent "div"
  const nestedDiv = document.createElement("div");
  nestedDiv.className = "nestedDiv";
  nestedDiv.appendChild(emailInfoFrom);
  nestedDiv.appendChild(emailInfoSubject);

  //Create parent 'div' and append children elements
  const emailInArchive = document.createElement("div");
  emailInArchive.className = "emailInbox";
  emailInArchive.appendChild(nestedDiv);
  emailInArchive.appendChild(emailInfoTime);

  // Add post to DOM
  document.querySelector("#emails-view").append(emailInArchive);
}

function load_viewEmail(email) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  //Set variables to pass as text
  const sender = email.sender;
  const recipients = email.recipients;
  const subject = email.subject;
  const time = email.timestamp;
  const body = email.body;
  const email_id = email.id;
  const archived = email.archived;
  var text = document.querySelector("#compose-body").value;
  text = text.replace(/\r?\n/g, "<br />");
  console.log("archived ->", archived);
  // Show the selected email block
  document.querySelector("#emails-view").innerHTML = `<span></span>`;

  //Create elements holding the information from the selected email
  const emailBlockUpFrom = document.createElement("div");
  emailBlockUpFrom.innerHTML = `<span className="info">From: ${sender}</span>`;
  const emailBlockUpTo = document.createElement("div");
  emailBlockUpTo.innerHTML = `<span className="info">To: ${recipients}</span>`;
  const emailBlockUpSubject = document.createElement("div");
  emailBlockUpSubject.innerHTML = `<span className="info">Subject: ${subject}</span>`;
  const emailBlockUpTime = document.createElement("div");
  emailBlockUpTime.innerHTML = `<span className="info">Timestamp: ${time}</span>`;
  const lineBreak = document.createElement("hr");
  const emailBlockDownBody = document.createElement("div");
  emailBlockDownBody.innerHTML = `<span className="content">${body}</span>`;
  const replyButton = document.createElement("button");
  replyButton.className = "btn btn-sm btn-outline-primary";
  replyButton.innerHTML = "Reply";
  //Add an event to the reply button to allow user to reply to the sender.
  replyButton.addEventListener("click", function () {
    // Show compose view and hide other views
    document.querySelector("#emails-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "block";

    // Pre-fill composition fields
    document.querySelector("#compose-recipients").value = sender;
    document.querySelector("#compose-subject").value = `Re: ${subject}`;
    document.querySelector(
      "#compose-body"
    ).value = `On ${time} ${sender} wrote:\r\n ${body} \n --------------\n`;
  });
  const archivedButton = document.createElement("button");
  archivedButton.className = "btn btn-sm btn-outline-primary";
  archivedButton.innerHTML = "Archive";
  //Add an event to the archive button to redirect the user to Archive page.
  archivedButton.addEventListener("click", function () {
    if (archived === false) {
      //Put request to update email.
      fetch(`/emails/${email_id}`, {
        method: "PUT",
        body: JSON.stringify({
          archived: true,
        }),
      });
      load_mailbox("inbox");
    }
  });
  const unArchivedButton = document.createElement("button");
  unArchivedButton.className = "btn btn-sm btn-outline-primary";
  unArchivedButton.innerHTML = "Unarchive";
  //Add an event to the unArchive button to redirect the user to Inbox page.
  unArchivedButton.addEventListener("click", function () {
    load_mailbox("inbox");
  });

  //Create parent 'div' and append children elements
  const emailBlock = document.createElement("div");
  emailBlock.className = "emailBlock";
  emailBlock.appendChild(emailBlockUpFrom);
  emailBlock.appendChild(emailBlockUpTo);
  emailBlock.appendChild(emailBlockUpSubject);
  emailBlock.appendChild(emailBlockUpTime);
  emailBlock.appendChild(replyButton);
  //If statement to determine if an email was archived or not, to show appropiate button
  if (archived === false) {
    emailBlock.appendChild(archivedButton);
  } else {
    emailBlock.appendChild(unArchivedButton);
  }
  emailBlock.appendChild(lineBreak);
  emailBlock.appendChild(emailBlockDownBody);

  // Add element to DOM
  document.querySelector("#emails-view").append(emailBlock);
}
