class SearchView {
  _parentElement = document.querySelector(".search");

  getQuery() {
    const query = this._parentElement.querySelector(".search__field").value;
    this._clearInput();
    return query;
  }
  _clearInput() {
    this._parentElement.querySelector(".search__field").value = "";
  }

  addHendlerSearch(hendler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      hendler();
    });
  }
}
export default new SearchView();
