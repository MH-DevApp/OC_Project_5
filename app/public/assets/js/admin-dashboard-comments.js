import {addSpinnerElement, removeSpinnerElement} from "./utils/spinner.js";
import {addNotification} from "./utils/notification.js";
import {filterEntities} from "./utils/filter.js";
import {entities} from "./admin-dashboard.js";

export const constructTableComments = (comments, showModal) => {
    const tBody = document.querySelector("table tbody");
    tBody.innerHTML = "";
    const spanCountEntities = document.querySelector("span.count-entities");
    spanCountEntities.textContent = comments.length.toString();

    if (comments.length) {
        let countElement = 0;
        comments.forEach((comment) => {
            countElement++;

            const tr = document.createElement("tr");
            tr.addEventListener("click", showModal);
            tr.dataset.entityId = comment["id"];
            tr.className = (comment["isValid"] === 0 && comment["validBy"] !== null && comment["validAt"] !== null) ?
                "table-danger" :
                    (comment["isValid"] === 0 && comment["validBy"] === null && comment["validAt"] === null) ?
                    "table-warning" :
                "";

            const thNumElement = document.createElement("th");
            thNumElement.textContent = countElement.toString();
            thNumElement.scope = "row";

            const tdAuthor = document.createElement("td");
            tdAuthor.dataset.col = "col-author";
            tdAuthor.textContent = comment["author"];

            const tdContent = document.createElement("td");
            tdContent.dataset.col = "col-content";
            tdContent.textContent = comment["content"];

            const tdIsValid = document.createElement("td");
            tdIsValid.dataset.col = "col-isValid";
            tdIsValid.textContent = (comment["isValid"] === 0 && comment["validBy"] !== null && comment["validAt"] !== null) ?
                "Refusé" :
                (comment["isValid"] === 0 && comment["validBy"] === null && comment["validAt"] === null) ?
                    "En attente" :
                    "Validé"
            tdIsValid.addEventListener("DOMSubtreeModified", (event) => {
                switch (event.currentTarget.textContent) {
                    case "En attente":
                        tr.className = "table-warning";
                        break;
                    case "Validé":
                        tr.className = "";
                        break;
                    case "Refusé":
                        tr.className = "table-danger";
                        break;
                }
            });

            const tdValidAt = document.createElement("td");
            tdValidAt.dataset.col = "col-validAt";
            tdValidAt.className = "d-none d-sm-table-cell";
            tdValidAt.textContent = comment["validAt"] !== null ?
                new Date(comment["validAt"]+" UTC").toLocaleDateString() :
                "-";

            const tdValidBy = document.createElement("td");
            tdValidBy.dataset.col = "col-validBy";
            tdValidBy.textContent = comment["validBy"] !== null ?
                comment["validBy"] :
                "-";

            const tdTitlePost = document.createElement("td");
            tdTitlePost.dataset.col = "col-titlePost";
            tdTitlePost.className = "d-none d-lg-table-cell";
            tdTitlePost.textContent = comment["titlePost"];

            const tdCreatedAt = document.createElement("td");
            tdCreatedAt.dataset.col = "col-createdAt";
            tdCreatedAt.className = "d-none d-lg-table-cell";
            tdCreatedAt.textContent = comment["createdAt"] !== null ?
                new Date(comment["createdAt"]+" UTC").toLocaleDateString() :
                "-";

            const tdUpdatedAt = document.createElement("td");
            tdUpdatedAt.dataset.col = "col-updatedAt";
            tdUpdatedAt.className = "d-none d-lg-table-cell";
            tdUpdatedAt.textContent = comment["updatedAt"] !== null ?
                new Date(comment["updatedAt"]+" UTC").toLocaleDateString() :
                "-";

            tr.append(
                thNumElement,
                tdAuthor,
                tdContent,
                tdIsValid,
                tdValidAt,
                tdValidBy,
                tdTitlePost,
                tdCreatedAt,
                tdUpdatedAt
            );

            tBody.append(tr);
        });
    } else {
        tBody.innerHTML = "<tr><td colspan='9' class='text-center'>Aucun commentaire n'a été trouvé.</td></tr>";
    }
};

export const initComments = (modal) => {
    const btnActions = modal.querySelectorAll("div.modal-footer button[data-action]");
    const isValidModalElement = modal.querySelector("[data-col=col-isValid]");
    const validAtModalElement = modal.querySelector("[data-col=col-validAt]");
    const validByModalElement = modal.querySelector("[data-col=col-validBy]");
    const updatedAtModalElement = modal.querySelector("[data-col=col-updatedAt]");

    isValidModalElement.addEventListener("DOMSubtreeModified", () => {
        const btnUpdateIsValid = modal.querySelector("div.modal-footer button[data-action=update-isValid]");

        if (isValidModalElement.textContent === "En attente") {
            isValidModalElement.className = "badge badge-pill bg-warning text-dark p-2";
            btnUpdateIsValid.textContent = "Valider le commentaire";
            btnUpdateIsValid.className = "btn btn-sm btn-success";
        } else if (isValidModalElement.textContent === "Refusé") {
            isValidModalElement.className = "badge badge-pill bg-danger text-light p-2";
            btnUpdateIsValid.textContent = "Valider le commentaire";
            btnUpdateIsValid.className = "btn btn-sm btn-success";
        } else {
            isValidModalElement.className = "badge badge-pill bg-dark text-light p-2";
            btnUpdateIsValid.textContent = "Refuser le commentaire";
            btnUpdateIsValid.className = "btn btn-sm btn-danger";
        }
    });

    btnActions.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            const id = modal.dataset.entityId;
            const url = event.currentTarget.dataset.apiUrl.replace("__ID__", id);
            addSpinnerElement(btn);

            fetch(url).then((response) => {
                return response.json();
            }).then((response) => {
                addNotification(response);
                if (response.success && response.action === "update-isValid") {
                    entities.map((entity) => {
                        if (entity["id"] === id) {
                            entity["isValid"] = entity["isValid"] === 1 ? 0 : 1;
                            entity["validBy"] = response["updated-details"]["validBy"];
                            entity["validAt"] = response["updated-details"]["validAt"];
                            entity["updatedAt"] = response["updated-details"]["updatedAt"];
                        }
                        return entity;
                    });
                    isValidModalElement.textContent = isValidModalElement.textContent === "Validé" ? "Refusé" : "Validé";
                    validAtModalElement.textContent = new Date().toLocaleDateString();
                    validByModalElement.textContent = response["validBy"];
                    updatedAtModalElement.textContent = new Date().toLocaleDateString();
                    filterEntities();
                }
            }).catch(() => {
                addNotification({
                    success: false,
                    message: "Une erreur s'est produite, veuillez réessayer plus tard."
                });
            }).finally(() => {
                removeSpinnerElement(btn);
            });
        });
    });
};