'use strict';

/* Điều hướng và trạng thái tiêu đề. */
const header = document.querySelector('.site-header');
const navigation = document.querySelector('.primary-nav');
const menuToggle = document.querySelector('.menu-toggle');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Mở trình đơn');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Đóng trình đơn' : 'Mở trình đơn');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menuToggle.focus(); }
});
window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
const scrollMarker = document.createElement('div');
scrollMarker.setAttribute('aria-hidden', 'true');
header.before(scrollMarker);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => header.classList.toggle('is-scrolled', !entry.isIntersecting)).observe(scrollMarker);
  const navLinks = [...navigation.querySelectorAll('a')];
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      const current = link.hash === `#${entry.target.id}`;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  navLinks.forEach(link => { const section = document.querySelector(link.hash); if (section) sectionObserver.observe(section); });
}

/* FAQ: chuyển động bằng CSS; nội dung đóng không nhận focus. */
const faqButtons = document.querySelectorAll('.faq-question');
function setFaqState(button, open) {
  const answer = document.getElementById(button.getAttribute('aria-controls'));
  button.setAttribute('aria-expanded', String(open));
  answer.classList.toggle('is-open', open);
  answer.setAttribute('aria-hidden', String(!open));
  answer.inert = !open;
}
faqButtons.forEach(button => {
  document.getElementById(button.getAttribute('aria-controls')).hidden = false;
  setFaqState(button, false);
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    faqButtons.forEach(other => setFaqState(other, other === button && open));
  });
});

/* Dialog gốc của trình duyệt hỗ trợ Tab và Escape. */
const inquiryDialog = document.querySelector('#inquiry-dialog');
const inquiryForm = document.querySelector('#inquiry-form');
const inquiryContent = document.querySelector('#inquiry-content');
const inquirySuccess = document.querySelector('#inquiry-success');
const storyDialog = document.querySelector('#story-dialog');
const serviceDialog = document.querySelector('#service-dialog');
const infoDialog = document.querySelector('#info-dialog');
const returnTargets = new WeakMap();
function openDialog(dialog, returnTarget = document.activeElement) {
  returnTargets.set(dialog, returnTarget);
  closeMenu();
  dialog.showModal();
  document.body.classList.add('has-dialog');
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (document.querySelector('dialog[open]')) return;
    document.body.classList.remove('has-dialog');
    const target = returnTargets.get(dialog);
    if (target?.isConnected && target.getClientRects().length) target.focus();
  });
});
function openInquiry(service, returnTarget) {
  inquiryForm.reset();
  [...inquiryForm.elements].forEach(field => field.setCustomValidity?.(''));
  inquiryContent.hidden = false;
  inquirySuccess.hidden = true;
  if (service) inquiryForm.elements.service.value = service;
  document.querySelector('#inquiry-title').textContent = service === 'Hồ sơ dịch vụ' ? 'Một khởi đầu thật rõ ràng.' : 'Kể chúng tôi nghe câu chuyện của bạn.';
  document.querySelector('#inquiry-description').textContent = service === 'Hồ sơ dịch vụ' ? 'Trải nghiệm yêu cầu nhận thông tin về các dịch vụ của Aurelle.' : 'Vài thông tin nhỏ để bắt đầu một ý tưởng lớn.';
  openDialog(inquiryDialog, returnTarget);
}
document.querySelectorAll('[data-inquiry]').forEach(button => button.addEventListener('click', () => {
  openInquiry(button.dataset.intent === 'guide' ? 'Hồ sơ dịch vụ' : undefined);
}));
const today = new Date();
inquiryForm.elements.date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
inquiryForm.addEventListener('invalid', event => {
  const field = event.target;
  if (field.validity.valueMissing) field.setCustomValidity(field.name === 'name' ? 'Vui lòng nhập họ và tên.' : 'Vui lòng nhập địa chỉ email.');
  else if (field.validity.typeMismatch) field.setCustomValidity('Vui lòng nhập địa chỉ email hợp lệ.');
  else if (field.validity.rangeUnderflow) field.setCustomValidity('Vui lòng chọn ngày hôm nay hoặc một ngày trong tương lai.');
  else if (field.validity.badInput) field.setCustomValidity('Vui lòng kiểm tra lại thông tin đã nhập.');
}, true);
inquiryForm.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => field.setCustomValidity(''));
  field.addEventListener('change', () => field.setCustomValidity(''));
});
inquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!inquiryForm.reportValidity()) return;
  const name = inquiryForm.elements.name.value.trim();
  if (!name) { inquiryForm.elements.name.setCustomValidity('Vui lòng nhập họ và tên.'); inquiryForm.elements.name.reportValidity(); return; }
  document.querySelector('#success-message').textContent = `Cảm ơn ${name}. Bạn vừa trải nghiệm yêu cầu tư vấn về dịch vụ “${inquiryForm.elements.service.value}”.`;
  inquiryContent.hidden = true;
  inquirySuccess.hidden = false;
  inquirySuccess.focus();
});
inquiryDialog.addEventListener('close', () => {
  inquiryForm.reset();
  [...inquiryForm.elements].forEach(field => field.setCustomValidity?.(''));
  document.querySelector('#success-message').textContent = '';
});

