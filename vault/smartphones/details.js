// --- Dynamic Illustration Paragraph Handler ---
// Dummy fallback paragraph (50 words)
const DUMMY_PARAGRAPH = "The new Zenith X1 Pro redefines smartphone excellence with its stunning display, lightning-fast processor, and all-day battery life. Capture every moment in vivid detail with its advanced camera system. Sleek, durable, and packed with smart features, it’s designed for those who demand performance, style, and innovation in every interaction.";

// Example: how you might structure your phone data (replace with your real data logic)
// Each phone object should have an 'illustration' property (string)
// For demonstration, we'll use dummy data:
const phoneData = {
  // Example: 'id-from-url': { illustration: 'Custom text for this phone.' }
  'apple16pro': {
    illustration: "Apple's iPhone 16 Pro is a masterpiece of engineering, blending cutting-edge performance with elegant design. Its advanced camera system, vibrant display, and robust battery life make it a top choice for professionals and enthusiasts alike. Experience seamless connectivity and innovative features that set a new standard in mobile technology."
  },
  'pixel9pro': {
    illustration: "Google Pixel 9 Pro delivers pure Android brilliance with its AI-powered camera, smooth performance, and stunning OLED display. Designed for those who value simplicity and power, it offers a clean user experience and reliable updates, making it a favorite among tech enthusiasts and everyday users alike."
  }
  // ...add more phones as needed
};

function getPhoneIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function setIllustrationText() {
  const phoneId = getPhoneIdFromUrl();
  const illustrationDiv = document.getElementById('phone-illustration');
  let text = DUMMY_PARAGRAPH;
  if (phoneId && phoneData[phoneId] && phoneData[phoneId].illustration) {
    text = phoneData[phoneId].illustration;
  }
  illustrationDiv.textContent = text;
}

// Call this on DOMContentLoaded or after your data loads
document.addEventListener('DOMContentLoaded', setIllustrationText);
// details.js - dynamic smartphone details page

// Dummy data for demonstration
const dummyPhones = [
  {
    id: 'iphone16pro',
    name: 'Apple iPhone 16 Pro',
    images: [
      'https://cdn.pixabay.com/photo/2017/01/06/19/15/smartphone-1957740_1280.png',
      'https://cdn.pixabay.com/photo/2016/11/29/09/32/iphone-1867461_1280.jpg',
      'https://cdn.pixabay.com/photo/2015/01/21/14/14/apple-606761_1280.jpg'
    ],
    specs: {
      RAM: '8GB',
      Processor: 'Apple A18',
      Camera: '48MP',
      Battery: '4500mAh',
      Display: '6.7" OLED',
      Brand: 'Apple',
      Color: 'White',
      Price: '₹1,29,999',
      OS: 'iOS 19',
      Storage: '256GB',
      Weight: '190g'
    },
    pros: ['Superb camera', 'Fast performance', 'Premium build', 'Long software support'],
    cons: ['Expensive', 'No charger in box', 'Limited customization'],
    myRating: 9.5,
    externalRatings: [
      { site: 'Amazon', rating: 4.7 },
      { site: 'Flipkart', rating: 4.6 },
      { site: 'GSMArena', rating: 9.2 }
    ],
    comments: [
      { name: 'Varsha', text: 'Is this available in India?' },
      { name: 'Amit', text: 'Does it support 5G?' }
    ]
  },
  {
    id: 'galaxys24ultra',
    name: 'Samsung Galaxy S24 Ultra',
    images: [
      'https://cdn.pixabay.com/photo/2017/01/06/19/15/smartphone-1957740_1280.png',
      'https://cdn.pixabay.com/photo/2016/11/29/09/32/iphone-1867461_1280.jpg',
      'https://cdn.pixabay.com/photo/2015/01/21/14/14/apple-606761_1280.jpg'
    ],
    specs: {
      RAM: '12GB+',
      Processor: 'Snapdragon 8 Gen 3',
      Camera: '200MP',
      Battery: '5000mAh',
      Display: '6.8" AMOLED',
      Brand: 'Samsung',
      Color: 'Black',
      Price: '₹1,19,999',
      OS: 'Android 15',
      Storage: '512GB',
      Weight: '210g'
    },
    pros: ['Best Android camera', 'Huge battery', 'S-Pen support', 'Great display'],
    cons: ['Bulky', 'Expensive', 'Slow charging'],
    myRating: 9.0,
    externalRatings: [
      { site: 'Amazon', rating: 4.8 },
      { site: 'Flipkart', rating: 4.7 },
      { site: 'GSMArena', rating: 9.0 }
    ],
    comments: [
      { name: 'Priya', text: 'How is the camera in low light?' }
    ]
  }
];

function getPhoneIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'iphone16pro'; // fallback
}

function renderDetails(phone) {
  // Name at top
  document.getElementById('phone-name').textContent = phone.name;

  // Image carousel
  let currentImg = 0;
  const carouselImg = document.getElementById('carousel-img');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  function showImg(idx) {
    carouselImg.src = phone.images[idx];
    carouselImg.alt = phone.name + ' image';
  }
  showImg(currentImg);
  prevBtn.onclick = () => {
    currentImg = (currentImg - 1 + phone.images.length) % phone.images.length;
    showImg(currentImg);
  };
  nextBtn.onclick = () => {
    currentImg = (currentImg + 1) % phone.images.length;
    showImg(currentImg);
  };

  // Key specs
  const specsList = document.getElementById('specs-list');
  specsList.innerHTML = Object.entries(phone.specs).map(([k,v]) => `<div class="bg-gray-800 rounded-xl p-4"><span class='font-semibold text-blue-400'>${k}:</span> ${v}</div>`).join('');

  // Pros/Cons
  document.getElementById('pros-list').innerHTML = phone.pros.map(p => `<li>${p}</li>`).join('');
  document.getElementById('cons-list').innerHTML = phone.cons.map(c => `<li>${c}</li>`).join('');

  // Ratings
  document.getElementById('my-rating').textContent = `${phone.myRating} / 10`;
  document.getElementById('external-ratings').innerHTML = phone.externalRatings.map(r => `<li><span class="font-semibold">${r.site}:</span> ${r.rating} / 5</li>`).join('');

  // Comments
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = phone.comments.map(c => `<div class="bg-gray-800 rounded-xl p-2"><span class="font-semibold">${c.name}:</span> ${c.text}</div>`).join('');
}

// Add review
function setupReviewForm(phone) {
  const form = document.getElementById('review-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = document.getElementById('review-text').value.trim();
    const rating = parseInt(document.getElementById('review-rating').value);
    if (text) {
      phone.reviews.push({ text, rating });
      renderDetails(phone);
      form.reset();
    }
  });
}

// Add comment
function setupCommentForm(phone) {
  const form = document.getElementById('comment-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('comment-name').value.trim() || 'Anonymous';
    const text = document.getElementById('comment-text').value.trim();
    if (text) {
      phone.comments.push({ name, text });
      renderDetails(phone);
      form.reset();
    }
  });
}

// Main
window.addEventListener('DOMContentLoaded', () => {
  const phoneId = getPhoneIdFromUrl();
  const phone = dummyPhones.find(p => p.id === phoneId) || dummyPhones[0];
  renderDetails(phone);
  setupReviewForm(phone);
  setupCommentForm(phone);
});
