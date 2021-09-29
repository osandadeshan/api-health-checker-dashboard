let serviceCurrentStatus = {};
let services = [];
const pollingInterval = 30;
let pollingIntervalId = null;

// Read config.json and create health tiles
const readConfig = () => {
    fetch("/config/default")
        .then(async (response) => {
            services = await response.json();
            generateServiceTiles("default");
            pollingIntervalId = setInterval(
                generateServiceTiles,
                pollingInterval * 1000
            );
        })
        .catch((e) => {
            console.error(e);
            window.alert(
                "Failed to retrieve backend-service data. Please check './config/config.json' file."
            );
        });
};

readConfig();

const generateServiceTiles = () => {
    const env = window["selectedEnv"];
    const servicesCount = services.length;
    let loadedServicesCount = 0;

    document.getElementById("envDropdown").disabled = true;
    // Looping through the api endpoints and get the status
    services.forEach((service) => {
        fetch("/health/" + env + "/" + service.id, {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        })
            .then((res) => {
                if (
                    !serviceCurrentStatus[service.id] ||
                    serviceCurrentStatus[service.id] !== res.status
                ) {
                    appendElements(service, res.status);
                    serviceCurrentStatus[service.id] = res.status;
                }
            })
            .finally(() => {
                setTimeout(() => {
                    loadedServicesCount++;
                    if (servicesCount === loadedServicesCount) {
                        document.getElementById("envDropdown").disabled = false;
                    }
                }, 800);
            });
    });
};

const setSelectedEnvironment = (env) => {
    setTimeout(() => {
        console.log("Waiting for selected environment");
    }, 1000);
    fetch("/config/" + env)
        .then(async (response) => {
            services = await response.json();
            document.getElementById("health-boxes").style.display = "flex";
            resetAllTiles();
            generateServiceTiles(env);
        })
        .catch((e) => {
            document.getElementById("health-boxes").style.display = "none";
            console.error(e);
            setTimeout(() => {
                window.alert(
                    `Failed to retrieve backend-service data. Please check './config/${env}-config.json' file.`
                );
            }, 100);
        });
};

function appendElements(
    {id, name, description, environment, url, contact},
    statusCode
) {
    const container = document.getElementById("health-boxes");
    const elementId = `component_${id}`;
    const currentElement = document.getElementById(elementId);

    const chipStyle =
        statusCode !== 200
            ? "background-color:#ef5c5c;"
            : "background-color:#66bb6a;";
    const borderStyle =
        statusCode !== 200
            ? "box-shadow: rgba(255, 0, 0, 0.9) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px; cursor:pointer;"
            : "box-shadow: rgba(127,255,0, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px; cursor:pointer;";
    const chipLabel = statusCode !== 200 ? "Not Available" : "Available";
    const env = environment.toUpperCase();

    if (currentElement) {
        document.getElementById(`chip_${elementId}`).style = chipStyle;
        document.getElementById(
            `chip_label_${elementId}`
        ).innerHTML = `${chipLabel}`;
        document.getElementById(
            `response_code_${elementId}`
        ).innerHTML = `<b>Response code: ${statusCode}</b>`;
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

        // Health Tile
        container.appendChild(el).innerHTML = `
      <div class="icon-box" style="${borderStyle}" data-toggle="modal" data-target="#modal_${elementId}">
            <div class="d-flex">
              <div class="icon" id="icon_${elementId}">
              <i class="ri-server-fill"></i>
            </div>
            <div class="chip" id="chip_${elementId}" style="${chipStyle}">
              <label id="chip_label_${elementId}">${chipLabel}</label>
            </div>
          </div>
          <h4 class="title"><a id="title_${elementId}">${name}</a></h4>
          <p class="description" id="response_code_${elementId}"><b>Response Code: ${statusCode}</b></p>
          <p class="description" id="description_${elementId}">${description}</p>
      </div>
      `;

        // Modal
        const p = document.createElement("div");
        p.innerHTML = `
      <div class="modal fade" id="modal_${elementId}" tabindex="-1" role="dialog" aria-labelledby="modal_${elementId}" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document" style="border-radius:100px!important;">
        <div class="modal-content">
          <div class="modal-header" style="background-color:#f2f2f2;">
            <h5 class="modal-title" id="exampleModalLabel">${name} Details</h5>
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
                  <td>Health URL</td>
                  <td style="overflow-wrap:break-word; word-wrap:break-word; word-break:break-all;"><a href="${url}" target="_blank">${url}</a></td>
              </tr>
              <tr>
                  <td>Environment</td>
                  <td style="overflow-wrap:break-word; word-wrap:break-word; word-break:break-all;">${env}</td>
              </tr>
              <tr>
                  <td>Contact Person/Team</td>
                  <td style="overflow-wrap:break-word; word-wrap:break-word; word-break:break-all;"><a href="mailto:${contact}">${contact}</a></td>
              </tr>
          </tbody>
      </table>
          </div>
          <div class="modal-footer" style="background-color:#f2f2f2;">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
      `;
        document.body.insertBefore(p, document.body.firstChild);
    }
}

function resetAllTiles() {
    serviceCurrentStatus = {};
    const tiles = document.getElementsByClassName(
        "col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0 "
    );
    Array.from(tiles).forEach((tile) => tile.remove());
}
