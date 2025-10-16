import { htmlToFragment, genericRenderer } from "../../lib/utils.js";
import template from "./template.html?raw";

export const ImageGalleryView = {
  html(data) {
    // Préparer les images
    const images = data.images && data.images.length > 0 
      ? data.images 
      : [{ url: data.mainImage, alt: data.productName }];
    
    console.log("ImageGallery - images:", images);
    
    // Générer le HTML des thumbnails
    let thumbnailsHTML = '';
    images.forEach((img, index) => {
      const url = img.url || img;
      const activeClass = index === 0 ? 'ring-2 ring-black' : '';
      thumbnailsHTML += `
        <div class="w-[100px] h-[100px] bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-black transition-all ${activeClass}" data-thumbnail-index="${index}">
          <img src="${url}" alt="Thumbnail ${index}" class="w-full h-full object-cover">
        </div>
      `;
    });

    return genericRenderer(template, {
      mainImage: images[0].url || images[0],
      productName: data.productName,
      thumbnails: thumbnailsHTML
    });
  },

  dom(data) {
    const fragment = htmlToFragment(this.html(data));
    this.attachEvents(fragment, data);
    return fragment;
  },

  attachEvents(fragment, data) {
    const images = data.images && data.images.length > 0 
      ? data.images 
      : [{ url: data.mainImage, alt: data.productName }];

    // Event listeners pour les thumbnails
    const thumbnails = fragment.querySelectorAll('[data-thumbnail-index]');
    const mainImage = fragment.querySelector('#mainImage');

    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.thumbnailIndex);
        
        // Mettre à jour l'image principale
        mainImage.src = images[index].url || images[index];
        
        // Mettre à jour les styles actifs
        thumbnails.forEach(t => t.classList.remove('ring-2', 'ring-[var(--primary)]'));
        e.currentTarget.classList.add('ring-2', 'ring-[var(--primary)]');
      });
    });
  }
};
