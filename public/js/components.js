const serviceCurrentStatus = {};
let services = [];
const pollingInterval = 30;

// Read config.json and create health tiles
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
        appendElements(service, res);
        serviceCurrentStatus[service.id] = res.status;
      }
    });
  });

  function appendElements({id, name, description}, {status, url}) {
    const elementId = `component_${id}`;
    const currentElement = document.getElementById(elementId);

    const chipStyle = status !== 200 ? "background-color:#ef5c5c;" : "background-color:#66bb6a;";
    const chipLabel = status !== 200 ? "Not Available" : "Available";
    const modalStyle = status !== 200 ? "color:#ef5c5c;" : "color:#66bb6a;";

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

      // Health Tile
      container.appendChild(el).innerHTML = `
      <div class="icon-box" data-toggle="modal" data-target="#modal_${elementId}">
            <div class="d-flex">
              <div class="icon" id="icon_${elementId}">
              <i class="ri-stack-line"></i>
            </div>
            <div class="chip" id="chip_${elementId}" style="${chipStyle}">
              <label id="chip_label_${elementId}">${chipLabel}</label>
            </div>
          </div>
          <h4 class="title"><a href="#" id="title_${elementId}">${name}</a></h4>
          <p class="description" id="response_code_${elementId}"><b>Response Code: ${status}</b></p>
          <p class="description" id="description_${elementId}">${description}</p>
      </div>
      `;
      // Modal
      const p = document.createElement("div");
      p.innerHTML = `
      <div class="modal fade" id="modal_${elementId}" tabindex="-1" role="dialog" aria-labelledby="modal_${elementId}" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">${name} Health Info</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          <table>
          <thead>
          </thead>
          <tbody class="table table-borderless">
              <tr>
                  <td>URL</td>
                  <td><b style="${modalStyle}">${url}</b></td>
              </tr>
              <tr>
                  <td>Response Code</td>
                  <td><b style="${modalStyle}">${status}</b></td>
              </tr>
              <tr>
                  <td>Status</td>
                  <td><b style="${modalStyle}">${chipLabel}</b></td>
              </tr>
          </tbody>
      </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
      `;
      document.body.insertBefore(p, document.body.firstChild);
    }
  }
}