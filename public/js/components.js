const serviceCurrentStatus = {};
let services = [];
const pollingInterval = 30;

(() => {
  fetch("/config", ).then(async (response) => {
    services = await response.json();
    generateServiceTiles();
    setInterval(generateServiceTiles, pollingInterval * 1000);
  }).catch((e) => {
    console.error(e);
    window.alert("Failed to retrieve backend-service data. Please check './config/config.json' file.");
  });
})();

const generateServiceTiles = () => {
  const container = document.getElementById("health-boxes");

  // Looping through the api endpoints and get the status
  services.forEach((service) => {
    fetch("/" + service.id, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }).then((res) => {
      if (!serviceCurrentStatus[service.id] || serviceCurrentStatus[service.id] !== res.status) {
        appendElements(service, res.status);
        serviceCurrentStatus[service.id] = res.status;
      }
    });
  });

  function appendElements({id, name, description}, status) {
    const elementId = `component_${id}`;
    const currentElement = document.getElementById(elementId);

    const chipStyle = status !== 200 ? "background-color:#ef5c5c;" : "background-color:#66bb6a;";
    const chipLabel = status !== 200 ? "Not Available" : "Available";

    if (currentElement) {
      document.getElementById(`chip_${elementId}`).style = chipStyle;
      document.getElementById(`chip_label_${elementId}`).innerHTML = `${chipLabel}`;
      document.getElementById(`response_code_${elementId}`).innerHTML = `<b>Response code: ${status}</b>`;
    } else {
      const el = document.createElement("div");
      el.setAttribute("id", elementId);
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
      <div class="icon-box">
            <div class="d-flex">
              <div class="icon" id="icon_${elementId}">
              <i class="ri-stack-line"></i>
            </div>
            <div class="chip" id="chip_${elementId}" style="${chipStyle}">
              <label id="chip_label_${elementId}">${chipLabel}</label>
            </div>
          </div>
          <h4 class="title"><a href="#" id="title_${elementId}">${name}</a></h4>
          <p class="description" id="response_code_${elementId}"><b>Response code: ${status}</b></p>
          <p class="description" id="description_${elementId}">${description}</p>
      </div>
      `;
    }
  }
}