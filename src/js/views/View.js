import { _ } from 'core-js';
import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    // get the data and make it belong to the (view-class) so that we can use it outside of this function
    this._data = data;
    const newMarkup = this._generateMarkup();
    // this will create a copy of the document(DOM) and convert the string(newMarkup) to a real-DOM-object
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // now newDOM is like a big object of (virtual-DOM) that lives in memory NOT tha page

    // selecting all elements that lives in our virtual-DOM and convering it to an array so that we can compare it with the real-DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // the original array we will compare the previous one to
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // looping over the 2 arrays ( Virtual DOM & Actual DOM ) at the same time so that we can compare them
    newElements.forEach((newElement, i) => {
      const currentElement = curElements[i];

      if (
        // comparing the (content) of the 2 nodes
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        // change the part that differ in the virtual-DOM
        currentElement.textContent = newElement.textContent;
      }
      // Updates changed ATTRIBUES not just textContent
      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach(attr => {
          currentElement.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner = function () {
    const markup = ` <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
    </div>`;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
