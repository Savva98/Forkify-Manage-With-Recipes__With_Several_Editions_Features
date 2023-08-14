import View from "./View";
import PreviewView from "./PreviewView";
import icons from "url:../../img/icons.svg";
class BookMarkView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it.`;
  _message = ``;

  addHendlerBookmarks(hendler) {
    window.addEventListener("load", hendler);
  }
  _generateMarkup() {
    return this._data
      .map((bookmark) => {
        // console.log(bookmark);
        return PreviewView.render(bookmark, false);
      })
      .join("");
  }
}

export default new BookMarkView();
