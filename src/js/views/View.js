import icons from "url:../../img/icons.svg";
export default class View {
  _data;
  _data1;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markUp = this._generateMarkup();

    if (!render) return markUp;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }
  rend(data) {
    this._data1 = data;
    const markUp = this._generateMarkup();
    this._ingContainer.insertAdjacentHTML("afterbegin", markUp);
  }

  update(data) {
    this._data = data;
    const newMarkUp = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkUp);
    const newElements = [...newDOM.querySelectorAll("*")];
    const curElements = [...this._parentElement.querySelectorAll("*")];
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(
      //   curEl,
      //   newEl.isEqualNode(curEl),
      //   newEl.firstChild?.nodeValue.trim() ?? ""
      // );

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue !== ""
      ) {
        curEl.innerHTML = newEl.innerHTML;
      }

      //Update change ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((att) =>
          curEl.setAttribute(att.name, att.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markUp = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }

  renderError(message = this._errorMessage) {
    const markUp = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }
  renderMessage(message = this._message) {
    const markUp = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }
}
