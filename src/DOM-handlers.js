import { createHTMLElement } from "./DOM-fns";
import emitter from "./emitter";

export function loginButtonHandler(e) {
    const modal = document.querySelector(".modal-container");

    modal.classList.add("login-form");
    
    modal.appendChild(
        createHTMLElement("h2", {
            textContent: "Log in request form"
        })
    );

    modal.appendChild(
        createHTMLElement("p", {
            textContent: "Please enter your username and password and click submit."
        })
    );

    modal.appendChild(
        createHTMLElement("p", {
            textContent: "IMPORTANT! - passwords and user content is not protected/encrypted.  However, all data remains ONLY on your device.  Please don't include any sensitive information anywhere in the app."
        })
    );

    const form = createHTMLElement("form", {
        method: "dialog"
    })
    
    form.appendChild(
        createHTMLElement("label", {
            htmlFor: "username-input",
            textContent: "Username"
        })
    );

    const usernameInput = createHTMLElement("input", {
        type: "text:",
        id: "username-input",
        required: true
    })
    form.appendChild(usernameInput);

    form.appendChild(
        createHTMLElement("label", {
            htmlFor: "password-input",
            textContent: "Password"
        })
    );

    const passwordInput = createHTMLElement("input", {
        type: "password",
        id: "password-input",
        required: true
    })
    form.appendChild(passwordInput);
    
    const submitButton = createHTMLElement("button", {
        type: "button",
        textContent: "Submit"
    })
    submitButton.addEventListener("click", (e) => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        modal.classList.remove("login-form");
        modal.close();
        modal.textContent = "";
        emitter.emit("request:logInUser", {
            username,
            password
        })
    })
    form.appendChild(submitButton);
    
    const resetButton = createHTMLElement("button", {
        type: "reset",
        textContent: "Reset"
    })
    form.appendChild(resetButton);
    
    const cancelButton = createHTMLElement("button", {
        type: "button",
        textContent: "Cancel"
    });
    cancelButton.addEventListener("click", (e) => {
        modal.close();
        modal.classList.remove("login-form");
        modal.textContent = "";
    })

    form.appendChild(cancelButton);
    
    modal.appendChild(form);

    modal.showModal();
}

export function registerButtonHandler(e) {
    const modal = document.querySelector(".modal-container");

    modal.classList.add("register-form");
    
    modal.appendChild(
        createHTMLElement("h2", {
            textContent: "Registration request form"
        })
    );

    modal.appendChild(
        createHTMLElement("p", {
            textContent: "Please enter your requested username and password and click submit."
        })
    );

    modal.appendChild(
        createHTMLElement("p", {
            textContent: "IMPORTANT! - passwords and user content is not protected/encrypted.  However, all data remains ONLY on your device.  Please don't include any sensitive information anywhere in the app."
        })
    );

    const form = createHTMLElement("form", {
        method: "dialog"
    })
    
    form.appendChild(
        createHTMLElement("label", {
            htmlFor: "username-input",
            textContent: "Username"
        })
    );

    const usernameInput = createHTMLElement("input", {
        type: "text:",
        id: "username-input",
        required: true
    })
    form.appendChild(usernameInput);

    form.appendChild(
        createHTMLElement("label", {
            htmlFor: "password-input",
            textContent: "Password"
        })
    );

    const passwordInput = createHTMLElement("input", {
        type: "password",
        id: "password-input",
        required: true
    })
    
    form.appendChild(passwordInput);
    
    const submitButton = createHTMLElement("button", {
        type: "button",
        textContent: "Submit"
    })
    submitButton.addEventListener("click", (e) => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        modal.classList.remove("register-form");
        modal.close();
        modal.textContent = "";
        emitter.emit("request:registerNewUser", {
            username,
            password
        })
    })
    form.appendChild(submitButton);
    
    const resetButton = createHTMLElement("button", {
        type: "reset",
        textContent: "Reset"
    })
    form.appendChild(resetButton);
    
    const cancelButton = createHTMLElement("button", {
        type: "button",
        textContent: "Cancel"
    });
    cancelButton.addEventListener("click", (e) => {
        modal.close();
        modal.classList.remove("register-form");
        modal.textContent = "";
    })

    form.appendChild(cancelButton);
    
    modal.appendChild(form);

    modal.showModal();
}

export function logoutButtonHandler(e) {
    userSessionClone = undefined;
    drawDefaultApp();
}

export function addProjectButtonHandler(e) {
    const projectsList = document.querySelector(".projects-list");
    const popup = projectsList.querySelector("form");
    popup.querySelector("input").value = "";
    popup.classList.toggle("not-displayed");
}
