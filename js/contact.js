const contactForm = document.getElementById("contact-form");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[\d\s()+-]{7,}$/;

const fields = {
  firstName: {
    element: document.getElementById("firstName"),
    validate(value) {
      return value.trim().length > 0;
    },
    message: "Please enter your first name.",
  },
  lastName: {
    element: document.getElementById("lastName"),
    validate(value) {
      return value.trim().length > 0;
    },
    message: "Please enter your last name.",
  },
  email: {
    element: document.getElementById("email"),
    validate(value) {
      return value.trim().length > 0 && emailPattern.test(value.trim());
    },
    message: "Please enter a valid email address.",
  },
  phone: {
    element: document.getElementById("phone"),
    validate(value) {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return true;
      }
      return phonePattern.test(trimmed);
    },
    message: "Please enter a valid phone number.",
  },
  message: {
    element: document.getElementById("message"),
    validate(value) {
      return value.trim().length >= 10;
    },
    message: "Please enter a message (at least 10 characters).",
  },
};

function setFieldValidity(fieldKey, isValid) {
  const field = fields[fieldKey];
  const feedback =
    field.element.parentElement.querySelector(".invalid-feedback");

  field.element.classList.toggle("is-invalid", !isValid);

  if (feedback) {
    feedback.textContent = field.message;
  }
}

function validateField(fieldKey) {
  const field = fields[fieldKey];
  const isValid = field.validate(field.element.value);
  setFieldValidity(fieldKey, isValid);
  return isValid;
}

function validateForm() {
  let isFormValid = true;
  let firstInvalidField = null;

  Object.keys(fields).forEach((fieldKey) => {
    const isValid = validateField(fieldKey);
    if (!isValid) {
      isFormValid = false;
      if (!firstInvalidField) {
        firstInvalidField = fields[fieldKey].element;
      }
    }
  });

  if (firstInvalidField) {
    firstInvalidField.focus();
  }

  return isFormValid;
}

function clearValidationOnInput() {
  Object.keys(fields).forEach((fieldKey) => {
    fields[fieldKey].element.addEventListener("input", () => {
      if (fields[fieldKey].element.classList.contains("is-invalid")) {
        validateField(fieldKey);
      }
    });
  });
}

function buildMailtoLink() {
  const firstName = fields.firstName.element.value.trim();
  const lastName = fields.lastName.element.value.trim();
  const email = fields.email.element.value.trim();
  const phone = fields.phone.element.value.trim() || "Not provided";
  const message = fields.message.element.value.trim();

  const subject = encodeURIComponent(`Contact from ${firstName} ${lastName}`);
  const body = encodeURIComponent(
    `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
  );

  return `mailto:yadavlaryan@gmail.com?subject=${subject}&body=${body}`;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  window.location.href = buildMailtoLink();
});

clearValidationOnInput();

const contactToast = document.getElementById("contact-toast");
let toastTimeoutId = null;

function showContactToast(message) {
  if (!contactToast) {
    return;
  }

  contactToast.textContent = message;
  contactToast.hidden = false;
  contactToast.classList.add("show");

  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  toastTimeoutId = setTimeout(() => {
    contactToast.classList.remove("show");
    setTimeout(() => {
      contactToast.hidden = true;
    }, 200);
  }, 2200);
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

document.querySelectorAll(".contact-copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const valueToCopy = button.dataset.copyValue?.trim();

    if (!valueToCopy) {
      showContactToast("Nothing to copy.");
      return;
    }

    try {
      await copyToClipboard(valueToCopy);
      showContactToast("Discord ID copied");
    } catch {
      showContactToast("Could not copy ID.");
    }
  });
});
