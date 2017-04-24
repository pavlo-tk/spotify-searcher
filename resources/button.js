"use strict";

/**
 * Represents a button (DOM element) to simplify setting/removing its "loading" state.
 */
class Button {
    /**
     *
     * @param {HTMLElement} element
     * @param {string} loadingTextAttribute Name of element's attribute that holds text that will be shown at button's "loading" state.
     */
    constructor(element, loadingTextAttribute) {
        this.element = element;
        this.loadingTextAttribute = loadingTextAttribute;
        
        this.originalHtml = element.innerHTML;
        this.loadingTextAttribute = loadingTextAttribute ? loadingTextAttribute : 'data-text-loading';
    }

    setLoading() {
        this.element.innerHTML = this.element.getAttribute(this.loadingTextAttribute);
        this.element.disabled = true;
    };
    clearLoading() {
        this.element.innerHTML = this.originalHtml;
        this.element.disabled = false;
    };
}