/* Dữ liệu nội dung ở cuối tệp: dễ thay dự án và phạm vi dịch vụ. */
let currentService;
document.querySelectorAll('[data-service-detail]').forEach(button => button.addEventListener('click', () => {
  currentService = services[button.dataset.serviceDetail];
  document.querySelector('#service-dialog-title').textContent = currentService.title;
  document.querySelector('#service-dialog-tags').textContent = currentService.tags;
  document.querySelector('#service-dialog-description').textContent = currentService.description;
  const image = document.querySelector('#service-dialog-image');
  image.src = currentService.image;
  image.alt = `Ảnh minh họa dịch vụ ${currentService.title.toLowerCase()}`;
  const list = document.querySelector('#service-inclusions');
  list.replaceChildren(...currentService.items.map(item => { const li = document.createElement('li'); li.textContent = item; return li; }));
  openDialog(serviceDialog);
}));
document.querySelector('#service-inquiry').addEventListener('click', () => {
  const returnTarget = returnTargets.get(serviceDialog);
  serviceDialog.close();
  openInquiry(currentService.title, returnTarget);
});
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  document.querySelector('#story-title').textContent = project.title;
  document.querySelector('#story-location').textContent = project.location;
  document.querySelector('#story-description').textContent = project.description;
  document.querySelector('#story-image').src = project.image;
  document.querySelector('#story-image').alt = project.alt;
  openDialog(storyDialog);
}));
document.querySelector('[data-story-inquiry]').addEventListener('click', () => {
  const returnTarget = returnTargets.get(storyDialog);
  storyDialog.close();
  openInquiry(undefined, returnTarget);
});

/* Liên hệ mẫu không dẫn sang tài khoản hay doanh nghiệp không liên quan. */
document.querySelectorAll('[data-info]').forEach(button => button.addEventListener('click', () => {
  const subject = button.dataset.info;
  const title = document.querySelector('#info-title');
  const description = document.querySelector('#info-description');
  if (subject === 'privacy') {
    title.textContent = 'Thông tin của bạn.';
    description.textContent = 'Đây là website minh họa. Biểu mẫu không gửi, lưu hoặc chia sẻ thông tin. Nội dung bạn nhập được xóa khi đóng biểu mẫu. Trang không sử dụng công cụ theo dõi hay cookie; ảnh và font được lưu cùng mã nguồn.\n\nKhi đưa lên mạng, đơn vị lưu trữ có thể ghi nhật ký truy cập thông thường. Trước khi sử dụng cho một doanh nghiệp thật, cần cập nhật thông báo này theo hoạt động và cách xử lý dữ liệu thực tế.';
  } else if (subject === 'contact') {
    title.textContent = 'Rất vui được kết nối.';
    description.textContent = 'Aurelle là thương hiệu giả định. Địa chỉ email trên trang chỉ dùng để minh họa. Bạn có thể chọn “Tư vấn ngay” để trải nghiệm biểu mẫu hoặc thay bằng thông tin liên hệ của doanh nghiệp trước khi ra mắt.';
  } else {
    title.textContent = `Hẹn gặp trên ${subject}.`;
    description.textContent = `Đây là vị trí dành cho trang ${subject} chính thức của thương hiệu. Liên kết hiện chưa được thiết lập trong bản minh họa.`;
  }
  openDialog(infoDialog);
}));

/* Hiệu ứng một lần cho các điểm nhấn; luôn tôn trọng giảm chuyển động. */
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('[data-reveal]').forEach(element => { element.classList.add('reveal-ready'); revealObserver.observe(element); });
}
document.querySelector('#current-year').textContent = new Date().getFullYear();

