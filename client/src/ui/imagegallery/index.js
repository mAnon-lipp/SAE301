import { htmlToFragment, processTemplate, genericRenderer, getAssetPath } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";

// Traiter le template une seule fois au chargement du module
const processedTemplate = processTemplate(template);

let ImageGalleryView = {
  html: function (data) {
    // Préparer les images
    const images = data.images && data.images.length > 0 
      ? data.images 
      : [{ url: data.mainImage, alt: data.productName }];

    // Générer le HTML des thumbnails
    let thumbnailsHTML = '';
    for (let index = 0; index < images.length; index++) {
      const img = images[index];
      let url = img.url || img;
      // Appliquer getAssetPath si c'est un chemin local
      if (url && !url.startsWith('http')) {
        url = getAssetPath(url);
      }
      const activeClass = index === 0 ? 'imagegallery_ring_black' : '';
      thumbnailsHTML += `
        <div class="imagegallery_thumbnail ${activeClass}" data-thumbnail-index="${index}">
          <img data-thumbnail data-image="${url}" src="${url}" alt="Thumbnail ${index}" class="imagegallery_img">
        </div>
      `;
    }

    const mainImageUrl = (() => {
      let url = images[0].url || images[0];
      if (url && !url.startsWith('http')) {
        url = getAssetPath(url);
      }
      return url;
    })();

    return genericRenderer(processedTemplate, {
      mainImage: mainImageUrl,
      productName: data.productName,
      thumbnails: thumbnailsHTML
    });
  },

  dom: function (data) {
    const fragment = htmlToFragment(this.html(data));
    this.attachEvents(fragment, data);
    return fragment;
  },

  attachEvents: function (fragment, data) {
    const images = data.images && data.images.length > 0 
      ? data.images 
      : [{ url: data.mainImage, alt: data.productName }];

    // Event listeners pour les thumbnails
    const thumbnails = fragment.querySelectorAll('[data-thumbnail-index]');
    const mainImage = fragment.querySelector('#mainImage');

    for (let i = 0; i < thumbnails.length; i++) {
      const thumbnail = thumbnails[i];
      thumbnail.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.thumbnailIndex);

        // Mettre à jour l'image principale
        let imageUrl = images[index].url || images[index];
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = getAssetPath(imageUrl);
        }
        mainImage.src = imageUrl;

        // Mettre à jour les styles actifs en utilisant nos classes CSS migrées
        for (let j = 0; j < thumbnails.length; j++) {
          const t = thumbnails[j];
          t.classList.remove('imagegallery_ring_black', 'imagegallery_ring_primary');
        }
        e.currentTarget.classList.add('imagegallery_ring_primary');
      });
    }
  }
};

export { ImageGalleryView };
