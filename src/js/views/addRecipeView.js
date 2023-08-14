import View from "./View";
import icons from "url:../../img/icons.svg";
import { UNIT_REC } from "../config";
import { extractNum } from "../helpers";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = `Recipe was successfully uploaded 🎉`;
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnAddRecipe = document.querySelector(
    ".nav__btn--add-recipe"
  );
  _btnClose = document.querySelector(".btn--close-modal");
  _ingridientQuantity = document.getElementById("quantity");
  _ingridientUnit = document.getElementById("unit");
  _ingridientDescription =
    document.getElementById("description");
  _addIngridient = document.querySelector(".add_ingridient");
  // _ingridientsArray = []
  _ingContainer = document.querySelector(".ingrdientsDes");
  _errorMessageContainer = document.querySelector(
    ".error__message"
  );
  // _data;

  constructor() {
    super();
    this._addHendlerShowWindow();
    this._addHendlerHideWindwo();
    // this._addIngridientDiscription();
    this._showMessageHowToWriteQuantity();
    this._closeWarningMessage([
      this._ingridientQuantity,
      this._ingridientUnit,
      this._ingridientDescription,
    ])
  }

  toggleClassList() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
    this._ingContainer.textContent = "";
  }
  _addHendlerShowWindow() {
    this._btnAddRecipe.addEventListener(
      "click",
      this.toggleClassList.bind(this)
    );
  }
  _addHendlerHideWindwo() {
    [this._btnClose, this._overlay].forEach((el) =>
      el.addEventListener(
        "click",
        this.toggleClassList.bind(this)
      )
    );
  }

  _addErrorMessage(message) {
    this._errorMessageContainer.classList.remove("hidden");
    const markUp = `<p class="err-message">${message}</p><a href="https://en.wikibooks.org/wiki/Cookbook:Units_of_measurement", target="_blank">Check here!</a>`;
    this._errorMessageContainer.insertAdjacentHTML(
      "afterbegin",
      markUp
    );
  }
  // _addAnotherErrorMessage(message){
  //   this._errorMessageContainer.classList.remove("hidden");
  //   const markUp = `<p class="err-message">${message}</p>`
  //   this._errorMessageContainer.insertAdjacentHTML(
  //     "afterbegin",
  //     markUp
  //   );
  // }
  _showMessageHowToWriteQuantity(){
    this._errorMessageContainer.classList.remove("hidden");
    const markUp = `<p class="err-message">Examples how to fill quantity field: 1...1000 1/2, 1/4, 3/4. If fill uncorrect, quantity will be nothing!</p>`
    this._errorMessageContainer.insertAdjacentHTML(
      "afterbegin",
      markUp
    );
  }
  _clearInput(par1, par2, par3) {
    par1.value = "";
    par2.value = "";
    par3.value = "";
  }
  _addHiddenClass() {
    if (
      !this._errorMessageContainer.classList.contains(
        "hidden"
      )
    ) {
      this._errorMessageContainer.classList.add("hidden");
      this._errorMessageContainer.textContent = "";
    }
  }
  _closeWarningMessage(arr){
    arr.forEach(el=> el.addEventListener('keydown', this._addHiddenClass.bind(this)))
  }
  _transformStr(str) {
    const string = str.toLowerCase();
    return string[0].toUpperCase() + string.slice(1);
  }
  

  _makeId(){
    const min =0;
    const max = 10000;
    const num1 = Math.floor(Math.random()*(max-min)+min);
    const num2 = Math.floor(Math.random()*(max-min)+min);
    return (num1+num2).toString();
  }
  _getIngridients() {
    const quantity = extractNum(this._ingridientQuantity.value);
    const unit = this._ingridientUnit.value.replaceAll(' ', '');
    const description = this._ingridientDescription.value;
    const id = this._makeId();
    this._closeWarningMessage([
      this._ingridientQuantity,
      this._ingridientUnit,
      this._ingridientDescription,
    ]);
    // this._ingridientQuantity.addEventListener('keydown', this._addHiddenClass.bind(this))
    // if(!unit){
    //   unit = ``
    // } 
    if (!UNIT_REC.some((un) => un === unit) && unit) {
      this._addErrorMessage(
        "There no such unit, for unit info. "
      );
      this._clearInput(
        this._ingridientQuantity,
        this._ingridientUnit,
        this._ingridientDescription
      );
    } else {
      const obj = {
        quantity: quantity ? +quantity : null,
        unit: unit? unit:``,
        description: description ? this._transformStr(description) : ``,
        id,
      };
      this._clearInput(
        this._ingridientQuantity,
        this._ingridientUnit,
        this._ingridientDescription
      );
      // if(!this._errorMessageContainer.classList.contains('hidden')){
      //   this._errorMessageContainer.textContent = ''
      // }
      // this._ingridientsArray.push(obj);
      return obj;
    }
  }

  _addIngridientDiscription(hendler) {
    this._addIngridient.addEventListener(
      "click",
      // this.getIngridients.bind(this)
      function (e) {
        e.preventDefault();
        hendler();
      }
    );
  }
  _removeIng(hendler) {
    [this._btnClose, this._overlay].forEach((el) =>
      el.addEventListener("click", hendler)
    );
  }
  _deleteIng(hendler){
    this._ingContainer.addEventListener('click', function(e){
      e.preventDefault();
      // const container = e.target.closest('.ingrdientsDes');
      const button = e.target.closest('.descript_btn_delete_ingridient');
      if(!button) return;
      const id = button.dataset.id;
      const para = button.closest('.descript');
      para.remove();
      hendler(id)
    })
  }

  addHendlerUpload(hendler) {
    this._parentElement.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        const dataArr = [...new FormData(this)];
        const data = Object.fromEntries(dataArr);
        hendler(data);
      }
    );
  }
  // _generateMarkUpIng(ing) {
  //   return ` <p class="descript">${ing.quantity} ${ing.unit} - ${ing.description}</p>
  //   `;
  // }
 
  _generateMarkup() {
    // return ` <p class="descript">${this._data1
    //   .map(this._generateMarkUpIng)
    //   .join("")}</p>
    // `;
    return `<p class="descript">${this._data1.quantity} ${this._data1.unit} - ${this._data1.description} <button class="descript_btn_delete_ingridient" data-id=${this._data1.id}><i class="material-icons">delete</i></button></p>`;
  }
}
{/* <i class="fa fa-close"></i> */}

export default new AddRecipeView();
