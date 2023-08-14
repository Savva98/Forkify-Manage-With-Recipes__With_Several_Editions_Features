import View from "./View";
import icons from "url:../../img/icons.svg";
import { BUTTON_NUM } from "../config";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHendlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const button = e.target.closest(".btn--inline");
      if (!button) return;

      const goToPage = +button.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1, there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this.generateMarkupButton(currentPage, BUTTON_NUM, 0, numPages);
    }
    // Last page
    if (currentPage === numPages && numPages > 1) {
      return this.generateMarkupButton(currentPage, 0, BUTTON_NUM, numPages);
    }
    // Other page
    if (currentPage < numPages) {
      return this.generateMarkupButton(
        currentPage,
        BUTTON_NUM,
        BUTTON_NUM,
        numPages
      );
    }
    // Page 1, and there are no other pages
    return ``;
  }

  generateMarkupButton(currPage, num, num2, numPages) {
    if (num === BUTTON_NUM && !num2 && numPages >= 2) {
      return `
      <button data-goto='${
        currPage + num
      }' class="btn--inline pagination__btn--next">
      <span>Page ${currPage + num}</span>
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </button> 
      <p class='page_results'>There are ${numPages} pages</p>
      `;
    }
    if (!num && num2 === BUTTON_NUM) {
      return `
      <button data-goto='${
        currPage - num2
      }' class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - num2}</span>
      </button>
      <p class='page_results'>${
        currPage === numPages ? `` : `There are ${numPages} pages`
      }</p>
          `;
    }
    return `
    <button data-goto='${
      currPage + num
    }' class="btn--inline pagination__btn--next">
        <span>Page ${currPage + num}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button> 
      <button data-goto='${
        currPage - num2
      }' class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - num2}</span>
      </button>
      <p class='page_results' >There are ${numPages} pages</p>
          `;
  }
}
export default new PaginationView();
