(() => {
  const container = document.getElementById("health-boxes");

  // Project components' name, description and id object array
  const services = [
    {
      name: "Mock Server",
      description: "This service will be using for all the mock server functions.",
      id: "mockServer"
    },
    {
      name: "User Management",
      description: "This service will be using to view, create, edit, and delete a user.",
      id: "user"
    },
    {
      name: "Careers Management",
      description: "This service will be using for all the career management functions.",
      id: "career"
    },
    {
      name: "Document Management",
      description: "This service will be using for all the document management functions.",
      id: "document"
    },
    {
      name: "Barcode Management",
      description: "This service will be using for all the barcode management functions.",
      id: "barcode"
    }
  ];

  // Looping through the api endpoints and get the status
  services.forEach((service) => {
    fetch("/" + service.id, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }).then((res) => {
      appendElements(service.name, service.description, res.status);
    });
  });

  function appendElements(name, description, status) {
    const el = document.createElement("div");
    el.classList.add(
      "col-md-6",
      "col-lg-3",
      "d-flex",
      "align-items-stretch",
      "mb-5",
      "mb-lg-0"
    );
    el.setAttribute("data-aos", "zoom-in");
    el.setAttribute("data-aos-delay", "zoom-in200");

    container.appendChild(el).innerHTML = `
    <div class="icon-box" style="margin-bottom:15px; ${
      status !== 200 ? "background-color:#ef5c5c;" : ""
    }">
        <div class="icon" style="${status !== 200 ? "color:#fff;" : "color:#2487ce;"}"><i class="ri-stack-line"></i></div>
        <h4 class="title"><a href="" style="${status !== 200 ? "color:#fff;" : "color:#124265;"}">${name}</a></h4>
        <p class="description" style="${status !== 200 ? "color:#fff;" : "color:#124265;"}"><b>Response code: ${status}</b></p>
        <p class="description" style="${status !== 200 ? "color:#fff;" : "color:#124265;"}">${description}</p>
    </div>
    `;
  }
})();