const services = {
  "wedding": {
    "title": "Tổ chức tiệc cưới",
    "image": "assets/images/hero.jpg",
    "tags": "Lên kế hoạch · Thiết kế · Điều phối",
    "description": "Một hành trình cưới được chăm chút từ đầu đến cuối.",
    "items": [
      "Tư vấn phong cách, địa điểm và dự trù ngân sách",
      "Thiết kế không gian, hoa cưới và trải nghiệm khách mời",
      "Kết nối đối tác, quản lý tiến độ và điều phối ngày cưới"
    ]
  },
  "private": {
    "title": "Sự kiện cá nhân",
    "image": "assets/images/wedding-table.jpg",
    "tags": "Sinh nhật · Cầu hôn · Kỷ niệm",
    "description": "Biến một dịp đặc biệt thành kỷ niệm thật riêng.",
    "items": [
      "Xây dựng chủ đề theo câu chuyện và sở thích của bạn",
      "Trang trí, thực đơn và những bất ngờ được chuẩn bị riêng",
      "Điều phối đón khách, hoạt động và khoảnh khắc chính"
    ]
  },
  "corporate": {
    "title": "Sự kiện doanh nghiệp",
    "image": "assets/images/service-corporate.png",
    "tags": "Hội nghị · Ra mắt · Tiệc tri ân",
    "description": "Chuyên nghiệp trong tổ chức, tinh tế trong cách thể hiện thương hiệu.",
    "items": [
      "Hội nghị, hội thảo, lễ ra mắt và khai trương",
      "Tiệc cuối năm, tiệc tri ân khách hàng và đối tác",
      "Kịch bản, sân khấu, âm thanh, ánh sáng và điều phối"
    ]
  },
  "design": {
    "title": "Thiết kế & trang trí",
    "image": "assets/images/wedding-garden.jpg",
    "tags": "Hoa nghệ thuật · Không gian · Ánh sáng",
    "description": "Để mỗi góc nhìn đều kể cùng một câu chuyện.",
    "items": [
      "Định hướng thẩm mỹ, bảng màu và chất liệu chủ đạo",
      "Thiết kế cổng hoa, sân khấu, bàn tiệc và khu đón khách",
      "Giám sát thi công và hoàn thiện từng chi tiết tại địa điểm"
    ]
  },
  "planning": {
    "title": "Tư vấn & điều phối",
    "image": "assets/images/service-planning.png",
    "tags": "Ngân sách · Kịch bản · Tiến độ",
    "description": "Sự an tâm đến từ một kế hoạch rõ ràng.",
    "items": [
      "Tư vấn lựa chọn dịch vụ và phân bổ ngân sách",
      "Lập kịch bản, lịch trình và phối hợp các nhà cung cấp",
      "Điều phối trong ngày cho kế hoạch bạn đã chuẩn bị"
    ]
  }
};
const projects = {
  "garden": {
    "title": "Minh & An",
    "location": "Tiệc cưới · Đà Lạt",
    "image": "assets/images/hero.jpg",
    "alt": "Lời hẹn giữa khu vườn",
    "description": "Một lễ cưới được hình dung giữa sắc hoa trắng và màu xanh của lá. Buổi lễ thân mật, bàn tiệc dài và những lời chúc dành riêng cho đôi bạn."
  },
  "coast": {
    "title": "Linh & Thomas",
    "location": "Tiệc cưới · Đà Nẵng",
    "image": "assets/images/hero-celebration.png",
    "alt": "Bên nhau, giữa thiên nhiên",
    "description": "Một ý tưởng tiệc cưới hướng về thiên nhiên: hoa màu kem, chất liệu mộc và bữa tối trong ánh hoàng hôn. Không gian dành cho những kết nối thật gần."
  },
  "gala": {
    "title": "Dạ tiệc Ánh Kim",
    "location": "Sự kiện doanh nghiệp · TP. Hồ Chí Minh",
    "image": "assets/images/service-corporate.png",
    "alt": "Một đêm kết nối",
    "description": "Ý tưởng dạ tiệc tri ân với ánh sáng champagne, bàn tiệc trang nhã và một chương trình được sắp xếp mạch lạc. Trải nghiệm thương hiệu thể hiện qua từng điểm chạm."
  },
  "intimate": {
    "title": "Một tối thật riêng",
    "location": "Tiệc riêng tư · TP. Hồ Chí Minh",
    "image": "assets/images/wedding-table.jpg",
    "alt": "Những người thương, một bàn tiệc",
    "description": "Một bữa tiệc kỷ niệm ấm cúng, nơi hoa, nến và những tấm thiệp viết tay dành trọn sự chú ý cho các vị khách thân thiết."
  },
  "floral": {
    "title": "Khu vườn trong mơ",
    "location": "Thiết kế không gian · Đà Lạt",
    "image": "assets/images/wedding-garden.jpg",
    "alt": "Khi không gian cất lời",
    "description": "Ý tưởng trang trí với cổng hoa trắng, lối đi mềm mại và những lớp cây xanh. Mọi chi tiết cùng hướng đến cảm giác thanh lịch, tự nhiên và nhẹ nhàng."
  }
};

