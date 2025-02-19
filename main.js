class CustomValidationButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Crear el botón
        this.button = document.createElement("button");
        this.button.innerText = "Validar Datos";
        this.button.addEventListener("click", () => this.validateData());

        this.shadowRoot.appendChild(this.button);
    }

    validateData() {
        Application.showBusyIndicator();

        const textArea = Application.getWidget(this.getAttribute("messageArea"));
        textArea.setValue("");

        const table = Application.getWidget(this.getAttribute("tableAlias"));
        const rd = table.getDataSource().getResultSet();

        let errores = 0;
        
        for (let i = 0; i < rd.length - 1; i++) {
            if (
                rd[i][Alias.MeasureDimension].description === "Libre Disposición" &&
                rd[i + 1][Alias.MeasureDimension].description === "Techo Gasto" &&
                Number.parseFloat(rd[i][Alias.MeasureDimension].rawValue) >
                Number.parseFloat(rd[i + 1][Alias.MeasureDimension].rawValue)
            ) {
                errores++;
                textArea.setValue(
                    textArea.getValue() +
                    "\n" +
                    "Ecónomica y Funcional donde se ha excedido el techo de gasto: " +
                    rd[i]["economica"].id +
                    " " +
                    rd[i]["funcional"].id
                );
            }
        }

        const successButton = Application.getWidget(this.getAttribute("buttonSuccess"));
        const errorButton = Application.getWidget(this.getAttribute("buttonError"));
        const popup = Application.getWidget(this.getAttribute("popup"));

        if (errores === 0) {
            errorButton.setVisible(false);
            successButton.setVisible(true);
            Application.showMessage(ApplicationMessageType.Success, "No se han encontrado errores");
        } else {
            successButton.setVisible(false);
            errorButton.setVisible(true);
            popup.open();
        }

        Application.hideBusyIndicator();
    }
}

customElements.define("custom-validation-button", CustomValidationButton);
